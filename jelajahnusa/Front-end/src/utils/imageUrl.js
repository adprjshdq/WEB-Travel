import API_URL from '../services/api'

const SERVER_URL =
    API_URL.replace(/\/api\/?$/, '')

export const getImageUrl = (image) => {
    if (!image) {
        return '/images/Labuan bajo copy.jpg'
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