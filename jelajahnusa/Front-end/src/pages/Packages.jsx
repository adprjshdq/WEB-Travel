import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { packages } from '../data/data'
import { useApp } from '../context/AppContext'
import {
  PageHead,
  WishBtn,
  rupiah
} from '../components/ui'

export default function Packages() {
  const [open, setOpen] = useState('p1')
  const { setBooking } = useApp()
  const nav = useNavigate()

  // =========================
  // FORMAT HARGA
  // =========================
  const formatHarga = (p) => {
    if (p.mataUang === 'USD') {
      return `USD ${Number(
        p.harga
      ).toLocaleString('en-US')}`
    }

    return rupiah(p.harga)
  }

  // =========================
  // BOOKING PAKET
  // =========================
  const pesan = (p) => {
    setBooking({
      item_type: 'package',

      // Harus sama dengan nama
      // yang digunakan backend
      item_name: p.nama,

      judul: `Paket ${p.nama}`,

      harga: Number(p.harga),

      mataUang:
        p.mataUang || 'IDR',

      satuan: 'orang'
    })

    nav('/booking')
  }

  return (
    <>
      <PageHead
        title="Paket wisata"
        desc="Pilih paket perjalanan yang sesuai dengan rencana liburanmu."
      />

      {/* INTRO */}
      <section className="mb-7 border border-line rounded-lg bg-panel p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm font-semibold text-accent">
              Pilihan perjalanan
            </p>

            <h2 className="mt-1 text-xl font-bold">
              Temukan paket yang cocok
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mute">
              Setiap paket memiliki durasi,
              kuota, itinerary, dan fasilitas
              yang berbeda. Buka rincian sebelum
              memesan.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 text-sm text-mute">
            <i
              className="fa-solid fa-suitcase text-accent"
              aria-hidden="true"
            />

            <span>
              {packages.length} paket tersedia
            </span>
          </div>
        </div>
      </section>

      {/* PACKAGE LIST */}
      <div className="space-y-3">
        {packages.map((p, index) => {
          const isOpen = open === p.id
          const isUsd =
            p.mataUang === 'USD'

          return (
            <article
              key={p.id}
              className="overflow-hidden rounded-lg border border-line bg-panel transition hover:border-accent/40"
            >
              {/* HEADER */}
              <div className="p-4 sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

                  {/* NUMBER */}
                  <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded bg-accent-soft text-sm font-bold text-accent sm:flex">
                    {String(
                      index + 1
                    ).padStart(2, '0')}
                  </div>

                  {/* MAIN INFO */}
                  <div className="min-w-0 flex-1">

                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">
                        <h2 className="text-lg font-bold sm:text-xl">
                          {p.nama}
                        </h2>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-mute">

                          {/* DURASI */}
                          <span className="flex items-center gap-1.5">
                            <i
                              className="fa-solid fa-clock text-accent"
                              aria-hidden="true"
                            />

                            {p.durasi}
                          </span>

                          {/* KUOTA */}
                          <span className="flex items-center gap-1.5">
                            <i
                              className="fa-solid fa-users text-accent"
                              aria-hidden="true"
                            />

                            {p.kuota} kursi
                          </span>

                          {/* LOKASI */}
                          {p.lokasi && (
                            <span className="flex items-center gap-1.5">
                              <i
                                className="fa-solid fa-location-dot text-accent"
                                aria-hidden="true"
                              />

                              {p.lokasi}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* WISHLIST */}
                      <WishBtn
                        id={p.id}
                        nama={p.nama}
                      />
                    </div>

                    {/* OPERATOR & RATING */}
                    {(p.operator ||
                      p.rating) && (
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-mute">

                          {p.operator && (
                            <span className="flex items-center gap-1.5">
                              <i
                                className="fa-solid fa-building text-accent"
                                aria-hidden="true"
                              />

                              {p.operator}
                            </span>
                          )}

                          {p.rating && (
                            <span className="flex items-center gap-1.5">
                              <i
                                className="fa-solid fa-star text-accent"
                                aria-hidden="true"
                              />

                              {Number(
                                p.rating
                              ).toFixed(1)}
                            </span>
                          )}
                        </div>
                      )}
                  </div>

                  {/* PRICE */}
                  <div className="shrink-0 border-t border-line pt-4 lg:border-0 lg:border-l lg:pl-5 lg:pt-0">
                    <p className="text-[11px] text-mute">
                      Mulai dari
                    </p>

                    <p className="mt-0.5 text-xl font-bold text-accent">
                      {formatHarga(p)}
                    </p>

                    <p className="text-xs text-mute">
                      per orang
                      {isUsd &&
                        ' • USD'}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-wrap gap-2 lg:shrink-0">

                    {/* DETAIL */}
                    <button
                      type="button"
                      className="btn"
                      aria-expanded={
                        isOpen
                      }
                      aria-controls={
                        `det-${p.id}`
                      }
                      onClick={() =>
                        setOpen(
                          isOpen
                            ? null
                            : p.id
                        )
                      }
                    >
                      <i
                        className={
                          `fa-solid ${isOpen
                            ? 'fa-chevron-up'
                            : 'fa-chevron-down'
                          }`
                        }
                        aria-hidden="true"
                      />

                      {isOpen
                        ? 'Tutup'
                        : 'Rincian'}
                    </button>

                    {/* BOOKING */}
                    <button
                      type="button"
                      className="btn btn-p"
                      onClick={() =>
                        pesan(p)
                      }
                    >
                      <i
                        className="fa-solid fa-calendar-check"
                        aria-hidden="true"
                      />

                      Pesan
                    </button>
                  </div>
                </div>
              </div>

              {/* DETAIL */}
              {isOpen && (
                <div
                  id={`det-${p.id}`}
                  className="border-t border-line bg-bg/20 p-4 sm:p-5"
                >
                  <div className="grid gap-6 md:grid-cols-[1.5fr_1fr]">

                    {/* ITINERARY */}
                    <div>
                      <div className="mb-4 flex items-center gap-2">
                        <i
                          className="fa-solid fa-route text-accent"
                          aria-hidden="true"
                        />

                        <h3 className="font-bold">
                          Itinerary
                        </h3>
                      </div>

                      {p.itin?.length >
                        0 ? (
                        <ol className="space-y-3">
                          {p.itin.map(
                            (
                              item,
                              itemIndex
                            ) => (
                              <li
                                key={`${p.id}-itin-${itemIndex}`}
                                className="flex gap-3"
                              >
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[11px] font-bold text-accent">
                                  {itemIndex +
                                    1}
                                </span>

                                <span className="pt-0.5 text-sm leading-relaxed text-mute">
                                  {item}
                                </span>
                              </li>
                            )
                          )}
                        </ol>
                      ) : (
                        <p className="text-sm text-mute">
                          Informasi
                          itinerary
                          belum
                          tersedia.
                        </p>
                      )}
                    </div>

                    {/* FACILITIES */}
                    <div>
                      <div className="mb-4 flex items-center gap-2">
                        <i
                          className="fa-solid fa-circle-check text-accent"
                          aria-hidden="true"
                        />

                        <h3 className="font-bold">
                          Sudah termasuk
                        </h3>
                      </div>

                      {p.termasuk?.length >
                        0 ? (
                        <ul className="space-y-2">
                          {p.termasuk.map(
                            (
                              item,
                              itemIndex
                            ) => (
                              <li
                                key={`${p.id}-include-${itemIndex}`}
                                className="flex items-start gap-2 text-sm text-mute"
                              >
                                <i
                                  className="fa-solid fa-check mt-1 text-xs text-accent"
                                  aria-hidden="true"
                                />

                                <span>
                                  {
                                    item
                                  }
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p className="text-sm text-mute">
                          Informasi
                          fasilitas
                          belum
                          tersedia.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* DETAIL FOOTER */}
                  <div className="mt-6 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                      <p className="text-xs text-mute">
                        Harga paket
                      </p>

                      <p className="text-lg font-bold text-accent">
                        {formatHarga(p)}

                        <span className="ml-1 text-xs font-normal text-mute">
                          / orang
                        </span>
                      </p>
                    </div>

                    <button
                      type="button"
                      className="btn btn-p w-full sm:w-auto"
                      onClick={() =>
                        pesan(p)
                      }
                    >
                      <i
                        className="fa-solid fa-calendar-check"
                        aria-hidden="true"
                      />

                      Pesan paket ini
                    </button>
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </>
  )
}