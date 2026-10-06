const SERVER_URL = 'http://localhost:5001'

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