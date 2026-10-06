import { PageHead } from '../components/ui'

const tonggak = [
  [
    '2018',
    'Dua pemandu dari Yogyakarta mulai membawa tamu ke Bromo.'
  ],
  [
    '2021',
    'Bermitra dengan 40 homestay milik warga lokal.'
  ],
  [
    '2024',
    'Membuka rute Labuan Bajo dan Raja Ampat.'
  ],
  [
    '2026',
    'Lebih dari 18.000 tamu, 96% memberi bintang 4 ke atas.'
  ]
]

export default function About() {
  return (
    <>
      <PageHead
        title="Tentang kami"
        desc="JelajahNusa dimulai dari satu pertanyaan: kenapa liburan di negeri sendiri harus ribet?"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <section aria-labelledby="pr">
          <h2
            id="pr"
            className="mb-3"
          >
            Perjalanan kami
          </h2>

          <ol className="space-y-4 border-l-2 border-line pl-5">
            {tonggak.map(([tahun, teks]) => (
              <li key={tahun}>
                <b className="text-accent">
                  {tahun}
                </b>

                <p>
                  {teks}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="pg">
          <h2
            id="pg"
            className="mb-3"
          >
            Cara kami bekerja
          </h2>

          <dl className="space-y-3">
            <div>
              <dt className="font-semibold">
                Pemandu lokal
              </dt>

              <dd className="text-mute">
                Semua pemandu tinggal di daerah tujuan dan bersertifikat HPI.
              </dd>
            </div>

            <div>
              <dt className="font-semibold">
                Harga jelas
              </dt>

              <dd className="text-mute">
                Tidak ada biaya tersembunyi. Yang termasuk dan tidak termasuk ditulis di setiap paket.
              </dd>
            </div>

            <div>
              <dt className="font-semibold">
                Kelompok kecil
              </dt>

              <dd className="text-mute">
                Maksimal 12 orang agar tetap nyaman dan tidak merusak lokasi.
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </>
  )
}