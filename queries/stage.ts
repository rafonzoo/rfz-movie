import { Images, EntityTVorMovie, HeroMedia } from '@/types'
import { api } from '@/utils/server'

async function getStageItems<T extends EntityTVorMovie[]>(lists: T) {
  const featured = lists.reduce(
    (max, item) => (item.popularity > (max?.popularity || 0) ? item : max),
    lists[0]
  )

  // Default hero media
  let hero: T[number] & HeroMedia = {
    ...lists[0],
    media: {
      posters: [lists[0]?.poster_path],
      backdrops: [lists[0]?.backdrop_path],
    },
  }

  // Update hero media if featured item exists
  if (featured) {
    const baseType = 'title' in featured ? 'movie' : 'tv'
    const mediaType = 'media_type' in featured ? featured.media_type : baseType

    hero = {
      ...featured,
      media: createMedia(
        await api<Images>(`/${mediaType}/${featured.id}/images`)
      ),
    }
  }

  return { lists, hero }
}

// Helper to validate and create media from images
function createMedia(images: Images) {
  const validatedBackdrops = validateImages(images.backdrops)
  const validatedPosters = validateImages(images.posters)

  const maxLength = Math.min(validatedBackdrops.length, validatedPosters.length)
  return {
    posters: validatedPosters.slice(0, maxLength),
    backdrops: validatedBackdrops.slice(0, maxLength),
  }
}

// Helper to validate images
function validateImages(images: Images['backdrops']) {
  return images
    .sort((a, b) => a.vote_count - b.vote_count)
    .filter((item) => !item.iso_639_1)
    .slice(0, 5)
    .map((item) => item.file_path)
}

export { getStageItems }
