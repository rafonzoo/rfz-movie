// async function getTrending() {
//   const { results } = await api<TrendingResults<'all'>>('/trending/all/day')
//   return results.filter((item) => item.media_type !== 'person')
// }

import FeaturedPoster from '@/components/Featured/Home'
import { getFeaturedShow } from '@/queries/featured'
import { EntityAll } from '@/types'

// async function getNowPlaying() {
//   const countries = ['id', 'en', 'ko', 'cn']
//   const { results } = await api<MoviesPlayingNow>(
//     '/movie/now_playing?region=id'
//   )

//   return results
//     .filter((movie) => countries.includes(movie.original_language))
//     .sort((a, b) => {
//       const dateA = new Date(a.release_date).getTime()
//       const dateB = new Date(b.release_date).getTime()
//       return dateB - dateA
//     })
// }

export default async function Home() {
  // const cinemas = await getNowPlaying()
  // const stage = await getStageItems(cinemas)
  const { results: featured } = await getFeaturedShow()

  return (
    <main>
      <div>
        <FeaturedPoster id='featured-1' lists={featured} />
      </div>
    </main>
  )
}
