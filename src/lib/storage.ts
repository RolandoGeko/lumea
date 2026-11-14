/** Lectura/escritura segura en localStorage (no falla en modo privado). */
import { brand } from '../config/brand'

const key = (k: string) => `${brand.slug}:${k}`

export function load<T>(k: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key(k))
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function save<T>(k: string, value: T) {
  try {
    localStorage.setItem(key(k), JSON.stringify(value))
  } catch {
    /* almacenamiento no disponible: la web sigue funcionando en memoria */
  }
}

export function remove(k: string) {
  try {
    localStorage.removeItem(key(k))
  } catch {
    /* ignorar */
  }
}
