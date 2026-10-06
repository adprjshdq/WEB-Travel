import { useEffect, useState } from 'react'

import { PageHead } from '../components/ui'

import { getImageUrl } from '../utils/imageUrl'

import API_URL from '../services/api'

const kosong = {
    name: '',
    city: '',
    stars: 3,
    price: '',
    facilities: '',
    image: null,
    rating: 0
}

export default function AdminHotels() {
    const [hotels, setHotels] = useState([])
    const [form, setForm] = useState(kosong)
    const [editingId, setEditingId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [preview, setPreview] = useState('')
    const [search, setSearch] = useState('')

    const token = localStorage.getItem('token')

    const loadHotels = async () => {
        try {
            const response = await fetch(
                `${API_URL}/admin/hotels`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const result = await response.json()

            if (result.success) {
                setHotels(result.data)
            } else {
                alert(
                    result.message ||
                    'Gagal mengambil data penginapan'
                )
            }
        } catch (error) {
            console.error(error)
            alert('Tidak dapat terhubung ke server.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadHotels()
    }, [])

    const set = (key) => (e) => {
        setForm((prev) => ({
            ...prev,
            [key]: e.target.value
        }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]

        if (!file) {
            setForm((prev) => ({
                ...prev,
                image: null
            }))
            setPreview('')
            return
        }

        const allowedTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp'
        ]

        if (!allowedTypes.includes(file.type)) {
            alert(
                'Format gambar harus JPG, JPEG, PNG, atau WEBP.'
            )
            e.target.value = ''
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran gambar maksimal 5 MB.')
            e.target.value = ''
            return
        }

        setForm((prev) => ({
            ...prev,
            image: file
        }))

        setPreview(URL.createObjectURL(file))
    }

    const resetForm = () => {
        setForm(kosong)
        setPreview('')
        setEditingId(null)

        const imageInput =
            document.getElementById('image')

        if (imageInput) {
            imageInput.value = ''
        }
    }

    const submit = async (e) => {
        e.preventDefault()

        if (
            !form.name.trim() ||
            !form.city.trim() ||
            !form.price
        ) {
            alert(
                'Nama, lokasi, dan harga wajib diisi.'
            )
            return
        }

        if (Number(form.price) < 0) {
            alert('Harga tidak boleh kurang dari 0.')
            return
        }

        if (
            Number(form.stars) < 1 ||
            Number(form.stars) > 5
        ) {
            alert('Bintang harus antara 1 sampai 5.')
            return
        }

        if (
            Number(form.rating) < 0 ||
            Number(form.rating) > 5
        ) {
            alert('Rating harus antara 0 sampai 5.')
            return
        }

        try {
            setSaving(true)

            const url = editingId
                ? `${API_URL}/admin/hotels/${editingId}`
                : `${API_URL}/admin/hotels`

            const formData = new FormData()

            formData.append(
                'name',
                form.name.trim()
            )

            formData.append(
                'city',
                form.city.trim()
            )

            formData.append(
                'stars',
                Number(form.stars)
            )

            formData.append(
                'price',
                Number(form.price)
            )

            formData.append(
                'facilities',
                form.facilities.trim()
            )

            formData.append(
                'rating',
                Number(form.rating)
            )

            if (form.image instanceof File) {
                formData.append(
                    'image',
                    form.image
                )
            }

            const response = await fetch(
                url,
                {
                    method: editingId
                        ? 'PUT'
                        : 'POST',

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
                alert(
                    result.message ||
                    'Gagal menyimpan penginapan'
                )
                return
            }

            alert(
                editingId
                    ? 'Penginapan berhasil diperbarui!'
                    : 'Penginapan berhasil ditambahkan!'
            )

            resetForm()

            await loadHotels()
        } catch (error) {
            console.error(error)

            alert(
                'Tidak dapat terhubung ke server.'
            )
        } finally {
            setSaving(false)
        }
    }

    const editHotel = (hotel) => {
        setEditingId(hotel.id)

        setForm({
            name: hotel.name || '',
            city: hotel.city || '',
            stars: hotel.stars || 1,
            price: hotel.price || '',
            facilities:
                hotel.facilities || '',
            image: null,
            rating: hotel.rating || 0
        })

        setPreview(
            hotel.image
                ? getImageUrl(hotel.image)
                : ''
        )

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    const cancelEdit = () => {
        resetForm()
    }

    const deleteHotel = async (id) => {
        const yakin = window.confirm(
            'Yakin ingin menghapus penginapan ini?'
        )

        if (!yakin) return

        try {
            const response = await fetch(
                `${API_URL}/admin/hotels/${id}`,
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
                    'Gagal menghapus penginapan'
                )
                return
            }

            alert(
                'Penginapan berhasil dihapus!'
            )

            await loadHotels()
        } catch (error) {
            console.error(error)

            alert(
                'Tidak dapat terhubung ke server.'
            )
        }
    }

    const filteredHotels = hotels.filter(
        (hotel) => {
            const keyword =
                search
                    .toLowerCase()
                    .trim()

            if (!keyword) return true

            return (
                hotel.name
                    ?.toLowerCase()
                    .includes(keyword) ||
                hotel.city
                    ?.toLowerCase()
                    .includes(keyword) ||
                hotel.facilities
                    ?.toLowerCase()
                    .includes(keyword)
            )
        }
    )

    return (
        <>
            <PageHead
                title="Kelola Penginapan"
                desc="Tambah, ubah, dan hapus data penginapan."
            />

            <div className="grid lg:grid-cols-[22rem_1fr] gap-5">

                {/* =========================
                    FORM
                ========================= */}

                <form
                    onSubmit={submit}
                    className="card p-5 space-y-4 h-fit"
                >
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="font-bold text-lg">
                                {editingId
                                    ? 'Edit Penginapan'
                                    : 'Tambah Penginapan'}
                            </h2>

                            <p className="text-xs text-mute mt-1">
                                {editingId
                                    ? 'Perbarui informasi penginapan.'
                                    : 'Masukkan data penginapan baru.'}
                            </p>
                        </div>

                        {editingId && (
                            <button
                                type="button"
                                className="btn text-sm"
                                onClick={cancelEdit}
                            >
                                Batal
                            </button>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="name"
                            className="block mb-1"
                        >
                            Nama penginapan
                        </label>

                        <input
                            id="name"
                            className="input"
                            value={form.name}
                            onChange={set('name')}
                            placeholder="Contoh: Villa Padi Ubud"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="city"
                            className="block mb-1"
                        >
                            Lokasi
                        </label>

                        <input
                            id="city"
                            className="input"
                            value={form.city}
                            onChange={set('city')}
                            placeholder="Contoh: Ubud, Bali"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label
                                htmlFor="stars"
                                className="block mb-1"
                            >
                                Bintang
                            </label>

                            <select
                                id="stars"
                                className="input"
                                value={form.stars}
                                onChange={set('stars')}
                            >
                                <option value="1">
                                    1 ⭐
                                </option>

                                <option value="2">
                                    2 ⭐
                                </option>

                                <option value="3">
                                    3 ⭐
                                </option>

                                <option value="4">
                                    4 ⭐
                                </option>

                                <option value="5">
                                    5 ⭐
                                </option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="rating"
                                className="block mb-1"
                            >
                                Rating
                            </label>

                            <input
                                id="rating"
                                type="number"
                                min="0"
                                max="5"
                                step="0.1"
                                className="input"
                                value={form.rating}
                                onChange={set('rating')}
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="price"
                            className="block mb-1"
                        >
                            Harga / malam
                        </label>

                        <input
                            id="price"
                            type="number"
                            min="0"
                            className="input"
                            value={form.price}
                            onChange={set('price')}
                            placeholder="Contoh: 850000"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="facilities"
                            className="block mb-1"
                        >
                            Fasilitas
                        </label>

                        <textarea
                            id="facilities"
                            rows="3"
                            className="input resize-none"
                            value={form.facilities}
                            onChange={set('facilities')}
                            placeholder="Kolam renang, Wi-Fi, Sarapan"
                        />

                        <p className="text-xs text-mute mt-1">
                            Pisahkan fasilitas dengan koma.
                        </p>
                    </div>

                    {/* UPLOAD */}

                    <div>
                        <label
                            htmlFor="image"
                            className="block mb-1"
                        >
                            Gambar penginapan
                        </label>

                        <input
                            id="image"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            className="input"
                            onChange={
                                handleImageChange
                            }
                        />

                        <p className="text-xs text-mute mt-1">
                            JPG, JPEG, PNG, atau WEBP. Maksimal 5 MB.
                        </p>

                        {preview && (
                            <div className="mt-3">
                                <p className="text-xs text-mute mb-2">
                                    Preview gambar
                                </p>

                                <img
                                    src={preview}
                                    alt="Preview penginapan"
                                    className="w-full h-44 object-cover rounded-xl border border-line"
                                />
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="btn btn-p w-full disabled:opacity-50"
                    >
                        {saving
                            ? 'Menyimpan...'
                            : editingId
                                ? 'Simpan Perubahan'
                                : 'Tambah Penginapan'}
                    </button>
                </form>

                {/* =========================
                    LIST
                ========================= */}

                <div className="space-y-4">

                    {/* SEARCH */}

                    <div className="card p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h2 className="font-bold">
                                    Daftar Penginapan
                                </h2>

                                <p className="text-sm text-mute">
                                    {hotels.length} penginapan terdaftar
                                </p>
                            </div>

                            <input
                                type="search"
                                className="input sm:max-w-xs"
                                placeholder="Cari penginapan..."
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
                        <div className="card p-6 text-center">
                            <p className="text-mute">
                                Memuat penginapan...
                            </p>
                        </div>
                    )}

                    {/* EMPTY */}

                    {!loading &&
                        filteredHotels.length === 0 && (
                            <div className="card p-6 text-center">
                                <p className="font-semibold">
                                    {search
                                        ? 'Penginapan tidak ditemukan'
                                        : 'Belum ada penginapan'}
                                </p>

                                <p className="text-sm text-mute mt-1">
                                    {search
                                        ? 'Coba gunakan kata kunci lain.'
                                        : 'Tambahkan penginapan melalui form di sebelah kiri.'}
                                </p>
                            </div>
                        )}

                    {/* CARDS */}

                    {!loading &&
                        filteredHotels.map((hotel) => {
                            const image =
                                hotel.image
                                    ? getImageUrl(
                                        hotel.image
                                    )
                                    : '/images/Villa padi ubud.jpg'

                            const facilities =
                                hotel.facilities
                                    ? hotel.facilities
                                        .split(',')
                                        .map(
                                            (item) =>
                                                item.trim()
                                        )
                                        .filter(Boolean)
                                    : []

                            return (
                                <article
                                    key={hotel.id}
                                    className="card p-4"
                                >
                                    <div className="flex flex-col sm:flex-row gap-4">

                                        {/* IMAGE */}

                                        <img
                                            src={image}
                                            alt={hotel.name}
                                            className="w-full sm:w-36 h-32 object-cover rounded-xl shrink-0"
                                        />

                                        {/* CONTENT */}

                                        <div className="flex-1 min-w-0">

                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">

                                                <div>
                                                    <h2 className="font-bold text-lg">
                                                        {hotel.name}
                                                    </h2>

                                                    <p className="text-sm text-mute mt-1">
                                                        <i className="fa-solid fa-location-dot mr-1" />
                                                        {hotel.city}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className="badge">
                                                        ⭐ {hotel.stars}
                                                    </span>

                                                    <span className="badge">
                                                        ★ {Number(
                                                            hotel.rating || 0
                                                        ).toFixed(1)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-3">
                                                <span className="text-accent font-bold text-lg">
                                                    Rp{' '}
                                                    {Number(
                                                        hotel.price
                                                    ).toLocaleString(
                                                        'id-ID'
                                                    )}
                                                </span>

                                                <span className="text-xs text-mute ml-1">
                                                    / malam
                                                </span>
                                            </div>

                                            {/* FACILITIES */}

                                            {facilities.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {facilities.map(
                                                        (
                                                            facility,
                                                            index
                                                        ) => (
                                                            <span
                                                                key={
                                                                    index
                                                                }
                                                                className="badge"
                                                            >
                                                                {
                                                                    facility
                                                                }
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            )}

                                            {/* ACTION */}

                                            <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-line">
                                                <button
                                                    type="button"
                                                    className="btn"
                                                    onClick={() =>
                                                        editHotel(
                                                            hotel
                                                        )
                                                    }
                                                >
                                                    <i className="fa-solid fa-pen-to-square mr-1" />
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn"
                                                    onClick={() =>
                                                        deleteHotel(
                                                            hotel.id
                                                        )
                                                    }
                                                >
                                                    <i className="fa-solid fa-trash mr-1" />
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            )
                        })}
                </div>
            </div>
        </>
    )
}