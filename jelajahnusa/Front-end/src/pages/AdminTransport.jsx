import { useEffect, useState } from 'react'
import { rupiah } from '../components/ui'

const API_URL = 'http://localhost:5001/api'

const emptyForm = {
    jenis: '',
    rute: '',
    operator: '',
    jam: '',
    price: ''
}

export default function AdminTransport() {
    const [transports, setTransports] = useState([])
    const [form, setForm] = useState(emptyForm)
    const [editingId, setEditingId] = useState(null)

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const token = localStorage.getItem('token')

    // =========================
    // LOAD DATA
    // =========================

    const loadTransports = async () => {
        try {
            setLoading(true)

            const response = await fetch(
                `${API_URL}/admin/transports`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const result = await response.json()

            if (!response.ok) {
                alert(
                    result.message ||
                    'Gagal mengambil data transportasi'
                )
                return
            }

            setTransports(result.data || [])
        } catch (error) {
            console.error(error)

            alert(
                'Tidak dapat terhubung ke server.'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadTransports()
    }, [])

    // =========================
    // FORM
    // =========================

    const set = (key) => (e) => {
        setForm({
            ...form,
            [key]: e.target.value
        })
    }

    const resetForm = () => {
        setForm(emptyForm)
        setEditingId(null)
    }

    // =========================
    // CREATE / UPDATE
    // =========================

    const submit = async (e) => {
        e.preventDefault()

        if (
            !form.jenis.trim() ||
            !form.rute.trim() ||
            !form.operator.trim() ||
            !form.jam.trim() ||
            form.price === ''
        ) {
            alert('Semua data wajib diisi.')
            return
        }

        if (
            Number.isNaN(Number(form.price)) ||
            Number(form.price) < 0
        ) {
            alert('Harga tidak valid.')
            return
        }

        try {
            setSaving(true)

            const url = editingId
                ? `${API_URL}/admin/transports/${editingId}`
                : `${API_URL}/admin/transports`

            const method = editingId
                ? 'PUT'
                : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type':
                        'application/json',
                    Authorization:
                        `Bearer ${token}`
                },
                body: JSON.stringify({
                    jenis: form.jenis.trim(),
                    rute: form.rute.trim(),
                    operator:
                        form.operator.trim(),
                    jam: form.jam.trim(),
                    price: Number(form.price)
                })
            })

            const result =
                await response.json()

            if (!response.ok) {
                alert(
                    result.message ||
                    'Gagal menyimpan transportasi'
                )
                return
            }

            alert(
                editingId
                    ? 'Transportasi berhasil diperbarui!'
                    : 'Transportasi berhasil ditambahkan!'
            )

            resetForm()

            await loadTransports()
        } catch (error) {
            console.error(error)

            alert(
                'Tidak dapat terhubung ke server.'
            )
        } finally {
            setSaving(false)
        }
    }

    // =========================
    // EDIT
    // =========================

    const editTransport = (transport) => {
        setEditingId(transport.id)

        setForm({
            jenis: transport.jenis || '',
            rute: transport.rute || '',
            operator:
                transport.operator || '',
            jam: transport.jam || '',
            price: transport.price ?? ''
        })

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    // =========================
    // DELETE
    // =========================

    const deleteTransport = async (id) => {
        const yakin = window.confirm(
            'Yakin ingin menghapus transportasi ini?'
        )

        if (!yakin) {
            return
        }

        try {
            const response = await fetch(
                `${API_URL}/admin/transports/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            )

            const result =
                await response.json()

            if (!response.ok) {
                alert(
                    result.message ||
                    'Gagal menghapus transportasi'
                )
                return
            }

            alert(
                'Transportasi berhasil dihapus!'
            )

            if (editingId === id) {
                resetForm()
            }

            await loadTransports()
        } catch (error) {
            console.error(error)

            alert(
                'Tidak dapat terhubung ke server.'
            )
        }
    }

    // =========================
    // ICON JENIS
    // =========================

    const getTransportIcon = (jenis) => {
        const value =
            String(jenis || '').toLowerCase()

        if (value.includes('pesawat')) {
            return 'fa-plane'
        }

        if (value.includes('kereta')) {
            return 'fa-train'
        }

        if (value.includes('bus')) {
            return 'fa-bus'
        }

        if (
            value.includes('mobil') ||
            value.includes('sewa')
        ) {
            return 'fa-car'
        }

        if (value.includes('kapal')) {
            return 'fa-ship'
        }

        return 'fa-route'
    }

    return (
        <div className="space-y-6">

            {/* =========================
                HEADER
            ========================= */}

            <div>
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-line flex items-center justify-center">
                        <i className="fa-solid fa-car text-accent text-lg" />
                    </div>

                    <div>
                        <p className="text-accent text-sm font-medium">
                            Administrasi
                        </p>

                        <h1 className="text-2xl font-bold">
                            Kelola Transportasi
                        </h1>
                    </div>
                </div>

                <p className="text-mute mt-3 max-w-2xl">
                    Kelola transportasi, rute,
                    operator, jadwal, dan harga
                    yang tersedia untuk pengguna.
                </p>
            </div>

            {/* =========================
                FORM
            ========================= */}

            <section className="card overflow-hidden">

                <div className="p-5 border-b border-line">
                    <div className="flex items-center justify-between gap-4">

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-line flex items-center justify-center">
                                <i
                                    className={`fa-solid ${editingId
                                            ? 'fa-pen'
                                            : 'fa-plus'
                                        } text-accent`}
                                />
                            </div>

                            <div>
                                <h2 className="font-bold">
                                    {editingId
                                        ? 'Edit Transportasi'
                                        : 'Tambah Transportasi'}
                                </h2>

                                <p className="text-mute text-sm mt-0.5">
                                    {editingId
                                        ? 'Perbarui informasi transportasi.'
                                        : 'Tambahkan transportasi baru.'}
                                </p>
                            </div>
                        </div>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="btn"
                            >
                                <i className="fa-solid fa-xmark mr-2" />
                                Batal
                            </button>
                        )}

                    </div>
                </div>

                <form
                    onSubmit={submit}
                    className="p-5 space-y-5"
                >

                    <div className="grid sm:grid-cols-2 gap-4">

                        {/* JENIS */}
                        <div>
                            <label className="block mb-2 text-sm font-medium">
                                Jenis Transportasi
                            </label>

                            <div className="relative">
                                <i className="fa-solid fa-route absolute left-3 top-1/2 -translate-y-1/2 text-mute" />

                                <input
                                    className="input pl-10"
                                    placeholder="Pesawat, Kereta, Bus..."
                                    value={form.jenis}
                                    onChange={set(
                                        'jenis'
                                    )}
                                />
                            </div>
                        </div>

                        {/* RUTE */}
                        <div>
                            <label className="block mb-2 text-sm font-medium">
                                Rute
                            </label>

                            <div className="relative">
                                <i className="fa-solid fa-location-arrow absolute left-3 top-1/2 -translate-y-1/2 text-mute" />

                                <input
                                    className="input pl-10"
                                    placeholder="Jakarta - Yogyakarta"
                                    value={form.rute}
                                    onChange={set(
                                        'rute'
                                    )}
                                />
                            </div>
                        </div>

                        {/* OPERATOR */}
                        <div>
                            <label className="block mb-2 text-sm font-medium">
                                Operator
                            </label>

                            <div className="relative">
                                <i className="fa-solid fa-building absolute left-3 top-1/2 -translate-y-1/2 text-mute" />

                                <input
                                    className="input pl-10"
                                    placeholder="Garuda Indonesia"
                                    value={
                                        form.operator
                                    }
                                    onChange={set(
                                        'operator'
                                    )}
                                />
                            </div>
                        </div>

                        {/* JAM */}
                        <div>
                            <label className="block mb-2 text-sm font-medium">
                                Jadwal / Jam
                            </label>

                            <div className="relative">
                                <i className="fa-solid fa-clock absolute left-3 top-1/2 -translate-y-1/2 text-mute" />

                                <input
                                    className="input pl-10"
                                    placeholder="06.10 - 09.25"
                                    value={form.jam}
                                    onChange={set(
                                        'jam'
                                    )}
                                />
                            </div>
                        </div>

                        {/* HARGA */}
                        <div className="sm:col-span-2">
                            <label className="block mb-2 text-sm font-medium">
                                Harga per orang
                            </label>

                            <div className="relative max-w-md">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mute text-sm">
                                    Rp
                                </span>

                                <input
                                    className="input pl-10"
                                    type="number"
                                    min="0"
                                    placeholder="750000"
                                    value={form.price}
                                    onChange={set(
                                        'price'
                                    )}
                                />
                            </div>
                        </div>

                    </div>

                    {/* BUTTON */}
                    <div className="flex flex-wrap gap-3 pt-2">

                        <button
                            type="submit"
                            className="btn btn-p"
                            disabled={saving}
                        >
                            <i
                                className={`fa-solid ${saving
                                        ? 'fa-spinner fa-spin'
                                        : editingId
                                            ? 'fa-check'
                                            : 'fa-plus'
                                    } mr-2`}
                            />

                            {saving
                                ? 'Menyimpan...'
                                : editingId
                                    ? 'Simpan Perubahan'
                                    : 'Tambah Transportasi'}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="btn"
                            >
                                Batal
                            </button>
                        )}

                    </div>

                </form>
            </section>

            {/* =========================
                DAFTAR
            ========================= */}

            <section className="card overflow-hidden">

                {/* HEADER TABLE */}

                <div className="p-5 border-b border-line">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                        <div>
                            <h2 className="font-bold text-lg">
                                Daftar Transportasi
                            </h2>

                            <p className="text-mute text-sm mt-1">
                                Data transportasi yang
                                tersedia di website.
                            </p>
                        </div>

                        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-line text-sm w-fit">
                            <i className="fa-solid fa-route text-accent" />

                            <span>
                                {transports.length}
                                {' '}
                                transportasi
                            </span>
                        </div>

                    </div>

                </div>

                {/* LOADING */}

                {loading ? (
                    <div className="p-8 text-center">

                        <i className="fa-solid fa-spinner fa-spin text-accent text-2xl" />

                        <p className="text-mute text-sm mt-3">
                            Memuat data transportasi...
                        </p>

                    </div>
                ) : transports.length === 0 ? (

                    /* EMPTY */

                    <div className="p-10 text-center">

                        <div className="w-14 h-14 mx-auto rounded-2xl bg-line flex items-center justify-center">
                            <i className="fa-solid fa-car text-accent text-xl" />
                        </div>

                        <h3 className="font-bold mt-4">
                            Belum ada transportasi
                        </h3>

                        <p className="text-mute text-sm mt-2">
                            Tambahkan transportasi
                            menggunakan form di atas.
                        </p>

                    </div>

                ) : (

                    /* TABLE */

                    <div className="overflow-x-auto">

                        <table className="w-full text-sm">

                            <thead>
                                <tr className="border-b border-line text-left bg-panel/50">

                                    <th className="px-5 py-4 font-semibold whitespace-nowrap">
                                        Transportasi
                                    </th>

                                    <th className="px-5 py-4 font-semibold">
                                        Rute
                                    </th>

                                    <th className="px-5 py-4 font-semibold">
                                        Operator
                                    </th>

                                    <th className="px-5 py-4 font-semibold whitespace-nowrap">
                                        Jadwal
                                    </th>

                                    <th className="px-5 py-4 font-semibold whitespace-nowrap">
                                        Harga
                                    </th>

                                    <th className="px-5 py-4 font-semibold text-right whitespace-nowrap">
                                        Aksi
                                    </th>

                                </tr>
                            </thead>

                            <tbody>

                                {transports.map(
                                    (transport) => (
                                        <tr
                                            key={
                                                transport.id
                                            }
                                            className="border-b border-line last:border-0 hover:bg-panel/50 transition"
                                        >

                                            {/* TRANSPORTASI */}

                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-3">

                                                    <div className="w-10 h-10 rounded-xl bg-line flex items-center justify-center shrink-0">
                                                        <i
                                                            className={`fa-solid ${getTransportIcon(
                                                                transport.jenis
                                                            )} text-accent`}
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold">
                                                            {
                                                                transport.jenis
                                                            }
                                                        </p>

                                                        <p className="text-xs text-mute mt-0.5">
                                                            ID #
                                                            {
                                                                transport.id
                                                            }
                                                        </p>
                                                    </div>

                                                </div>

                                            </td>

                                            {/* RUTE */}

                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-2">
                                                    <i className="fa-solid fa-location-dot text-mute text-xs" />

                                                    <span>
                                                        {
                                                            transport.rute
                                                        }
                                                    </span>
                                                </div>

                                            </td>

                                            {/* OPERATOR */}

                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-2">
                                                    <i className="fa-solid fa-building text-mute text-xs" />

                                                    <span>
                                                        {
                                                            transport.operator
                                                        }
                                                    </span>
                                                </div>

                                            </td>

                                            {/* JAM */}

                                            <td className="px-5 py-4 whitespace-nowrap">

                                                <div className="flex items-center gap-2">
                                                    <i className="fa-solid fa-clock text-mute text-xs" />

                                                    <span>
                                                        {
                                                            transport.jam
                                                        }
                                                    </span>
                                                </div>

                                            </td>

                                            {/* HARGA */}

                                            <td className="px-5 py-4 whitespace-nowrap">

                                                <p className="font-bold text-accent">
                                                    {rupiah(
                                                        transport.price
                                                    )}
                                                </p>

                                                <p className="text-xs text-mute mt-0.5">
                                                    / orang
                                                </p>

                                            </td>

                                            {/* AKSI */}

                                            <td className="px-5 py-4">

                                                <div className="flex justify-end gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            editTransport(
                                                                transport
                                                            )
                                                        }
                                                        className="btn"
                                                        title="Edit transportasi"
                                                    >
                                                        <i className="fa-solid fa-pen-to-square mr-1.5" />
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            deleteTransport(
                                                                transport.id
                                                            )
                                                        }
                                                        className="btn"
                                                        title="Hapus transportasi"
                                                    >
                                                        <i className="fa-solid fa-trash mr-1.5" />
                                                        Hapus
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