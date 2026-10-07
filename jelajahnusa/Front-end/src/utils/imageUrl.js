export function getImageUrl(image) {
  if (!image) return '';

  if (image === 'upload-1791292990010-rinjani.jpg') {
    return '/images/rinjani.jpg';
  }

  if (image.startsWith('http')) {
    return image;
  }

  if (image.startsWith('upload-')) {
    return `${import.meta.env.VITE_API_URL?.replace('/api', '')}/uploads/${image}`;
  }

  return `/images/${image}`;
}