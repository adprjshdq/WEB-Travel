const API_URL = 'http://localhost:5001/api'

export const getDestinations = async () => {
    const response = await fetch(`${API_URL}/destinations`)
    if (!response.ok) {
        throw new Error('Gagal mengambil data destinasi')
    }

    const result = await response.json()
    
    return result.data
}
