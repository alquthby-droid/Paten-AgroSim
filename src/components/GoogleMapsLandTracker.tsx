/// <reference types="google.maps" />
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
  AdvancedMarker,
  Pin,
  Polygon,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Maximize2,
  Trash2,
  RotateCcw,
  Navigation,
  CheckCircle2,
  Layers,
  ArrowRight,
  Info,
  Sparkles,
  Search,
  AlertCircle,
  Loader2,
  Plus,
  Crosshair,
  Map as MapIcon,
} from 'lucide-react';
import { MapCoordinate, MeasuredLandResult } from '../types';

interface GoogleMapsLandTrackerProps {
  currentAreaAre: number;
  onApplyArea: (are: number) => void;
  cropName: string;
  onCoordinatesChange?: (coords: { lat: number; lng: number; label?: string }) => void;
  initialCoords?: { lat: number; lng: number; label?: string };
}

const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCA26XW-0y46lKbQnRlsSFjvuO8N2Rhb_E';

// Preset Lokasi Pertanian Populer di Indonesia
interface FarmlandPreset {
  name: string;
  region: string;
  center: { lat: number; lng: number };
  zoom: number;
  coordinates: MapCoordinate[];
}

const FARMLAND_PRESETS: FarmlandPreset[] = [
  {
    name: 'Lahan Jagung Grobogan (50 Are / 0.5 Ha)',
    region: 'Jawa Tengah',
    center: { lat: -7.0862, lng: 110.9234 },
    zoom: 18,
    coordinates: [
      { lat: -7.0858, lng: 110.9229, label: 'Patok Utara 1' },
      { lat: -7.0859, lng: 110.9239, label: 'Patok Timur 2' },
      { lat: -7.0865, lng: 110.9238, label: 'Patok Selatan 3' },
      { lat: -7.0864, lng: 110.9228, label: 'Patok Barat 4' },
    ],
  },
  {
    name: 'Sawah Padi Karawang (100 Are / 1.0 Ha)',
    region: 'Jawa Barat',
    center: { lat: -6.2845, lng: 107.3012 },
    zoom: 17,
    coordinates: [
      { lat: -6.284, lng: 107.3005, label: 'Pematang Utara' },
      { lat: -6.2841, lng: 107.302, label: 'Pematang Timur' },
      { lat: -6.2851, lng: 107.3019, label: 'Pematang Selatan' },
      { lat: -6.285, lng: 107.3004, label: 'Pematang Barat' },
    ],
  },
  {
    name: 'Kebun Tembakau Temanggung (50 Are / 0.5 Ha)',
    region: 'Lereng Sindoro-Sumbing, Jateng',
    center: { lat: -7.2891, lng: 110.0543 },
    zoom: 18,
    coordinates: [
      { lat: -7.2887, lng: 110.0538, label: 'Batas Atas' },
      { lat: -7.2888, lng: 110.0548, label: 'Batas Lereng Timur' },
      { lat: -7.2895, lng: 110.0547, label: 'Batas Bawah' },
      { lat: -7.2894, lng: 110.0537, label: 'Batas Lereng Barat' },
    ],
  },
  {
    name: 'Kebun Tembakau & Padi Jember (75 Are / 0.75 Ha)',
    region: 'Jawa Timur',
    center: { lat: -8.1724, lng: 113.7008 },
    zoom: 17,
    coordinates: [
      { lat: -8.1718, lng: 113.7001, label: 'Patok 1' },
      { lat: -8.1719, lng: 113.7015, label: 'Patok 2' },
      { lat: -8.1729, lng: 113.7014, label: 'Patok 3' },
      { lat: -8.1728, lng: 113.7, label: 'Patok 4' },
    ],
  },
  {
    name: 'Sentra Jagung & Bawang Brebes (30 Are)',
    region: 'Jawa Tengah',
    center: { lat: -6.8703, lng: 109.0435 },
    zoom: 18,
    coordinates: [
      { lat: -6.8698, lng: 109.0431, label: 'Patok 1' },
      { lat: -6.8699, lng: 109.0441, label: 'Patok 2' },
      { lat: -6.8708, lng: 109.044, label: 'Patok 3' },
      { lat: -6.8707, lng: 109.043, label: 'Patok 4' },
    ],
  },
];

