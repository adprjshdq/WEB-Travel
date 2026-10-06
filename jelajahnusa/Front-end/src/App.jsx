import { useState, useEffect } from 'react'

import {
  Routes,
  Route,
  useLocation,
  Navigate
} from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

import Home from './pages/Home'
import Destinations from './pages/Destinations'
import Packages from './pages/Packages'
import Hotels from './pages/Hotels'
import Transport from './pages/Transport'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import About from './pages/About'
import Faq from './pages/Faq'

import Booking from './pages/Booking'
import Payment from './pages/Payment'
import Account from './pages/Account'
import Wishlist from './pages/Wishlist'
import Reviews from './pages/Reviews'
import BookingDetail from './pages/BookingDetail'

import AdminDashboard from './pages/AdminDashboard'
import AdminDestinations from './pages/AdminDestinations'
import AdminUsers from './pages/AdminUsers'
import AdminBooking from './pages/AdminBooking'
import AdminHotels from './pages/AdminHotels'
import AdminTransport from './pages/AdminTransport'

import PageTransition from './components/PageTransition'


// =====================================
// PROTECTED ROUTE
// =====================================

function ProtectedRoute({ children }) {
  const token =
    localStorage.getItem('token')

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  return children
}


// =====================================
// ADMIN ROUTE
// =====================================

function AdminRoute({ children }) {
  const token =
    localStorage.getItem('token')

  const user = JSON.parse(
    localStorage.getItem('jn_user') || 'null'
  )

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  if (user?.role !== 'admin') {
    return (
      <Navigate
        to="/"
        replace
      />
    )
  }

  return children
}


// =====================================
// APP
// =====================================

export default function App() {
  const { pathname } =
    useLocation()

  const [open, setOpen] =
    useState(false)

  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register'


  // =====================================
  // PAGE EFFECT
  // =====================================

  useEffect(() => {
    setOpen(false)

    window.scrollTo(
      0,
      0
    )

    document.documentElement.classList.toggle(
      'login-page',
      isAuthPage
    )

    document.body.classList.toggle(
      'login-page',
      isAuthPage
    )

    return () => {
      document.documentElement.classList.remove(
        'login-page'
      )

      document.body.classList.remove(
        'login-page'
      )
    }
  }, [
    pathname,
    isAuthPage
  ])


  return (
    <>
      {/* =====================================
                SKIP LINK
            ===================================== */}

      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:top-2 focus:left-2 btn btn-p"
      >
        Lewati ke konten
      </a>


      {/* =====================================
                NAVBAR & SIDEBAR
            ===================================== */}

      {!isAuthPage && (
        <>
          <Navbar
            open={open}
            onMenu={() =>
              setOpen(!open)
            }
          />

          <Sidebar
            open={open}
            onClose={() =>
              setOpen(false)
            }
          />
        </>
      )}


      {/* =====================================
                MAIN
            ===================================== */}

      <main
        id="konten"
        className={
          isAuthPage
            ? 'h-screen overflow-hidden'
            : 'pt-14 lg:pl-60'
        }
      >
        <div
          className={
            isAuthPage
              ? 'w-full h-full'
              : 'max-w-5xl mx-auto p-4 sm:p-6'
          }
        >

          <PageTransition>

            {/* =====================================
                            SEMUA ROUTE HANYA SATU ROUTES
                        ===================================== */}

            <Routes>

              {/* =================================
                                AUTH
                            ================================= */}

              <Route
                path="/login"
                element={<Login />}
              />

              <Route
                path="/register"
                element={<Register />}
              />


              {/* =================================
                                PUBLIC
                            ================================= */}

              <Route
                path="/"
                element={<Home />}
              />

              <Route
                path="/destinasi"
                element={<Destinations />}
              />

              <Route
                path="/paket"
                element={<Packages />}
              />

              <Route
                path="/hotel"
                element={<Hotels />}
              />

              <Route
                path="/transportasi"
                element={<Transport />}
              />

              {/* GALERI */}
              <Route
                path="/galeri"
                element={<Gallery />}
              />

              {/* KONTAK */}
              <Route
                path="/kontak"
                element={<Contact />}
              />

              <Route
                path="/tentang"
                element={<About />}
              />

              <Route
                path="/faq"
                element={<Faq />}
              />


              {/* =================================
                                PROTECTED USER
                            ================================= */}

              <Route
                path="/booking"
                element={
                  <ProtectedRoute>
                    <Booking />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/pembayaran"
                element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/akun"
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <Wishlist />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/review"
                element={
                  <ProtectedRoute>
                    <Reviews />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/booking/:id"
                element={
                  <ProtectedRoute>
                    <BookingDetail />
                  </ProtectedRoute>
                }
              />


              {/* =================================
                                ADMIN
                            ================================= */}

              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/destinasi"
                element={
                  <AdminRoute>
                    <AdminDestinations />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <AdminUsers />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/booking"
                element={
                  <AdminRoute>
                    <AdminBooking />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/penginapan"
                element={
                  <AdminRoute>
                    <AdminHotels />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/transportasi"
                element={
                  <AdminRoute>
                    <AdminTransport />
                  </AdminRoute>
                }
              />


              {/* =================================
                                404
                            ================================= */}

              <Route
                path="*"
                element={
                  <div className="card p-6 text-center">
                    <i
                      className="fa-solid fa-compass mb-3 text-3xl text-mute"
                      aria-hidden="true"
                    />

                    <h2>
                      Halaman tidak ditemukan
                    </h2>

                    <p className="mt-2 text-sm text-mute">
                      Halaman yang kamu cari
                      tidak tersedia.
                    </p>
                  </div>
                }
              />

            </Routes>

          </PageTransition>

        </div>
      </main>
    </>
  )
}