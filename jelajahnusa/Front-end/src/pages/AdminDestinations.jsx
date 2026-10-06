import { useEffect, useState } from 'react'

import API_URL from '../services/api'

const SERVER_URL = API_URL.replace(/\/api\/?$/, '')

const emptyForm = {
    name: '',
    location: '',
    description: '',
    image: null,
    category: '',
    rating: ''
}

export default function AdminDestinations() {
    const [destinations, setDestinations] = useState([])
    const [form, setForm] = useState(emptyForm)
    const [editingId, setEditingId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')
    const [preview, setPreview] = useState('')
    const [search, setSearch] = useState('')

    const token = localStorage.getItem('token')

    // =========================
    // IMAGE URL
    // =========================

    const getImageUrl = (image) => {
        if (!image) {
            return ''
        }

        if (
            image.startsWith('http://') ||
            image.startsWith('https://')
        ) {
            return image
        }

        if (image.startsWith('upload-')) {
            return `${SERVER_URL}/uploads/${image}`
        }

        return `/images/${image}`
    }

    // =========================
    // LOAD DESTINATIONS
    // =========================

    const loadDestinations = async () => {
        try {
            setLoading(true)

            const response = await fetch(
                `${API_URL}/admin/destinations`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const result = await response.json()

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    'Gagal mengambil data destinasi'
                )
            }

            setDestinations(result.data || [])
        } catch (error) {
            console.error(error)

            setMessage(
                error.message ||
                'Gagal mengambil data destinasi'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadDestinations()
    }, [])

    // =========================
    // FORM CHANGE
    // =========================

    const handleChange = (e) => {
        const { name, value } = e.target

        setForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    // =========================
    // IMAGE CHANGE
    // =========================

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]

        if (!file) {
            return
        }

        const allowedTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp'
        ]

        if (!allowedTypes.includes(file.type)) {
            setMessage(
                'Format gambar harus JPG, JPEG, PNG, atau WEBP.'
            )

            e.target.value = ''

            return
        }

        if (file.size > 5 * 1024 * 1024) {
            setMessage(
                'Ukuran gambar maksimal 5 MB.'
            )

            e.target.value = ''

            return
        }

        setForm((prev) => ({
            ...prev,
            image: file
        }))

        setMessage('')

        const imageUrl =
            URL.createObjectURL(file)

        setPreview(imageUrl)
    }

    // =========================
    // RESET FORM
    // =========================

    const resetForm = () => {
        setForm(emptyForm)
        setEditingId(null)
        setPreview('')
        setMessage('')

        const fileInput =
            document.getElementById(
                'destination-image'
            )

        if (fileInput) {
            fileInput.value = ''
        }
    }

    // =========================
    // EDIT
    // =========================

    const handleEdit = (destination) => {
        setEditingId(destination.id)

        setForm({
            name: destination.name || '',
            location: destination.location || '',
            description:
                destination.description || '',
            image: null,
            category:
                destination.category || '',
            rating:
                destination.rating || ''
        })

        if (destination.image) {
            setPreview(
                getImageUrl(
                    destination.image
                )
            )
        } else {
            setPreview('')
        }

        setMessage('')

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    // =========================
    // SUBMIT
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault()

        setSaving(true)
        setMessage('')

        try {
            const url = editingId
                ? `${API_URL}/admin/destinations/${editingId}`
                : `${API_URL}/admin/destinations`

            const method = editingId
                ? 'PUT'
                : 'POST'

            const formData = new FormData()

            formData.append(
                'name',
                form.name
            )

            formData.append(
                'location',
                form.location
            )

            formData.append(
                'description',
                form.description
            )

            formData.append(
                'category',
                form.category
            )

            formData.append(
                'rating',
                form.rating
                    ? Number(form.rating)
                    : 0
            )

            if (form.image) {
                formData.append(
                    'image',
                    form.image
                )
            }

            const response = await fetch(
                url,
                {
                    method,
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    },
                    body: formData
                }
            )

            const result =
                await response.json()

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    'Gagal menyimpan destinasi'
                )
            }

            setMessage(
                editingId
                    ? 'Destinasi berhasil diperbarui.'
                    : 'Destinasi berhasil ditambahkan.'
            )

            resetForm()

            await loadDestinations()
        } catch (error) {
            console.error(error)

            setMessage(
                error.message ||
                'Terjadi kesalahan.'
            )
        } finally {
            setSaving(false)
        }
    }

    // =========================
    // DELETE
    // =========================

    const handleDelete = async (id) => {
        const yakin = window.confirm(
            'Yakin ingin menghapus destinasi ini?'
        )

        if (!yakin) {
            return
        }

        try {
            const response = await fetch(
                `${API_URL}/admin/destinations/${id}`,
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
                throw new Error(
                    result.message ||
                    'Gagal menghapus destinasi'
                )
            }

            setMessage(
                'Destinasi berhasil dihapus.'
            )

            await loadDestinations()
        } catch (error) {
            console.error(error)

            setMessage(
                error.message ||
                'Gagal menghapus destinasi'
            )
        }
    }

    // =========================
    // SEARCH
    // =========================

    const filteredDestinations =
        destinations.filter(
            (destination) => {
                const keyword =
                    search.toLowerCase()

                return (
                    destination.name
                        ?.toLowerCase()
                        .includes(keyword) ||
                    destination.location
                        ?.toLowerCase()
                        .includes(keyword) ||
                    destination.category
                        ?.toLowerCase()
                        .includes(keyword)
                )
            }
        )

    return (
        <div className="space-y-8">

            {/* HEADER */}

            <div>
                <p className="text-accent text-sm font-medium">
                    Administrator
                </p>

                <h1 className="mt-1">
                    Kelola Destinasi
                </h1>

                <p className="text-mute mt-2">
                    Tambah, edit, dan kelola destinasi wisata NusaTrip.
                </p>
            </div>

            {/* FORM */}

            <section className="card p-5">

                <div className="flex items-center justify-between gap-4 mb-5">

                    <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-xl bg-line flex items-center justify-center">

                            <i
                                className={`fa-solid ${editingId
                                        ? 'fa-pen-to-square'
                                        : 'fa-location-dot'
                                    } text-accent`}
                            />

                        </div>

                        <div>

                            <h2 className="text-xl font-bold">
                                {editingId
                                    ? 'Edit Destinasi'
                                    : 'Tambah Destinasi'}
                            </h2>

                            <p className="text-mute text-sm mt-1">
                                {editingId
                                    ? 'Perbarui informasi destinasi.'
                                    : 'Tambahkan destinasi wisata baru.'}
                            </p>

                        </div>

                    </div>

                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="btn"
                        >
                            <i className="fa-solid fa-xmark" />
                            Batal
                        </button>
                    )}

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid md:grid-cols-2 gap-4"
                >

                    {/* NAMA */}

                    <div>

                        <label className="block text-sm text-mute mb-2">
                            Nama destinasi
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Contoh: Raja Ampat"
                            required
                            className="input w-full"
                        />

                    </div>

                    {/* LOKASI */}

                    <div>

                        <label className="block text-sm text-mute mb-2">
                            Lokasi
                        </label>

                        <input
                            type="text"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="Contoh: Papua Barat"
                            required
                            className="input w-full"
                        />

                    </div>

                    {/* KATEGORI */}

                    <div>

                        <label className="block text-sm text-mute mb-2">
                            Kategori
                        </label>

                        <input
                            type="text"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            placeholder="Contoh: Pantai"
                            className="input w-full"
                        />

                    </div>

                    {/* RATING */}

                    <div>

                        <label className="block text-sm text-mute mb-2">
                            Rating
                        </label>

                        <div className="relative">

                            <input
                                type="number"
                                name="rating"
                                value={form.rating}
                                onChange={handleChange}
                                min="0"
                                max="5"
                                step="0.1"
                                placeholder="Contoh: 4.8"
                                className="input w-full pr-12"
                            />

                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-accent">
                                ⭐
                            </span>

                        </div>

                    </div>

                    {/* UPLOAD */}

                    <div className="md:col-span-2">

                        <label className="block text-sm text-mute mb-2">
                            Gambar destinasi
                        </label>

                        <div className="border border-line rounded-xl p-4">

                            <input
                                id="destination-image"
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleImageChange}
                                className="w-full"
                            />

                            <p className="text-mute text-xs mt-2">
                                JPG, JPEG, PNG, atau WEBP.
                                Maksimal 5 MB.
                            </p>

                        </div>

                    </div>

                    {/* PREVIEW */}

                    {preview && (
                        <div className="md:col-span-2">

                            <p className="text-sm text-mute mb-2">
                                Preview gambar
                            </p>

                            <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-line">

                                <img
                                    src={preview}
                                    alt="Preview destinasi"
                                    className="w-full h-56 object-cover"
                                />

                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2">

                                    <p className="text-xs text-white">

                                        {form.image
                                            ? form.image.name
                                            : 'Gambar saat ini'}

                                    </p>

                                </div>

                            </div>

                        </div>
                    )}

                    {/* DESKRIPSI */}

                    <div className="md:col-span-2">

                        <label className="block text-sm text-mute mb-2">
                            Deskripsi
                        </label>

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Deskripsi destinasi..."
                            rows="5"
                            className="input w-full resize-y"
                        />

                    </div>

                    {/* BUTTON */}

                    <div className="md:col-span-2 flex flex-wrap gap-2 pt-1">

                        <button
                            type="submit"
                            className="btn btn-p"
                            disabled={saving}
                        >

                            <i
                                className={`fa-solid ${saving
                                        ? 'fa-spinner fa-spin'
                                        : editingId
                                            ? 'fa-save'
                                            : 'fa-cloud-arrow-up'
                                    }`}
                            />

                            {saving
                                ? 'Menyimpan...'
                                : editingId
                                    ? 'Simpan Perubahan'
                                    : 'Upload & Tambah Destinasi'}

                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="btn"
                            >
                                <i className="fa-solid fa-xmark" />
                                Batal
                            </button>
                        )}

                    </div>

                </form>

                {/* MESSAGE */}

                {message && (
                    <div className="mt-5 p-3 rounded-xl bg-line flex items-center gap-3">

                        <i className="fa-solid fa-circle-info text-accent" />

                        <p
                            className="text-sm"
                            role="status"
                        >
                            {message}
                        </p>

                    </div>
                )}

            </section>

            {/* LIST */}

            <section className="card p-5">

                {/* LIST HEADER */}

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    <div>

                        <h2 className="text-xl font-bold">
                            Daftar Destinasi
                        </h2>

                        <p className="text-mute text-sm mt-1">
                            {destinations.length} destinasi terdaftar
                        </p>

                    </div>

                    {/* SEARCH */}

                    <div className="relative w-full lg:w-80">

                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-mute" />

                        <input
                            type="text"
                            className="input w-full pl-10"
                            placeholder="Cari destinasi..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                </div>

                {/* LOADING */}

                {loading && (
                    <div className="py-10 text-center">

                        <i className="fa-solid fa-spinner fa-spin text-accent text-xl" />

                        <p className="text-mute mt-3">
                            Memuat destinasi...
                        </p>

                    </div>
                )}

                {/* EMPTY */}

                {!loading &&
                    filteredDestinations.length === 0 && (
                        <div className="py-10 text-center">

                            <div className="w-14 h-14 rounded-full bg-line flex items-center justify-center mx-auto">

                                <i className="fa-solid fa-map-location-dot text-mute text-xl" />

                            </div>

                            <p className="font-semibold mt-4">
                                {search
                                    ? 'Destinasi tidak ditemukan'
                                    : 'Belum ada destinasi'}
                            </p>

                            <p className="text-mute text-sm mt-1">
                                {search
                                    ? 'Coba gunakan kata kunci lain.'
                                    : 'Tambahkan destinasi pertama melalui form di atas.'}
                            </p>

                        </div>
                    )}

                {/* DESTINATION LIST */}

                {!loading &&
                    filteredDestinations.length > 0 && (
                        <div className="grid lg:grid-cols-2 gap-4 mt-5">

                            {filteredDestinations.map(
                                (destination) => (
                                    <article
                                        key={destination.id}
                                        className="border border-line rounded-xl overflow-hidden hover:border-accent transition"
                                    >

                                        {/* IMAGE */}

                                        <div className="relative h-48">

                                            {destination.image ? (
                                                <img
                                                    src={getImageUrl(
                                                        destination.image
                                                    )}
                                                    alt={
                                                        destination.name
                                                    }
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-line flex items-center justify-center">

                                                    <i className="fa-solid fa-image text-mute text-2xl" />

                                                </div>
                                            )}

                                            {/* CATEGORY */}

                                            {destination.category && (
                                                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 text-white text-xs font-semibold">
                                                    {
                                                        destination.category
                                                    }
                                                </span>
                                            )}

                                            {/* RATING */}

                                            <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 text-white text-xs font-semibold">
                                                ⭐{' '}
                                                {destination.rating ||
                                                    '0.0'}
                                            </span>

                                        </div>

                                        {/* CONTENT */}

                                        <div className="p-4">

                                            <div className="flex items-start justify-between gap-3">

                                                <div className="min-w-0">

                                                    <h3 className="font-bold text-lg">
                                                        {
                                                            destination.name
                                                        }
                                                    </h3>

                                                    <p className="text-mute text-sm mt-1">

                                                        <i className="fa-solid fa-location-dot mr-1" />

                                                        {
                                                            destination.location
                                                        }

                                                    </p>

                                                </div>

                                            </div>

                                            {/* DESCRIPTION */}

                                            {destination.description && (
                                                <p className="text-mute text-sm mt-3 line-clamp-2">
                                                    {
                                                        destination.description
                                                    }
                                                </p>
                                            )}

                                            {/* ACTION */}

                                            <div className="flex gap-2 mt-4 pt-4 border-t border-line">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEdit(
                                                            destination
                                                        )
                                                    }
                                                    className="btn flex-1"
                                                >
                                                    <i className="fa-solid fa-pen" />
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            destination.id
                                                        )
                                                    }
                                                    className="btn flex-1"
                                                >
                                                    <i className="fa-solid fa-trash" />
                                                    Hapus
                                                </button>

                                            </div>

                                        </div>

                                    </article>
                                )
                            )}

                        </div>
                    )}

            </section>

        </div>
    )
}