// Helper kalkulasi luas geosfer (m²) menggunakan rumus spherical geodesi (WGS84)
function calculateGeodesicArea(coords: MapCoordinate[]): number {
  if (coords.length < 3) return 0;
  const radius = 6378137; // Radius bumi meter
  let total = 0;

  for (let i = 0; i < coords.length; i++) {
    const p1 = coords[i];
    const p2 = coords[(i + 1) % coords.length];

    const lat1 = (p1.lat * Math.PI) / 180;
    const lat2 = (p2.lat * Math.PI) / 180;
    const lng1 = (p1.lng * Math.PI) / 180;
    const lng2 = (p2.lng * Math.PI) / 180;

    total += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
  }

  total = (Math.abs(total) * radius * radius) / 2;
  return Math.round(total);
}

// Helper kalkulasi keliling poligon (meter)
function calculatePerimeter(coords: MapCoordinate[]): number {
  if (coords.length < 2) return 0;
  const radius = 6378137;
  let perimeter = 0;

  for (let i = 0; i < coords.length; i++) {
    const p1 = coords[i];
    const p2 = coords[(i + 1) % coords.length];

    const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
    const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
    const lat1 = (p1.lat * Math.PI) / 180;
    const lat2 = (p2.lat * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    perimeter += radius * c;
  }

  return Math.round(perimeter);
}

// Komponen Pengendali Kamera & Interaksi di dalam Google Maps Canvas
const MapContent: React.FC<{
  coordinates: MapCoordinate[];
  onAddPoint: (point: MapCoordinate) => void;
  mapType: 'satellite' | 'roadmap';
  center: { lat: number; lng: number };
  zoom: number;
  userGpsPosition: { lat: number; lng: number; accuracy?: number } | null;
}> = ({ coordinates, onAddPoint, mapType, center, zoom, userGpsPosition }) => {
  const map = useMap();

  // Sinkronisasi Kamera: Selalu geser (panTo) dan zoom ke target koordinat saat center/zoom berubah
  useEffect(() => {
    if (!map) return;
    map.panTo(center);
    if (zoom) map.setZoom(zoom);
  }, [map, center, zoom]);

  // Set Map Type ID (Satelit Hybrid vs Roadmap)
  useEffect(() => {
    if (!map) return;
    map.setMapTypeId(
      mapType === 'satellite' ? google.maps.MapTypeId.HYBRID : google.maps.MapTypeId.ROADMAP
    );
  }, [map, mapType]);

  // Listener Klik di Peta untuk Menambahkan Titik Patok Batas Lahan
  useEffect(() => {
    if (!map) return;
    const listener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        onAddPoint({
          lat: Math.round(lat * 1000000) / 1000000,
          lng: Math.round(lng * 1000000) / 1000000,
          label: `Patok ${coordinates.length + 1}`,
        });
      }
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [map, coordinates.length, onAddPoint]);

  return (
    <>
      {/* Poligon Lahan Hijau Transparan */}
      {coordinates.length >= 3 && (
        <Polygon
          paths={coordinates}
          strokeColor="#10b981"
          strokeOpacity={1}
          strokeWeight={2.5}
          fillColor="#059669"
          fillOpacity={0.4}
        />
      )}

      {/* Garis Batas jika Baru 2 Titik */}
      {coordinates.length === 2 && (
        <Polygon
          paths={coordinates}
          strokeColor="#10b981"
          strokeOpacity={0.9}
          strokeWeight={2.5}
          fillColor="transparent"
        />
      )}

      {/* Marker Titik Patok Batas Lahan Petani */}
      {coordinates.map((coord, idx) => (
        <AdvancedMarker
          key={`patok-${idx}-${coord.lat}-${coord.lng}`}
          position={{ lat: coord.lat, lng: coord.lng }}
          title={coord.label || `Patok ${idx + 1}`}
        >
          <Pin
            background="#059669"
            borderColor="#ffffff"
            glyphColor="#ffffff"
            glyphText={`${idx + 1}`}
          />
        </AdvancedMarker>
      ))}

      {/* Marker GPS Posisi Petani Saat Ini (Pulsing Radar Pin) */}
      {userGpsPosition && (
        <AdvancedMarker
          position={{ lat: userGpsPosition.lat, lng: userGpsPosition.lng }}
          title={`Lokasi GPS Anda Saat Ini (Akurasi: ±${Math.round(
            userGpsPosition.accuracy || 10
          )} m)`}
        >
          <div className="relative flex items-center justify-center cursor-pointer">
            <span className="absolute w-8 h-8 rounded-full bg-blue-500/40 animate-ping"></span>
            <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center text-white text-[9px] font-black">
              GPS
            </div>
          </div>
        </AdvancedMarker>
      )}
    </>
  );
};

export const GoogleMapsLandTracker: React.FC<GoogleMapsLandTrackerProps> = ({
  currentAreaAre,
  onApplyArea,
  cropName,
  onCoordinatesChange,
  initialCoords,
}) => {
  const [coordinates, setCoordinates] = useState<MapCoordinate[]>(
    FARMLAND_PRESETS[0].coordinates
  );
  const [mapType, setMapType] = useState<'satellite' | 'roadmap'>('satellite');
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
    initialCoords || FARMLAND_PRESETS[0].center
  );
  const [mapZoom, setMapZoom] = useState<number>(FARMLAND_PRESETS[0].zoom);
  const [isSuccessApplied, setIsSuccessApplied] = useState<boolean>(false);

  // Status GPS Pengguna
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'searching' | 'found' | 'error'>('idle');
  const [gpsErrorMsg, setGpsErrorMsg] = useState<string>('');
  const [userGpsPosition, setUserGpsPosition] = useState<{
    lat: number;
    lng: number;
    accuracy?: number;
  } | null>(null);

  // Pencarian Alamat / Lokasi / Koordinat
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchingLocation, setIsSearchingLocation] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string>('');

  // Input Koordinat Manual (BPN / GPS Genggam)
  const [manualLat, setManualLat] = useState<string>('-7.0860');
  const [manualLng, setManualLng] = useState<string>('110.9230');

  // Hasil Perhitungan Luas Lahan Real-Time
  const landResult: MeasuredLandResult = useMemo(() => {
    const areaM2 = calculateGeodesicArea(coordinates);
    const areaAre = Math.round((areaM2 / 100) * 10) / 10; // 1 Are = 100 m²
    const areaHa = Math.round((areaM2 / 10000) * 100) / 100; // 1 Ha = 10.000 m²
    const perimeterMeters = calculatePerimeter(coordinates);

    return {
      coordinates,
      areaSquareMeters: areaM2,
      areaAre,
      areaHa,
      perimeterMeters,
    };
  }, [coordinates]);

  const handleAddPoint = useCallback((point: MapCoordinate) => {
    setCoordinates((prev) => [...prev, point]);
  }, []);

  const handleRemoveLastPoint = () => {
    setCoordinates((prev) => prev.slice(0, prev.length - 1));
  };

  const handleResetPoints = () => {
    setCoordinates([]);
  };

  const handleSelectPreset = (preset: FarmlandPreset) => {
    setCoordinates(preset.coordinates);
    setMapCenter(preset.center);
    setMapZoom(preset.zoom);
    setSearchError('');
    if (onCoordinatesChange) {
      onCoordinatesChange({ lat: preset.center.lat, lng: preset.center.lng, label: preset.name });
    }
  };

  const handleAddManualPoint = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (!isNaN(lat) && !isNaN(lng)) {
      const newPoint: MapCoordinate = {
        lat: Math.round(lat * 1000000) / 1000000,
        lng: Math.round(lng * 1000000) / 1000000,
        label: `Patok Manual ${coordinates.length + 1}`,
      };
      setCoordinates((prev) => [...prev, newPoint]);
      setMapCenter({ lat: newPoint.lat, lng: newPoint.lng });
      setMapZoom(18);
    }
  };

  // Tambah Patok Langsung dari Posisi GPS Petani
  const handleAddPointFromCurrentGps = () => {
    if (userGpsPosition) {
      handleAddPoint({
        lat: Math.round(userGpsPosition.lat * 1000000) / 1000000,
        lng: Math.round(userGpsPosition.lng * 1000000) / 1000000,
        label: `Patok GPS ${coordinates.length + 1}`,
      });
    }
  };

  // Pelacakan GPS HP / Perangkat Petani
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      setGpsErrorMsg('Browser atau perangkat Anda tidak mendukung fitur Geolocation/GPS.');
      return;
    }

    setGpsStatus('searching');
    setGpsErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;

        const newPos = { lat, lng, accuracy };
        setUserGpsPosition(newPos);
        setMapCenter({ lat, lng });
        setMapZoom(19); // Zoom dekat agar pematang sawah terlihat jelas
        setManualLat(lat.toFixed(6));
        setManualLng(lng.toFixed(6));
        setGpsStatus('found');
        if (onCoordinatesChange) {
          onCoordinatesChange({ lat, lng, label: 'GPS Pengguna' });
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setGpsStatus('error');
        if (err.code === 1) {
          setGpsErrorMsg(
            'Izin akses GPS belum diizinkan oleh peramban. Silakan aktifkan izin lokasi di browser Anda, atau gunakan kolom pencarian desa/koordinat di bawah.'
          );
        } else if (err.code === 2) {
          setGpsErrorMsg(
            'Sinyal GPS tidak terdeteksi. Silakan coba kembali di luar ruangan atau gunakan pencarian alamat.'
          );
        } else {
          setGpsErrorMsg('Waktu permintaan sinyal GPS habis (Timeout). Silakan coba lagi.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  };

  // Pencarian Lokasi Berdasarkan Nama Tempat atau Format Koordinat Lat, Lng
  const handleSearchLocation = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setSearchError('');
    setIsSearchingLocation(true);

    // 1. Cek apakah pengguna menginput format koordinat langsung (contoh: "-7.0862, 110.9234")
    const coordRegex = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;
    if (coordRegex.test(query)) {
      const parts = query.split(',');
      const lat = parseFloat(parts[0].trim());
      const lng = parseFloat(parts[1].trim());
      setMapCenter({ lat, lng });
      setMapZoom(18);
      setManualLat(lat.toFixed(6));
      setManualLng(lng.toFixed(6));
      setIsSearchingLocation(false);
      if (onCoordinatesChange) {
        onCoordinatesChange({ lat, lng, label: query });
      }
      return;
    }

    // 2. Geocoding menggunakan Google Maps Geocoder Service
    if (typeof google !== 'undefined' && google.maps && google.maps.Geocoder) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {
          address: query,
          componentRestrictions: { country: 'id' }, // Batasi pencarian di wilayah Indonesia
        },
        (results, status) => {
          setIsSearchingLocation(false);
          if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
            const loc = results[0].geometry.location;
            const lat = loc.lat();
            const lng = loc.lng();
            setMapCenter({ lat, lng });
            setMapZoom(17);
            setManualLat(lat.toFixed(6));
            setManualLng(lng.toFixed(6));
            if (onCoordinatesChange) {
              onCoordinatesChange({ lat, lng, label: query });
            }
          } else {
            setSearchError(
              `Lokasi "${query}" tidak ditemukan. Coba ketik nama kecamatan, kabupaten, atau koordinat lat, lng.`
            );
          }
        }
      );
    } else {
      setIsSearchingLocation(false);
      setSearchError('Layanan pencarian peta sedang memuat. Silakan coba sesaat lagi.');
    }
  };

  // Terapkan ke Simulasi Utama
  const handleApplyToSimulation = () => {
    if (landResult.areaAre > 0) {
      onApplyArea(Math.max(1, Math.round(landResult.areaAre)));
      setIsSuccessApplied(true);
      setTimeout(() => setIsSuccessApplied(false), 3000);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700">
            <MapPin className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-slate-900">
                Pelacakan Luas Lahan Berbasis Koordinat (Google Maps API)
              </h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Otomatisasi Lahan
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Ukur batas lahan riil via GPS atau klik patok di peta satelit untuk menghitung luas (Are, Ha, m²) otomatis
            </p>
          </div>
        </div>

        {/* Tombol Terapkan ke Simulasi Pupuk */}
        <button
          onClick={handleApplyToSimulation}
          disabled={landResult.areaAre <= 0}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer ${
            isSuccessApplied
              ? 'bg-emerald-700 text-white'
              : landResult.areaAre > 0
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isSuccessApplied ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tersinkron ke Simulasi!</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span>
                Terapkan Luas ({landResult.areaAre || 0} Are) ke Simulasi
              </span>
            </>
          )}
        </button>
      </div>

      {/* Bar Pencarian Lokasi & Tombol GPS Aktif */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
        {/* Input Form Pencarian Tempat */}
        <form
          onSubmit={handleSearchLocation}
          className="md:col-span-8 flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari desa, kecamatan, kabupaten, atau koordinat (cth: Grobogan, Karawang, Temanggung)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={isSearchingLocation}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
          >
            {isSearchingLocation ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Search className="w-3.5 h-3.5" />
            )}
            <span>Cari Lokasi</span>
          </button>
        </form>

        {/* Tombol Deteksi GPS HP Petani */}
        <div className="md:col-span-4 flex items-center gap-2">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={gpsStatus === 'searching'}
            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer ${
              gpsStatus === 'searching'
                ? 'bg-blue-50 border-blue-300 text-blue-700 animate-pulse'
                : gpsStatus === 'found'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50'
            }`}
          >
            {gpsStatus === 'searching' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Mendeteksi GPS...</span>
              </>
            ) : (
              <>
                <Crosshair className="w-3.5 h-3.5" />
                <span>Deteksi Lokasi GPS Saya</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Bar Notifikasi GPS / Error Handler */}
      {gpsStatus === 'found' && userGpsPosition && (
        <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span>
            <span className="font-semibold">GPS Terdeteksi:</span>
            <span className="font-mono text-[11px]">
              {userGpsPosition.lat.toFixed(6)}, {userGpsPosition.lng.toFixed(6)}
            </span>
            <span className="text-[11px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
              Akurasi: ±{Math.round(userGpsPosition.accuracy || 10)} meter
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddPointFromCurrentGps}
            className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Tancapkan Patok di Titik GPS Ini</span>
          </button>
        </div>
      )}

      {gpsStatus === 'error' && (
        <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-0.5">
            <span className="font-semibold">Pemberitahuan GPS:</span>
            <p className="text-[11px] text-amber-800">{gpsErrorMsg}</p>
          </div>
        </div>
      )}

      {searchError && (
        <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{searchError}</span>
        </div>
      )}

      {/* Preset Lokasi Pertanian Populer */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-500 font-medium text-[11px] mr-1">Preset Lahan:</span>
        {FARMLAND_PRESETS.map((p) => (
          <button
            key={p.name}
            onClick={() => handleSelectPreset(p)}
            className="px-2 py-1 rounded-md border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-900 text-[11px] font-medium transition-colors cursor-pointer"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Google Maps Canvas Container */}
      <div className="relative rounded-xl overflow-hidden border border-slate-300 shadow-inner h-[400px] sm:h-[460px] w-full bg-slate-100">
        <APIProvider
          apiKey={GOOGLE_MAPS_API_KEY}
          libraries={['geometry', 'marker', 'geocoding']}
        >
          <Map
            defaultCenter={mapCenter}
            defaultZoom={mapZoom}
            mapId="DEMO_MAP_ID"
            gestureHandling="greedy"
            disableDefaultUI={false}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            className="w-full h-full"
          >
            <MapContent
              coordinates={coordinates}
              onAddPoint={handleAddPoint}
              mapType={mapType}
              center={mapCenter}
              zoom={mapZoom}
              userGpsPosition={userGpsPosition}
            />
          </Map>
        </APIProvider>

        {/* Floating Controls: Citra Satelit vs Peta Jalan */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs p-1 rounded-lg border border-slate-200 shadow-md text-xs">
          <button
            onClick={() => setMapType('satellite')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              mapType === 'satellite'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Citra Satelit
          </button>
          <button
            onClick={() => setMapType('roadmap')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              mapType === 'roadmap'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Peta Jalan
          </button>
        </div>

        {/* Floating Actions: Undo Titik & Reset Poligon */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs p-1 rounded-lg border border-slate-200 shadow-md text-xs">
          <button
            onClick={handleRemoveLastPoint}
            disabled={coordinates.length === 0}
            className="px-2.5 py-1 rounded hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:hover:bg-transparent flex items-center gap-1 text-[11px] cursor-pointer"
            title="Hapus patok terakhir"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>Undo Titik</span>
          </button>
          <button
            onClick={handleResetPoints}
            disabled={coordinates.length === 0}
            className="px-2.5 py-1 rounded hover:bg-rose-50 text-rose-600 disabled:opacity-40 disabled:hover:bg-transparent flex items-center gap-1 text-[11px] cursor-pointer"
            title="Hapus semua patok"
          >
            <Trash2 className="w-3 h-3" />
            <span>Reset Poligon</span>
          </button>
        </div>

        {/* Petunjuk Interaktif Melayang */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-md shadow pointer-events-none flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>Klik langsung di peta satelit untuk menancapkan patok batas lahan</span>
        </div>
      </div>

      {/* Panel Hasil Kalkulasi Luas Lahan Otomatis */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium">Luas Lahan (Are):</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-bold font-mono text-emerald-700">
              {landResult.areaAre.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-slate-600 font-semibold">Are</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Unit standar simulasi pupuk
          </span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium">Luas Hektar (Ha):</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-bold font-mono text-slate-800">
              {landResult.areaHa.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-slate-600 font-semibold">Ha</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {landResult.areaHa >= 0.5 ? 'Memenuhi Mode Irit 0.5 Ha' : 'Skala Petak Kecil'}
          </span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium">Luas Meter Persegi:</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-bold font-mono text-slate-800">
              {landResult.areaSquareMeters.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-slate-600 font-semibold">m²</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Total area tertutup poligon
          </span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium">Keliling Batas Lahan:</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-bold font-mono text-slate-800">
              {landResult.perimeterMeters.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-slate-600 font-semibold">Meter</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Panjang pematang / pagar
          </span>
        </div>
      </div>

      {/* Input Koordinat Manual (BPN / GPS) & Daftar Patok Batas */}
      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
          <span className="text-xs font-semibold text-slate-800">
            Daftar Koordinat Patok Lahan ({coordinates.length} Titik Sudut)
          </span>

          {/* Form Tambah Koordinat Manual (BPN / GPS) */}
          <div className="flex items-center gap-1.5 text-xs">
            <input
              type="text"
              placeholder="Latitude (cth: -7.086)"
              value={manualLat}
              onChange={(e) => setManualLat(e.target.value)}
              className="w-28 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono"
            />
            <input
              type="text"
              placeholder="Longitude (cth: 110.923)"
              value={manualLng}
              onChange={(e) => setManualLng(e.target.value)}
              className="w-28 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono"
            />
            <button
              onClick={handleAddManualPoint}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-medium flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Tambah</span>
            </button>
          </div>
        </div>

        {/* Chip Daftar Patok */}
        {coordinates.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
            {coordinates.map((c, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-slate-200 text-[11px] text-slate-700 font-mono shadow-2xs"
              >
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <span>
                  {c.lat.toFixed(5)}, {c.lng.toFixed(5)}
                </span>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">
            Belum ada titik patok batas. Klik pada peta satelit di atas atau gunakan GPS untuk mulai membuat batas lahan Anda.
          </p>
        )}
      </div>
    </div>
  );
};
