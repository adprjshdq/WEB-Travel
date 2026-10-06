export const destinations = [
  {
    id: 'd1',
    nama: 'Labuan Bajo',
    wilayah: 'Nusa Tenggara',
    desk: 'Gerbang Taman Nasional Komodo, pulau-pulau kecil, dan pantai pink.',
    harga: 1800000,
    rating: 4.8,
    hue: 200,
    image: '/Labuan bajo copy.jpg'
    // properti lainnya tetap
  },

  {
    id: 'd2',
    nama: 'Raja Ampat',
    wilayah: 'Papua',
    desk: 'Spot selam kelas dunia dengan lebih dari 1.500 pulau karst.',
    harga: 6500000,
    rating: 4.9,
    hue: 175,
    image: '/Raja ampat.jpg'
    // properti lainnya tetap
  },

  {
    id: 'd3',
    nama: 'Ubud',
    wilayah: 'Bali',
    desk: 'Sawah terasering, galeri seni, dan kelas memasak Bali.',
    harga: 900000,
    rating: 4.6,
    hue: 120,
    image: '/Ubud bali.jpg'
    // properti lainnya tetap
  },

  {
    id: 'd4',
    nama: 'Yogyakarta',
    wilayah: 'Jawa',
    desk: 'Borobudur, Prambanan, Keraton, dan kuliner di sekitar Malioboro.',
    harga: 750000,
    rating: 4.7,
    hue: 30,
    image: '/Yogyakarta.jpg'
    // properti lainnya tetap
  },

  {
    id: 'd5',
    nama: 'Gunung Bromo',
    wilayah: 'Jawa',
    desk: 'Sunrise dari Penanjakan dan lautan pasir kaldera Tengger.',
    harga: 650000,
    rating: 4.7,
    hue: 15,
    image: '/Bromo.jpeg'
    // properti lainnya tetap
  },

  {
    id: 'd6',
    nama: 'Danau Toba',
    wilayah: 'Sumatra',
    desk: 'Danau vulkanik terbesar di Asia Tenggara, dengan Pulau Samosir.',
    harga: 1100000,
    rating: 4.5,
    hue: 215,
    image: '/Danau toba.png'
    // properti lainnya tetap
  }
]


