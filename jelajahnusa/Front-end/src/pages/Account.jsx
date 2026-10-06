import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Field, PageHead, rupiah } from '../components/ui'
import API_URL from '../services/api'

export default function Account() {
  const { user, setUser, orders = [] } = useApp()
  const navigate = useNavigate()

  const [bookings, setBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [saving, setSaving] = useState(false)
  const [ok, setOk] = useState(false)

  const [f, setF] = useState({
    name: user?.name || user?.nama || '',
    email: user?.email || '',
    telp: user?.telp || ''
  })

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token =
          localStorage.getItem('token')

        if (!token) {
          setLoadingBookings(false)
          return
        }

        const response = await fetch(
          `${API_URL}/bookings/my`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        )

        const result =
          await response.json()

        if (!response.ok) {
          console.error(
            result.message ||
            'Gagal mengambil booking'
          )
          return
        }

        setBookings(result.data || [])
      } catch (error) {
        console.error(
          'Gagal mengambil riwayat booking:',
          error
        )
      } finally {
        setLoadingBookings(false)
      }
    }

    fetchBookings()
  }, [])

  const handleChange =
    (key) => (e) => {
      setF((prev) => ({
        ...prev,
        [key]: e.target.value
      }))

      setOk(false)
    }

  const handleSave = (e) => {
    e.preventDefault()

    if (
      !f.name.trim() ||
      !f.email.trim()
    ) {
      alert(
        'Nama dan email wajib diisi.'
      )
      return
    }

    setSaving(true)

    const updatedUser = {
      ...user,
      name: f.name.trim(),
      email: f.email.trim(),
      telp: f.telp.trim()
    }

    setUser(updatedUser)

    localStorage.setItem(
      'jn_user',
      JSON.stringify(updatedUser)
    )

    setTimeout(() => {
      setSaving(false)
      setOk(true)
    }, 300)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('jn_user')

    setUser(null)

    navigate('/login')
  }

  const getStatus = (status) => {
    if (status === 'confirmed') {
      return {
        label: 'Confirmed',
        message:
          'Pembayaran telah dikonfirmasi.',
        icon: 'fa-circle-check',
        text: 'text-green-400',
        bg: 'bg-green-500/10'
      }
    }

    if (status === 'cancelled') {
      return {
        label: 'Cancelled',
        message:
          'Booking ini telah dibatalkan.',
        icon: 'fa-circle-xmark',
        text: 'text-red-400',
        bg: 'bg-red-500/10'
      }
    }

    return {
      label: 'Pending',
      message:
        'Menunggu pembayaran atau konfirmasi.',
      icon: 'fa-clock',
      text: 'text-yellow-400',
      bg: 'bg-yellow-500/10'
    }
  }

  const getTypeName = (type) => {
    switch (type) {
      case 'package':
        return 'Paket wisata'

      case 'hotel':
        return 'Penginapan'

      case 'transport':
        return 'Transportasi'

      case 'destination':
        return 'Destinasi wisata'

      default:
        return type || 'Booking'
    }
  }

  const formatPrice = (
    price,
    currency = 'IDR'
  ) => {
    const amount =
      Number(price) || 0

    if (
      String(currency).toUpperCase() ===
      'USD'
    ) {
      return `USD ${amount.toLocaleString(
        'en-US'
      )}`
    }

    return rupiah(amount)
  }

  const formatDate = (date) => {
    if (!date) {
      return '-'
    }

    const parsedDate =
      new Date(`${date}T00:00:00`)

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date
    }

    return parsedDate.toLocaleDateString(
      'id-ID',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }
    )
  }

  return (
    <>
      <PageHead
        title="Akun saya"
        desc="Kelola profil dan pantau booking perjalanan kamu."
      />

      <div className="grid items-start gap-5 md:grid-cols-[18rem_1fr]">

        {/* ================= PROFIL ================= */}
        <form
          className="card space-y-3 p-4"
          onSubmit={handleSave}
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent">
              <i
                className="fa-solid fa-user"
                aria-hidden="true"
              />
            </div>

            <div>
              <h2>Profil</h2>

              <p className="text-xs text-mute">
                Informasi akun
              </p>
            </div>
          </div>

          <Field
            id="account-name"
            label="Nama lengkap"
            value={f.name}
            onChange={handleChange('name')}
            required
          />

          <Field
            id="account-email"
            label="Email"
            type="email"
            value={f.email}
            onChange={handleChange('email')}
            required
          />

          <Field
            id="account-phone"
            label="Nomor telepon"
            type="tel"
            value={f.telp}
            onChange={handleChange('telp')}
          />

          <button
            type="submit"
            className="btn btn-p w-full"
            disabled={saving}
          >
            <i
              className={
                saving
                  ? 'fa-solid fa-spinner fa-spin'
                  : 'fa-solid fa-floppy-disk'
              }
              aria-hidden="true"
            />

            {saving
              ? 'Menyimpan...'
              : 'Simpan profil'}
          </button>

          <div
            className="min-h-5 text-sm text-accent"
            role="status"
          >
            {ok &&
              'Profil tersimpan.'}
          </div>

          <hr className="border-line" />

          <button
            type="button"
            onClick={handleLogout}
            className="btn w-full"
          >
            <i
              className="fa-solid fa-right-from-bracket"
              aria-hidden="true"
            />

            Logout
          </button>
        </form>

        {/* ================= BOOKING ================= */}
        <section aria-labelledby="booking-title">

          {/* HEADER */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 id="booking-title">
                Booking Saya
              </h2>

              <p className="text-sm text-mute">
                Pantau status semua booking kamu
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent-soft text-accent">
              <i
                className="fa-solid fa-bell"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* LOADING */}
          {loadingBookings && (
            <div className="space-y-4">
              {[1, 2].map(
                (item) => (
                  <div
                    key={item}
                    className="card animate-pulse p-4"
                  >
                    <div className="h-4 w-28 rounded bg-panel-soft" />

                    <div className="mt-3 h-5 w-2/3 rounded bg-panel-soft" />

                    <div className="mt-4 h-16 rounded bg-panel-soft" />
                  </div>
                )
              )}
            </div>
          )}

          {/* EMPTY */}
          {!loadingBookings &&
            bookings.length === 0 && (
              <div className="card p-6 text-center">
                <i
                  className="fa-solid fa-calendar-xmark mb-3 text-3xl text-mute"
                  aria-hidden="true"
                />

                <p className="font-semibold">
                  Belum ada booking
                </p>

                <p className="mt-1 text-sm text-mute">
                  Booking yang kamu buat akan muncul di sini.
                </p>

                <Link
                  to="/paket"
                  className="btn btn-p mt-4"
                >
                  <i
                    className="fa-solid fa-compass"
                    aria-hidden="true"
                  />

                  Cari Paket Wisata
                </Link>
              </div>
            )}

          {/* BOOKING LIST */}
          {!loadingBookings &&
            bookings.length > 0 && (
              <div className="space-y-4">
                {bookings.map(
                  (booking) => {
                    const status =
                      getStatus(
                        booking.status
                      )

                    return (
                      <div
                        key={booking.id}
                        className="card overflow-hidden"
                      >

                        {/* STATUS */}
                        <div
                          className={`p-4 ${status.bg}`}
                        >
                          <div className="flex items-center gap-3">
                            <i
                              className={`fa-solid ${status.icon} text-xl ${status.text}`}
                              aria-hidden="true"
                            />

                            <div className="min-w-0 flex-1">
                              <p
                                className={`font-semibold ${status.text}`}
                              >
                                {status.label}
                              </p>

                              <p className="text-sm text-mute">
                                {status.message}
                              </p>
                            </div>

                            <span className="text-sm text-mute">
                              #{booking.id}
                            </span>
                          </div>
                        </div>

                        {/* CONTENT */}
                        <div className="p-4">
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                              <h3 className="text-lg font-semibold">
                                {booking.item_name}
                              </h3>

                              <p className="mt-1 text-sm text-mute">
                                {getTypeName(
                                  booking.item_type
                                )}
                              </p>
                            </div>

                            <div className="text-left sm:text-right">
                              <p className="text-xs text-mute">
                                Total
                              </p>

                              <p className="font-bold text-accent">
                                {formatPrice(
                                  booking.total_price,
                                  booking.currency
                                )}
                              </p>
                            </div>
                          </div>

                          {/* INFO */}
                          <div className="mt-4 grid gap-3 sm:grid-cols-3">
                            <div className="rounded-md bg-panel-soft p-3">
                              <p className="text-xs text-mute">
                                Tanggal
                              </p>

                              <p className="mt-1 text-sm font-semibold">
                                {formatDate(
                                  booking.booking_date
                                )}
                              </p>
                            </div>

                            <div className="rounded-md bg-panel-soft p-3">
                              <p className="text-xs text-mute">
                                Jumlah
                              </p>

                              <p className="mt-1 text-sm font-semibold">
                                {booking.guests ||
                                  1}{' '}
                                orang
                              </p>
                            </div>

                            <div className="rounded-md bg-panel-soft p-3">
                              <p className="text-xs text-mute">
                                Status
                              </p>

                              <p
                                className={`mt-1 text-sm font-semibold ${status.text}`}
                              >
                                {status.label}
                              </p>
                            </div>
                          </div>

                          {/* ACTION */}
                          <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-line pt-4">
                            <Link
                              to={`/booking/${booking.id}`}
                              className="btn"
                            >
                              <i
                                className="fa-solid fa-eye"
                                aria-hidden="true"
                              />

                              Lihat Detail
                            </Link>

                            {booking.status ===
                              'pending' && (
                                <Link
                                  to={`/booking/${booking.id}`}
                                  className="btn btn-p"
                                >
                                  <i
                                    className="fa-solid fa-credit-card"
                                    aria-hidden="true"
                                  />

                                  Lanjut Pembayaran
                                </Link>
                              )}
                          </div>
                        </div>
                      </div>
                    )
                  }
                )}
              </div>
            )}

          {/* ================= PESANAN SESI INI ================= */}
          {orders.length > 0 && (
            <div className="mt-6">

              <div className="mb-3">
                <h2>
                  Pesanan Sesi Ini
                </h2>

                <p className="text-sm text-mute">
                  Pesanan yang baru selesai dibayar.
                </p>
              </div>

              <div className="card divide-y divide-line overflow-hidden">
                {orders.map(
                  (order) => (
                    <div
                      key={order.id}
                      className="flex flex-wrap items-center gap-x-4 gap-y-2 p-3"
                    >
                      <b className="w-24 text-sm">
                        {order.id}
                      </b>

                      <span className="min-w-0 flex-1">
                        <span className="font-medium">
                          {order.judul}
                        </span>

                        <br />

                        <small className="text-mute">
                          Berangkat{' '}
                          {order.tgl}

                          {order.metode && (
                            <>
                              {' · '}
                              {order.metode}
                            </>
                          )}
                        </small>
                      </span>

                      <span className="font-semibold text-accent">
                        {formatPrice(
                          order.total,
                          order.mataUang
                        )}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

        </section>
      </div>
    </>
  )
}