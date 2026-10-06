import { useEffect, useRef, useState } from 'react'

import { PageHead } from '../components/ui'

import { getImageUrl } from '../utils/imageUrl'

const API_URL = 'http://localhost:5001/api'

const tinggi = [
  'h-40',
  'h-56',
  'h-48',
  'h-64',
  'h-44',
  'h-52'
]

export default function Gallery() {
  const [destinations, setDestinations] =
    useState([])

  const [sel, setSel] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const ref = useRef(null)

  // ===============================
  // AMBIL DESTINASI DARI DATABASE
  // ===============================
  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const response = await fetch(
          `${API_URL}/destinations`
        )

        const result =
          await response.json()

        if (!response.ok) {
          throw new Error(
            result.message ||
            'Gagal mengambil destinasi'
          )
        }

        if (result.success) {
          setDestinations(
            result.data || []
          )
        }
      } catch (error) {
        console.error(
          'Gagal mengambil destinasi:',
          error
        )
      } finally {
        setLoading(false)
      }
    }

    loadDestinations()
  }, [])

  // ===============================
  // BUKA / TUTUP DIALOG
  // ===============================
  useEffect(() => {
    const dialog = ref.current

    if (!dialog) {
      return
    }

    if (sel) {
      if (!dialog.open) {
        dialog.showModal()
      }
    } else {
      if (dialog.open) {
        dialog.close()
      }
    }
  }, [sel])

  // ===============================
  // FORMAT FOTO
  // ===============================
  const foto = destinations.map(
    (destination, index) => ({
      ...destination,

      k: index,

      label: `${destination.name}, ${destination.location}`,

      image: getImageUrl(
        destination.image
      )
    })
  )

  // ===============================
  // FALLBACK IMAGE
  // ===============================
  const handleImageError = (e) => {
    e.currentTarget.src =
      '/images/Labuan bajo copy.jpg'
  }

  return (
    <>
      <PageHead
        title="Galeri"
        desc="Foto destinasi wisata JelajahNusa."
      />

      {/* ===============================
                LOADING
            =============================== */}
      {loading && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(
            (item) => (
              <div
                key={item}
                className="card animate-pulse overflow-hidden"
              >
                <div
                  className={`bg-panel-soft ${tinggi[item - 1]}`}
                />

                <div className="space-y-2 p-3">
                  <div className="h-4 w-2/3 rounded bg-panel-soft" />
                  <div className="h-3 w-1/2 rounded bg-panel-soft" />
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* ===============================
                EMPTY
            =============================== */}
      {!loading &&
        foto.length === 0 && (
          <div className="card p-6 text-center">
            <i
              className="fa-solid fa-images mb-3 text-3xl text-mute"
              aria-hidden="true"
            />

            <p className="font-semibold">
              Belum ada destinasi
            </p>

            <p className="mt-1 text-sm text-mute">
              Foto destinasi akan muncul
              di sini setelah tersedia.
            </p>
          </div>
        )}

      {/* ===============================
                GALERI
            =============================== */}
      {!loading &&
        foto.length > 0 && (
          <ul className="columns-2 gap-3 md:columns-3">
            {foto.map((f) => (
              <li
                key={f.id}
                className="mb-3 break-inside-avoid"
              >
                <button
                  type="button"
                  className="card block w-full overflow-hidden text-left transition hover:border-accent/50"
                  onClick={() =>
                    setSel(f)
                  }
                  aria-label={`Perbesar foto ${f.label}`}
                >
                  <img
                    src={f.image}
                    alt={f.label}
                    onError={
                      handleImageError
                    }
                    className={`block w-full ${tinggi[
                      f.k %
                      tinggi.length
                      ]
                      } object-cover transition duration-300 hover:scale-[1.02]`}
                  />

                  <div className="p-3">
                    <p className="font-semibold">
                      {f.name}
                    </p>

                    <p className="mt-1 text-xs text-mute">
                      <i
                        className="fa-solid fa-location-dot mr-1"
                        aria-hidden="true"
                      />

                      {f.location}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}

      {/* ===============================
                DIALOG FOTO
            =============================== */}
      <dialog
        ref={ref}
        onClose={() =>
          setSel(null)
        }
        className="m-auto w-[min(90vw,40rem)] rounded-lg border border-line bg-panel p-3 text-ink backdrop:bg-black/70"
        aria-label="Foto diperbesar"
      >
        {sel && (
          <>
            <img
              src={sel.image}
              alt={sel.label}
              onError={
                handleImageError
              }
              className="h-80 w-full rounded-lg object-cover"
            />

            <div className="mt-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold">
                  {sel.name}
                </p>

                <p className="mt-1 text-sm text-mute">
                  <i
                    className="fa-solid fa-location-dot mr-1"
                    aria-hidden="true"
                  />

                  {sel.location}
                </p>
              </div>

              <button
                type="button"
                className="btn shrink-0"
                onClick={() =>
                  setSel(null)
                }
              >
                <i
                  className="fa-solid fa-xmark"
                  aria-hidden="true"
                />

                Tutup
              </button>
            </div>
          </>
        )}
      </dialog>
    </>
  )
}