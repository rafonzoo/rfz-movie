import { EntityAll, Genres, EntityTVorMovie } from '@/types'

export function getTitleOrName(item: EntityAll) {
  if ('name' in item) return item.name
  if ('title' in item) return item.title

  console.warn('No key matches in item. Returning empty string...')
  return ''
}

export function getReleaseDate(item: EntityAll) {
  if ('release_date' in item) return new Date(item.release_date)
  if ('first_air_date' in item) return new Date(item.first_air_date)

  console.warn("No key matches in item. Returning today's date...")
  return new Date()
}

export function getFirstGenre(item: EntityTVorMovie) {
  let genre: null | { id: number; name: string } = null
  let i = 0

  while (i < item.genre_ids.length) {
    const current = Genres.find((gen) => gen.id === item.genre_ids[i])
    if (current) {
      genre = current
      break
    }
    i++
  }

  if (!genre) {
    console.warn('No genre found. Returning empty string...')
  }

  return genre?.name || ''
}