export const packages = [
  /*
  |--------------------------------------------------------------------------
  | PAKET PANGANDARAN
  |--------------------------------------------------------------------------
  */

  {
    id: 'p5',
    nama: 'Eksplorasi Pangandaran & Madasari',
    durasi: '2 hari 1 malam',
    harga: 1250000,
    mataUang: 'IDR',
    kuota: 20,
    hue: 'from-cyan-500 to-blue-600',

    itin: [
      'Hari 1: Berangkat menuju Kabupaten Pangandaran',
      'Hari 1: Menikmati keindahan Pantai Pangandaran',
      'Hari 1: Waktu bebas bermain di pantai',
      'Hari 1: Menikmati sunset di Pantai Pangandaran',
      'Hari 1: Check-in dan istirahat di penginapan',
      'Hari 2: Sarapan dan check-out',
      'Hari 2: Menuju Pantai Madasari',
      'Hari 2: Eksplorasi Pantai Madasari',
      'Hari 2: Menikmati pemandangan pantai',
      'Hari 2: Perjalanan kembali'
    ],

    termasuk: [
      'Transportasi perjalanan',
      'Penginapan 1 malam',
      'Tiket masuk destinasi',
      'Sarapan',
      'Pemandu wisata',
      'Dokumentasi'
    ]
  },


  /*
  |--------------------------------------------------------------------------
  | KOMODO SAILING
  |--------------------------------------------------------------------------
  */

  {
    id: 'p1',
    nama: 'Komodo Sailing',
    durasi: '3 hari 2 malam',
    harga: 4850000,
    mataUang: 'IDR',
    kuota: 12,
    hue: 200,

    itin: [
      'Hari 1: Tiba di Labuan Bajo, naik kapal ke Pulau Kelor, sunset di Kalong.',
      'Hari 2: Trekking Pulau Padar, Pink Beach, snorkeling Manta Point.',
      'Hari 3: Pulau Komodo, kembali ke dermaga, antar ke bandara.'
    ],

    termasuk: [
      'Kapal phinisi',
      'Makan 8x',
      'Tiket taman nasional',
      'Pemandu'
    ]
  },


  /*
  |--------------------------------------------------------------------------
  | BROMO & IJEN
  |--------------------------------------------------------------------------
  */

  {
    id: 'p2',
    nama: 'Bromo dan Ijen',
    durasi: '3 hari 2 malam',
    harga: 2350000,
    mataUang: 'IDR',
    kuota: 20,
    hue: 15,

    itin: [
      'Hari 1: Jemput di Malang, menuju Cemoro Lawang.',
      'Hari 2: Jeep sunrise Penanjakan, Bukit Teletubbies, lanjut Banyuwangi.',
      'Hari 3: Blue fire Kawah Ijen pukul 01.00, kembali ke Banyuwangi.'
    ],

    termasuk: [
      'Jeep 4WD',
      'Homestay',
      'Masker gas',
      'Pemandu'
    ]
  },


  /*
  |--------------------------------------------------------------------------
  | JOGJA HERITAGE
  |--------------------------------------------------------------------------
  */

  {
    id: 'p3',
    nama: 'Jogja Heritage',
    durasi: '4 hari 3 malam',
    harga: 3100000,
    mataUang: 'IDR',
    kuota: 15,
    hue: 30,

    itin: [
      'Hari 1: Keraton, Taman Sari, makan malam gudeg.',
      'Hari 2: Borobudur sunrise, Candi Mendut, desa wisata.',
      'Hari 3: Prambanan, tari Ramayana.',
      'Hari 4: Belanja batik, antar ke stasiun.'
    ],

    termasuk: [
      'Hotel bintang 3',
      'Mobil + sopir',
      'Tiket masuk',
      'Sarapan'
    ]
  },


  /*
  |--------------------------------------------------------------------------
  | RAJA AMPAT DIVING
  |--------------------------------------------------------------------------
  */

  {
    id: 'p4',
    nama: 'Raja Ampat Diving',
    durasi: '5 hari 4 malam',
    harga: 12900000,
    mataUang: 'IDR',
    kuota: 8,
    hue: 175,

    itin: [
      'Hari 1: Tiba Sorong, speedboat ke Waisai.',
      'Hari 2-4: 9 dive di Arborek, Cape Kri, dan Misool.',
      'Hari 5: Kembali ke Sorong.'
    ],

    termasuk: [
      'Resort tepi pantai',
      'Peralatan selam',
      'Dive master',
      'Makan penuh'
    ]
  },


  /*
  |--------------------------------------------------------------------------
  | RINJANI HERO
  |--------------------------------------------------------------------------
  */

  {
    id: 'p6',
    nama: 'Rinjani Hero — Sembalun Summit',
    durasi: '2 hari 1 malam',
    harga: 175,
    mataUang: 'USD',
    kuota: 10,
    hue: 'from-slate-600 to-emerald-600',

    operator: 'Rinjani Hero',

    lokasi: 'Sembalun, Lombok',

    rating: 4.9,

    deskripsi:
      'Paket pendakian Gunung Rinjani 2D1N melalui jalur Sembalun dengan fokus utama mencapai puncak Rinjani.',

    itin: [
      'Hari 1: Registrasi dan persiapan di Sembalun.',
      'Hari 1: Trekking menuju Plawangan Sembalun.',
      'Hari 1: Mendirikan tenda dan menikmati sunset.',
      'Hari 1: Istirahat di area camping.',
      'Hari 2: Bangun dini hari dan persiapan summit.',
      'Hari 2: Pendakian menuju puncak Gunung Rinjani.',
      'Hari 2: Menikmati sunrise dari puncak.',
      'Hari 2: Turun menuju Sembalun.',
      'Hari 2: Perjalanan kembali.'
    ],

    termasuk: [
      'Tiket e-Rinjani',
      'Asuransi',
      'Guide berlisensi',
      'Porter',
      'Tenda',
      'Makanan',
      'Hotel 1 malam sebelum trekking'
    ],

    catatan: [
      'Harga USD 175 per orang.',
      'Operator lokal dengan pengalaman lebih dari 10 tahun.',
      'Rating operator 4.9/5.',
      'Peserta wajib mengikuti ketentuan Taman Nasional Gunung Rinjani.',
      'Kondisi fisik yang baik diperlukan untuk pendakian summit.'
    ]
  },


  /*
  |--------------------------------------------------------------------------
  | INDAHNESIA TREKKING
  |--------------------------------------------------------------------------
  */

  {
    id: 'p7',
    nama: 'Indahnesia Trekking — Sembalun ke Senaru',
    durasi: '3 hari 2 malam',
    harga: 129,
    mataUang: 'USD',
    kuota: 10,
    hue: 'from-emerald-500 to-teal-600',

    operator: 'Indahnesia Trekking',

    lokasi: 'Sembalun – Senaru, Lombok',

    rating: 4.8,

    deskripsi:
      'Paket trekking 3D2N dari Sembalun menuju Senaru dengan summit Gunung Rinjani, Danau Segara Anak, dan hot springs.',

    itin: [
      'Hari 1: Registrasi digital dan persiapan di Sembalun.',
      'Hari 1: Trekking dari Sembalun menuju Plawangan Sembalun.',
      'Hari 1: Camping di area crater rim.',
      'Hari 2: Summit Gunung Rinjani dan menikmati sunrise.',
      'Hari 2: Turun menuju Danau Segara Anak.',
      'Hari 2: Menikmati Danau Segara Anak dan hot springs.',
      'Hari 2: Bermalam di area camping.',
      'Hari 3: Trekking menuju jalur keluar Senaru.',
      'Hari 3: Exit dan perjalanan kembali.'
    ],

    termasuk: [
      'Paket trekking',
      'Summit Gunung Rinjani',
      'Danau Segara Anak',
      'Hot springs',
      'Guide',
      'Porter',
      'Perlengkapan trekking sesuai paket'
    ],

    catatan: [
      'Harga mulai dari USD 129 per orang.',
      'Asuransi wajib mengikuti ketentuan yang berlaku.',
      'Registrasi digital dilakukan sebelum trekking.',
      'Jadwal dan jalur mengikuti ketentuan Taman Nasional Gunung Rinjani.'
    ]
  }
]


