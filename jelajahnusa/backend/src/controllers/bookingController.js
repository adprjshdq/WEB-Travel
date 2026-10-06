const pool = require('../config/database')

// ========================================
// DAFTAR HARGA PAKET
// ========================================

const packagePrices = {
    'Eksplorasi Pangandaran & Madasari': {
        price: 1250000,
        currency: 'IDR'
    },

    'Komodo Sailing': {
        price: 4850000,
        currency: 'IDR'
    },

    'Bromo dan Ijen': {
        price: 2350000,
        currency: 'IDR'
    },

    'Jogja Heritage': {
        price: 3100000,
        currency: 'IDR'
    },

    'Raja Ampat Diving': {
        price: 12900000,
        currency: 'IDR'
    },

    'Rinjani Hero — Sembalun Summit': {
        price: 175,
        currency: 'USD'
    },

    'Indahnesia Trekking — Sembalun ke Senaru': {
        price: 129,
        currency: 'USD'
    }
}

// ========================================
// HELPER
// ========================================

const isValidId = (id) => {
    return (
        /^\d+$/.test(String(id)) &&
        Number(id) > 0
    )
}

const isValidDate = (dateString) => {
    if (
        typeof dateString !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(dateString)
    ) {
        return false
    }

    const [
        year,
        month,
        day
    ] = dateString
        .split('-')
        .map(Number)

    const date = new Date(
        Date.UTC(
            year,
            month - 1,
            day
        )
    )

    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    )
}

const getTodayString = () => {
    const today = new Date()

    return [
        today.getFullYear(),
        String(
            today.getMonth() + 1
        ).padStart(2, '0'),
        String(
            today.getDate()
        ).padStart(2, '0')
    ].join('-')
}

const isValidGuests = (guests) => {
    return (
        Number.isInteger(guests) &&
        guests >= 1 &&
        guests <= 20
    )
}

const isValidNotes = (notes) => {
    return (
        notes === null ||
        notes === undefined ||
        (
            typeof notes === 'string' &&
            notes.trim().length <= 2000
        )
    )
}

// ========================================
// GET SEMUA BOOKING - ADMIN
// ========================================

