import { useEffect, useState } from 'react'

// State yang otomatis tersimpan di localStorage
export default function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : initial }
    catch { return initial }
  })
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* penyimpanan penuh/diblokir */ }
  }, [key, value])
  return [value, setValue]
}
