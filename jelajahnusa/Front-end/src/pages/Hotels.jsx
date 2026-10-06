import { useEffect, useMemo, useState } from 'react'
import {
  useNavigate,
  useSearchParams
} from 'react-router-dom'

import { useApp } from '../context/AppContext'

import {
  PageHead,
  Stars,
  WishBtn,
  rupiah
} from '../components/ui'

import { getImageUrl } from '../utils/imageUrl'

import API_URL from '../services/api'

export default function Hotels() {
  const [params, setParams] = useSearchParams()
  const nav = useNavigate()
  const { setBooking } = useApp()

  const [hotels, setHotels] = useState([])
  const [maks, setMaks] = useState(7000000)
  const [urut, setUrut] = useState('murah')
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  const cityParam = params.get('city') || ''

  // =========================
  // AMBIL DATA HOTEL
  // =========================
  useEffect(() => {
    const loadHotels = async () => {
      try {
        const response = await fetch(
          `${API_URL}/hotels`
        )

        const result = await response.json()

        if (result.success) {
          setHotels(result.data || [])
        }
      } catch (error) {
        console.error(
          'Gagal mengambil data hotel:',
          error
        )
      } finally {
        setLoading(false)
      }
    }

    loadHotels()
  }, [])

  // =========================
  // DAFTAR KOTA
  // =========================
  const cities = useMemo(() => {
    return [
      'Semua',
      ...new Set(
        hotels
          .map((hotel) => hotel.city)
          .filter(Boolean)
      )
    ]
  }, [hotels])

  const selectedCity = cityParam || 'Semua'

  // =========================
  // FILTER & SORTING
  // =========================
  const list = useMemo(() => {
    const keyword = q.trim().toLowerCase()

    return [...hotels]
      .filter((hotel) => {
        const cocokHarga =
          Number(hotel.price || 0) <= maks

        const hotelCity =
          hotel.city?.toLowerCase() || ''

        const filterCity =
          selectedCity.toLowerCase()

        const cocokKota =
          selectedCity === 'Semua' ||
          hotelCity.includes(filterCity) ||
          filterCity.includes(hotelCity)

        const cocokNama =
          !keyword ||
          hotel.name
            ?.toLowerCase()
            .includes(keyword)

        return (
          cocokHarga &&
          cocokKota &&
          cocokNama
        )
      })
      .sort((a, b) => {
        if (urut === 'murah') {
          return (
            Number(a.price || 0) -
            Number(b.price || 0)
          )
        }

        return (
          Number(b.stars || 0) -
          Number(a.stars || 0)
        )
      })
  }, [
    hotels,
    maks,
    urut,
    q,
    selectedCity
  ])

  // =========================
  // PILIH KOTA
  // =========================
  const pilihKota = (city) => {
    if (city === 'Semua') {
      setParams({})
      return
    }

    setParams({
      city
    })
  }

  // =========================
  // RESET FILTER
  // =========================
  const resetFilter = () => {
    setQ('')
    setMaks(7000000)
    setUrut('murah')
    setParams({})
  }

  // =========================
  // BOOKING HOTEL
  // =========================
  const pesanHotel = (hotel) => {
    setBooking({
      item_type: 'hotel',
      item_name: hotel.name,
      judul: hotel.name,
      harga: Number(hotel.price || 0),
      mataUang: 'IDR',
      satuan: 'malam'
    })

    nav('/booking')
  }

  return (
    <>
      <PageHead
        title="Penginapan"
        desc="Hotel, villa, dan homestay untuk menemani perjalananmu."
      />

      {/* HEADER & SEARCH */}
      <section className="mb-7 border border-line rounded-lg bg-panel p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-accent">
              Penginapan
            </p>

            <h2 className="mt-1 text-xl font-bold">
              Temukan tempat menginap
            </h2>

            <p className="mt-1.5 text-sm text-mute">
              Cari penginapan berdasarkan nama,
              lokasi, dan anggaran.
            </p>
          </div>

          <div className="hidden items-center gap-2 text-sm text-mute sm:flex">
            <i
              className="fa-solid fa-hotel text-accent"
              aria-hidden="true"
            />
            {hotels.length} penginapan
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative mt-5">
          <i
            className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-mute"
            aria-hidden="true"
          />

          <input
            className="input !pl-11"
            placeholder="Cari hotel, villa, atau homestay..."
            aria-label="Cari penginapan"
            value={q}
            onChange={(e) =>
              setQ(e.target.value)
            }
          />
        </div>

        {/* CITY */}
        <div className="mt-5 border-t border-line pt-4">
          <p className="mb-2 text-xs font-semibold text-mute">
            Lokasi
          </p>

          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() =>
                  pilihKota(city)
                }
                className="chip"
                aria-pressed={
                  selectedCity === city
                }
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* LOADING */}
      {loading && (
        <div className="grid gap-5 lg:grid-cols-[15rem_1fr]">
          <div className="hidden h-72 rounded-lg border border-line bg-panel p-5 animate-pulse lg:block">
            <div className="h-4 w-1/2 rounded bg-line" />

            <div className="mt-6 h-3 w-1/3 rounded bg-line" />

            <div className="mt-3 h-2 w-full rounded bg-line" />

            <div className="mt-8 h-10 w-full rounded bg-line" />
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-lg border border-line bg-panel p-3 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="h-40 w-40 shrink-0 rounded-md bg-line" />

                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-2/3 rounded bg-line" />

                    <div className="h-3 w-1/3 rounded bg-line" />

                    <div className="h-3 w-1/2 rounded bg-line" />

                    <div className="mt-5 h-8 w-32 rounded bg-line" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTENT */}
      {!loading && (
        <div className="grid gap-5 lg:grid-cols-[15rem_1fr]">

          {/* FILTER */}
          <aside
            className="h-fit rounded-lg border border-line bg-panel p-4 lg:sticky lg:top-20"
            aria-label="Filter penginapan"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold">
                  Filter
                </h3>

                <p className="mt-0.5 text-xs text-mute">
                  Sesuaikan hasil
                </p>
              </div>

              <i
                className="fa-solid fa-sliders text-accent"
                aria-hidden="true"
              />
            </div>

            {/* PRICE */}
            <div className="mt-6">
              <label
                htmlFor="maks"
                className="text-sm font-semibold"
              >
                Harga maksimal
              </label>

              <p className="mt-1 font-bold text-accent">
                {rupiah(maks)}
              </p>

              <input
                id="maks"
                type="range"
                min="300000"
                max="7000000"
                step="50000"
                value={maks}
                onChange={(e) =>
                  setMaks(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="mt-3 w-full accent-green-500"
              />

              <div className="mt-1 flex justify-between text-[11px] text-mute">
                <span>
                  Rp300 ribu
                </span>

                <span>
                  Rp7 juta
                </span>
              </div>
            </div>

            {/* SORT */}
            <div className="mt-6 border-t border-line pt-5">
              <label
                htmlFor="urut"
                className="text-sm font-semibold"
              >
                Urutkan
              </label>

              <select
                id="urut"
                className="input mt-2"
                value={urut}
                onChange={(e) =>
                  setUrut(
                    e.target.value
                  )
                }
              >
                <option value="murah">
                  Harga termurah
                </option>

                <option value="bintang">
                  Bintang tertinggi
                </option>
              </select>
            </div>

            {/* RESET */}
            <button
              type="button"
              onClick={resetFilter}
              className="btn mt-6 w-full"
            >
              <i
                className="fa-solid fa-rotate-left"
                aria-hidden="true"
              />
              Reset filter
            </button>
          </aside>

          {/* RESULTS */}
          <div>

            {/* RESULT HEADER */}
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold">
                  <span className="text-accent">
                    {list.length}
                  </span>{' '}
                  penginapan ditemukan
                </p>

                {(q ||
                  selectedCity !==
                  'Semua') && (
                    <p className="mt-1 text-xs text-mute">
                      {q &&
                        `Pencarian: "${q}"`}

                      {q &&
                        selectedCity !==
                        'Semua' &&
                        ' • '}

                      {selectedCity !==
                        'Semua' &&
                        `Lokasi: ${selectedCity}`}
                    </p>
                  )}
              </div>

              {(q ||
                selectedCity !==
                'Semua') && (
                  <button
                    type="button"
                    onClick={
                      resetFilter
                    }
                    className="text-left text-sm font-semibold text-accent hover:underline"
                  >
                    Reset filter
                  </button>
                )}
            </div>

            {/* EMPTY */}
            {list.length === 0 && (
              <div className="rounded-lg border border-line bg-panel p-10 text-center">
                <i
                  className="fa-solid fa-bed text-3xl text-mute"
                  aria-hidden="true"
                />

                <h2 className="mt-4 text-lg font-bold">
                  Penginapan tidak ditemukan
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm text-mute">
                  Tidak ada penginapan yang
                  sesuai dengan filter saat ini.
                </p>

                <button
                  type="button"
                  onClick={resetFilter}
                  className="btn btn-p mt-5"
                >
                  <i
                    className="fa-solid fa-rotate-left"
                    aria-hidden="true"
                  />
                  Reset filter
                </button>
              </div>
            )}

            {/* HOTEL LIST */}
            <div className="space-y-4">
              {list.map((h) => {
                const image =
                  getImageUrl(h.image)

                const facilities =
                  h.facilities
                    ? h.facilities
                      .split(',')
                      .map((item) =>
                        item.trim()
                      )
                      .filter(Boolean)
                    : []

                return (
                  <article
                    key={h.id}
                    className="group overflow-hidden rounded-lg border border-line bg-panel transition hover:border-accent/40"
                  >
                    <div className="grid md:grid-cols-[15rem_1fr]">

                      {/* IMAGE */}
                      <div className="relative h-60 md:h-full md:min-h-[19rem]">
                        <img
                          src={image}
                          alt={h.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                        />

                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded bg-bg/90 px-2.5 py-1 text-xs font-semibold">
                          <i
                            className="fa-solid fa-star text-accent"
                            aria-hidden="true"
                          />

                          {Number(
                            h.stars || 0
                          ).toFixed(1)}
                        </div>
                      </div>

                      {/* CONTENT */}
                      <div className="flex flex-col p-5">

                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">

                            <p className="flex items-center gap-2 text-sm font-semibold text-accent">
                              <i
                                className="fa-solid fa-location-dot"
                                aria-hidden="true"
                              />

                              {h.city}
                            </p>

                            <h2 className="mt-1.5 text-xl font-bold">
                              {h.name}
                            </h2>

                            <div className="mt-2">
                              <Stars
                                n={Number(
                                  h.stars ||
                                  0
                                )}
                              />
                            </div>
                          </div>

                          <WishBtn
                            id={`hotel-${h.id}`}
                            nama={h.name}
                          />
                        </div>

                        {/* FACILITIES */}
                        {facilities.length >
                          0 && (
                            <div className="mt-5">
                              <p className="mb-2 text-xs font-semibold text-mute">
                                Fasilitas
                              </p>

                              <div className="flex flex-wrap gap-x-4 gap-y-2">
                                {facilities
                                  .slice(
                                    0,
                                    6
                                  )
                                  .map(
                                    (
                                      facility,
                                      index
                                    ) => (
                                      <span
                                        key={`${facility}-${index}`}
                                        className="flex items-center gap-1.5 text-xs text-mute"
                                      >
                                        <i
                                          className="fa-solid fa-check text-accent"
                                          aria-hidden="true"
                                        />

                                        {
                                          facility
                                        }
                                      </span>
                                    )
                                  )}
                              </div>
                            </div>
                          )}

                        {/* PRICE */}
                        <div className="mt-6 border-t border-line pt-5">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                              <p className="text-xs text-mute">
                                Mulai dari
                              </p>

                              <p className="mt-0.5 text-xl font-bold text-accent">
                                {rupiah(
                                  Number(
                                    h.price ||
                                    0
                                  )
                                )}
                              </p>

                              <p className="text-xs text-mute">
                                per kamar /
                                malam
                              </p>
                            </div>

                            <button
                              type="button"
                              className="btn btn-p w-full sm:w-auto"
                              onClick={() =>
                                pesanHotel(
                                  h
                                )
                              }
                            >
                              <i
                                className="fa-solid fa-calendar-check"
                                aria-hidden="true"
                              />

                              Pesan kamar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}