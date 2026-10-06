const API_URL =
    import.meta.env.VITE_API_URL || '/api'

export const getDestinations = async () => {
    const response = await fetch(
        `${API_URL}/destinations`
    )

    if (!response.ok) {
        throw new Error(
            'Gagal mengambil data destinasi'
        )
    }

    const result = await response.json()

    return result.data
}

export default API_URL