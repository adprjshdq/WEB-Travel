import { useApp } from '../context/AppContext'

export const rupiah = (n) => 'Rp' + n.toLocaleString('id-ID')

export const PageHead = ({ title, desc, children }) => (
  <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
    <div><h1>{title}</h1>{desc && <p className="text-mute max-w-xl">{desc}</p>}</div>
    {children}
  </div>
)

// Placeholder gambar. Ganti dengan <img> asli saat foto sudah tersedia.
export const Ph = ({ hue, label, className = 'h-32' }) => (
  <div className={`ph ${className}`} style={{ '--h': hue }} role="img" aria-label={label}>{label}</div>
)

export const Stars = ({ n }) => (
  <span className="text-amber-400 text-xs" aria-label={`Rating ${n} dari 5`}>
    {[1, 2, 3, 4, 5].map((i) => <i key={i} className={`${i <= Math.round(n) ? 'fa-solid' : 'fa-regular'} fa-star`} aria-hidden="true" />)}
  </span>
)

export function WishBtn({ id, nama }) {
  const { wish, toggleWish } = useApp()
  const on = wish.includes(id)
  return (
    <button className="btn !px-2.5" onClick={() => toggleWish(id)} aria-pressed={on} aria-label={`${on ? 'Hapus' : 'Simpan'} ${nama} ${on ? 'dari' : 'ke'} wishlist`}>
      <i className={`${on ? 'fa-solid text-accent' : 'fa-regular'} fa-heart`} aria-hidden="true" />
    </button>
  )
}

export const Field = ({ label, id, ...p }) => (
  <div><label htmlFor={id}>{label}</label><input id={id} className="input" {...p} /></div>
)
