const pool = require('../config/database')

/*
|--------------------------------------------------------------------------
| DAFTAR HARGA PAKET
|--------------------------------------------------------------------------
| Harga package menjadi sumber harga utama dari backend.
| Frontend tidak dipercaya untuk menentukan total_price.
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| GET SEMUA BOOKING - ADMIN
|--------------------------------------------------------------------------
*/

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

        res.json({
            success: true,
            data: rows
        })

    } catch (error) {
        console.error(
            'Get bookings error:',
            error
        )

        res.status(500).json({
            success: false,
            message:
                'Gagal mengambil data booking'
        })
    }
}

/*
|--------------------------------------------------------------------------
| CREATE BOOKING
|--------------------------------------------------------------------------
*/

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

        /*
        |--------------------------------------------------------------------------
        | VALIDASI DATA DASAR
        |--------------------------------------------------------------------------
        */

        if (
            !item_type ||
            !item_name ||
            !booking_date
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Item, jenis booking, dan tanggal wajib diisi'
            })
        }

        /*
        |--------------------------------------------------------------------------
        | VALIDASI TANGGAL
        |--------------------------------------------------------------------------
        */

        const dateRegex =
            /^\d{4}-\d{2}-\d{2}$/

        if (!dateRegex.test(booking_date)) {
            return res.status(400).json({
                success: false,
                message:
                    'Format tanggal booking tidak valid'
            })
        }

        const [
            year,
            month,
            day
        ] = booking_date
            .split('-')
            .map(Number)

        const selectedDate =
            new Date(
                Date.UTC(
                    year,
                    month - 1,
                    day
                )
            )

        const validCalendarDate =
            selectedDate.getUTCFullYear() === year &&
            selectedDate.getUTCMonth() === month - 1 &&
            selectedDate.getUTCDate() === day

        if (!validCalendarDate) {
            return res.status(400).json({
                success: false,
                message:
                    'Tanggal booking tidak valid'
            })
        }

        const today = new Date()

        const todayString = [
            today.getFullYear(),
            String(
                today.getMonth() + 1
            ).padStart(2, '0'),
            String(
                today.getDate()
            ).padStart(2, '0')
        ].join('-')

        if (booking_date < todayString) {
            return res.status(400).json({
                success: false,
                message:
                    'Tanggal booking tidak boleh sebelum hari ini'
            })
        }

        /*
        |--------------------------------------------------------------------------
        | VALIDASI JENIS BOOKING
        |--------------------------------------------------------------------------
        */

        const allowedTypes = [
            'package',
            'hotel',
            'transport',
            'destination'
        ]

        if (!allowedTypes.includes(item_type)) {
            return res.status(400).json({
                success: false,
                message:
                    'Jenis booking tidak valid'
            })
        }

        /*
        |--------------------------------------------------------------------------
        | VALIDASI JUMLAH TAMU
        |--------------------------------------------------------------------------
        */

        const jumlahTamu =
            Number(guests || 1)

        if (
            !Number.isInteger(jumlahTamu) ||
            jumlahTamu < 1 ||
            jumlahTamu > 20
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Jumlah peserta harus antara 1 sampai 20 orang'
            })
        }

        /*
        |--------------------------------------------------------------------------
        | HARGA BOOKING
        |--------------------------------------------------------------------------
        */

        let hargaPerOrang = 0
        let currency = 'IDR'
        let totalPrice = 0

        /*
        |--------------------------------------------------------------------------
        | PACKAGE
        |--------------------------------------------------------------------------
        */

        if (item_type === 'package') {
            const selectedPackage =
                packagePrices[item_name]

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

        /*
        |--------------------------------------------------------------------------
        | DESTINATION
        |--------------------------------------------------------------------------
        */

        else if (
            item_type === 'destination'
        ) {
            if (!destination_id) {
                return res.status(400).json({
                    success: false,
                    message:
                        'ID destinasi wajib diisi'
                })
            }

            const [destination] =
                await pool.query(
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
                destination.length === 0
            ) {
                return res.status(404).json({
                    success: false,
                    message:
                        'Destinasi tidak ditemukan'
                })
            }

            hargaPerOrang =
                Number(
                    destination[0].price || 0
                )

            if (
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

        /*
        |--------------------------------------------------------------------------
        | HOTEL
        |--------------------------------------------------------------------------
        */

        else if (
            item_type === 'hotel'
        ) {
            const [hotel] =
                await pool.query(
                    `
                    SELECT
                        id,
                        name,
                        price
                    FROM hotels
                    WHERE name = ?
                    LIMIT 1
                    `,
                    [item_name]
                )

            if (
                hotel.length === 0
            ) {
                return res.status(404).json({
                    success: false,
                    message:
                        'Hotel tidak ditemukan'
                })
            }

            hargaPerOrang =
                Number(
                    hotel[0].price || 0
                )

            if (
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

        /*
        |--------------------------------------------------------------------------
        | TRANSPORT
        |--------------------------------------------------------------------------
        | Harga transportasi diambil langsung dari database.
        | total_price dari frontend tidak dipercaya.
        |--------------------------------------------------------------------------
        */

        else if (
            item_type === 'transport'
        ) {
            if (!transport_id) {
                return res.status(400).json({
                    success: false,
                    message:
                        'ID transportasi wajib diisi'
                })
            }

            const [transport] =
                await pool.query(
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
                transport.length === 0
            ) {
                return res.status(404).json({
                    success: false,
                    message:
                        'Transportasi tidak ditemukan'
                })
            }

            hargaPerOrang =
                Number(
                    transport[0].price || 0
                )

            if (
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

        /*
        |--------------------------------------------------------------------------
        | VALIDASI HASIL HARGA
        |--------------------------------------------------------------------------
        */

        if (totalPrice <= 0) {
            return res.status(400).json({
                success: false,
                message:
                    'Total harga booking tidak valid'
            })
        }

        /*
        |--------------------------------------------------------------------------
        | SIMPAN BOOKING
        |--------------------------------------------------------------------------
        */

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
                    destination_id || null,
                    transport_id || null,
                    item_type,
                    item_name,
                    booking_date,
                    jumlahTamu,
                    totalPrice,
                    currency,
                    notes || null
                ]
            )

        /*
        |--------------------------------------------------------------------------
        | RESPONSE
        |--------------------------------------------------------------------------
        */

        res.status(201).json({
            success: true,

            message:
                'Booking berhasil dibuat',

            data: {
                id:
                    result.insertId,

                item_type,

                item_name,

                guests:
                    jumlahTamu,

                price_per_person:
                    hargaPerOrang,

                total_price:
                    totalPrice,

                currency
            }
        })

    } catch (error) {
        console.error(
            'Create booking error:',
            error
        )

        res.status(500).json({
            success: false,
            message:
                'Gagal membuat booking'
        })
    }
}

/*
|--------------------------------------------------------------------------
| UPDATE STATUS BOOKING - ADMIN
|--------------------------------------------------------------------------
*/

const updateBookingStatus = async (
    req,
    res
) => {
    try {
        const { id } =
            req.params

        const { status } =
            req.body

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

        res.json({
            success: true,
            message:
                'Status booking berhasil diperbarui'
        })

    } catch (error) {
        console.error(error)

        res.status(500).json({
            success: false,
            message:
                'Gagal memperbarui booking'
        })
    }
}

/*
|--------------------------------------------------------------------------
| DELETE BOOKING - ADMIN
|--------------------------------------------------------------------------
*/

const deleteBooking = async (
    req,
    res
) => {
    try {
        const { id } =
            req.params

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

        res.json({
            success: true,
            message:
                'Booking berhasil dihapus'
        })

    } catch (error) {
        console.error(error)

        res.status(500).json({
            success: false,
            message:
                'Gagal menghapus booking'
        })
    }
}

/*
|--------------------------------------------------------------------------
| BAYAR BOOKING
|--------------------------------------------------------------------------
*/

const payBooking = async (
    req,
    res
) => {
    try {
        const { id } =
            req.params

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

        res.json({
            success: true,
            message:
                'Pembayaran berhasil dikonfirmasi'
        })

    } catch (error) {
        console.error(error)

        res.status(500).json({
            success: false,
            message:
                'Gagal memproses pembayaran'
        })
    }
}

/*
|--------------------------------------------------------------------------
| BOOKING MILIK USER
|--------------------------------------------------------------------------
*/

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

        res.json({
            success: true,
            data: rows
        })

    } catch (error) {
        console.error(error)

        res.status(500).json({
            success: false,
            message:
                'Gagal mengambil riwayat booking'
        })
    }
}

/*
|--------------------------------------------------------------------------
| DETAIL BOOKING MILIK USER
|--------------------------------------------------------------------------
*/

const getMyBookingDetail = async (
    req,
    res
) => {
    try {
        const { id } =
            req.params

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

        res.json({
            success: true,
            data: rows[0]
        })

    } catch (error) {
        console.error(error)

        res.status(500).json({
            success: false,
            message:
                'Gagal mengambil detail booking'
        })
    }
}

/*
|--------------------------------------------------------------------------
| BATALKAN BOOKING
|--------------------------------------------------------------------------
*/

const cancelMyBooking = async (
    req,
    res
) => {
    try {
        const { id } =
            req.params

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

        res.json({
            success: true,
            message:
                'Booking berhasil dibatalkan'
        })

    } catch (error) {
        console.error(error)

        res.status(500).json({
            success: false,
            message:
                'Gagal membatalkan booking'
        })
    }
}

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

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