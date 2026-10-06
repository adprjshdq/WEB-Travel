import { useEffect, useState } from 'react'

import API_URL from '../services/api'

export default function AdminUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user'
    })

    const [editingId, setEditingId] = useState(null)

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token')

            const response = await fetch(
                `${API_URL}/admin/users`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const result = await response.json()

            if (result.success) {
                setUsers(result.data)
            }
        } catch (error) {
            console.error(
                'Gagal mengambil data user:',
                error
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const resetForm = () => {
        setForm({
            name: '',
            email: '',
            password: '',
            role: 'user'
        })

        setEditingId(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const token = localStorage.getItem('token')

            const url = editingId
                ? `${API_URL}/admin/users/${editingId}`
                : `${API_URL}/admin/users`

            const method = editingId
                ? 'PUT'
                : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(form)
            })

            const result = await response.json()

            if (!response.ok) {
                alert(
                    result.message ||
                    'Terjadi kesalahan'
                )
                return
            }

            alert(
                editingId
                    ? 'User berhasil diperbarui'
                    : 'User berhasil ditambahkan'
            )

            resetForm()
            fetchUsers()
        } catch (error) {
            console.error(error)
            alert('Gagal menghubungi server')
        }
    }

    const handleEdit = (user) => {
        setEditingId(user.id)

        setForm({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role
        })

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    const handleDelete = async (id) => {
        if (!confirm('Yakin ingin menghapus user ini?')) {
            return
        }

        try {
            const token = localStorage.getItem('token')

            const response = await fetch(
                `${API_URL}/admin/users/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const result = await response.json()

            if (!response.ok) {
                alert(
                    result.message ||
                    'Gagal menghapus user'
                )
                return
            }

            alert('User berhasil dihapus')

            fetchUsers()
        } catch (error) {
            console.error(error)
            alert('Gagal menghubungi server')
        }
    }

    const filteredUsers = users.filter((user) => {
        const keyword = search.toLowerCase()

        return (
            user.name
                ?.toLowerCase()
                .includes(keyword) ||
            user.email
                ?.toLowerCase()
                .includes(keyword) ||
            user.role
                ?.toLowerCase()
                .includes(keyword)
        )
    })

    const formatDate = (date) => {
        if (!date) {
            return '-'
        }

        return new Date(date).toLocaleDateString(
            'id-ID',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }
        )
    }

    return (
        <div className="space-y-8">

            {/* HEADER */}
            <div>
                <p className="text-accent text-sm font-medium">
                    Administrator
                </p>

                <h1 className="mt-1">
                    Kelola User
                </h1>

                <p className="text-mute mt-2">
                    Tambah, edit, dan kelola akun pengguna NusaTrip.
                </p>
            </div>


            {/* FORM USER */}
            <section className="card p-5">

                <div className="flex items-center gap-3 mb-5">

                    <div className="w-11 h-11 rounded-xl bg-line flex items-center justify-center">
                        <i
                            className={`fa-solid ${editingId
                                    ? 'fa-user-pen'
                                    : 'fa-user-plus'
                                } text-accent`}
                        />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold">
                            {editingId
                                ? 'Edit User'
                                : 'Tambah User'}
                        </h2>

                        <p className="text-mute text-sm mt-1">
                            {editingId
                                ? 'Perbarui informasi akun pengguna.'
                                : 'Tambahkan akun pengguna baru.'}
                        </p>
                    </div>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="grid md:grid-cols-2 gap-4"
                >

                    {/* NAMA */}
                    <div>
                        <label className="block text-sm text-mute mb-2">
                            Nama
                        </label>

                        <input
                            className="input w-full"
                            name="name"
                            placeholder="Masukkan nama"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>


                    {/* EMAIL */}
                    <div>
                        <label className="block text-sm text-mute mb-2">
                            Email
                        </label>

                        <input
                            className="input w-full"
                            name="email"
                            type="email"
                            placeholder="Masukkan email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>


                    {/* PASSWORD */}
                    <div>
                        <label className="block text-sm text-mute mb-2">
                            Password
                        </label>

                        <input
                            className="input w-full"
                            name="password"
                            type="password"
                            placeholder={
                                editingId
                                    ? 'Password baru (opsional)'
                                    : 'Masukkan password'
                            }
                            value={form.password}
                            onChange={handleChange}
                            required={!editingId}
                        />

                        {editingId && (
                            <p className="text-xs text-mute mt-1">
                                Kosongkan jika tidak ingin mengubah password.
                            </p>
                        )}
                    </div>


                    {/* ROLE */}
                    <div>
                        <label className="block text-sm text-mute mb-2">
                            Role
                        </label>

                        <select
                            className="input w-full"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                        >
                            <option value="user">
                                User
                            </option>

                            <option value="admin">
                                Admin
                            </option>
                        </select>
                    </div>


                    {/* BUTTON */}
                    <div className="md:col-span-2 flex flex-wrap gap-2 pt-2">

                        <button
                            type="submit"
                            className="btn btn-p"
                        >
                            <i
                                className={`fa-solid ${editingId
                                        ? 'fa-save'
                                        : 'fa-user-plus'
                                    }`}
                            />

                            {editingId
                                ? 'Simpan Perubahan'
                                : 'Tambah User'}
                        </button>


                        {editingId && (
                            <button
                                type="button"
                                className="btn"
                                onClick={resetForm}
                            >
                                <i className="fa-solid fa-xmark" />
                                Batal
                            </button>
                        )}

                    </div>

                </form>

            </section>


            {/* DAFTAR USER */}
            <section className="card p-5">

                {/* HEADER TABLE */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    <div>
                        <h2 className="text-xl font-bold">
                            Daftar User
                        </h2>

                        <p className="text-mute text-sm mt-1">
                            {users.length} akun terdaftar
                        </p>
                    </div>


                    {/* SEARCH */}
                    <div className="relative w-full lg:w-80">

                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-mute" />

                        <input
                            className="input w-full pl-10"
                            type="text"
                            placeholder="Cari nama, email, atau role..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>

                </div>


                {/* LOADING */}
                {loading && (
                    <div className="py-10 text-center">
                        <i className="fa-solid fa-spinner fa-spin text-accent text-xl" />

                        <p className="text-mute mt-3">
                            Memuat data user...
                        </p>
                    </div>
                )}


                {/* EMPTY */}
                {!loading &&
                    filteredUsers.length === 0 && (
                        <div className="py-10 text-center">

                            <div className="w-14 h-14 rounded-full bg-line flex items-center justify-center mx-auto">
                                <i className="fa-solid fa-users-slash text-mute text-xl" />
                            </div>

                            <p className="font-semibold mt-4">
                                {search
                                    ? 'User tidak ditemukan'
                                    : 'Belum ada user'}
                            </p>

                            <p className="text-mute text-sm mt-1">
                                {search
                                    ? 'Coba gunakan kata kunci lain.'
                                    : 'Belum ada akun pengguna yang terdaftar.'}
                            </p>

                        </div>
                    )}


                {/* TABLE */}
                {!loading &&
                    filteredUsers.length > 0 && (
                        <div className="overflow-x-auto mt-5">

                            <table className="w-full text-sm">

                                <thead>
                                    <tr className="border-b border-line text-left">

                                        <th className="p-3 text-mute font-medium">
                                            User
                                        </th>

                                        <th className="p-3 text-mute font-medium">
                                            Email
                                        </th>

                                        <th className="p-3 text-mute font-medium">
                                            Role
                                        </th>

                                        <th className="p-3 text-mute font-medium">
                                            Terdaftar
                                        </th>

                                        <th className="p-3 text-mute font-medium text-right">
                                            Aksi
                                        </th>

                                    </tr>
                                </thead>


                                <tbody>

                                    {filteredUsers.map(
                                        (user) => (
                                            <tr
                                                key={user.id}
                                                className="border-b border-line last:border-0 hover:bg-line/30 transition"
                                            >

                                                {/* USER */}
                                                <td className="p-3">

                                                    <div className="flex items-center gap-3">

                                                        <div className="w-10 h-10 rounded-full bg-line flex items-center justify-center shrink-0">
                                                            <i className="fa-solid fa-user text-accent" />
                                                        </div>

                                                        <div>
                                                            <p className="font-semibold">
                                                                {user.name}
                                                            </p>

                                                            <p className="text-xs text-mute">
                                                                ID #{user.id}
                                                            </p>
                                                        </div>

                                                    </div>

                                                </td>


                                                {/* EMAIL */}
                                                <td className="p-3 text-mute">
                                                    {user.email}
                                                </td>


                                                {/* ROLE */}
                                                <td className="p-3">

                                                    <span
                                                        className={
                                                            user.role === 'admin'
                                                                ? 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/10 text-accent text-xs font-semibold'
                                                                : 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-line text-mute text-xs font-semibold'
                                                        }
                                                    >
                                                        <i
                                                            className={
                                                                user.role === 'admin'
                                                                    ? 'fa-solid fa-shield-halved'
                                                                    : 'fa-solid fa-user'
                                                            }
                                                        />

                                                        {user.role === 'admin'
                                                            ? 'Administrator'
                                                            : 'User'}
                                                    </span>

                                                </td>


                                                {/* TANGGAL */}
                                                <td className="p-3 text-mute whitespace-nowrap">
                                                    {formatDate(
                                                        user.created_at
                                                    )}
                                                </td>


                                                {/* AKSI */}
                                                <td className="p-3">

                                                    <div className="flex justify-end gap-2">

                                                        <button
                                                            type="button"
                                                            className="btn px-3"
                                                            title="Edit user"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    user
                                                                )
                                                            }
                                                        >
                                                            <i className="fa-solid fa-pen" />

                                                            <span className="hidden sm:inline">
                                                                Edit
                                                            </span>
                                                        </button>


                                                        <button
                                                            type="button"
                                                            className="btn px-3"
                                                            title="Hapus user"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    user.id
                                                                )
                                                            }
                                                        >
                                                            <i className="fa-solid fa-trash" />

                                                            <span className="hidden sm:inline">
                                                                Hapus
                                                            </span>
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>
                    )}

            </section>

        </div>
    )
}