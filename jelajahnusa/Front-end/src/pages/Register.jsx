import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API_URL from '../services/api'

export default function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    async function handleRegister(e) {
        e.preventDefault()

        setError('')
        setSuccess('')

        if (password !== confirmPassword) {
            setError(
                'Password dan konfirmasi password tidak sama.'
            )
            return
        }

        if (password.length < 6) {
            setError(
                'Password minimal 6 karakter.'
            )
            return
        }

        setLoading(true)

        try {
            const response = await fetch(
                `${API_URL}/auth/register`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            )

            const result = await response.json()

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    'Registrasi gagal'
                )
            }

            setSuccess(
                'Registrasi berhasil! Mengalihkan ke Login...'
            )

            setTimeout(() => {
                navigate('/login')
            }, 1000)

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

            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/30 to-emerald-950/50" />

            {/* Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">

                <div className="w-full max-w-[430px]">

                    {/* Card */}
                    <div className="rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-2xl overflow-hidden">

                        {/* Accent */}
                        <div className="h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-cyan-400" />

                        <div className="p-6 sm:p-8">

                            {/* Brand */}
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 text-lg font-extrabold text-white hover:opacity-90 transition"
                            >
                                <span className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
                                    <i
                                        className="fa-solid fa-compass text-emerald-400"
                                        aria-hidden="true"
                                    />
                                </span>

                                <span>NusaTrip</span>
                            </Link>

                            {/* Heading */}
                            <div className="mt-7">
                                <p className="text-emerald-400 text-sm font-semibold mb-2">
                                    Mulai perjalananmu
                                </p>

                                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                                    Buat akun baru
                                </h1>

                                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                                    Daftar sekarang dan mulai
                                    menjelajahi destinasi Indonesia.
                                </p>
                            </div>

                            {/* Form */}
                            <form
                                onSubmit={handleRegister}
                                className="mt-7 space-y-4"
                            >

                                {/* Name */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-semibold text-slate-300 mb-2"
                                    >
                                        Nama lengkap
                                    </label>

                                    <div className="relative">
                                        <i
                                            className="fa-solid fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                            aria-hidden="true"
                                        />

                                        <input
                                            id="name"
                                            className="w-full h-12 rounded-xl border border-slate-700 bg-slate-900/80 text-white pl-11 pr-4 outline-none transition placeholder:text-slate-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                                            type="text"
                                            placeholder="Nama lengkap"
                                            value={name}
                                            onChange={(e) =>
                                                setName(
                                                    e.target.value
                                                )
                                            }
                                            autoComplete="name"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-semibold text-slate-300 mb-2"
                                    >
                                        Email
                                    </label>

                                    <div className="relative">
                                        <i
                                            className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                            aria-hidden="true"
                                        />

                                        <input
                                            id="email"
                                            className="w-full h-12 rounded-xl border border-slate-700 bg-slate-900/80 text-white pl-11 pr-4 outline-none transition placeholder:text-slate-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                                            type="email"
                                            placeholder="nama@email.com"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(
                                                    e.target.value
                                                )
                                            }
                                            autoComplete="email"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-semibold text-slate-300 mb-2"
                                    >
                                        Password
                                    </label>

                                    <div className="relative">
                                        <i
                                            className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                            aria-hidden="true"
                                        />

                                        <input
                                            id="password"
                                            className="w-full h-12 rounded-xl border border-slate-700 bg-slate-900/80 text-white pl-11 pr-12 outline-none transition placeholder:text-slate-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder="Minimal 6 karakter"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(
                                                    e.target.value
                                                )
                                            }
                                            autoComplete="new-password"
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
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition"
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

                                {/* Confirm Password */}
                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-semibold text-slate-300 mb-2"
                                    >
                                        Konfirmasi password
                                    </label>

                                    <div className="relative">
                                        <i
                                            className="fa-solid fa-shield-halved absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                            aria-hidden="true"
                                        />

                                        <input
                                            id="confirmPassword"
                                            className="w-full h-12 rounded-xl border border-slate-700 bg-slate-900/80 text-white pl-11 pr-12 outline-none transition placeholder:text-slate-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                                            type={
                                                showConfirmPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder="Ulangi password"
                                            value={confirmPassword}
                                            onChange={(e) =>
                                                setConfirmPassword(
                                                    e.target.value
                                                )
                                            }
                                            autoComplete="new-password"
                                            minLength={6}
                                            required
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition"
                                            aria-label={
                                                showConfirmPassword
                                                    ? 'Sembunyikan password'
                                                    : 'Tampilkan password'
                                            }
                                        >
                                            <i
                                                className={`fa-solid ${showConfirmPassword
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

                                {/* Success */}
                                {success && (
                                    <div
                                        role="status"
                                        className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
                                    >
                                        <i
                                            className="fa-solid fa-circle-check mt-0.5"
                                            aria-hidden="true"
                                        />

                                        <span>{success}</span>
                                    </div>
                                )}

                                {/* Submit */}
                                <button
                                    className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <i
                                                className="fa-solid fa-spinner fa-spin"
                                                aria-hidden="true"
                                            />

                                            Membuat akun...
                                        </>
                                    ) : (
                                        <>
                                            <i
                                                className="fa-solid fa-user-plus"
                                                aria-hidden="true"
                                            />

                                            Buat akun
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Login */}
                            <div className="relative my-7">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-800" />
                                </div>

                                <div className="relative flex justify-center">
                                    <span className="bg-slate-950 px-3 text-xs text-slate-600">
                                        atau
                                    </span>
                                </div>
                            </div>

                            <p className="text-center text-sm text-slate-400">
                                Sudah punya akun?{' '}

                                <Link
                                    to="/login"
                                    className="text-emerald-400 font-bold hover:text-emerald-300 transition"
                                >
                                    Masuk sekarang
                                </Link>
                            </p>

                        </div>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-xs text-white/50 mt-5">
                        Satu akun untuk semua perjalananmu di NusaTrip.
                    </p>

                </div>
            </div>
        </div>
    )
}