import { EntityAll, Genres, EntityTVorMovie } from '@/types'

export function isTVorMovie(item: EntityAll): item is EntityTVorMovie {
  return !('profile_path' in item)
}

export function getMediaType(item: EntityAll) {
  if ('name' in item) return 'tv'
  if ('gender' in item) return 'person'

  return 'movie'
}

export function getTitleOrName(item: EntityAll) {
  if ('name' in item) return item.name
  if ('title' in item) return item.title

  console.warn('No key matches in item. Returning empty string...')
  return ''
}

export function getImageOf(item: EntityAll) {
  if ('poster_path' in item) return item.poster_path as string
  if ('backdrop_path' in item) return item.backdrop_path as string
  if ('profile_path' in item) return item.profile_path as string

  console.warn('No key matches in item. Returning empty string...')
  return ''
}

export function getPosterBackdropOf<
  T extends { poster_path?: string; backdrop_path?: string },
>(key: 'backdrop_path' | 'poster_path', item: T) {
  return key in item ? item[key] : ''
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