const getBookings = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                b.id,
                b.user_id,
                b.destination_id,
                b.transport_id,
                b.item_type,
                b.item_name,
                b.booking_date,
                b.guests,
                b.total_price,
                b.currency,
                b.notes,
                b.status,
                b.created_at,

                u.name AS user_name,
                u.email AS user_email,

                d.name AS destination_name,

                t.jenis AS transport_type,
                t.rute AS transport_route,
                t.operator AS transport_operator

            FROM bookings b

            JOIN users u
                ON b.user_id = u.id

            LEFT JOIN destinations d
                ON b.destination_id = d.id

            LEFT JOIN transports t
                ON b.transport_id = t.id

            ORDER BY b.created_at DESC
        `)

        return res.json({
            success: true,
            data: rows
        })
    } catch (error) {
        console.error(
            'Get bookings error:',
            error
        )

        return res.status(500).json({
            success: false,
            message:
                'Gagal mengambil data booking'
        })
    }
}

// ========================================
// CREATE BOOKING
// ========================================

const createBooking = async (req, res) => {
    try {
        const {
            destination_id,
            transport_id,
            item_type,
            item_name,
            booking_date,
            guests,
            notes
        } = req.body

        // ========================================
        // VALIDASI ITEM TYPE
        // ========================================

        const allowedTypes = [
            'package',
            'hotel',
            'transport',
            'destination'
        ]

        if (
            typeof item_type !== 'string' ||
            !allowedTypes.includes(item_type)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Jenis booking tidak valid'
            })
        }

        // ========================================
        // VALIDASI ITEM NAME
        // ========================================

        if (
            typeof item_name !== 'string' ||
            !item_name.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Nama item booking wajib diisi'
            })
        }

        const requestedItemName =
            item_name.trim()

        if (
            requestedItemName.length > 200
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Nama item booking terlalu panjang'
            })
        }

        // ========================================
        // VALIDASI TANGGAL
        // ========================================

        if (!isValidDate(booking_date)) {
            return res.status(400).json({
                success: false,
                message:
                    'Tanggal booking tidak valid'
            })
        }

        const todayString =
            getTodayString()

        if (
            booking_date < todayString
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Tanggal booking tidak boleh sebelum hari ini'
            })
        }

        // ========================================
        // VALIDASI JUMLAH TAMU
        // ========================================

        const jumlahTamu =
            guests === undefined ||
                guests === ''
                ? 1
                : Number(guests)

        if (!isValidGuests(jumlahTamu)) {
            return res.status(400).json({
                success: false,
                message:
                    'Jumlah peserta harus antara 1 sampai 20 orang'
            })
        }

        // ========================================
        // VALIDASI CATATAN
        // ========================================

        if (!isValidNotes(notes)) {
            return res.status(400).json({
                success: false,
                message:
                    'Catatan maksimal 2000 karakter'
            })
        }

        const cleanNotes =
            typeof notes === 'string'
                ? notes.trim()
                : null

        // ========================================
        // HARGA
        // ========================================

        let hargaPerOrang = 0
        let totalPrice = 0
        let currency = 'IDR'

        let finalItemName =
            requestedItemName

        let finalDestinationId =
            null

        let finalTransportId =
            null

        // ========================================
        // PACKAGE
        // ========================================

        if (
            item_type === 'package'
        ) {
            const selectedPackage =
                packagePrices[
                requestedItemName
                ]

            if (!selectedPackage) {
                return res.status(404).json({
                    success: false,
                    message:
                        'Paket wisata tidak ditemukan atau belum memiliki harga'
                })
            }

            hargaPerOrang =
                Number(
                    selectedPackage.price
                )

            currency =
                selectedPackage.currency

            totalPrice =
                hargaPerOrang *
                jumlahTamu
        }

        // ========================================
        // DESTINATION
        // ========================================

        else if (
            item_type === 'destination'
        ) {
            if (
                !isValidId(
                    destination_id
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        'ID destinasi tidak valid'
                })
            }

            const [
                destinations
            ] = await pool.query(
                `
                SELECT
                    id,
                    name,
                    price
                FROM destinations
                WHERE id = ?
                LIMIT 1
                `,
                [destination_id]
            )

            if (
                destinations.length === 0
            ) {
                return res.status(404).json({
                    success: false,
                    message:
                        'Destinasi tidak ditemukan'
                })
            }

            const destination =
                destinations[0]

            // Nama dari database
            // menjadi sumber kebenaran.
            finalItemName =
                destination.name

            finalDestinationId =
                destination.id

            hargaPerOrang =
                Number(
                    destination.price || 0
                )

            if (
                !Number.isFinite(
                    hargaPerOrang
                ) ||
                hargaPerOrang <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Harga destinasi belum ditentukan'
                })
            }

            currency = 'IDR'

            totalPrice =
                hargaPerOrang *
                jumlahTamu
        }

        // ========================================
        // HOTEL
        // ========================================

        else if (
            item_type === 'hotel'
        ) {
            /*
             * Saat ini tabel bookings belum memiliki
             * hotel_id, jadi pencarian hotel tetap
             * menggunakan nama.
             */

            const [
                hotels
            ] = await pool.query(
                `
                SELECT
                    id,
                    name,
                    price
                FROM hotels
                WHERE name = ?
                LIMIT 1
                `,
                [requestedItemName]
            )

            if (
                hotels.length === 0
            ) {
                return res.status(404).json({
                    success: false,
                    message:
                        'Hotel tidak ditemukan'
                })
            }

            const hotel =
                hotels[0]

            finalItemName =
                hotel.name

            hargaPerOrang =
                Number(
                    hotel.price || 0
                )

            if (
                !Number.isFinite(
                    hargaPerOrang
                ) ||
                hargaPerOrang <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Harga hotel belum ditentukan'
                })
            }

            currency = 'IDR'

            totalPrice =
                hargaPerOrang *
                jumlahTamu
        }

        // ========================================
        // TRANSPORT
        // ========================================

        else if (
            item_type === 'transport'
        ) {
            if (
                !isValidId(
                    transport_id
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        'ID transportasi tidak valid'
                })
            }

            const [
                transports
            ] = await pool.query(
                `
                SELECT
                    id,
                    jenis,
                    rute,
                    operator,
                    price
                FROM transports
                WHERE id = ?
                LIMIT 1
                `,
                [transport_id]
            )

            if (
                transports.length === 0
            ) {
                return res.status(404).json({
                    success: false,
                    message:
                        'Transportasi tidak ditemukan'
                })
            }

            const transport =
                transports[0]

            finalTransportId =
                transport.id

            /*
             * Nama booking dibentuk dari
             * data database.
             */
            finalItemName =
                `${transport.jenis} - ${transport.rute}`

            hargaPerOrang =
                Number(
                    transport.price || 0
                )

            if (
                !Number.isFinite(
                    hargaPerOrang
                ) ||
                hargaPerOrang <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Harga transportasi belum ditentukan'
                })
            }

            currency = 'IDR'

            totalPrice =
                hargaPerOrang *
                jumlahTamu
        }

        // ========================================
        // VALIDASI TOTAL
        // ========================================

        if (
            !Number.isFinite(
                hargaPerOrang
            ) ||
            !Number.isFinite(
                totalPrice
            ) ||
            hargaPerOrang <= 0 ||
            totalPrice <= 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Total harga booking tidak valid'
            })
        }

        // ========================================
        // SIMPAN BOOKING
        // ========================================

        const [result] =
            await pool.query(
                `
                INSERT INTO bookings
                (
                    user_id,
                    destination_id,
                    transport_id,
                    item_type,
                    item_name,
                    booking_date,
                    guests,
                    total_price,
                    currency,
                    notes
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    req.user.id,
                    finalDestinationId,
                    finalTransportId,
                    item_type,
                    finalItemName,
                    booking_date,
                    jumlahTamu,
                    totalPrice,
                    currency,
                    cleanNotes || null
                ]
            )

        // ========================================
        // RESPONSE
        // ========================================

        return res.status(201).json({
            success: true,
            message:
                'Booking berhasil dibuat',
            data: {
                id: result.insertId,
                item_type: item_type,
                item_name: finalItemName,
                booking_date: booking_date,
                guests: jumlahTamu,
                price_per_person:
                    hargaPerOrang,
                total_price:
                    totalPrice,
                currency: currency
            }
        })
    } catch (error) {
        console.error(
            'Create booking error:',
            error
        )

        return res.status(500).json({
            success: false,
            message:
                'Gagal membuat booking'
        })
    }
}