export const hotels = [
  {
    id: 'h1',
    nama: 'Villa Padi Ubud',
    kota: 'Ubud',
    bintang: 4,
    harga: 850000,
    fas: [
      'Kolam renang',
      'Sarapan',
      'Wi-Fi'
    ],
    hue: 120,
    image: '/Villa padi ubud.jpg'
    // properti lainnya tetap
  },

  {
    id: 'h2',
    nama: 'Malioboro Heritage',
    kota: 'Yogyakarta',
    bintang: 3,
    harga: 520000,
    fas: [
      'AC',
      'Sarapan',
      'Parkir'
    ],
    hue: 30,
    image: '/Malioboro Heritage.jpg'
  },

  {
    id: 'h3',
    nama: 'Waecicu Beach Inn',
    kota: 'Labuan Bajo',
    bintang: 4,
    harga: 680000,
    fas: [
      'Pantai privat',
      'Wi-Fi',
      'Antar bandara'
    ],
    hue: 200,
    image: '/Waeecicu beach inn.jpg'
  },

  {
    id: 'h4',
    nama: 'Sere Lake Lodge',
    kota: 'Danau Toba',
    bintang: 3,
    harga: 450000,
    fas: [
      'View danau',
      'Sarapan'
    ],
    hue: 215,
    image: '/Sere lake lodge.jpg'
  },

  {
    id: 'h5',
    nama: 'Bromo Permai Homestay',
    kota: 'Bromo',
    bintang: 2,
    harga: 300000,
    fas: [
      'Air panas',
      'Selimut tebal'
    ],
    hue: 15,
    image: '/Bromo permai homestay.jpg'
  }
]


