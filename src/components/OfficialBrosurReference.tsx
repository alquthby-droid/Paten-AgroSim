import React from 'react';
import { CropType } from '../types';
import { BookOpen, CheckCircle, Info } from 'lucide-react';

interface OfficialBrosurReferenceProps {
  crop: CropType;
}

export const OfficialBrosurReference: React.FC<OfficialBrosurReferenceProps> = ({
  crop,
}) => {
  return (
    <div className="bg-emerald-900/5 rounded-xl border border-emerald-900/15 p-4 text-slate-800">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-4 h-4 text-emerald-700" />
        <h4 className="font-semibold text-sm text-slate-900">
          Protokol Resmi Brosur Paten Gold (
          {crop === 'jagung' ? 'Jagung' : crop === 'padi' ? 'Padi' : 'Tembakau'})
        </h4>
        <span className="text-[11px] text-emerald-800 font-mono ml-auto">
          www.pupukpaten.com
        </span>
      </div>

      {crop === 'tembakau' && (
        <div className="space-y-3 text-xs">
          <div>
            <span className="font-semibold text-emerald-900 block mb-1">
              Pemupukan (Kocor 100ml / pohon):
            </span>
            <ul className="space-y-1.5 pl-4 list-disc text-slate-700">
              <li>
                <strong>Hari ke-14:</strong> Campurkan 1 sachet Paten Gold + ZA 1
                gelas + air 20 liter. Kocorkan pada tanaman 100ml/pohon.
              </li>
              <li>
                <strong>Hari ke-28:</strong> Campurkan 1 sachet Paten Gold + NPK 1
                gelas + air 20 liter. Kocorkan pada tanaman 100ml/pohon. Lakukan
                lagi pada umur <strong>30 hari</strong>.
              </li>
            </ul>
          </div>
          <div className="pt-2 border-t border-emerald-900/10">
            <span className="font-semibold text-emerald-900 block mb-1">
              Penyemprotan Rutin:
            </span>
            <p className="text-slate-700">
              Campurkan 1 sachet Paten Gold + Insek + air 60 liter. Semprotkan
              pada tanaman <strong>7 hari sekali</strong>.
            </p>
          </div>
        </div>
      )}

      {crop === 'jagung' && (
        <div className="space-y-2.5 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-700">
            <div className="space-y-1">
              <p>
                <strong>H-5 HST:</strong> 1 sachet Paten Gold per tangki 16-20
                liter. Semprot pada tanaman (cegah virus bule).
              </p>
              <p>
                <strong>H-12 HST:</strong> 1 sachet Paten Gold + Urea 2 gelas aqua
                + air 20 liter. Kocorkan 50ml/pohon.
              </p>
              <p>
                <strong>H-14 HST:</strong> 1 sachet Paten Gold + Insek per tangki
                16-20 liter. Semprot tanaman.
              </p>
              <p>
                <strong>H-21 HST:</strong> 1 sachet Paten Gold + Insek per tangki
                16-20 liter. Semprot tanaman.
              </p>
            </div>
            <div className="space-y-1">
              <p>
                <strong>H-26 HST:</strong> 1 sachet Paten Gold + Urea 2 gelas aqua
                + air 20 liter. Kocorkan 50ml/pohon.
              </p>
              <p>
                <strong>H-28 HST:</strong> 1 sachet Paten Gold + Insek per tangki
                16-20 liter. Semprot tanaman.
              </p>
              <p>
                <strong>H-35 HST:</strong> 2 sachet Paten Gold + air 20 liter.
                Kocorkan pada tanaman 50ml/pohon (Full Paten tanpa urea).
              </p>
            </div>
          </div>
        </div>
      )}

      {crop === 'padi' && (
        <div className="space-y-2.5 text-xs text-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <p>
              <strong>H-5 HST:</strong> 2 sachet Paten Gold per tangki 16-20
              liter. Semprot kasar.
            </p>
            <p>
              <strong>H-12-15 HST:</strong> 3 sachet Paten Gold + Insek per
              tangki 16-20 liter. Semprot kasar.
            </p>
            <p>
              <strong>H-28 HST:</strong> 3 sachet Paten Gold + Insek per tangki
              16-20 liter. Semprot kasar.
            </p>
            <p>
              <strong>H-50 & H-70 HST:</strong> Masing-masing 3 sachet Paten Gold
              + Insek per tangki 16-20 liter. Semprot kasar.
            </p>
          </div>

          <div className="p-2.5 bg-amber-500/10 border border-amber-600/20 rounded-md text-amber-900">
            <div className="flex items-center gap-1.5 font-semibold text-xs text-amber-900 mb-1">
              <Info className="w-3.5 h-3.5 text-amber-700" />
              Catatan Resmi Brosur (Mode Irit):
            </div>
            <p className="text-[11px] leading-relaxed">
              &quot;Anjuran diatas adalah anjuran pemakaian tanpa campuran ZA/Urea.
              Jika ingin menambahkan <strong>ZA/Urea 1 gelas per tangki</strong>,
              maka Paten Gold <strong>CUKUP 1 SACHET PER TANGKI</strong>!&quot;
            </p>
          </div>
        </div>
      )}

      {crop === 'hortikultura' && (
        <div className="space-y-3 text-xs text-slate-700">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-600/20 rounded-md text-emerald-950">
            <span className="font-semibold block mb-0.5">
              Komoditas Sasaran Brosur:
            </span>
            <p className="text-[11px] leading-relaxed text-emerald-900">
              Cabe Besar / Rawit, Tomat, Kacang Panjang, Timun, Paria, Labu Siam, Labu, Oyong, Semangka & Melon.
            </p>
          </div>

          <div className="space-y-2">
            <div>
              <strong className="text-emerald-900">1. Sebelum Penanaman (H-2 Pra-Tanam):</strong>
              <p className="text-slate-700 mt-0.5">
                Lahan harus dilestarikan dengan penyemprotan di tanah dan sekitarnya dengan <strong>Paten Imun 3 saset per tangki</strong>, 2 hari sebelum bibit ditanam.
              </p>
            </div>

            <div>
              <strong className="text-emerald-900">2. Pemupukan Kocor (H-7 dan tiap 15–20 hari sekali):</strong>
              <p className="text-slate-700 mt-0.5">
                Kocor <strong>1 sachet Paten Hijau + 1 sachet Paten Imun + air 16 liter</strong>. Kocorkan <strong>50 ml per tanaman</strong> dan lakukan tiap 15–20 hari sekali (H-7, H-25, H-45, H-65).
              </p>
            </div>

            <div>
              <strong className="text-emerald-900">3. Penyemprotan Rutin 7 Hari Sekali:</strong>
              <p className="text-slate-700 mt-0.5">
                Semprotkan <strong>Paten Hijau 1 sachet + Paten Imun 1 sachet + Insek + air per tangki</strong>, dan lakukan penyemprotan setiap <strong>7 hari sekali</strong> hingga panen.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