// ========================================
// UPDATE STATUS BOOKING - ADMIN
// ========================================

const updateBookingStatus = async (
    req,
    res
) => {
    try {
        const { id } =
            req.params

        const { status } =
            req.body

        if (!isValidId(id)) {
            return res.status(400).json({
                success: false,
                message:
                    'ID booking tidak valid'
            })
        }

        const allowedStatus = [
            'pending',
            'confirmed',
            'cancelled'
        ]

        if (
            !allowedStatus.includes(
                status
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Status booking tidak valid'
            })
        }

        const [result] =
            await pool.query(
                `
                UPDATE bookings
                SET status = ?
                WHERE id = ?
                `,
                [
                    status,
                    id
                ]
            )

        if (
            result.affectedRows === 0
        ) {
            return res.status(404).json({
                success: false,
                message:
                    'Booking tidak ditemukan'
            })
        }

        return res.json({
            success: true,
            message:
                'Status booking berhasil diperbarui'
        })
    } catch (error) {
        console.error(
            'Update booking status error:',
            error
        )

        return res.status(500).json({
            success: false,
            message:
                'Gagal memperbarui booking'
        })
    }
}

// ========================================
// DELETE BOOKING - ADMIN
// ========================================

const deleteBooking = async (
    req,
    res
) => {
    try {
        const { id } =
            req.params

        if (!isValidId(id)) {
            return res.status(400).json({
                success: false,
                message:
                    'ID booking tidak valid'
            })
        }

        const [result] =
            await pool.query(
                `
                DELETE FROM bookings
                WHERE id = ?
                `,
                [id]
            )

        if (
            result.affectedRows === 0
        ) {
            return res.status(404).json({
                success: false,
                message:
                    'Booking tidak ditemukan'
            })
        }

        return res.json({
            success: true,
            message:
                'Booking berhasil dihapus'
        })
    } catch (error) {
        console.error(
            'Delete booking error:',
            error
        )

        return res.status(500).json({
            success: false,
            message:
                'Gagal menghapus booking'
        })
    }
}

// ========================================
// BAYAR BOOKING
// ========================================

