import { Images, EntityTVorMovie } from '@/types'
import { getMediaType } from '@/utils/helper'
import { api } from '@/utils/server'

type FeaturedResult<T extends EntityTVorMovie[]> = {
  results: T
  total_pages: number
}

type FeaturedMedia = {
  media: {
    poster: string
    backdrop: string
    logo: string
  }
}

type InsertTypeToArray<T, A extends unknown[]> = (A[number] & T)[]

type WithMedia<T extends unknown[]> = InsertTypeToArray<FeaturedMedia, T>

export async function getFeaturedShow<T extends EntityTVorMovie[]>() {
  let fetchedItems: EntityTVorMovie[] = []
  let totalPages = Infinity
  let currentPage = 1

  // Featured is trending item without person
  const featured: WithMedia<T> = []

  while (featured.length < 10 && currentPage <= totalPages) {
    try {
      // Fetch trending items from the API
      const url = `/trending/all/week?page=${currentPage}`
      const { results, total_pages } = await api<FeaturedResult<T>>(url)

      totalPages = total_pages
      currentPage++

      // Filter and sort the results
      const validItems = results
        .filter((item) => item.overview && item.genre_ids.length)
        .sort((a, b) => b.popularity - a.popularity)

      fetchedItems = [...fetchedItems, ...validItems]

      // Fetch media details for the remaining items concurrently
      const imageFetches = fetchedItems
        .slice(featured.length, featured.length + 10 - featured.length)
        .map(async (item) => {
          try {
            const { posters, backdrops, logos } = await api<Images>(
              `/${getMediaType(item)}/${item.id}/images`
            )

            const { poster, backdrop, logo } = {
              poster: posters.find((x) => !x.iso_639_1)?.file_path || '',
              backdrop: backdrops.find((x) => !x.iso_639_1)?.file_path || '',
              logo: logos.find((x) => x.iso_639_1 === 'en')?.file_path || '',
            }

            if (poster && backdrop && logo) {
              return {
                ...item,
                media: { poster, backdrop, logo },
              }
            }
          } catch (imageError) {
            console.error(
              `Failed to fetch images for item ID ${item.id}:`,
              imageError
            )
          }
          return null
        })

      // Await all media fetches and add valid results to trending
      featured.push(...(await Promise.all(imageFetches)).filter(Boolean))

      // Remove processed items from the list
      fetchedItems = fetchedItems.slice(featured.length)
    } catch (error) {
      console.error(
        `Failed to fetch trending data on page ${currentPage - 1}:`,
        error
      )
      break // Exit if an API error occurs
    }
  }

  return { results: featured }
}
