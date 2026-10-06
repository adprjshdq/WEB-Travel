import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { packages } from '../data/data'
import { getDestinations } from '../services/api'
import { Stars, rupiah } from '../components/ui'
import { getImageUrl } from '../utils/imageUrl'

export default function Home() {
  const nav = useNavigate()

  const [destinations, setDestinations] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    getDestinations()
      .then((data) => {
        setDestinations(data)
      })
      .catch((error) => {
        console.error(
          'Gagal mengambil destinasi:',
          error
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const cari = (e) => {
    e.preventDefault()

    const query = new FormData(
      e.target
    ).get('q')

    if (!query?.trim()) {
      nav('/destinasi')
      return
    }

    nav(
      '/destinasi?q=' +
      encodeURIComponent(
        query.trim()
      )
    )
  }

  const featuredDestinations =
    destinations.slice(0, 6)

  return (
    <div className="space-y-12">

      {/* =====================================
                HERO
            ===================================== */}

      <section
        aria-labelledby="judul"
        className="
                    relative
                    min-h-[430px]
                    overflow-hidden
                    border
                    border-line
                    rounded-lg
                    bg-panel
                "
      >
        {/* Background */}

        <div
          className="
                        absolute
                        inset-0
                        bg-cover
                        bg-center
                    "
          style={{
            backgroundImage:
              "url('/images/pemandangan.jpg')"
          }}
        />

        {/* Dark overlay */}

        <div className="
                    absolute
                    inset-0
                    bg-[#0b1220]/75
                " />

        <div className="
                    relative
                    flex
                    min-h-[430px]
                    items-center
                    px-5
                    py-12
                    sm:px-8
                    lg:px-12
                ">

          <div className="max-w-2xl">

            <p className="
                            mb-3
                            text-sm
                            font-semibold
                            text-accent
                        ">
              Jelajah Indonesia
            </p>

            <h1
              id="judul"
              className="
                                max-w-2xl
                                text-3xl
                                font-bold
                                leading-tight
                                sm:text-4xl
                                lg:text-5xl
                            "
            >
              Temukan tempat yang
              ingin kamu datangi.
            </h1>

            <p className="
                            mt-5
                            max-w-xl
                            text-base
                            leading-relaxed
                            text-mute
                            sm:text-lg
                        ">
              Cari destinasi, penginapan,
              dan paket perjalanan untuk
              menjelajahi berbagai sudut
              Indonesia.
            </p>

            {/* Search */}

            <form
              onSubmit={cari}
              role="search"
              className="
                                mt-7
                                max-w-2xl
                            "
            >
              <label
                htmlFor="q"
                className="sr-only"
              >
                Cari destinasi
              </label>

              <div className="
                                flex
                                flex-col
                                gap-2
                                sm:flex-row
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
                    id="q"
                    name="q"
                    className="
                                            h-11
                                            w-full
                                            rounded-md
                                            border
                                            border-line
                                            bg-bg/90
                                            pl-11
                                            pr-4
                                            text-ink
                                            outline-none
                                            placeholder:text-mute
                                            focus:border-accent
                                        "
                    placeholder="Cari destinasi..."
                  />
                </div>

                <button
                  type="submit"
                  className="
                                        btn
                                        btn-p
                                        h-11
                                        px-6
                                    "
                >
                  Cari
                </button>

              </div>
            </form>

            {/* Popular searches */}

            <div className="
                            mt-4
                            flex
                            flex-wrap
                            items-center
                            gap-x-2
                            gap-y-2
                        ">
              <span className="
                                text-xs
                                text-mute
                            ">
                Populer:
              </span>

              {[
                'Raja Ampat',
                'Gunung Bromo',
                'Borobudur',
                'Kelingking Beach'
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    nav(
                      `/destinasi?q=${encodeURIComponent(
                        item
                      )}`
                    )
                  }
                  className="
                                        text-xs
                                        text-mute
                                        underline
                                        underline-offset-4
                                        hover:text-accent
                                        transition
                                    "
                >
                  {item}
                </button>
              ))}
            </div>

          </div>

        </div>
      </section>


      {/* =====================================
                DESTINASI
            ===================================== */}

      <section aria-labelledby="populer">

        <div className="
                    mb-5
                    flex
                    items-end
                    justify-between
                    gap-4
                ">
          <div>

            <p className="
                            mb-1
                            text-sm
                            font-semibold
                            text-accent
                        ">
              Destinasi
            </p>

            <h2
              id="populer"
              className="
                                text-2xl
                                font-bold
                            "
            >
              Tempat yang sedang
              menarik perhatian
            </h2>

            <p className="
                            mt-1
                            text-sm
                            text-mute
                        ">
              Beberapa destinasi yang
              bisa kamu pertimbangkan.
            </p>

          </div>

          <Link
            to="/destinasi"
            className="
                            hidden
                            text-sm
                            font-semibold
                            text-accent
                            hover:underline
                            sm:block
                        "
          >
            Lihat semua
          </Link>
        </div>


        {/* Loading */}

        {loading ? (
          <div className="
                        grid
                        gap-5
                        sm:grid-cols-2
                        lg:grid-cols-3
                    ">
            {[1, 2, 3].map(
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
                  </div>
                </div>
              )
            )}
          </div>

        ) : featuredDestinations.length === 0 ? (

          <div className="
                        border
                        border-line
                        bg-panel
                        rounded-lg
                        p-8
                        text-center
                    ">
            <i
              className="
                                fa-solid
                                fa-map-location-dot
                                text-2xl
                                text-mute
                            "
              aria-hidden="true"
            />

            <p className="
                            mt-3
                            text-sm
                            text-mute
                        ">
              Belum ada destinasi
              yang tersedia.
            </p>
          </div>

        ) : (

          <div className="
                        grid
                        gap-5
                        sm:grid-cols-2
                        lg:grid-cols-3
                    ">

            {featuredDestinations.map(
              (d) => (
                <Link
                  key={d.id}
                  to={`/destinasi?q=${encodeURIComponent(
                    d.name
                  )}`}
                  className="
                                        group
                                        overflow-hidden
                                        rounded-lg
                                        border
                                        border-line
                                        bg-panel
                                        transition
                                        hover:-translate-y-0.5
                                        hover:border-accent/50
                                    "
                >

                  {/* Image */}

                  <div className="
                                        relative
                                        overflow-hidden
                                    ">
                    <img
                      src={getImageUrl(
                        d.image
                      )}
                      alt={
                        d.name
                      }
                      className="
                                                h-52
                                                w-full
                                                object-cover
                                                transition
                                                duration-500
                                                group-hover:scale-[1.03]
                                            "
                    />

                    {d.category && (
                      <span className="
                                                absolute
                                                left-3
                                                top-3
                                                rounded
                                                bg-bg/85
                                                px-2
                                                py-1
                                                text-[11px]
                                                font-semibold
                                                text-ink
                                            ">
                        {
                          d.category
                        }
                      </span>
                    )}
                  </div>


                  {/* Content */}

                  <div className="p-4">

                    <h3 className="
                                            truncate
                                            font-bold
                                            group-hover:text-accent
                                            transition
                                        ">
                      {d.name}
                    </h3>

                    <p className="
                                            mt-1.5
                                            flex
                                            items-center
                                            gap-1.5
                                            truncate
                                            text-sm
                                            text-mute
                                        ">
                      <i
                        className="
                                                    fa-solid
                                                    fa-location-dot
                                                    text-accent
                                                    text-xs
                                                "
                        aria-hidden="true"
                      />

                      {d.location}
                    </p>

                    <div className="
                                            mt-3
                                            flex
                                            items-center
                                            justify-between
                                        ">
                      <Stars
                        n={Number(
                          d.rating
                        )}
                      />

                      <span className="
                                                text-xs
                                                text-mute
                                            ">
                        {Number(
                          d.rating
                        ).toFixed(1)}
                      </span>
                    </div>

                  </div>

                </Link>
              )
            )}

          </div>
        )}


        <Link
          to="/destinasi"
          className="
                        btn
                        mt-5
                        w-full
                        sm:hidden
                    "
        >
          Lihat semua destinasi

          <i
            className="
                            fa-solid
                            fa-arrow-right
                        "
            aria-hidden="true"
          />
        </Link>

      </section>


      {/* =====================================
                PAKET WISATA
            ===================================== */}

      <section aria-labelledby="paket-populer">

        <div className="
                    mb-5
                    flex
                    items-end
                    justify-between
                    gap-4
                ">
          <div>

            <p className="
                            mb-1
                            text-sm
                            font-semibold
                            text-accent
                        ">
              Paket perjalanan
            </p>

            <h2
              id="paket-populer"
              className="
                                text-2xl
                                font-bold
                            "
            >
              Pilihan perjalanan
            </h2>

            <p className="
                            mt-1
                            text-sm
                            text-mute
                        ">
              Paket yang bisa langsung
              kamu pesan.
            </p>

          </div>

          <Link
            to="/paket"
            className="
                            hidden
                            text-sm
                            font-semibold
                            text-accent
                            hover:underline
                            sm:block
                        "
          >
            Semua paket
          </Link>

        </div>


        <div className="
                    divide-y
                    divide-line
                    overflow-hidden
                    rounded-lg
                    border
                    border-line
                    bg-panel
                ">

          {packages.map(
            (p, index) => (
              <Link
                key={p.id}
                to="/paket"
                className="
                                    group
                                    flex
                                    flex-col
                                    gap-4
                                    p-4
                                    transition
                                    hover:bg-panel-soft
                                    sm:flex-row
                                    sm:items-center
                                "
              >

                {/* Number */}

                <span className="
                                    hidden
                                    w-8
                                    shrink-0
                                    text-sm
                                    font-semibold
                                    text-mute
                                    sm:block
                                ">
                  {String(
                    index + 1
                  ).padStart(
                    2,
                    '0'
                  )}
                </span>


                {/* Icon */}

                <div className="
                                    hidden
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded
                                    bg-accent-soft
                                    text-accent
                                    sm:flex
                                ">
                  <i
                    className="
                                            fa-solid
                                            fa-route
                                            text-sm
                                        "
                    aria-hidden="true"
                  />
                </div>


                {/* Info */}

                <div className="
                                    min-w-0
                                    flex-1
                                ">

                  <h3 className="
                                        truncate
                                        font-semibold
                                        group-hover:text-accent
                                        transition
                                    ">
                    {p.nama}
                  </h3>

                  <div className="
                                        mt-1
                                        flex
                                        flex-wrap
                                        gap-x-4
                                        gap-y-1
                                        text-xs
                                        text-mute
                                    ">
                    <span>
                      {p.durasi}
                    </span>

                    <span>
                      {p.kuota}
                      {' '}
                      kursi
                    </span>
                  </div>

                </div>


                {/* Price */}

                <div className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-4
                                    sm:block
                                    sm:text-right
                                ">

                  <div>
                    <p className="
                                            text-[11px]
                                            text-mute
                                        ">
                      Mulai dari
                    </p>

                    <p className="
                                            text-base
                                            font-bold
                                            text-accent
                                        ">
                      {p.mataUang ===
                        'USD'
                        ? `USD ${Number(
                          p.harga
                        ).toLocaleString(
                          'en-US'
                        )}`
                        : rupiah(
                          p.harga
                        )}
                    </p>
                  </div>

                  <i
                    className="
                                            fa-solid
                                            fa-arrow-right
                                            text-mute
                                            transition
                                            group-hover:translate-x-1
                                            group-hover:text-accent
                                            sm:mt-1
                                        "
                    aria-hidden="true"
                  />

                </div>

              </Link>
            )
          )}

        </div>


        <Link
          to="/paket"
          className="
                        btn
                        mt-5
                        w-full
                        sm:hidden
                    "
        >
          Lihat semua paket
        </Link>

      </section>


      {/* =====================================
                CTA
            ===================================== */}

      <section className="
                border
                border-line
                rounded-lg
                bg-panel
                px-5
                py-7
                sm:px-8
            ">

        <div className="
                    flex
                    flex-col
                    gap-5
                    md:flex-row
                    md:items-center
                    md:justify-between
                ">

          <div>

            <p className="
                            text-sm
                            font-semibold
                            text-accent
                        ">
              Sudah menentukan tujuan?
            </p>

            <h2 className="
                            mt-1
                            text-xl
                            font-bold
                        ">
              Temukan perjalanan berikutnya.
            </h2>

            <p className="
                            mt-2
                            max-w-xl
                            text-sm
                            text-mute
                        ">
              Lihat berbagai destinasi
              dan pilih tempat yang
              paling sesuai dengan
              rencanamu.
            </p>

          </div>

          <Link
            to="/destinasi"
            className="
                            btn
                            btn-p
                            shrink-0
                        "
          >
            Jelajahi destinasi

            <i
              className="
                                fa-solid
                                fa-arrow-right
                            "
              aria-hidden="true"
            />
          </Link>

        </div>

      </section>

    </div>
  )
}