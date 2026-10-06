import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { PageHead, rupiah } from '../components/ui'

const API_URL = 'http://localhost:5001/api'

export default function BookingDetail() {
    const { id } = useParams()

    const [booking, setBooking] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [cancelling, setCancelling] = useState(false)

    const fetchBooking = async () => {
        try {
            const token = localStorage.getItem('token')

            if (!token) {
                setError('Silakan login terlebih dahulu.')
                setLoading(false)
                return
            }

            const response = await fetch(
                `${API_URL}/bookings/my/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const result = await response.json()

            if (!response.ok) {
                setError(
                    result.message ||
                    'Gagal mengambil detail booking.'
                )
                return
            }

            setBooking(result.data)
        } catch (error) {
            console.error(error)

            setError(
                'Tidak dapat terhubung ke server.'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBooking()
    }, [id])

    const handleCancel = async () => {
        const confirmCancel = window.confirm(
            'Apakah kamu yakin ingin membatalkan booking ini?'
        )

        if (!confirmCancel) {
            return
        }

        try {
            setCancelling(true)

            const token = localStorage.getItem('token')

            const response = await fetch(
                `${API_URL}/bookings/${id}/cancel`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const result = await response.json()

            if (!response.ok) {
                alert(
                    result.message ||
                    'Booking gagal dibatalkan.'
                )
                return
            }

            alert('Booking berhasil dibatalkan.')

            await fetchBooking()
        } catch (error) {
            console.error(error)

            alert(
                'Tidak dapat terhubung ke server.'
            )
        } finally {
            setCancelling(false)
        }
    }

    const getTypeName = (type) => {
        if (type === 'package') {
            return 'Paket Wisata'
        }

        if (type === 'hotel') {
            return 'Penginapan'
        }

        if (type === 'transport') {
            return 'Transportasi'
        }

        return type
    }

    const getStatus = (status) => {
        if (status === 'confirmed') {
            return {
                label: 'Confirmed',
                className:
                    'bg-green-500/10 text-green-400'
            }
        }

        if (status === 'cancelled') {
            return {
                label: 'Cancelled',
                className:
                    'bg-red-500/10 text-red-400'
            }
        }

        return {
            label: 'Pending',
            className:
                'bg-yellow-500/10 text-yellow-400'
        }
    }

    if (loading) {
        return (
            <>
                <PageHead title="Detail Booking" />

                <div className="card p-6 text-mute">
                    Memuat detail booking...
                </div>
            </>
        )
    }

    if (error) {
        return (
            <>
                <PageHead title="Detail Booking" />

                <div className="card p-6">
                    <p className="text-red-400 mb-4">
                        {error}
                    </p>

                    <Link
                        to="/akun"
                        className="btn btn-p inline-block"
                    >
                        Kembali ke Akun
                    </Link>
                </div>
            </>
        )
    }

    if (!booking) {
        return null
    }

    const status = getStatus(
        booking.status
    )

    return (
        <>
            <PageHead title="Detail Booking" />

            <div className="max-w-3xl mx-auto">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-5">

                    <div>
                        <h1 className="text-2xl font-bold">
                            Detail Booking
                        </h1>

                        <p className="text-mute text-sm mt-1">
                            Booking #{booking.id}
                        </p>
                    </div>

                    <Link
                        to="/akun"
                        className="btn"
                    >
                        <i className="fa-solid fa-arrow-left mr-2" />
                        Kembali
                    </Link>

                </div>

                {/* CARD DETAIL */}
                <div className="card overflow-hidden">

                    {/* ITEM */}
                    <div className="p-5 border-b border-line">

                        <div className="flex flex-wrap items-start justify-between gap-4">

                            <div>
                                <p className="text-mute text-sm mb-1">
                                    Item booking
                                </p>

                                <h2 className="text-xl font-bold">
                                    {booking.item_name}
                                </h2>

                                <p className="text-mute text-sm mt-1">
                                    {getTypeName(
                                        booking.item_type
                                    )}
                                </p>
                            </div>

                            <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${status.className}`}
                            >
                                {status.label}
                            </span>

                        </div>

                    </div>

                    {/* INFORMASI */}
                    <div className="p-5">

                        <h3 className="font-semibold mb-4">
                            Informasi Booking
                        </h3>

                        <div className="grid sm:grid-cols-2 gap-4">

                            <div className="p-4 rounded-lg bg-panel">
                                <p className="text-mute text-sm">
                                    Nomor Booking
                                </p>

                                <p className="font-semibold mt-1">
                                    #{booking.id}
                                </p>
                            </div>

                            <div className="p-4 rounded-lg bg-panel">
                                <p className="text-mute text-sm">
                                    Jenis
                                </p>

                                <p className="font-semibold mt-1">
                                    {getTypeName(
                                        booking.item_type
                                    )}
                                </p>
                            </div>

                            <div className="p-4 rounded-lg bg-panel">
                                <p className="text-mute text-sm">
                                    Tanggal Booking
                                </p>

                                <p className="font-semibold mt-1">
                                    {booking.booking_date}
                                </p>
                            </div>

                            <div className="p-4 rounded-lg bg-panel">
                                <p className="text-mute text-sm">
                                    Jumlah
                                </p>

                                <p className="font-semibold mt-1">
                                    {booking.guests} orang
                                </p>
                            </div>

                        </div>

                        {booking.notes && (
                            <div className="mt-4 p-4 rounded-lg bg-panel">

                                <p className="text-mute text-sm">
                                    Catatan
                                </p>

                                <p className="mt-1">
                                    {booking.notes}
                                </p>

                            </div>
                        )}

                    </div>

                    {/* TOTAL */}
                    <div className="border-t border-line p-5">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-mute text-sm">
                                    Total Pembayaran
                                </p>

                                <p className="text-2xl font-bold text-accent mt-1">
                                    {rupiah(
                                        Number(
                                            booking.total_price
                                        )
                                    )}
                                </p>
                            </div>

                            <i className="fa-solid fa-receipt text-3xl text-accent" />

                        </div>

                    </div>

                    {/* AKSI */}
                    {booking.status === 'pending' && (
                        <div className="border-t border-line p-5">

                            <div className="flex flex-wrap items-center justify-between gap-3">

                                <div>
                                    <p className="font-semibold">
                                        Batalkan Booking?
                                    </p>

                                    <p className="text-mute text-sm">
                                        Booking yang dibatalkan tidak dapat diproses kembali.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={cancelling}
                                    className="btn bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                >
                                    <i className="fa-solid fa-ban mr-2" />

                                    {cancelling
                                        ? 'Membatalkan...'
                                        : 'Batalkan Booking'}
                                </button>

                            </div>

                        </div>
                    )}

                    {/* BOOKING DIBATALKAN */}
                    {booking.status === 'cancelled' && (
                        <div className="border-t border-line p-5">

                            <div className="p-4 rounded-lg bg-red-500/10 text-red-400">

                                <div className="flex items-center gap-3">

                                    <i className="fa-solid fa-circle-xmark text-xl" />

                                    <div>
                                        <p className="font-semibold">
                                            Booking telah dibatalkan
                                        </p>

                                        <p className="text-sm mt-1">
                                            Booking ini sudah tidak dapat diproses kembali.
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </div>
                    )}

                    {/* CREATED */}
                    <div className="border-t border-line px-5 py-4">

                        <p className="text-mute text-sm">
                            Booking dibuat pada
                        </p>

                        <p className="text-sm mt-1">
                            {new Date(
                                booking.created_at
                            ).toLocaleString('id-ID')}
                        </p>

                    </div>

                </div>

            </div>
        </>
    )
}