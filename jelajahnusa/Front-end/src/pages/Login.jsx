import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import API_URL from '../services/api'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const { setUser } = useApp()

    async function handleLogin(e) {
        e.preventDefault()

        setError('')
        setLoading(true)

        try {
            const response = await fetch(
                `${API_URL}/auth/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            )

            const result = await response.json()

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    'Email atau password salah'
                )
            }

            localStorage.setItem(
                'token',
                result.data.token
            )

            localStorage.setItem(
                'jn_user',
                JSON.stringify(result.data.user)
            )

            setUser(result.data.user)

            navigate('/')
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden">

            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('/images/pemandangan.jpg')"
                }}
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-slate-950/65" />

            {/* Soft gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/30 to-emerald-950/50" />

            {/* Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">

                <div className="w-full max-w-[430px]">

                    {/* Card */}
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">

                        {/* Top accent */}
                        <div className="h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-cyan-400" />

                        <div className="p-6 sm:p-8">

                            {/* Brand */}
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 text-lg font-extrabold text-slate-900 hover:opacity-90 transition"
                            >
                                <span className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                                    <i
                                        className="fa-solid fa-compass text-emerald-600"
                                        aria-hidden="true"
                                    />
                                </span>

                                <span>NusaTrip</span>
                            </Link>

                            {/* Heading */}
                            <div className="mt-8">
                                <p className="text-emerald-600 text-sm font-semibold mb-2">
                                    Selamat datang kembali
                                </p>

                                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                                    Masuk ke akunmu
                                </h1>

                                <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                                    Masuk untuk melanjutkan perjalanan
                                    dan menemukan destinasi favoritmu.
                                </p>
                            </div>

                            {/* Form */}
                            <form
                                onSubmit={handleLogin}
                                className="mt-7 space-y-5"
                            >

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-semibold text-slate-700 mb-2"
                                    >
                                        Email
                                    </label>

                                    <div className="relative">
                                        <i
                                            className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                            aria-hidden="true"
                                        />

                                        <input
                                            id="email"
                                            className="w-full h-12 rounded-xl border border-slate-200 bg-white text-slate-900 pl-11 pr-4 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                                            type="email"
                                            placeholder="nama@email.com"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            autoComplete="email"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-semibold text-slate-700"
                                        >
                                            Password
                                        </label>
                                    </div>

                                    <div className="relative">
                                        <i
                                            className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                            aria-hidden="true"
                                        />

                                        <input
                                            id="password"
                                            className="w-full h-12 rounded-xl border border-slate-200 bg-white text-slate-900 pl-11 pr-12 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder="Minimal 6 karakter"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            autoComplete="current-password"
                                            minLength={6}
                                            required
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    !showPassword
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                                            aria-label={
                                                showPassword
                                                    ? 'Sembunyikan password'
                                                    : 'Tampilkan password'
                                            }
                                        >
                                            <i
                                                className={`fa-solid ${showPassword
                                                        ? 'fa-eye-slash'
                                                        : 'fa-eye'
                                                    }`}
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div
                                        role="alert"
                                        className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                                    >
                                        <i
                                            className="fa-solid fa-circle-exclamation mt-0.5"
                                            aria-hidden="true"
                                        />

                                        <span>{error}</span>
                                    </div>
                                )}

                                {/* Submit */}
                                <button
                                    className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold transition-all shadow-lg shadow-emerald-500/10 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <i
                                                className="fa-solid fa-spinner fa-spin"
                                                aria-hidden="true"
                                            />

                                            Sedang masuk...
                                        </>
                                    ) : (
                                        <>
                                            <i
                                                className="fa-solid fa-right-to-bracket"
                                                aria-hidden="true"
                                            />

                                            Masuk ke NusaTrip
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Register */}
                            <div className="relative my-7">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200" />
                                </div>

                                <div className="relative flex justify-center">
                                    <span className="bg-white px-3 text-xs text-slate-400">
                                        atau
                                    </span>
                                </div>
                            </div>

                            <p className="text-center text-sm text-slate-600">
                                Belum punya akun?{' '}

                                <Link
                                    to="/register"
                                    className="text-emerald-600 font-bold hover:text-emerald-700 transition"
                                >
                                    Daftar sekarang
                                </Link>
                            </p>

                        </div>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-xs text-white/70 mt-5">
                        Jelajahi Indonesia, buat perjalananmu sendiri.
                    </p>

                </div>
            </div>
        </div>
    )
}