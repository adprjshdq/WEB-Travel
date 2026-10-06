import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import API_URL from '../services/api'

export default function AdminDashboard() {
    const { user } = useApp()

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDestinations: 0,
        totalBookings: 0,
        totalRevenue: 0
    })

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token =
                    localStorage.getItem('token')

                const response = await fetch(
                    `${API_URL}/admin/stats`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                )

                const result =
                    await response.json()

                if (result.success) {
                    setStats(result.data)
                }
            } catch (error) {
                console.error(
                    'Gagal mengambil statistik:',
                    error
                )
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    return (
        <div className="space-y-8">

            {/* HEADER */}
            <div>
                <p className="text-accent text-sm font-medium">
                    Dashboard Admin
                </p>

                <h1 className="mt-1">
                    Halo, {user?.name || 'Admin'} 
                </h1>

                <p className="text-mute mt-2">
                    Selamat datang di panel administrasi
                    NusaTrip.
                </p>
            </div>

            {/* STATISTIK */}
            <section>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    {/* TOTAL USER */}
                    <div className="card p-5 transition hover:border-accent">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-mute text-sm">
                                    Total User
                                </p>

                                <h2 className="mt-2 text-3xl font-bold">
                                    {loading
                                        ? '...'
                                        : stats.totalUsers}
                                </h2>
                            </div>

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-line">
                                <i className="fa-solid fa-users text-lg text-accent" />
                            </div>
                        </div>

                        <p className="mt-4 text-xs text-mute">
                            Pengguna terdaftar
                        </p>
                    </div>

                    {/* DESTINASI */}
                    <div className="card p-5 transition hover:border-accent">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-mute text-sm">
                                    Destinasi
                                </p>

                                <h2 className="mt-2 text-3xl font-bold">
                                    {loading
                                        ? '...'
                                        : stats.totalDestinations}
                                </h2>
                            </div>

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-line">
                                <i className="fa-solid fa-location-dot text-lg text-accent" />
                            </div>
                        </div>

                        <p className="mt-4 text-xs text-mute">
                            Destinasi wisata
                        </p>
                    </div>

                    {/* BOOKING */}
                    <div className="card p-5 transition hover:border-accent">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-mute text-sm">
                                    Booking
                                </p>

                                <h2 className="mt-2 text-3xl font-bold">
                                    {loading
                                        ? '...'
                                        : stats.totalBookings}
                                </h2>
                            </div>

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-line">
                                <i className="fa-solid fa-calendar-check text-lg text-accent" />
                            </div>
                        </div>

                        <p className="mt-4 text-xs text-mute">
                            Total pesanan
                        </p>
                    </div>

                    {/* PENDAPATAN */}
                    <div className="card p-5 transition hover:border-accent">
                        <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-mute text-sm">
                                    Pendapatan
                                </p>

                                <h2 className="mt-2 break-words text-2xl font-bold">
                                    {loading
                                        ? '...'
                                        : `Rp ${Number(
                                            stats.totalRevenue
                                        ).toLocaleString(
                                            'id-ID'
                                        )}`}
                                </h2>
                            </div>

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-line">
                                <i className="fa-solid fa-money-bill-wave text-lg text-accent" />
                            </div>
                        </div>

                        <p className="mt-4 text-xs text-mute">
                            Dari booking terkonfirmasi
                        </p>
                    </div>
                </div>
            </section>

            {/* MENU ADMIN */}
            <section>
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">
                            Kelola Website
                        </h2>

                        <p className="mt-1 text-sm text-mute">
                            Kelola data dan aktivitas
                            website NusaTrip.
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    {/* USER */}
                    <Link
                        to="/admin/users"
                        className="card group p-5 transition hover:border-accent"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-line">
                            <i className="fa-solid fa-users text-xl text-accent" />
                        </div>

                        <h3 className="mt-4 font-bold">
                            Kelola User
                        </h3>

                        <p className="mt-2 text-sm leading-relaxed text-mute">
                            Tambah, edit, dan hapus data
                            pengguna.
                        </p>

                        <div className="mt-4 text-sm font-semibold text-accent">
                            Kelola →
                        </div>
                    </Link>

                    {/* DESTINASI */}
                    <Link
                        to="/admin/destinasi"
                        className="card group p-5 transition hover:border-accent"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-line">
                            <i className="fa-solid fa-map-location-dot text-xl text-accent" />
                        </div>

                        <h3 className="mt-4 font-bold">
                            Kelola Destinasi
                        </h3>

                        <p className="mt-2 text-sm leading-relaxed text-mute">
                            Atur destinasi wisata dan
                            informasi tempat.
                        </p>

                        <div className="mt-4 text-sm font-semibold text-accent">
                            Kelola →
                        </div>
                    </Link>

                    {/* PENGINAPAN */}
                    <Link
                        to="/admin/penginapan"
                        className="card group p-5 transition hover:border-accent"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-line">
                            <i className="fa-solid fa-hotel text-xl text-accent" />
                        </div>

                        <h3 className="mt-4 font-bold">
                            Kelola Penginapan
                        </h3>

                        <p className="mt-2 text-sm leading-relaxed text-mute">
                            Atur hotel, harga, fasilitas,
                            dan gambar.
                        </p>

                        <div className="mt-4 text-sm font-semibold text-accent">
                            Kelola →
                        </div>
                    </Link>

                    {/* TRANSPORTASI */}
                    <Link
                        to="/admin/transportasi"
                        className="card group p-5 transition hover:border-accent"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-line">
                            <i className="fa-solid fa-car text-xl text-accent" />
                        </div>

                        <h3 className="mt-4 font-bold">
                            Kelola Transportasi
                        </h3>

                        <p className="mt-2 text-sm leading-relaxed text-mute">
                            Atur transportasi, rute,
                            operator, jadwal, dan harga.
                        </p>

                        <div className="mt-4 text-sm font-semibold text-accent">
                            Kelola →
                        </div>
                    </Link>

                    {/* BOOKING */}
                    <Link
                        to="/admin/booking"
                        className="card group p-5 transition hover:border-accent"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-line">
                            <i className="fa-solid fa-calendar-check text-xl text-accent" />
                        </div>

                        <h3 className="mt-4 font-bold">
                            Kelola Booking
                        </h3>

                        <p className="mt-2 text-sm leading-relaxed text-mute">
                            Kelola pesanan dan aktivitas
                            booking wisata.
                        </p>

                        <div className="mt-4 text-sm font-semibold text-accent">
                            Kelola →
                        </div>
                    </Link>
                </div>
            </section>

            {/* INFORMASI ADMIN */}
            <section className="card p-5">
                <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-line">
                        <i className="fa-solid fa-user-shield text-accent" />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold">
                            Informasi Admin
                        </h2>

                        <p className="text-sm text-mute">
                            Informasi akun administrator
                            yang sedang login.
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">

                    {/* NAMA */}
                    <div className="rounded-xl bg-line/50 p-4">
                        <span className="text-sm text-mute">
                            Nama
                        </span>

                        <p className="mt-1 font-semibold">
                            {user?.name || '-'}
                        </p>
                    </div>

                    {/* EMAIL */}
                    <div className="rounded-xl bg-line/50 p-4">
                        <span className="text-sm text-mute">
                            Email
                        </span>

                        <p className="mt-1 break-all font-semibold">
                            {user?.email || '-'}
                        </p>
                    </div>

                    {/* ROLE */}
                    <div className="rounded-xl bg-line/50 p-4">
                        <span className="text-sm text-mute">
                            Role
                        </span>

                        <p className="mt-1 font-semibold text-accent">
                            Administrator
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}