import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { PageHead, WishBtn, rupiah } from '../components/ui'

import API_URL from '../services/api'

export default function Transport() {
  const { setBooking } = useApp()
  const nav = useNavigate()

  const [transports, setTransports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTransports = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${API_URL}/transports`
        )

        const result =
          await response.json()

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
            'Gagal mengambil data transportasi'
          )
        }

        setTransports(result.data)

      } catch (err) {
        console.error(err)

        setError(
          err.message ||
          'Tidak dapat mengambil data transportasi'
        )

      } finally {
        setLoading(false)
      }
    }

    fetchTransports()
  }, [])

  const pesan = (transport) => {
    const harga = Number(
      transport.price || 0
    )

    if (harga <= 0) {
      alert(
        'Harga transportasi belum tersedia.'
      )
      return
    }

    setBooking({
      item_type: 'transport',

      item_name:
        `${transport.jenis} — ${transport.rute}`,

      judul:
        `${transport.jenis} — ${transport.rute}`,

      harga,

      mataUang: 'IDR',

      satuan: 'orang',

      transport_id:
        transport.id,

      transport: transport
    })

    nav('/booking')
  }

  return (
    <>
      <PageHead
        title="Transportasi"
        desc="Pilih transportasi untuk perjalanan Anda."
      />

      {loading && (
        <div className="card p-5 text-center">
          Memuat data transportasi...
        </div>
      )}

      {!loading && error && (
        <div className="card p-5">
          <p className="text-red-400">
            {error}
          </p>
        </div>
      )}

      {!loading &&
        !error &&
        transports.length === 0 && (
          <div className="card p-5 text-center">
            Belum ada data transportasi.
          </div>
        )}

      {!loading &&
        !error &&
        transports.length > 0 && (
          <div className="grid gap-4">

            {transports.map(
              (transport) => (
                <article
                  key={
                    transport.id
                  }
                  className="card p-4"
                >

                  <div className="flex flex-wrap items-center gap-4">

                    <div className="w-12 h-12 rounded-xl bg-panel border border-line flex items-center justify-center">

                      <i
                        className={
                          transport.jenis ===
                            'Pesawat'
                            ? 'fa-solid fa-plane text-accent text-xl'
                            : transport.jenis ===
                              'Kereta'
                              ? 'fa-solid fa-train text-accent text-xl'
                              : transport.jenis ===
                                'Bus'
                                ? 'fa-solid fa-bus text-accent text-xl'
                                : 'fa-solid fa-car text-accent text-xl'
                        }
                        aria-hidden="true"
                      />

                    </div>

                    <div className="flex-1 min-w-52">

                      <h2>
                        {
                          transport.jenis
                        }
                      </h2>

                      <p className="font-medium">
                        {
                          transport.rute
                        }
                      </p>

                      <p className="text-mute text-sm">
                        Operator:{' '}
                        {
                          transport.operator
                        }
                      </p>

                      <p className="text-mute text-sm">
                        Jadwal:{' '}
                        {
                          transport.jam
                        }
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="text-accent font-bold text-lg">
                        {rupiah(
                          Number(
                            transport.price
                          )
                        )}
                      </p>

                      <p className="text-mute text-sm">
                        / orang
                      </p>

                    </div>

                    <WishBtn
                      id={
                        `transport-${transport.id}`
                      }
                      nama={
                        `${transport.jenis} — ${transport.rute}`
                      }
                    />

                    <button
                      className="btn btn-p"
                      onClick={() =>
                        pesan(
                          transport
                        )
                      }
                    >
                      Pesan
                    </button>

                  </div>

                </article>
              )
            )}

          </div>
        )}
    </>
  )
}