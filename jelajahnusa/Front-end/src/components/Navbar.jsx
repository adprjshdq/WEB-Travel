import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Navbar({ onMenu, open }) {
  const { wish, user } = useApp()

  const firstName =
    (user?.name || user?.nama || 'Akun').split(' ')[0]

  return (
    <header className="fixed top-0 inset-x-0 h-14 z-40 bg-bg/95 backdrop-blur border-b border-line flex items-center gap-3 px-4">

      {/* Mobile menu */}
      <button
        type="button"
        className="btn lg:hidden !px-2.5"
        onClick={onMenu}
        aria-expanded={open}
        aria-controls="sidebar"
        aria-label={open ? 'Tutup menu' : 'Buka menu'}
      >
        <i
          className={`fa-solid ${open ? 'fa-xmark' : 'fa-bars'}`}
          aria-hidden="true"
        />
      </button>

      {/* Logo */}
      <Link
        to="/"
        className="font-head font-extrabold text-lg flex items-center"
      >
        <i
          className="fa-solid fa-compass text-accent mr-2"
          aria-hidden="true"
        />

        <span>NUSATRAVEL</span>
      </Link>

      {/* Right menu */}
      <nav
        className="ml-auto flex items-center gap-2"
        aria-label="Pintasan"
      >
        {/* Admin badge */}
        {user?.role === 'admin' && (
          <Link
            to="/admin"
            className="hidden sm:flex items-center gap-2 btn"
            title="Dashboard Admin"
          >
            <i
              className="fa-solid fa-gauge-high text-accent"
              aria-hidden="true"
            />
            <span>Admin</span>
          </Link>
        )}

        {/* Wishlist */}
        <Link
          to="/wishlist"
          className="btn flex items-center gap-2"
          aria-label={`Wishlist, ${wish.length} item`}
        >
          <i
            className="fa-solid fa-heart"
            aria-hidden="true"
          />

          {wish.length > 0 && (
            <span className="text-accent font-semibold">
              {wish.length}
            </span>
          )}
        </Link>

        {/* Account */}
        <Link
          to="/akun"
          className="btn flex items-center gap-2"
        >
          <i
            className="fa-solid fa-user"
            aria-hidden="true"
          />

          <span className="hidden sm:inline">
            {firstName}
          </span>
        </Link>
      </nav>
    </header>
  )
}