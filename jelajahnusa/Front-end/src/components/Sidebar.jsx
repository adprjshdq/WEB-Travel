import { NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Sidebar({ open, onClose }) {
  const { user } = useApp()

  const groups = [
    [
      'Jelajahi',
      [
        ['/', 'fa-house', 'Beranda'],
        [
          '/destinasi',
          'fa-location-dot',
          'Destinasi'
        ],
        [
          '/paket',
          'fa-suitcase',
          'Paket wisata'
        ],
        [
          '/hotel',
          'fa-bed',
          'Penginapan'
        ],
        [
          '/transportasi',
          'fa-plane',
          'Transportasi'
        ],
        [
          '/galeri',
          'fa-image',
          'Galeri'
        ]
      ]
    ],

    [
      'Pesanan',
      [
        [
          '/booking',
          'fa-calendar-check',
          'Booking'
        ],
        [
          '/pembayaran',
          'fa-credit-card',
          'Pembayaran'
        ]
      ]
    ],

    [
      'Saya',
      [
        [
          '/akun',
          'fa-user',
          'Akun'
        ],
        [
          '/wishlist',
          'fa-heart',
          'Wishlist'
        ],
        [
          '/review',
          'fa-star',
          'Review'
        ]
      ]
    ],

    [
      'Bantuan',
      [
        [
          '/tentang',
          'fa-circle-info',
          'Tentang kami'
        ],
        [
          '/faq',
          'fa-circle-question',
          'FAQ'
        ],
        [
          '/kontak',
          'fa-envelope',
          'Kontak'
        ]
      ]
    ]
  ]

  // Menu khusus admin
  if (user?.role === 'admin') {
    groups.push([
      'Administrasi',
      [
        [
          '/admin',
          'fa-gauge-high',
          'Dashboard'
        ],
        [
          '/admin/users',
          'fa-users',
          'Kelola User'
        ],
        [
          '/admin/destinasi',
          'fa-map-location-dot',
          'Kelola Destinasi'
        ],
        [
          '/admin/penginapan',
          'fa-hotel',
          'Kelola Penginapan'
        ],
        [
          '/admin/transportasi',
          'fa-car',
          'Kelola Transportasi'
        ],
        [
          '/admin/booking',
          'fa-calendar-check',
          'Kelola Booking'
        ]
      ]
    ])
  }

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={onClose}
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`
                    fixed top-14 bottom-0 left-0 w-60 z-30
                    bg-bg border-r border-line
                    flex flex-col
                    transition-transform duration-200
                    ${open
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
          }
                `}
      >
        {/* User Info */}
        <div className="p-3 border-b border-line">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-panel">
            <div className="w-9 h-9 rounded-full bg-line flex items-center justify-center shrink-0">
              <i
                className="fa-solid fa-user text-accent"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">
                {user?.name ||
                  user?.nama ||
                  'Pengunjung'}
              </p>

              <p className="text-xs text-mute">
                {user?.role === 'admin'
                  ? 'Administrator'
                  : 'Pengguna'}
              </p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto p-3">
          <nav aria-label="Menu utama">
            {groups.map(
              ([title, links]) => (
                <div
                  key={title}
                  className="mb-5"
                >
                  <p className="px-2 mb-2 text-[11px] uppercase tracking-wider text-mute font-bold">
                    {title}
                  </p>

                  <div className="space-y-1">
                    {links.map(
                      ([
                        to,
                        icon,
                        label
                      ]) => (
                        <NavLink
                          key={to}
                          to={to}
                          end={
                            to ===
                            '/'
                          }
                          onClick={
                            onClose
                          }
                          className={({
                            isActive
                          }) => `
                                                        flex items-center gap-3
                                                        px-3 py-2
                                                        rounded-lg
                                                        text-sm
                                                        transition-all
                                                        ${isActive
                              ? 'bg-line text-accent font-semibold'
                              : 'text-mute hover:text-ink hover:bg-panel'
                            }
                                                    `}
                        >
                          <i
                            className={`fa-solid ${icon} w-4 text-center`}
                            aria-hidden="true"
                          />

                          <span>
                            {label}
                          </span>
                        </NavLink>
                      )
                    )}
                  </div>
                </div>
              )
            )}
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="p-3 border-t border-line">
          <p className="text-[11px] text-mute text-center">
            NUSATRAVEL
          </p>
        </div>
      </aside>
    </>
  )
}