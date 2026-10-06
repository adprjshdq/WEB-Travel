import { useEffect, useState } from 'react'
import {
  useSearchParams,
  useNavigate
} from 'react-router-dom'

import { useApp } from '../context/AppContext'
import { getDestinations } from '../services/api'

import {
  PageHead,
  Stars,
  WishBtn,
  rupiah
} from '../components/ui'

import { getImageUrl } from '../utils/imageUrl'

const API_URL = 'http://localhost:5001/api'

export default function Destinations() {
  const [params] = useSearchParams()
  const nav = useNavigate()
  const { setBooking } = useApp()

  const [q, setQ] = useState(
    params.get('q') || ''
  )

  const [wil, setWil] = useState('Semua')

  const [destinations, setDestinations] =
    useState([])

  const [hotels, setHotels] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [loadingHotels, setLoadingHotels] =
    useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          destinationsResponse,
          hotelsResponse
        ] = await Promise.all([
          getDestinations(),

          fetch(`${API_URL}/hotels`)
            .then((res) => res.json())
        ])

        setDestinations(
          destinationsResponse || []
        )

        if (hotelsResponse.success) {
          setHotels(
            hotelsResponse.data || []
          )
        }
      } catch (error) {
        console.error(
          'Gagal mengambil data:',
          error
        )
      } finally {
        setLoading(false)
        setLoadingHotels(false)
      }
    }

    loadData()
  }, [])

  const wilayah = [
    'Semua',
    ...new Set(
      destinations
        .map((d) => d.location)
        .filter(Boolean)
    )
  ]

  const list = destinations.filter((d) => {
    const cocokWilayah =
      wil === 'Semua' ||
      d.location === wil

    const cocokPencarian =
      d.name
        ?.toLowerCase()
        .includes(q.toLowerCase())

    return (
      cocokWilayah &&
      cocokPencarian
    )
  })

  const resetFilter = () => {
    setQ('')
    setWil('Semua')
  }

  const pesanDestinasi = (destination) => {
    const harga = Number(
      destination.price || 0
    )

    if (harga <= 0) {
      alert(
        'Harga wisata untuk destinasi ini belum ditentukan.'
      )
      return
    }

    setBooking({
      destination_id:
        destination.id,

      item_type:
        'destination',

      item_name:
        destination.name,

      judul:
        destination.name,

      harga,

      mataUang: 'IDR',

      satuan: 'orang'
    })

    nav('/booking')
  }

  if (loading) {
    return (
      <>
        <PageHead
          title="Destinasi"
          desc="Temukan berbagai destinasi wisata di Indonesia."
        />

        <div className="
                    grid
                    gap-5
                    sm:grid-cols-2
                    lg:grid-cols-3
                ">
          {[1, 2, 3, 4, 5, 6].map(
            (item) => (
              <div
                key={item}
                className="
                                    overflow-hidden
                                    rounded-lg
                                    border
                                    border-line
                                    bg-panel
                                    animate-pulse
                                "
              >
                <div className="
                                    h-52
                                    bg-line
                                " />

                <div className="
                                    space-y-3
                                    p-4
                                ">
                  <div className="
                                        h-4
                                        w-3/4
                                        rounded
                                        bg-line
                                    " />

                  <div className="
                                        h-3
                                        w-1/2
                                        rounded
                                        bg-line
                                    " />

                  <div className="
                                        h-3
                                        w-full
                                        rounded
                                        bg-line
                                    " />

                  <div className="
                                        h-10
                                        rounded
                                        bg-line
                                    " />
                </div>
              </div>
            )
          )}
        </div>
      </>
    )
  }

  return (
    <>
      <PageHead
        title="Destinasi"
        desc="Temukan berbagai destinasi wisata di Indonesia."
      />

      {/* SEARCH & FILTER */}
      <section
        aria-label="Pencarian destinasi"
        className="mb-7"
      >
        <div className="
                    border
                    border-line
                    rounded-lg
                    bg-panel
                    p-4
                ">
          <div className="
                        flex
                        flex-col
                        gap-3
                        lg:flex-row
                    ">
            <div className="
                            relative
                            flex-1
                        ">
              <i
                className="
                                    fa-solid
                                    fa-magnifying-glass
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-mute
                                "
                aria-hidden="true"
              />

              <input
                className="
                                    input
                                    !pl-11
                                "
                placeholder="Cari destinasi..."
                aria-label="Cari destinasi"
                value={q}
                onChange={(e) =>
                  setQ(
                    e.target.value
                  )
                }
              />
            </div>

            {(q ||
              wil !== 'Semua') && (
                <button
                  type="button"
                  className="btn"
                  onClick={
                    resetFilter
                  }
                >
                  <i
                    className="
                                        fa-solid
                                        fa-rotate-left
                                    "
                    aria-hidden="true"
                  />

                  Reset
                </button>
              )}
          </div>

          {/* WILAYAH */}
          <div className="
                        mt-4
                        border-t
                        border-line
                        pt-4
                    ">
            <div className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                        ">
              <span className="
                                mr-1
                                text-xs
                                font-medium
                                text-mute
                            ">
                Wilayah
              </span>

              {wilayah.map((w) => (
                <button
                  key={w}
                  type="button"
                  className="chip"
                  aria-pressed={
                    wil === w
                  }
                  onClick={() =>
                    setWil(w)
                  }
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HASIL */}
      <div className="
                mb-5
                flex
                flex-col
                gap-2
                sm:flex-row
                sm:items-center
                sm:justify-between
            ">
        <div>
          <p className="
                        text-sm
                        font-semibold
                    ">
            <span className="
                            text-accent
                        ">
              {list.length}
            </span>{' '}
            destinasi tersedia
          </p>

          {(q ||
            wil !== 'Semua') && (
              <p className="
                            mt-1
                            text-xs
                            text-mute
                        ">
                {q &&
                  `Pencarian: "${q}"`}

                {q &&
                  wil !== 'Semua' &&
                  ' • '}

                {wil !== 'Semua' &&
                  `Wilayah: ${wil}`}
              </p>
            )}
        </div>

        {(q ||
          wil !== 'Semua') && (
            <button
              type="button"
              className="
                            text-left
                            text-sm
                            font-semibold
                            text-accent
                            hover:underline
                            sm:text-right
                        "
              onClick={
                resetFilter
              }
            >
              Reset filter
            </button>
          )}
      </div>

      {/* EMPTY */}
      {list.length === 0 && (
        <div className="
                    border
                    border-line
                    rounded-lg
                    bg-panel
                    p-10
                    text-center
                ">
          <i
            className="
                            fa-solid
                            fa-map-location-dot
                            text-3xl
                            text-mute
                        "
            aria-hidden="true"
          />

          <h2 className="
                        mt-4
                        text-lg
                        font-bold
                    ">
            Destinasi tidak ditemukan
          </h2>

          <p className="
                        mx-auto
                        mt-2
                        max-w-md
                        text-sm
                        text-mute
                    ">
            Tidak ada destinasi yang
            sesuai dengan pencarian
            atau wilayah yang dipilih.
          </p>

          <button
            type="button"
            className="
                            btn
                            btn-p
                            mt-5
                        "
            onClick={
              resetFilter
            }
          >
            <i
              className="
                                fa-solid
                                fa-rotate-left
                            "
              aria-hidden="true"
            />

            Reset filter
          </button>
        </div>
      )}

      {/* DESTINASI */}
      {list.length > 0 && (
        <div className="space-y-7">
          {list.map((d) => {
            const nearbyHotels =
              hotels.filter(
                (hotel) => {
                  const hotelCity =
                    hotel.city
                      ?.toLowerCase()

                  const location =
                    d.location
                      ?.toLowerCase()

                  return (
                    hotelCity?.includes(
                      location
                    ) ||
                    location?.includes(
                      hotelCity
                    )
                  )
                }
              )

            const harga = Number(
              d.price || 0
            )

            return (
              <article
                key={d.id}
                className="
                                    overflow-hidden
                                    rounded-lg
                                    border
                                    border-line
                                    bg-panel
                                "
              >
                {/* DESTINASI */}
                <div className="
                                    grid
                                    lg:grid-cols-[20rem_1fr]
                                ">
                  {/* IMAGE */}
                  <div className="
                                        relative
                                        h-64
                                        lg:h-full
                                        lg:min-h-[25rem]
                                    ">
                    <img
                      src={getImageUrl(
                        d.image
                      )}
                      alt={d.name}
                      className="
                                                h-full
                                                w-full
                                                object-cover
                                            "
                      onError={(e) => {
                        e.currentTarget.src =
                          '/images/Labuan bajo copy.jpg'
                      }}
                    />

                    {d.category && (
                      <span className="
                                                absolute
                                                left-3
                                                top-3
                                                rounded
                                                bg-bg/90
                                                px-2.5
                                                py-1
                                                text-[11px]
                                                font-semibold
                                            ">
                        {d.category}
                      </span>
                    )}

                    <div className="
                                            absolute
                                            bottom-3
                                            left-3
                                            flex
                                            items-center
                                            gap-1.5
                                            rounded
                                            bg-bg/90
                                            px-2.5
                                            py-1
                                            text-xs
                                            font-semibold
                                        ">
                      <i
                        className="
                                                    fa-solid
                                                    fa-star
                                                    text-accent
                                                "
                        aria-hidden="true"
                      />

                      {Number(
                        d.rating || 0
                      ).toFixed(1)}
                    </div>
                  </div>

                  {/* DETAIL */}
                  <div className="
                                        flex
                                        flex-col
                                        p-5
                                        sm:p-6
                                    ">
                    <div className="
                                            flex
                                            items-start
                                            justify-between
                                            gap-4
                                        ">
                      <div className="
                                                min-w-0
                                            ">
                        <p className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    text-sm
                                                    font-semibold
                                                    text-accent
                                                ">
                          <i
                            className="
                                                            fa-solid
                                                            fa-location-dot
                                                        "
                            aria-hidden="true"
                          />

                          {d.location}
                        </p>

                        <h2 className="
                                                    mt-1.5
                                                    text-2xl
                                                    font-bold
                                                ">
                          {d.name}
                        </h2>

                        <div className="mt-2">
                          <Stars
                            n={Number(
                              d.rating || 0
                            )}
                          />
                        </div>
                      </div>

                      <WishBtn
                        id={d.id}
                        nama={d.name}
                      />
                    </div>

                    <p className="
                                            mt-5
                                            max-w-3xl
                                            text-sm
                                            leading-relaxed
                                            text-mute
                                        ">
                      {d.description ||
                        'Nikmati keindahan destinasi wisata Indonesia.'}
                    </p>

                    <div className="
                                            mt-6
                                            border-t
                                            border-line
                                            pt-5
                                        ">
                      <div className="
                                                flex
                                                flex-col
                                                gap-4
                                                sm:flex-row
                                                sm:items-end
                                                sm:justify-between
                                            ">
                        <div>
                          <p className="
                                                        text-xs
                                                        text-mute
                                                    ">
                            Harga wisata
                          </p>

                          {harga > 0 ? (
                            <>
                              <p className="
                                                                mt-0.5
                                                                text-2xl
                                                                font-bold
                                                                text-accent
                                                            ">
                                {rupiah(
                                  harga
                                )}
                              </p>

                              <p className="
                                                                text-xs
                                                                text-mute
                                                            ">
                                per orang
                              </p>
                            </>
                          ) : (
                            <p className="
                                                            mt-1
                                                            text-sm
                                                            text-mute
                                                        ">
                              Harga belum
                              ditentukan
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          className="
                                                        btn
                                                        btn-p
                                                        w-full
                                                        sm:w-auto
                                                    "
                          disabled={
                            harga <= 0
                          }
                          onClick={() =>
                            pesanDestinasi(
                              d
                            )
                          }
                        >
                          <i
                            className="
                                                            fa-solid
                                                            fa-calendar-check
                                                        "
                            aria-hidden="true"
                          />

                          {harga > 0
                            ? 'Pesan wisata'
                            : 'Harga belum tersedia'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PENGINAPAN */}
                <div className="
                                    border-t
                                    border-line
                                    bg-bg/20
                                    p-4
                                    sm:p-5
                                ">
                  <div className="
                                        mb-4
                                        flex
                                        flex-col
                                        gap-2
                                        sm:flex-row
                                        sm:items-center
                                        sm:justify-between
                                    ">
                    <div>
                      <h3 className="
                                                font-bold
                                            ">
                        Penginapan
                        di{' '}
                        {d.location}
                      </h3>

                      <p className="
                                                mt-0.5
                                                text-xs
                                                text-mute
                                            ">
                        Pilihan tempat
                        menginap di
                        sekitar
                        destinasi.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="
                                                flex
                                                items-center
                                                gap-2
                                                text-left
                                                text-sm
                                                font-semibold
                                                text-accent
                                                hover:underline
                                            "
                      onClick={() =>
                        nav(
                          `/hotel?city=${encodeURIComponent(
                            d.location
                          )}`
                        )
                      }
                    >
                      Lihat semua

                      <i
                        className="
                                                    fa-solid
                                                    fa-arrow-right
                                                "
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  {/* LOADING HOTEL */}
                  {loadingHotels && (
                    <div className="
                                            grid
                                            gap-3
                                            sm:grid-cols-2
                                        ">
                      {[1, 2].map(
                        (item) => (
                          <div
                            key={item}
                            className="
                                                            flex
                                                            gap-3
                                                            rounded-lg
                                                            border
                                                            border-line
                                                            bg-panel
                                                            p-3
                                                            animate-pulse
                                                        "
                          >
                            <div className="
                                                            h-24
                                                            w-24
                                                            shrink-0
                                                            rounded-md
                                                            bg-line
                                                        " />

                            <div className="
                                                            flex-1
                                                            space-y-2
                                                        ">
                              <div className="
                                                                h-4
                                                                w-3/4
                                                                rounded
                                                                bg-line
                                                            " />

                              <div className="
                                                                h-3
                                                                w-1/2
                                                                rounded
                                                                bg-line
                                                            " />

                              <div className="
                                                                h-3
                                                                w-1/3
                                                                rounded
                                                                bg-line
                                                            " />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {/* NO HOTEL */}
                  {!loadingHotels &&
                    nearbyHotels.length ===
                    0 && (
                      <div className="
                                                rounded-lg
                                                border
                                                border-line
                                                bg-panel
                                                p-6
                                                text-center
                                            ">
                        <i
                          className="
                                                        fa-solid
                                                        fa-bed
                                                        text-2xl
                                                        text-mute
                                                    "
                          aria-hidden="true"
                        />

                        <p className="
                                                    mt-2
                                                    text-sm
                                                    text-mute
                                                ">
                          Belum ada
                          penginapan
                          yang
                          terdaftar
                          di lokasi
                          ini.
                        </p>

                        <button
                          type="button"
                          className="
                                                        btn
                                                        mt-4
                                                    "
                          onClick={() =>
                            nav(
                              '/hotel'
                            )
                          }
                        >
                          Lihat
                          penginapan
                        </button>
                      </div>
                    )}

                  {/* HOTEL */}
                  {!loadingHotels &&
                    nearbyHotels.length >
                    0 && (
                      <div className="
                                                grid
                                                gap-3
                                                sm:grid-cols-2
                                            ">
                        {nearbyHotels
                          .slice(0, 2)
                          .map(
                            (
                              hotel
                            ) => (
                              <div
                                key={
                                  hotel.id
                                }
                                className="
                                                                    flex
                                                                    gap-3
                                                                    rounded-lg
                                                                    border
                                                                    border-line
                                                                    bg-panel
                                                                    p-3
                                                                    transition
                                                                    hover:border-accent/40
                                                                "
                              >
                                <img
                                  src={getImageUrl(
                                    hotel.image
                                  )}
                                  alt={
                                    hotel.name
                                  }
                                  className="
                                                                        h-24
                                                                        w-24
                                                                        shrink-0
                                                                        rounded-md
                                                                        object-cover
                                                                    "
                                  onError={(
                                    e
                                  ) => {
                                    e.currentTarget.src =
                                      '/images/Labuan bajo copy.jpg'
                                  }}
                                />

                                <div className="
                                                                    min-w-0
                                                                    flex-1
                                                                ">
                                  <h4 className="
                                                                        truncate
                                                                        font-semibold
                                                                    ">
                                    {
                                      hotel.name
                                    }
                                  </h4>

                                  <p className="
                                                                        mt-1
                                                                        truncate
                                                                        text-xs
                                                                        text-mute
                                                                    ">
                                    {
                                      hotel.city
                                    }
                                  </p>

                                  <div className="mt-1">
                                    <Stars
                                      n={Number(
                                        hotel.stars ||
                                        0
                                      )}
                                    />
                                  </div>

                                  <div className="
                                                                        mt-2
                                                                        flex
                                                                        items-end
                                                                        justify-between
                                                                        gap-2
                                                                    ">
                                    <div>
                                      <p className="
                                                                                text-sm
                                                                                font-bold
                                                                                text-accent
                                                                            ">
                                        {rupiah(
                                          Number(
                                            hotel.price ||
                                            0
                                          )
                                        )}
                                      </p>

                                      <p className="
                                                                                text-[10px]
                                                                                text-mute
                                                                            ">
                                        per malam
                                      </p>
                                    </div>

                                    <button
                                      type="button"
                                      className="
                                                                                btn
                                                                                btn-p
                                                                                px-3
                                                                                text-xs
                                                                            "
                                      onClick={() =>
                                        nav(
                                          '/hotel'
                                        )
                                      }
                                    >
                                      Lihat
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                      </div>
                    )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </>
  )
}