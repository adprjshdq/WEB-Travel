import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { PageHead, rupiah } from '../components/ui'

const API_URL = 'http://localhost:5001/api'

const metode = [
  ['BCA Virtual Account', 'fa-building-columns'],
  ['Mandiri Virtual Account', 'fa-building-columns'],
  ['QRIS', 'fa-qrcode'],
  ['Kartu kredit', 'fa-credit-card']
]

export default function Payment() {
  const {
    booking,
    setBooking,
    orders,
    setOrders
  } = useApp()

  const [m, setM] =
    useState(metode[0][0])

  const [kode, setKode] =
    useState(null)

  const [loading, setLoading] =
    useState(false)

  const formatHarga = (harga) => {
    if (booking?.mataUang === 'USD') {
      return `USD ${Number(harga).toLocaleString('en-US')}`
    }

    return rupiah(harga)
  }

  /*
   * Setelah pembayaran berhasil
   */
  if (kode) {
    return (
      <>
        <PageHead
          title="Pembayaran"
        />

        <div
          className="
                        card
                        border-accent
                        p-5
                    "
          role="status"
        >
          <div className="
                        flex
                        items-start
                        gap-3
                    ">
            <div className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-accent-soft
                            text-accent
                        ">
              <i
                className="
                                    fa-solid
                                    fa-check
                                "
                aria-hidden="true"
              />
            </div>

            <div>
              <h2 className="
                                mb-1
                                text-accent
                            ">
                Pembayaran diterima
              </h2>

              <p className="
                                text-sm
                                text-mute
                            ">
                Kode pesanan{' '}
                <b className="text-ink">
                  {kode}
                </b>.
              </p>

              <p className="
                                mt-1
                                text-sm
                                text-mute
                            ">
                Pesanan Anda telah
                berhasil dikonfirmasi.
              </p>
            </div>
          </div>

          <Link
            to="/akun"
            className="
                            btn
                            mt-4
                        "
          >
            <i
              className="
                                fa-solid
                                fa-clock-rotate-left
                            "
              aria-hidden="true"
            />

            Lihat riwayat pesanan
          </Link>
        </div>
      </>
    )
  }

  /*
   * Tidak ada booking
   */
  if (!booking?.total) {
    return (
      <>
        <PageHead
          title="Pembayaran"
        />

        <div className="
                    card
                    p-5
                ">
          <div className="
                        flex
                        items-center
                        gap-3
                    ">
            <i
              className="
                                fa-solid
                                fa-receipt
                                text-2xl
                                text-mute
                            "
              aria-hidden="true"
            />

            <div>
              <h2 className="
                                text-lg
                                font-bold
                            ">
                Belum ada tagihan
              </h2>

              <p className="
                                mt-1
                                text-sm
                                text-mute
                            ">
                Silakan buat booking
                terlebih dahulu.
              </p>
            </div>
          </div>

          <Link
            to="/booking"
            className="
                            btn
                            btn-p
                            mt-4
                        "
          >
            Mulai Booking
          </Link>
        </div>
      </>
    )
  }

  /*
   * Proses pembayaran
   */
  const bayar = async () => {
    if (!booking.booking_id) {
      alert(
        'ID booking tidak ditemukan.'
      )
      return
    }

    try {
      setLoading(true)

      const token =
        localStorage.getItem('token')

      if (!token) {
        alert(
          'Sesi login tidak ditemukan. Silakan login kembali.'
        )
        return
      }

      const response = await fetch(
        `${API_URL}/bookings/${booking.booking_id}/pay`,
        {
          method: 'PUT',
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      )

      const result =
        await response.json()

      if (!response.ok) {
        alert(
          result.message ||
          'Pembayaran gagal diproses.'
        )
        return
      }

      const id =
        'JN-' +
        Date.now()
          .toString()
          .slice(-6)

      setOrders([
        {
          id,
          booking_id:
            booking.booking_id,
          judul:
            booking.judul,
          tgl:
            booking.tgl,
          total:
            booking.total,
          mataUang:
            booking.mataUang ||
            'IDR',
          metode: m,
          status:
            'confirmed'
        },
        ...orders
      ])

      setBooking(null)
      setKode(id)
    } catch (error) {
      console.error(
        'Payment error:',
        error
      )

      alert(
        'Tidak dapat terhubung ke server.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHead
        title="Pembayaran"
        desc="Pilih metode pembayaran untuk menyelesaikan pesanan."
      />

      <div className="
                grid
                gap-5
                md:grid-cols-2
            ">
        {/* METODE PEMBAYARAN */}
        <fieldset className="
                    card
                    space-y-2
                    p-4
                ">
          <legend className="
                        px-1
                        font-head
                        font-bold
                    ">
            Metode pembayaran
          </legend>

          {metode.map(
            ([nama, icon]) => (
              <label
                key={nama}
                className={`
                                    flex
                                    items-center
                                    gap-3
                                    rounded-md
                                    border
                                    p-3
                                    cursor-pointer
                                    !mb-0
                                    !text-ink
                                    transition
                                    ${m === nama
                    ? 'border-accent bg-accent-soft'
                    : 'border-line hover:border-accent/40'
                  }
                                `}
              >
                <input
                  type="radio"
                  name="metode-pembayaran"
                  className="accent-green-500"
                  checked={
                    m === nama
                  }
                  onChange={() =>
                    setM(nama)
                  }
                />

                <span className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-md
                                    bg-bg
                                ">
                  <i
                    className={`
                                            fa-solid
                                            ${icon}
                                            text-sm
                                        `}
                    aria-hidden="true"
                  />
                </span>

                <span className="
                                    text-sm
                                    font-medium
                                ">
                  {nama}
                </span>
              </label>
            )
          )}
        </fieldset>

        {/* TAGIHAN */}
        <div className="
                    card
                    h-fit
                    p-5
                    md:sticky
                    md:top-20
                ">
          <div className="
                        flex
                        items-center
                        justify-between
                        gap-3
                    ">
            <h2>
              Tagihan
            </h2>

            <span className="
                            rounded-full
                            border
                            border-line
                            px-2.5
                            py-1
                            text-[11px]
                            font-semibold
                            text-mute
                        ">
              {booking.mataUang || 'IDR'}
            </span>
          </div>

          <div className="
                        mt-4
                        rounded-md
                        border
                        border-line
                        bg-bg/30
                        p-4
                    ">
            <p className="
                            font-semibold
                        ">
              {booking.judul}
            </p>

            <p className="
                            mt-1
                            text-sm
                            text-mute
                        ">
              Berangkat {booking.tgl}
            </p>

            <p className="
                            text-sm
                            text-mute
                        ">
              {booking.jml}{' '}
              {booking.satuan}
            </p>
          </div>

          <div className="
                        my-5
                        border-t
                        border-line
                        pt-4
                    ">
            <p className="
                            text-xs
                            text-mute
                        ">
              Total pembayaran
            </p>

            <p className="
                            mt-1
                            text-2xl
                            font-head
                            font-bold
                            text-accent
                        ">
              {formatHarga(
                booking.total
              )}
            </p>
          </div>

          <button
            type="button"
            className="
                            btn
                            btn-p
                            w-full
                        "
            onClick={bayar}
            disabled={loading}
          >
            <i
              className={
                loading
                  ? `
                                        fa-solid
                                        fa-spinner
                                        fa-spin
                                    `
                  : `
                                        fa-solid
                                        fa-lock
                                    `
              }
              aria-hidden="true"
            />

            {loading
              ? 'Memproses pembayaran...'
              : `Bayar dengan ${m}`}
          </button>

          <p className="
                        mt-3
                        text-center
                        text-[11px]
                        text-mute
                    ">
            Pembayaran diproses secara
            aman melalui sistem JelajahNusa.
          </p>
        </div>
      </div>
    </>
  )
}