export const transports = [
  {
    id: 't1',
    jenis: 'Pesawat',
    rute: 'Jakarta - Labuan Bajo',
    operator: 'Garuda Indonesia',
    jam: '06.10 - 09.25',
    harga: 2150000
  },

  {
    id: 't2',
    jenis: 'Pesawat',
    rute: 'Jakarta - Yogyakarta (YIA)',
    operator: 'Citilink',
    jam: '07.30 - 08.55',
    harga: 780000
  },

  {
    id: 't3',
    jenis: 'Pesawat',
    rute: 'Surabaya - Denpasar',
    operator: 'Lion Air',
    jam: '10.05 - 11.55',
    harga: 640000
  },

  {
    id: 't4',
    jenis: 'Kereta',
    rute: 'Gambir - Yogyakarta',
    operator: 'Argo Lawu',
    jam: '08.00 - 15.30',
    harga: 410000
  },

  {
    id: 't5',
    jenis: 'Kereta',
    rute: 'Surabaya - Malang',
    operator: 'Penataran',
    jam: '09.15 - 11.40',
    harga: 80000
  },

  {
    id: 't6',
    jenis: 'Bus',
    rute: 'Medan - Parapat',
    operator: 'ALS Executive',
    jam: '08.00 - 13.00',
    harga: 150000
  },

  {
    id: 't7',
    jenis: 'Sewa mobil',
    rute: 'Bali, termasuk sopir 12 jam',
    operator: 'Bali Trans',
    jam: 'Fleksibel',
    harga: 750000
  },

  {
    id: 't8',
    jenis: 'Sewa mobil',
    rute: 'Yogyakarta, Innova + sopir',
    operator: 'Jogja Rental',
    jam: 'Fleksibel',
    harga: 650000
  }
]


export const faqs = [
  [
    'Bagaimana cara memesan paket wisata?',
    'Pilih paket, tekan Pesan, isi data pada halaman Booking, lalu selesaikan di halaman Pembayaran.'
  ],

  [
    'Apakah saya bisa membatalkan pesanan?',
    'Bisa. Pembatalan H-14 atau lebih awal dikembalikan 100%, H-7 sampai H-13 dikembalikan 50%, kurang dari H-7 tidak ada pengembalian.'
  ],

  [
    'Metode pembayaran apa yang tersedia?',
    'Transfer bank (BCA, Mandiri, BNI), QRIS, dan kartu kredit. Pembayaran harus selesai dalam 24 jam.'
  ],

  [
    'Apakah harga paket sudah termasuk tiket pesawat?',
    'Tidak. Tiket transportasi ke kota tujuan dipesan terpisah di halaman Transportasi.'
  ],

  [
    'Berapa minimal peserta per paket?',
    'Paket open trip berjalan mulai 2 peserta. Untuk private trip, hubungi kami lewat halaman Kontak.'
  ],

  [
    'Bagaimana jika cuaca buruk?',
    'Jadwal dapat diubah demi keselamatan. Kami akan menawarkan penjadwalan ulang atau pengembalian dana sesuai kebijakan.'
  ]
]


export const seedReviews = [
  {
    id: 1,
    nama: 'Dewi Anggraini',
    paket: 'Komodo Sailing',
    bintang: 5,
    teks: 'Kru kapal ramah, jadwal tidak terburu-buru. Padar saat sunrise memang sepadan dengan capeknya.',
    tgl: '2026-08-14'
  },

  {
    id: 2,
    nama: 'Bagas Wicaksono',
    paket: 'Bromo dan Ijen',
    bintang: 4,
    teks: 'Jeep tepat waktu. Hanya saja homestay agak dingin, bawa jaket tebal.',
    tgl: '2026-07-02'
  },

  {
    id: 3,
    nama: 'Siti Maharani',
    paket: 'Jogja Heritage',
    bintang: 5,
    teks: 'Pemandu paham sejarah, tidak sekadar foto-foto. Anak saya senang di Prambanan.',
    tgl: '2026-09-09'
  }
]