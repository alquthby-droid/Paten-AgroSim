import { CropType, SeasonType, SeasonalGuidance } from '../types';

export const SEASONAL_GUIDANCE: Record<CropType, Record<SeasonType, SeasonalGuidance>> = {
  jagung: {
    hujan: {
      season: 'hujan',
      optimalSprayHours: '06.30 - 08.30 WIB (setelah embun menguap) atau 15.30 - 17.00 WIB (cerah berawan)',
      optimalKocorHours: '07.00 - 09.30 WIB saat bedengan tidak tergenang air',
      soilMoistureCondition: 'Lembap kapasitas lapang (becek/genangan wajib dikeringkan terlebih dahulu)',
      adjuvantAdvice: 'Gunakan Perekat/Perata (Sticker) 5-10 ml/tangki agar larutan tidak luntur tercuci hujan mendadak.',
      waterAdjustmentAdvice: 'Volume air kocor dapat disesuaikan 40-50 ml/pohon karena tanah sudah basah alami. Pastikan larutan tidak larut terhanyut.',
      keyRisks: [
        'Risiko penyakit bulai (Peronosclerospora maydis) & busuk pelepah meningkat tinggi.',
        'Pencucian hara kimia oleh air hujan lebat.',
        'Kelembapan udara tinggi memicu spora jamur.',
      ],
      bestPractices: [
        'Aplikasi Paten Gold H-5 pencegah bule adalah wajib dan tidak boleh terlewat.',
        'Pastikan jeda minimal 1-2 jam sebelum hujan lebat agar nutrisi nano terserap sempurna melalui stomata.',
        'Perbaiki parit saluran drainase air agar lahan tidak terendam air lebih dari 6 jam.',
      ],
    },
    kemarau: {
      season: 'kemarau',
      optimalSprayHours: '06.00 - 08.00 WIB (sebelum terik matahari > 30°C) atau 16.00 - 17.30 WIB',
      optimalKocorHours: '15.30 - 17.30 WIB (sore hari) setelah penyiraman tanah',
      soilMoistureCondition: 'Siram atau leb tanah tipis sebelum kocor agar larutan nutrisi langsung terhisap akar.',
      adjuvantAdvice: 'Gunakan pembasah (wetting agent) agar larutan semprot tidak cepat mengering di permukaan daun.',
      waterAdjustmentAdvice: 'Pertahankan volume penuh (50 ml/pohon kocor) untuk memberi tambahan hidrasi bagi perakaran tanaman.',
      keyRisks: [
        'Ulat grayak (Spodoptera frugiperda / FAW) dan penggerek tongkol sangat agresif.',
        'Stomata daun menutup lebih cepat di atas pukul 09.00 akibat sengatan panas terik.',
        'Penguapan pupuk kimia konvensional sangat tinggi jika disebar di permukaan tanah kering.',
      ],
      bestPractices: [
        'Kocorkan nutrisi di sore hari agar tanaman memanfaatkan nutrisi sepanjang malam dalam kondisi sejuk.',
        'Sinergikan Paten Gold dengan Insektisida tepat sasaran pada H-14, H-21, dan H-28.',
        'Hindari semprot siang hari (10.00 - 15.00 WIB) karena stomata daun tertutup.',
      ],
    },
  },
  padi: {
    hujan: {
      season: 'hujan',
      optimalSprayHours: '07.00 - 09.00 WIB saat daun sudah tidak terlalu basah oleh embun pekat',
      optimalKocorHours: 'Semprot kasar langsung ke tajuk dan pangkal rumpun padi',
      soilMoistureCondition: 'Kondisi air sawah macak-macak (ketinggian 1-2 cm, jangan banjir 10 cm)',
      adjuvantAdvice: 'Gunakan perekat tahan hujan (rain-fastness) berkualitas.',
      waterAdjustmentAdvice: 'Gunakan nozzle semprot spuyer kasar dengan tekanan stabil agar butiran menempel kuat di daun.',
      keyRisks: [
        'Penyakit blast daun & leher malai (Pyricularia oryzae).',
        'Bakteri hawar daun (Xanthomonas oryzae) mudah menular lewat cipratan air hujan.',
        'Rebah batang akibat tanaman terlalu rimbun pupuk N kimia berlebih.',
      ],
      bestPractices: [
        'Paten Gold memperkokoh dinding sel batang padi sehingga lebih tahan terpaan angin dan hujan kencang.',
        'Kurangi dosis Urea kimia berlebih, optimalkan formula Paten Gold 1 sachet + 1 gelas pupuk starter.',
        'Semprot kasar pada H-12, H-28, H-50, dan H-70 dengan interval disiplin.',
      ],
    },
    kemarau: {
      season: 'kemarau',
      optimalSprayHours: '06.00 - 08.30 WIB atau 16.00 - 17.30 WIB',
      optimalKocorHours: 'Semprot kasar foliar menyeluruh',
      soilMoistureCondition: 'Tanah basah lembap / terairi teratur (hindari fase bunting dalam kondisi tanah pecah retak)',
      adjuvantAdvice: 'Bisa ditambahkan perata agar larutan merata ke sela-sela pelepah padi.',
      waterAdjustmentAdvice: 'Pastikan volume air tangki cukup (10-12 tangki/ha) agar rumpun padi terbasahi optimal.',
      keyRisks: [
        'Serangan wereng batang coklat (WBC) dan walang sangit di fase pengisian bulir.',
        'Bulir padi hampa jika tanaman kekurangan air dan nutrisi saat fase bunting.',
      ],
      bestPractices: [
        'Penyemprotan H-50 dan H-70 sangat penting untuk menjamin pengisian bulir padi bernas sampai pangkal malai.',
        'Campurkan insektisida anti wereng terdaftar saat penyemprotan jika ada tanda populasi nimfa di pangkal batang.',
      ],
    },
  },
  tembakau: {
    hujan: {
      season: 'hujan',
      optimalSprayHours: '07.00 - 08.30 WIB atau sore berawan 15.30 - 17.00 WIB',
      optimalKocorHours: 'Pagi hari 07.00 - 09.00 WIB HANYA saat parit/guludan tidak tergenang',
      soilMoistureCondition: 'Lembap sedang. Tembakau TIDAK BOLEH tergenang air lebih dari beberapa jam!',
      adjuvantAdvice: 'Perekat khusus tembakau dosis rendah agar tidak merusak lilin alami permukaan daun.',
      waterAdjustmentAdvice: 'Volume kocor 80-100 ml/pohon, pastikan larutan meresap ke zona akar piringan.',
      keyRisks: [
        'Penyakit lanas (Phytophthora nicotianae) dan layu bakteri (Ralstonia solanacearum).',
        'Daun tembakau menjadi tipis dan kadar nikotin/aroma menurun jika air berlebih.',
      ],
      bestPractices: [
        'Perdalam parit drainase bedengan hingga minimal 40-50 cm.',
        'Kocorkan Paten Gold + ZA (H-14) dan NPK (H-28 & 30) untuk menjaga vigor tanaman di tengah cekaman basah.',
        'Semprot 7 hari sekali dengan insek untuk mencegah ulat kipat dan kutu kebul.',
      ],
    },
    kemarau: {
      season: 'kemarau',
      optimalSprayHours: '06.00 - 08.00 WIB (udara sejuk, stomata terbuka lebar) atau 16.00 - 17.30 WIB',
      optimalKocorHours: 'Sore hari 15.30 - 17.30 WIB atau pagi hari setelah bedengan diairi',
      soilMoistureCondition: 'Tanah diberi air irigasi piringan terlebih dahulu sebelum pemupukan kocor.',
      adjuvantAdvice: 'Pembasah halus agar penyerapan nano Paten Gold maksimal tanpa bercak pada daun tembakau.',
      waterAdjustmentAdvice: 'Volume kocor penuh 100 ml/pohon untuk menjaga kelembapan perakaran tanaman.',
      keyRisks: [
        'Kutu kebul (vektor virus kerupuk/mosaik) berkembang sangat cepat di musim kering.',
        'Thrips dan ulat grayak merusak helaian daun.',
        'Stomata daun menutup cepat saat matahari naik terik.',
      ],
      bestPractices: [
        'Musim kemarau adalah musim emas tembakau kualitas tinggi dengan aroma dan getah terbaik.',
        'Kocor tepat 100 ml/pohon pada H-14, H-28, dan H-30 untuk menghasilkan lamina daun tebal berkualitas super.',
        'Rutin semprot Paten Gold + Insek setiap 7 hari sekali.',
      ],
    },
  },
  hortikultura: {
    hujan: {
      season: 'hujan',
      optimalSprayHours: '06.30 - 08.30 WIB (setelah embun mengering) atau 15.30 - 17.00 WIB',
      optimalKocorHours: '07.00 - 09.30 WIB pada lubang tanam piringan (parit bedengan bebas genangan)',
      soilMoistureCondition: 'Lembap sedang. Drainase bedengan wajib tinggi (40-60 cm) agar akar cabe/tomat tidak busuk.',
      adjuvantAdvice: 'Gunakan Perekat/Perata (Sticker) 5-10 ml/tangki agar larutan Paten Imun + Hijau tahan terpaan hujan.',
      waterAdjustmentAdvice: 'Kocor 40-50 ml/pohon. Pastikan lubang mulsa tidak tergenang lumpur.',
      keyRisks: [
        'Penyakit patek / antraknosa (Colletotrichum) pada buah cabe dan tomat.',
        'Busuk batang dan layu fusarium/bakteri berkembang sangat cepat.',
        'Bunga cabe/tomat rontok akibat kelembapan berlebih dan kekurangan unsur kalsium/mikro.',
      ],
      bestPractices: [
        'Sterilisasi lahan H-2 dengan Paten Imun (3 sachet/tangki) sangat krusial untuk mensterilkan spora patogen tanah.',
        'Semprot rutin Paten Imun 1 sachet + Paten Hijau 1 sachet tiap 7 hari untuk memicu fitoaleksin antibodi tanaman.',
        'Jaga sanitasi kebun dari buah busuk yang jatuh ke tanah.',
      ],
    },
    kemarau: {
      season: 'kemarau',
      optimalSprayHours: '06.00 - 08.00 WIB (sebelum terik matahari) atau 16.00 - 17.30 WIB',
      optimalKocorHours: 'Sore hari 15.30 - 17.30 WIB setelah penyiraman piringan',
      soilMoistureCondition: 'Tanah diberi air irigasi piringan terlebih dahulu sebelum pemupukan kocor.',
      adjuvantAdvice: 'Gunakan pembasah (spreader) agar larutan merata ke permukaan daun bawah tempat kutu bersembunyi.',
      waterAdjustmentAdvice: 'Pertahankan kocor 50 ml/pohon penuh untuk hidrasi perakaran di bawah mulsa plastik.',
      keyRisks: [
        'Ledakan hama Thrips, Tungau (Mites), dan Kutu Kebul (vektor Virus Gemini kuning bule).',
        'Gugur bunga dan buah kecil akibat suhu siang hari > 34°C.',
      ],
      bestPractices: [
        'Campurkan insektisida penuntas kutu saat semprot 7 harian Paten Hijau + Paten Imun.',
        'Aplikasi kocor rutin tiap 15-20 hari (H-7, 25, 45, 65) menjamin pembuahan terus berlanjut tanpa jeda petik.',
        'Mulsa plastik perak-hitam sangat dianjurkan untuk memantulkan sinar dan mengusir kutu kebul.',
      ],
    },
  },
};