const payBooking = async (
    req,
    res
) => {
    try {
        const { id } =
            req.params

        if (!isValidId(id)) {
            return res.status(400).json({
                success: false,
                message:
                    'ID booking tidak valid'
            })
        }

        const [result] =
            await pool.query(
                `
                UPDATE bookings
                SET status = 'confirmed'
                WHERE id = ?
                AND user_id = ?
                AND status = 'pending'
                `,
                [
                    id,
                    req.user.id
                ]
            )

        if (
            result.affectedRows === 0
        ) {
            return res.status(404).json({
                success: false,
                message:
                    'Booking tidak ditemukan atau sudah diproses'
            })
        }

        return res.json({
            success: true,
            message:
                'Pembayaran berhasil dikonfirmasi'
        })
    } catch (error) {
        console.error(
            'Pay booking error:',
            error
        )

        return res.status(500).json({
            success: false,
            message:
                'Gagal memproses pembayaran'
        })
    }
}

// ========================================
// BOOKING MILIK USER
// ========================================

const getMyBookings = async (
    req,
    res
) => {
    try {
        const [rows] =
            await pool.query(
                `
                SELECT
                    b.id,
                    b.destination_id,
                    b.transport_id,
                    b.item_type,
                    b.item_name,
                    b.booking_date,
                    b.guests,
                    b.total_price,
                    b.currency,
                    b.notes,
                    b.status,
                    b.created_at,

                    t.jenis AS transport_type,
                    t.rute AS transport_route,
                    t.operator AS transport_operator

                FROM bookings b

                LEFT JOIN transports t
                    ON b.transport_id = t.id

                WHERE b.user_id = ?

                ORDER BY b.created_at DESC
                `,
                [req.user.id]
            )

        return res.json({
            success: true,
            data: rows
        })
    } catch (error) {
        console.error(
            'Get my bookings error:',
            error
        )

        return res.status(500).json({
            success: false,
            message:
                'Gagal mengambil riwayat booking'
        })
    }
}

// ========================================
// DETAIL BOOKING MILIK USER
// ========================================

const getMyBookingDetail = async (
    req,
    res
) => {
    try {
        const { id } =
            req.params

        if (!isValidId(id)) {
            return res.status(400).json({
                success: false,
                message:
                    'ID booking tidak valid'
            })
        }

        const [rows] =
            await pool.query(
                `
                SELECT
                    b.id,
                    b.destination_id,
                    b.transport_id,
                    b.item_type,
                    b.item_name,
                    b.booking_date,
                    b.guests,
                    b.total_price,
                    b.currency,
                    b.notes,
                    b.status,
                    b.created_at,

                    t.jenis AS transport_type,
                    t.rute AS transport_route,
                    t.operator AS transport_operator

                FROM bookings b

                LEFT JOIN transports t
                    ON b.transport_id = t.id

                WHERE b.id = ?
                AND b.user_id = ?

                LIMIT 1
                `,
                [
                    id,
                    req.user.id
                ]
            )

        if (
            rows.length === 0
        ) {
            return res.status(404).json({
                success: false,
                message:
                    'Booking tidak ditemukan'
            })
        }

        return res.json({
            success: true,
            data: rows[0]
        })
    } catch (error) {
        console.error(
            'Get booking detail error:',
            error
        )

        return res.status(500).json({
            success: false,
            message:
                'Gagal mengambil detail booking'
        })
    }
}

// ========================================
// BATALKAN BOOKING
// ========================================

const cancelMyBooking = async (
    req,
    res
) => {
    try {
        const { id } =
            req.params

        if (!isValidId(id)) {
            return res.status(400).json({
                success: false,
                message:
                    'ID booking tidak valid'
            })
        }

        const [result] =
            await pool.query(
                `
                UPDATE bookings
                SET status = 'cancelled'
                WHERE id = ?
                AND user_id = ?
                AND status = 'pending'
                `,
                [
                    id,
                    req.user.id
                ]
            )

        if (
            result.affectedRows === 0
        ) {
            return res.status(404).json({
                success: false,
                message:
                    'Booking tidak ditemukan atau tidak dapat dibatalkan'
            })
        }

        return res.json({
            success: true,
            message:
                'Booking berhasil dibatalkan'
        })
    } catch (error) {
        console.error(
            'Cancel booking error:',
            error
        )

        return res.status(500).json({
            success: false,
            message:
                'Gagal membatalkan booking'
        })
    }
}

// ========================================
// EXPORT
// ========================================

module.exports = {
    getBookings,
    getMyBookings,
    getMyBookingDetail,
    createBooking,
    updateBookingStatus,
    deleteBooking,
    payBooking,
    cancelMyBooking
}