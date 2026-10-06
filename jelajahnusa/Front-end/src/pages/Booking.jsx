import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Field, PageHead, rupiah } from '../components/ui'

const API_URL = 'http://localhost:5001/api'

export default function Booking() {
  const { booking, setBooking, user } = useApp()
  const nav = useNavigate()

  const [f, setF] = useState({
    nama: user?.name || '',
    tgl: '',
    jml: 2,
    catatan: ''
  })

  const [loading, setLoading] = useState(false)

  if (!booking) {
    return (
      <>
        <PageHead title="Booking" />

        <p className="card p-4">
          Belum ada yang dipilih.{' '}

          <Link
            to="/paket"
            className="text-accent"
          >
            Pilih paket wisata
          </Link>{' '}

          atau{' '}

          <Link
            to="/hotel"
            className="text-accent"
          >
            cari penginapan
          </Link>.
        </p>
      </>
    )
  }

  const total =
    Number(booking.harga) *
    Number(f.jml)

  const formatHarga = (harga) => {
    if (booking.mataUang === 'USD') {
      return `USD ${Number(harga).toLocaleString('en-US')}`
    }

    return rupiah(harga)
  }

  const set = (key) => (e) => {
    setF({
      ...f,
      [key]: e.target.value
    })
  }

  const lanjut = async (e) => {
    e.preventDefault()

    if (!user) {
      alert('Silakan login terlebih dahulu.')
      nav('/login')
      return
    }

    if (!f.tgl) {
      alert('Silakan pilih tanggal booking.')
      return
    }

    if (!booking.item_type || !booking.item_name) {
      alert('Data booking tidak lengkap.')
      return
    }

    try {
      setLoading(true)

      const token =
        localStorage.getItem('token')

      const response = await fetch(
        `${API_URL}/bookings`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({
            destination_id:
              booking.destination_id || null,

            transport_id:
              booking.transport_id || null,

            item_type:
              booking.item_type,

            item_name:
              booking.item_name,

            booking_date:
              f.tgl,

            guests:
              Number(f.jml),

            total_price:
              total,

            currency:
              booking.mataUang ||
              'IDR',

            notes:
              f.catatan
          })
        }
      )

      const result =
        await response.json()

      if (!response.ok) {
        alert(
          result.message ||
          'Booking gagal dibuat.'
        )

        return
      }

      setBooking({
        ...booking,
        ...f,
        jml:
          Number(f.jml),
        total,
        booking_id:
          result.data.id
      })

      alert(
        'Booking berhasil dibuat!'
      )

      nav('/pembayaran')

    } catch (error) {
      console.error(error)

      alert(
        'Tidak dapat terhubung ke server.'
      )

    } finally {
      setLoading(false)
    }
  }

  const today =
    new Date()
      .toISOString()
      .split('T')[0]

  return (
    <>
      <PageHead
        title="Booking"
        desc="Lengkapi data pemesan dan pilih tanggal booking."
      />

      <div className="grid md:grid-cols-[1fr_18rem] gap-5 items-start">

        <form
          onSubmit={lanjut}
          className="card p-5 space-y-4"
        >

          <Field
            id="nama"
            label="Nama pemesan"
            required
            value={f.nama}
            onChange={set('nama')}
          />

          <div className="grid grid-cols-2 gap-4">

            <Field
              id="tgl"
              label="Tanggal booking"
              type="date"
              name="tgl"
              required
              value={f.tgl}
              min={today}
              onChange={set('tgl')}
            />

            <Field
              id="jml"
              label={`Jumlah ${booking.satuan}`}
              type="number"
              min="1"
              max="20"
              required
              value={f.jml}
              onChange={set('jml')}
            />

          </div>

          <div>
            <label htmlFor="cat">
              Catatan
            </label>

            <textarea
              id="cat"
              rows="3"
              className="input"
              placeholder="Alergi makanan, kebutuhan khusus, dll."
              value={f.catatan}
              onChange={set('catatan')}
            />
          </div>

          <button
            type="submit"
            className="btn btn-p"
            disabled={loading}
          >
            {loading
              ? 'Menyimpan booking...'
              : 'Lanjut ke pembayaran'}
          </button>

        </form>

        <aside
          className="card p-4 md:sticky md:top-20"
          aria-label="Ringkasan"
        >

          <h2 className="mb-2">
            Ringkasan
          </h2>

          <p className="font-semibold">
            {booking.judul}
          </p>

          <p className="text-mute text-sm">
            {formatHarga(booking.harga)}
            {' × '}
            {f.jml}{' '}
            {booking.satuan}
          </p>

          <p className="border-t border-line mt-3 pt-3 flex justify-between font-bold">

            <span>
              Total
            </span>

            <span className="text-accent">
              {formatHarga(total)}
            </span>

          </p>

        </aside>

      </div>
    </>
  )
}