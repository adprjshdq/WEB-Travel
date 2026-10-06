import { useState } from 'react'

import { packages } from '../data/data'

import { useApp } from '../context/AppContext'

import {
  PageHead,
  Stars
} from '../components/ui'

export default function Reviews() {
  const {
    reviews,
    setReviews,
    user
  } = useApp()

  const [f, setF] = useState({
    paket: packages[0]?.nama || '',
    bintang: 5,
    teks: ''
  })

  const totalReviews = reviews.length

  const avg =
    totalReviews > 0
      ? (
        reviews.reduce(
          (total, review) =>
            total + Number(review.bintang || 0),
          0
        ) / totalReviews
      ).toFixed(1)
      : '0.0'

  const kirim = (e) => {
    e.preventDefault()

    if (!user) {
      alert('Silakan login terlebih dahulu.')
      return
    }

    if (!f.teks.trim()) {
      alert('Silakan tulis pengalaman Anda.')
      return
    }

    if (f.teks.trim().length < 10) {
      alert(
        'Ulasan minimal 10 karakter.'
      )
      return
    }

    const reviewBaru = {
      id: Date.now(),
      nama:
        user.name ||
        user.nama ||
        'Pengguna',
      tgl: new Date()
        .toISOString()
        .slice(0, 10),
      paket: f.paket,
      bintang: Number(f.bintang),
      teks: f.teks.trim()
    }

    setReviews([
      reviewBaru,
      ...reviews
    ])

    setF({
      ...f,
      teks: ''
    })

    alert('Ulasan berhasil dikirim.')
  }

  return (
    <>
      <PageHead
        title="Review pelanggan"
        desc="Lihat pengalaman pelanggan dan bagikan pengalaman perjalanan Anda."
      />

      <div className="grid items-start gap-5 md:grid-cols-[1fr_20rem]">

        {/* ================= DAFTAR REVIEW ================= */}
        <div>

          <div className="card mb-4 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <b className="font-head text-3xl">
                  {avg}
                </b>

                <span className="ml-2">
                  <Stars
                    n={Number(avg)}
                  />
                </span>
              </div>

              <span className="text-sm text-mute">
                dari {totalReviews} ulasan
              </span>
            </div>
          </div>

          {totalReviews === 0 ? (
            <div className="card p-6 text-center">
              <i
                className="fa-solid fa-comments mb-3 text-3xl text-mute"
                aria-hidden="true"
              />

              <p className="font-semibold">
                Belum ada ulasan
              </p>

              <p className="mt-1 text-sm text-mute">
                Jadilah orang pertama yang memberikan
                ulasan.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="card p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <b>
                      {review.nama ||
                        'Pengguna'}
                    </b>

                    <Stars
                      n={Number(
                        review.bintang
                      )}
                    />
                  </div>

                  <p className="mb-2 mt-1 text-sm text-mute">
                    {review.paket ||
                      'Paket wisata'}
                    {' · '}
                    {review.tgl || '-'}
                  </p>

                  <p className="leading-7">
                    {review.teks}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ================= FORM REVIEW ================= */}
        <form
          onSubmit={kirim}
          className="card space-y-4 p-4 md:sticky md:top-20"
        >
          <div>
            <h2>
              Tulis ulasan
            </h2>

            <p className="mt-1 text-sm text-mute">
              Bagikan pengalaman perjalanan Anda.
            </p>
          </div>

          <div>
            <label htmlFor="rp">
              Paket
            </label>

            <select
              id="rp"
              className="input"
              value={f.paket}
              onChange={(e) =>
                setF({
                  ...f,
                  paket: e.target.value
                })
              }
            >
              {packages.map((p) => (
                <option
                  key={p.id}
                  value={p.nama}
                >
                  {p.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="rb">
              Penilaian
            </label>

            <select
              id="rb"
              className="input"
              value={f.bintang}
              onChange={(e) =>
                setF({
                  ...f,
                  bintang: Number(
                    e.target.value
                  )
                })
              }
            >
              {[5, 4, 3, 2, 1].map(
                (n) => (
                  <option
                    key={n}
                    value={n}
                  >
                    {n} bintang
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label htmlFor="rt">
              Pengalaman Anda
            </label>

            <textarea
              id="rt"
              rows="5"
              required
              minLength="10"
              className="input"
              placeholder="Ceritakan pengalaman perjalanan Anda..."
              value={f.teks}
              onChange={(e) =>
                setF({
                  ...f,
                  teks: e.target.value
                })
              }
            />
          </div>

          <button
            type="submit"
            className="btn btn-p w-full"
          >
            <i
              className="fa-solid fa-paper-plane"
              aria-hidden="true"
            />

            Kirim ulasan
          </button>
        </form>
      </div>
    </>
  )
}