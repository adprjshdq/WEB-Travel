import { Link } from 'react-router-dom'

import {
  destinations,
  packages,
  hotels
} from '../data/data'

import { useApp } from '../context/AppContext'

import {
  PageHead,
  rupiah
} from '../components/ui'

export default function Wishlist() {
  const {
    wish,
    toggleWish
  } = useApp()

  const semua = [
    ...destinations.map((d) => ({
      ...d,
      tipe: 'Destinasi',
      to: '/destinasi',
      nama: d.nama || d.name
    })),

    ...packages.map((p) => ({
      ...p,
      tipe: 'Paket',
      to: '/paket',
      nama: p.nama || p.name
    })),

    ...hotels.map((h) => ({
      ...h,
      tipe: 'Hotel',
      to: '/hotel',
      nama: h.nama || h.name
    }))
  ]

  const items = semua.filter((item) =>
    wish.includes(item.id)
  )

  return (
    <>
      <PageHead
        title="Wishlist"
        desc="Simpan yang menarik, bandingkan nanti."
      />

      {items.length === 0 ? (
        <div className="card p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
              <i
                className="fa-solid fa-heart"
                aria-hidden="true"
              />
            </div>

            <div>
              <p className="font-semibold">
                Wishlist masih kosong
              </p>

              <p className="mt-1 text-sm text-mute">
                Tekan ikon hati pada destinasi,
                paket, atau hotel yang menarik.
              </p>
            </div>
          </div>

          <Link
            to="/destinasi"
            className="btn btn-p mt-4"
          >
            <i
              className="fa-solid fa-compass"
              aria-hidden="true"
            />
            Jelajahi Destinasi
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={`${item.tipe}-${item.id}`}
              className="card flex flex-wrap items-center gap-3 p-3"
            >
              <span className="chip w-24 justify-center !cursor-default">
                {item.tipe}
              </span>

              <Link
                to={item.to}
                className="min-w-0 flex-1 font-semibold transition-colors hover:text-accent"
              >
                {item.nama}
              </Link>

              <span className="text-sm font-semibold text-accent">
                {item.harga != null
                  ? rupiah(item.harga)
                  : '-'}
              </span>

              <button
                type="button"
                className="btn"
                onClick={() =>
                  toggleWish(item.id)
                }
                aria-label={`Hapus ${item.nama} dari wishlist`}
                title="Hapus dari wishlist"
              >
                <i
                  className="fa-solid fa-trash"
                  aria-hidden="true"
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}