import {
  Images,
  EntityTVorMovie,
  type MoviesPlayingNow,
} from '@/types/entities'
import { getMediaType, isTVorMovie, slugify } from '@/helpers/entities'
import { api } from '@/server/utils'

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
  let overviewId = new Map<number, string>()
  let totalPages = Infinity
  let totalFetch = 1
  let currentPage = 1

  // Featured is trending item without person
  const featured: WithMedia<T> = []
  const countRequest = false

  while (featured.length < 10 && currentPage <= totalPages) {
    try {
      // Revalidate every n seconds (Only work after build)
      const opt = { next: { revalidate: 60 * 60 * 24 } }
      const url = `/trending/all/day?page=${currentPage}`

      // Fetch trending items from the API
      const [IDResult, ENResult] = await Promise.all([
        api<FeaturedResult<T>>(`${url}&language=id-ID`, opt),
        api<FeaturedResult<T>>(`${url}&language=en-US`, opt),
      ])

      overviewId = new Map(
        IDResult.results
          .filter((item) => !!item.overview)
          .map((item) => [item.id, item.overview])
      )

      totalPages = ENResult.total_pages
      currentPage++
      totalFetch++

      // Filter and sort the results
      const validItems = ENResult.results
        .filter(isTVorMovie)
        .sort((a, b) => b.popularity - a.popularity)
        .map((item) => ({
          ...item,
          overview: overviewId.get(item.id) || item.overview,
        }))

      fetchedItems = [...fetchedItems, ...validItems]

      // Fetch media details for the remaining items concurrently
      const imageFetches = fetchedItems
        .slice(featured.length, featured.length + 10 - featured.length)
        .map(async (item) => {
          try {
            const { posters, backdrops, logos } = await api<Images>(
              `/${getMediaType(item)}/${item.id}/images`,
              opt
            )

            const { poster, backdrop, logo } = {
              poster: posters.find((x) => !x.iso_639_1)?.file_path || '',
              backdrop: backdrops.find((x) => !x.iso_639_1)?.file_path || '',
              logo: logos.find((x) => x.iso_639_1 === 'en')?.file_path || '',
            }

            // Estimate total request
            totalFetch++

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

      // Await all media fetches and add valid results to featured
      featured.push(...(await Promise.all(imageFetches)).filter(Boolean))

      // Remove processed items from the list
      fetchedItems = fetchedItems.slice(featured.length)
    } catch (error) {
      console.error(
        `Failed to fetch featured data on page ${currentPage - 1}:`,
        error
      )
      break // Exit if an API error occurs
    }
  }

  if (countRequest) console.log(totalFetch)
  return { results: featured }
}

export async function getNowPlaying() {
  const countries = ['en', 'ko', 'cn']
  const url = '/movie/now_playing?region=id'
  const [page1] = await Promise.all([
    api<MoviesPlayingNow>(url + '&page=1'),
    // api<MoviesPlayingNow>(url + '&page=2'),
  ])

  const results = [...page1.results]
  // const cinemas = results.filter((item) => item.original_language === 'id')
  const boxOffice = results.filter((movie) =>
    countries.includes(movie.original_language)
  )
  // .filter((movie) => countries.includes(movie.original_language))
  // .sort((a, b) => {
  //   const dateA = new Date(a.release_date).getTime()
  //   const dateB = new Date(b.release_date).getTime()
  //   return dateB - dateA
  // })

  // try {
  //   // const htmlString = await (await fetch('https://21cineplex.com')).text()
  //   // const matches = htmlString.match(/<a href="https:\/\/21cineplex\.com\/([^,\/]+)(?:\.htm|,[^,]+,[^,]+\.htm)">/g) // prettier-ignore
  //   const htmlString = await (
  //     await fetch('https://cinepolis.co.id/home.aspx/loadNowShowingMovies', {
  //       method: 'POST',
  //       headers: {

  //       }
  //     })
  //   ).text()
  //   const matches = htmlString.match(/CommonPageHelper\.SelMovie\('[^']+','([^']+)'/g) // prettier-ignore
  //   if (matches) {
  //     matches.forEach((match) => {
  //       // const slug = match.replace(/.*https:\/\/21cineplex\.com\/([^,\/]+)(?:\.htm|,[^,]+,[^,]+\.htm).*/, '$1') // prettier-ignore
  //       const slug = match.replace(/^CommonPageHelper\.SelMovie\('[^']+','([^']+)'/, '$1') // prettier-ignore
  //       const item = boxOffice.find((item) =>
  //         slugify(item.title).includes(slug)
  //       )

  //       // if (item) cinemas.push(item)
  //     })
  //   }
  // } catch (e) {
  //   console.log(e)
  // }

  const availableCinema = results.sort((a, b) => {
    const dateA = new Date(a.release_date).getTime()
    const dateB = new Date(b.release_date).getTime()
    return dateB - dateA
  })

  // console.log(results.map((item) => item.title))

  return availableCinema
}
