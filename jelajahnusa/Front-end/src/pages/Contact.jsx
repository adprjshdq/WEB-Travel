import { useState } from 'react'

import { useApp } from '../context/AppContext'

import {
  Field,
  PageHead
} from '../components/ui'

export default function Contact() {
  const {
    messages,
    setMessages
  } = useApp()

  const [f, setF] = useState({
    nama: '',
    email: '',
    pesan: ''
  })

  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const set = (key) => (e) => {
    setF((prev) => ({
      ...prev,
      [key]: e.target.value
    }))

    setSent(false)
  }

  const kirimPesan = (e) => {
    e.preventDefault()

    if (!f.nama.trim()) {
      alert('Nama wajib diisi.')
      return
    }

    if (!f.email.trim()) {
      alert('Email wajib diisi.')
      return
    }

    if (!f.pesan.trim()) {
      alert('Pesan wajib diisi.')
      return
    }

    if (f.pesan.trim().length < 10) {
      alert('Pesan minimal 10 karakter.')
      return
    }

    setSending(true)

    const pesanBaru = {
      nama: f.nama.trim(),
      email: f.email.trim(),
      pesan: f.pesan.trim(),
      tgl: Date.now()
    }

    setMessages([
      ...messages,
      pesanBaru
    ])

    setF({
      nama: '',
      email: '',
      pesan: ''
    })

    setTimeout(() => {
      setSending(false)
      setSent(true)
    }, 300)
  }

  return (
    <>
      <PageHead
        title="Hubungi kami"
        desc="Tim kami membalas dalam 1 hari kerja."
      />

      <div className="grid gap-5 md:grid-cols-[1fr_16rem]">

        {/* FORM KONTAK */}
        <form
          className="card space-y-4 p-5"
          onSubmit={kirimPesan}
        >
          <div>
            <h2>
              Kirim pesan
            </h2>

            <p className="mt-1 text-sm text-mute">
              Punya pertanyaan atau membutuhkan
              bantuan? Hubungi tim JelajahNusa.
            </p>
          </div>

          <Field
            id="contact-name"
            label="Nama"
            required
            value={f.nama}
            onChange={set('nama')}
          />

          <Field
            id="contact-email"
            label="Email"
            type="email"
            required
            value={f.email}
            onChange={set('email')}
          />

          <div>
            <label htmlFor="contact-message">
              Pesan
            </label>

            <textarea
              id="contact-message"
              rows="5"
              required
              minLength="10"
              className="input"
              placeholder="Tulis pesan Anda..."
              value={f.pesan}
              onChange={set('pesan')}
            />
          </div>

          <button
            type="submit"
            className="btn btn-p"
            disabled={sending}
          >
            <i
              className={
                sending
                  ? 'fa-solid fa-spinner fa-spin'
                  : 'fa-solid fa-paper-plane'
              }
              aria-hidden="true"
            />

            {sending
              ? 'Mengirim...'
              : 'Kirim pesan'}
          </button>

          <p
            role="status"
            className="min-h-5 text-sm text-accent"
          >
            {sent &&
              'Pesan terkirim. Kami akan membalas lewat email.'}
          </p>
        </form>

        {/* INFORMASI KONTAK */}
        <address className="card h-fit space-y-4 p-4 text-sm not-italic">

          <div>
            <h2>
              Kontak
            </h2>

            <p className="mt-1 text-mute">
              Informasi kontak JelajahNusa.
            </p>
          </div>

          <div className="space-y-3">

            <p className="flex items-start gap-2">
              <i
                className="fa-solid fa-location-dot w-5 shrink-0 pt-1 text-accent"
                aria-hidden="true"
              />

              <span>
                Tasikmalaya, Jawa Barat, Indonesia
                6 October 2026
              </span>
            </p>

            <p className="flex items-center gap-2">
              <i
                className="fa-brands fa-whatsapp w-5 shrink-0 text-accent"
                aria-hidden="true"
              />

              <span>
                0858-9022-7322
              </span>
            </p>

            <p className="flex items-center gap-2 break-all">
              <i
                className="fa-solid fa-envelope w-5 shrink-0 text-accent"
                aria-hidden="true"
              />

              <span>
                NUSATRAVEL@jelajahnusa.id
              </span>
            </p>

          </div>

          <div className="border-t border-line pt-3">
            <p className="text-mute">
              Senin sampai Sabtu,
              <br />
              08.00 - 00.00 WIB
            </p>
          </div>

        </address>

      </div>
    </>
  )
}