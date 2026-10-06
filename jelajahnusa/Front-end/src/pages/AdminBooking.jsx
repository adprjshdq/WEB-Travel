import { useEffect, useState } from 'react'

const API_URL = 'http://localhost:5001/api'

export default function AdminBooking() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [updatingId, setUpdatingId] = useState(null)

    const fetchBookings = async () => {
        try {
            setLoading(true)

            const token =
                localStorage.getItem('token')

            const response = await fetch(
                `${API_URL}/bookings`,
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
                setBookings(result.data)
            } else {
                alert(
                    result.message ||
                    'Gagal mengambil data booking.'
                )
            }
        } catch (error) {
            console.error(error)

            alert(
                'Tidak dapat terhubung ke server.'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBookings()
    }, [])

    const updateStatus = async (
        id,
        status
    ) => {
        try {
            setUpdatingId(id)

            const token =
                localStorage.getItem('token')

            const response = await fetch(
                `${API_URL}/bookings/${id}/status`,
                {
                    method: 'PUT',

                    headers: {
                        'Content-Type':
                            'application/json',

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        status
                    })
                }
            )

            const result =
                await response.json()

            if (!response.ok) {
                alert(
                    result.message ||
                    'Gagal mengubah status booking.'
                )

                return
            }

            await fetchBookings()
        } catch (error) {
            console.error(error)

            alert(
                'Tidak dapat terhubung ke server.'
            )
        } finally {
            setUpdatingId(null)
        }
    }

    const deleteBooking = async (id) => {
        const yakin = window.confirm(
            'Yakin ingin menghapus booking ini?'
        )

        if (!yakin) {
            return
        }

        try {
            const token =
                localStorage.getItem('token')

            const response = await fetch(
                `${API_URL}/bookings/${id}`,
                {
                    method: 'DELETE',

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
                    'Gagal menghapus booking.'
                )

                return
            }

            alert(
                'Booking berhasil dihapus!'
            )

            await fetchBookings()
        } catch (error) {
            console.error(error)

            alert(
                'Tidak dapat terhubung ke server.'
            )
        }
    }

    const formatDate = (date) => {
        if (!date) {
            return '-'
        }

        const parsedDate =
            new Date(date)

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
                month: 'short',
                year: 'numeric'
            }
        )
    }

    // FORMAT HARGA
    const formatPrice = (
        price,
        currency = 'IDR'
    ) => {
        const amount =
            Number(price) || 0

        const currentCurrency =
            String(currency || 'IDR')
                .toUpperCase()

        if (
            currentCurrency === 'USD'
        ) {
            return `USD ${amount.toLocaleString('en-US')}`
        }

        return `Rp ${amount.toLocaleString('id-ID')}`
    }

    const getStatusClass = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-500/10 text-green-400 border-green-500/20'

            case 'cancelled':
                return 'bg-red-500/10 text-red-400 border-red-500/20'

            case 'pending':
            default:
                return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
        }
    }

    const getStatusLabel = (status) => {
        switch (status) {
            case 'confirmed':
                return 'Confirmed'

            case 'cancelled':
                return 'Cancelled'

            case 'pending':
            default:
                return 'Pending'
        }
    }

    const filteredBookings =
        bookings.filter((booking) => {
            const keyword =
                search
                    .toLowerCase()
                    .trim()

            const matchesSearch =
                !keyword ||
                booking.user_name
                    ?.toLowerCase()
                    .includes(keyword) ||
                booking.user_email
                    ?.toLowerCase()
                    .includes(keyword) ||
                booking.destination_name
                    ?.toLowerCase()
                    .includes(keyword)

            const matchesStatus =
                statusFilter === 'all' ||
                booking.status === statusFilter

            return (
                matchesSearch &&
                matchesStatus
            )
        })

    const totalBooking =
        bookings.length

    const pendingBooking =
        bookings.filter(
            (booking) =>
                booking.status === 'pending'
        ).length

    const confirmedBooking =
        bookings.filter(
            (booking) =>
                booking.status === 'confirmed'
        ).length

    const cancelledBooking =
        bookings.filter(
            (booking) =>
                booking.status === 'cancelled'
        ).length

    return (
        <div className="space-y-6">

            {/* HEADER */}

            <div>
                <p className="text-mute text-sm">
                    Administrator
                </p>

                <h1 className="mt-1 text-2xl font-bold">
                    Kelola Booking
                </h1>

                <p className="text-mute mt-2">
                    Kelola seluruh pemesanan wisata
                    yang masuk ke sistem.
                </p>
            </div>


            {/* STATISTIK */}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

                <div className="card p-4">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-mute text-sm">
                                Total Booking
                            </p>

                            <p className="text-2xl font-bold mt-1">
                                {totalBooking}
                            </p>
                        </div>

                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <i className="fa-solid fa-calendar text-blue-400" />
                        </div>

                    </div>
                </div>


                <div className="card p-4">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-mute text-sm">
                                Pending
                            </p>

                            <p className="text-2xl font-bold mt-1">
                                {pendingBooking}
                            </p>
                        </div>

                        <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                            <i className="fa-solid fa-clock text-yellow-400" />
                        </div>

                    </div>
                </div>


                <div className="card p-4">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-mute text-sm">
                                Confirmed
                            </p>

                            <p className="text-2xl font-bold mt-1">
                                {confirmedBooking}
                            </p>
                        </div>

                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <i className="fa-solid fa-circle-check text-green-400" />
                        </div>

                    </div>
                </div>


                <div className="card p-4">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-mute text-sm">
                                Cancelled
                            </p>

                            <p className="text-2xl font-bold mt-1">
                                {cancelledBooking}
                            </p>
                        </div>

                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <i className="fa-solid fa-circle-xmark text-red-400" />
                        </div>

                    </div>
                </div>

            </div>


            {/* FILTER */}

            <section className="card p-4">

                <div className="flex flex-col lg:flex-row gap-3">

                    <div className="flex-1 relative">

                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-mute" />

                        <input
                            type="search"
                            className="input pl-10"
                            placeholder="Cari nama, email, atau destinasi..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <select
                        className="input lg:w-52"
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value
                            )
                        }
                    >
                        <option value="all">
                            Semua Status
                        </option>

                        <option value="pending">
                            Pending
                        </option>

                        <option value="confirmed">
                            Confirmed
                        </option>

                        <option value="cancelled">
                            Cancelled
                        </option>
                    </select>

                </div>


                <div className="flex items-center justify-between mt-3 text-sm">

                    <p className="text-mute">
                        Menampilkan{' '}

                        <span className="text-ink font-semibold">
                            {filteredBookings.length}
                        </span>{' '}

                        dari{' '}

                        <span className="text-ink font-semibold">
                            {bookings.length}
                        </span>{' '}

                        booking
                    </p>

                    {(search ||
                        statusFilter !== 'all') && (

                            <button
                                type="button"
                                className="text-accent text-sm font-semibold"
                                onClick={() => {
                                    setSearch('')
                                    setStatusFilter(
                                        'all'
                                    )
                                }}
                            >
                                Reset filter
                            </button>

                        )}

                </div>

            </section>


            {/* DATA */}

            <section className="card p-4">

                {loading ? (

                    <div className="py-10 text-center">

                        <i className="fa-solid fa-spinner fa-spin text-2xl text-mute" />

                        <p className="text-mute mt-3">
                            Memuat booking...
                        </p>

                    </div>

                ) : filteredBookings.length === 0 ? (

                    <div className="text-center py-12">

                        <i className="fa-solid fa-calendar-xmark text-4xl text-mute" />

                        <p className="mt-4 font-semibold">
                            {bookings.length === 0
                                ? 'Belum ada booking'
                                : 'Booking tidak ditemukan'}
                        </p>

                        <p className="text-mute text-sm mt-1">
                            {bookings.length === 0
                                ? 'Booking dari pengguna akan muncul di sini.'
                                : 'Coba ubah kata kunci atau filter status.'}
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full text-sm">

                            <thead>

                                <tr className="border-b border-line text-left">

                                    <th className="p-3 whitespace-nowrap">
                                        User
                                    </th>

                                    <th className="p-3 whitespace-nowrap">
                                        Destinasi
                                    </th>

                                    <th className="p-3 whitespace-nowrap">
                                        Tanggal
                                    </th>

                                    <th className="p-3 whitespace-nowrap">
                                        Tamu
                                    </th>

                                    <th className="p-3 whitespace-nowrap">
                                        Total
                                    </th>

                                    <th className="p-3 whitespace-nowrap">
                                        Status
                                    </th>

                                    <th className="p-3 text-right whitespace-nowrap">
                                        Aksi
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredBookings.map(
                                    (booking) => (

                                        <tr
                                            key={booking.id}
                                            className="border-b border-line last:border-0 hover:bg-white/[0.02]"
                                        >

                                            {/* USER */}

                                            <td className="p-3 min-w-48">

                                                <p className="font-semibold">
                                                    {booking.user_name}
                                                </p>

                                                <p className="text-mute text-xs mt-1">
                                                    {booking.user_email}
                                                </p>

                                            </td>


                                            {/* DESTINATION */}

                                            <td className="p-3 min-w-40">

                                                <p className="font-medium">
                                                    {booking.destination_name}
                                                </p>

                                            </td>


                                            {/* DATE */}

                                            <td className="p-3 whitespace-nowrap">

                                                <div className="flex items-center gap-2">

                                                    <i className="fa-regular fa-calendar text-mute" />

                                                    <span>
                                                        {formatDate(
                                                            booking.booking_date
                                                        )}
                                                    </span>

                                                </div>

                                            </td>


                                            {/* GUEST */}

                                            <td className="p-3 whitespace-nowrap">

                                                <div className="flex items-center gap-2">

                                                    <i className="fa-solid fa-users text-mute" />

                                                    <span>
                                                        {booking.guests}{' '}
                                                        orang
                                                    </span>

                                                </div>

                                            </td>


                                            {/* PRICE */}

                                            <td className="p-3 whitespace-nowrap">

                                                <span className="font-bold text-accent">

                                                    {formatPrice(
                                                        booking.total_price,
                                                        booking.currency
                                                    )}

                                                </span>

                                            </td>


                                            {/* STATUS */}

                                            <td className="p-3">

                                                <div className="space-y-2">

                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold ${getStatusClass(
                                                            booking.status
                                                        )}`}
                                                    >
                                                        {getStatusLabel(
                                                            booking.status
                                                        )}
                                                    </span>

                                                    <select
                                                        className="input min-w-32 text-xs"
                                                        value={
                                                            booking.status
                                                        }
                                                        disabled={
                                                            updatingId ===
                                                            booking.id
                                                        }
                                                        onChange={(e) =>
                                                            updateStatus(
                                                                booking.id,
                                                                e.target.value
                                                            )
                                                        }
                                                    >

                                                        <option value="pending">
                                                            Pending
                                                        </option>

                                                        <option value="confirmed">
                                                            Confirmed
                                                        </option>

                                                        <option value="cancelled">
                                                            Cancelled
                                                        </option>

                                                    </select>

                                                </div>

                                            </td>


                                            {/* ACTION */}

                                            <td className="p-3 text-right">

                                                <button
                                                    type="button"
                                                    className="btn"
                                                    title="Hapus booking"
                                                    onClick={() =>
                                                        deleteBooking(
                                                            booking.id
                                                        )
                                                    }
                                                >
                                                    <i className="fa-solid fa-trash" />
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

        </div>
    )
}