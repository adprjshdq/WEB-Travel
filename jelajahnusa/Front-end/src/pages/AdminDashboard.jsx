import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const API_URL = 'http://localhost:5001/api'

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
                    Halo, {user?.name || 'Admin'} 👋
                </h1>

                <p className="text-mute mt-2">
                    Selamat datang di panel administrasi
                    NusaTrip.
                </p>
            </div>


            {/* STATISTIK */}

            <section>

                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">

                    {/* TOTAL USER */}

                    <div className="card p-5 hover:border-accent transition">

                        <div className="flex items-center justify-between gap-4">

                            <div>

                                <p className="text-mute text-sm">
                                    Total User
                                </p>

                                <h2 className="text-3xl font-bold mt-2">
                                    {loading
                                        ? '...'
                                        : stats.totalUsers}
                                </h2>

                            </div>

                            <div className="w-12 h-12 shrink-0 rounded-xl bg-line flex items-center justify-center">

                                <i className="fa-solid fa-users text-accent text-lg" />

                            </div>

                        </div>

                        <p className="text-xs text-mute mt-4">
                            Pengguna terdaftar
                        </p>

                    </div>


                    {/* DESTINASI */}

                    <div className="card p-5 hover:border-accent transition">

                        <div className="flex items-center justify-between gap-4">

                            <div>

                                <p className="text-mute text-sm">
                                    Destinasi
                                </p>

                                <h2 className="text-3xl font-bold mt-2">
                                    {loading
                                        ? '...'
                                        : stats.totalDestinations}
                                </h2>

                            </div>

                            <div className="w-12 h-12 shrink-0 rounded-xl bg-line flex items-center justify-center">

                                <i className="fa-solid fa-location-dot text-accent text-lg" />

                            </div>

                        </div>

                        <p className="text-xs text-mute mt-4">
                            Destinasi wisata
                        </p>

                    </div>


                    {/* BOOKING */}

                    <div className="card p-5 hover:border-accent transition">

                        <div className="flex items-center justify-between gap-4">

                            <div>

                                <p className="text-mute text-sm">
                                    Booking
                                </p>

                                <h2 className="text-3xl font-bold mt-2">
                                    {loading
                                        ? '...'
                                        : stats.totalBookings}
                                </h2>

                            </div>

                            <div className="w-12 h-12 shrink-0 rounded-xl bg-line flex items-center justify-center">

                                <i className="fa-solid fa-calendar-check text-accent text-lg" />

                            </div>

                        </div>

                        <p className="text-xs text-mute mt-4">
                            Total pesanan
                        </p>

                    </div>


                    {/* PENDAPATAN */}

                    <div className="card p-5 hover:border-accent transition">

                        <div className="flex items-center justify-between gap-4">

                            <div className="min-w-0">

                                <p className="text-mute text-sm">
                                    Pendapatan
                                </p>

                                <h2 className="text-2xl font-bold mt-2 break-words">

                                    {loading
                                        ? '...'
                                        : `Rp ${Number(
                                            stats.totalRevenue
                                        ).toLocaleString(
                                            'id-ID'
                                        )}`}

                                </h2>

                            </div>

                            <div className="w-12 h-12 shrink-0 rounded-xl bg-line flex items-center justify-center">

                                <i className="fa-solid fa-money-bill-wave text-accent text-lg" />

                            </div>

                        </div>

                        <p className="text-xs text-mute mt-4">
                            Dari booking terkonfirmasi
                        </p>

                    </div>

                </div>

            </section>


            {/* MENU ADMIN */}

            <section>

                <div className="flex items-center justify-between mb-4">

                    <div>

                        <h2 className="text-xl font-bold">
                            Kelola Website
                        </h2>

                        <p className="text-mute text-sm mt-1">
                            Kelola data dan aktivitas
                            website NusaTrip.
                        </p>

                    </div>

                </div>


                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">


                    {/* USER */}

                    <Link
                        to="/admin/users"
                        className="card p-5 hover:border-accent transition group"
                    >

                        <div className="w-12 h-12 rounded-xl bg-line flex items-center justify-center">

                            <i className="fa-solid fa-users text-accent text-xl" />

                        </div>

                        <h3 className="font-bold mt-4">
                            Kelola User
                        </h3>

                        <p className="text-mute text-sm mt-2 leading-relaxed">
                            Tambah, edit, dan hapus data
                            pengguna.
                        </p>

                        <div className="mt-4 text-accent text-sm font-semibold">
                            Kelola →
                        </div>

                    </Link>


                    {/* DESTINASI */}

                    <Link
                        to="/admin/destinasi"
                        className="card p-5 hover:border-accent transition group"
                    >

                        <div className="w-12 h-12 rounded-xl bg-line flex items-center justify-center">

                            <i className="fa-solid fa-map-location-dot text-accent text-xl" />

                        </div>

                        <h3 className="font-bold mt-4">
                            Kelola Destinasi
                        </h3>

                        <p className="text-mute text-sm mt-2 leading-relaxed">
                            Atur destinasi wisata dan
                            informasi tempat.
                        </p>

                        <div className="mt-4 text-accent text-sm font-semibold">
                            Kelola →
                        </div>

                    </Link>


                    {/* PENGINAPAN */}

                    <Link
                        to="/admin/penginapan"
                        className="card p-5 hover:border-accent transition group"
                    >

                        <div className="w-12 h-12 rounded-xl bg-line flex items-center justify-center">

                            <i className="fa-solid fa-hotel text-accent text-xl" />

                        </div>

                        <h3 className="font-bold mt-4">
                            Kelola Penginapan
                        </h3>

                        <p className="text-mute text-sm mt-2 leading-relaxed">
                            Atur hotel, harga, fasilitas,
                            dan gambar.
                        </p>

                        <div className="mt-4 text-accent text-sm font-semibold">
                            Kelola →
                        </div>

                    </Link>


                    {/* TRANSPORTASI */}

                    <Link
                        to="/admin/transportasi"
                        className="card p-5 hover:border-accent transition group"
                    >

                        <div className="w-12 h-12 rounded-xl bg-line flex items-center justify-center">

                            <i className="fa-solid fa-car text-accent text-xl" />

                        </div>

                        <h3 className="font-bold mt-4">
                            Kelola Transportasi
                        </h3>

                        <p className="text-mute text-sm mt-2 leading-relaxed">
                            Atur transportasi, rute,
                            operator, jadwal, dan harga.
                        </p>

                        <div className="mt-4 text-accent text-sm font-semibold">
                            Kelola →
                        </div>

                    </Link>


                    {/* BOOKING */}

                    <Link
                        to="/admin/booking"
                        className="card p-5 hover:border-accent transition group"
                    >

                        <div className="w-12 h-12 rounded-xl bg-line flex items-center justify-center">

                            <i className="fa-solid fa-calendar-check text-accent text-xl" />

                        </div>

                        <h3 className="font-bold mt-4">
                            Kelola Booking
                        </h3>

                        <p className="text-mute text-sm mt-2 leading-relaxed">
                            Kelola pesanan dan aktivitas
                            booking wisata.
                        </p>

                        <div className="mt-4 text-accent text-sm font-semibold">
                            Kelola →
                        </div>

                    </Link>

                </div>

            </section>


            {/* INFORMASI ADMIN */}

            <section className="card p-5">

                <div className="flex items-center gap-3 mb-5">

                    <div className="w-10 h-10 rounded-xl bg-line flex items-center justify-center">

                        <i className="fa-solid fa-user-shield text-accent" />

                    </div>

                    <div>

                        <h2 className="text-xl font-bold">
                            Informasi Admin
                        </h2>

                        <p className="text-mute text-sm">
                            Informasi akun administrator
                            yang sedang login.
                        </p>

                    </div>

                </div>


                <div className="grid sm:grid-cols-3 gap-4">


                    {/* NAMA */}

                    <div className="rounded-xl bg-line/50 p-4">

                        <span className="text-mute text-sm">
                            Nama
                        </span>

                        <p className="font-semibold mt-1">
                            {user?.name || '-'}
                        </p>

                    </div>


                    {/* EMAIL */}

                    <div className="rounded-xl bg-line/50 p-4">

                        <span className="text-mute text-sm">
                            Email
                        </span>

                        <p className="font-semibold mt-1 break-all">
                            {user?.email || '-'}
                        </p>

                    </div>


                    {/* ROLE */}

                    <div className="rounded-xl bg-line/50 p-4">

                        <span className="text-mute text-sm">
                            Role
                        </span>

                        <p className="text-accent font-semibold mt-1">
                            Administrator
                        </p>

                    </div>

                </div>

            </section>

        </div>
    )
}