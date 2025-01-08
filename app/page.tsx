// async function getTrending() {
//   const { results } = await api<TrendingResults<'all'>>('/trending/all/day')
//   return results.filter((item) => item.media_type !== 'person')
// }

import { getFeaturedShow, getNowPlaying } from '@/server/queries'
import FeaturedPoster from '@/components/Featured/Home'
import PosterDefault from '@/components/Poster/Default'

export default async function Home() {
  // const stage = await getStageItems(cinemas)
  const cinemas = await getNowPlaying()
  const { results: featured } = await getFeaturedShow()

  return (
    <main>
      <FeaturedPoster lists={featured} />
      <PosterDefault orientation='portrait' items={cinemas}>
        Hari ini di bioskop
      </PosterDefault>
    </main>
  )
}
