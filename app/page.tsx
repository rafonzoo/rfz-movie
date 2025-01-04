import { MoviesPlayingNow, PopularTvShows, TrendingResults } from '@/types'
import { getStageItems } from '@/queries/stage'
import { api } from '@/utils/server'
import SectionStage from '@/components/Section/Stage'

async function getTrending() {
  const { results } = await api<TrendingResults<'all'>>('/trending/all/day')
  return results.filter((item) => item.media_type !== 'person')
}

async function getNowPlaying() {
  const countries = ['id', 'en', 'ko', 'cn']
  const { results } = await api<MoviesPlayingNow>(
    '/movie/now_playing?region=id'
  )

  return results
    .filter((movie) => countries.includes(movie.original_language))
    .sort((a, b) => {
      const dateA = new Date(a.release_date).getTime()
      const dateB = new Date(b.release_date).getTime()
      return dateB - dateA
    })
}

export default async function Home() {
  // const trending = await getTrending()
  const cinemas = await getNowPlaying()
  const stage = await getStageItems(cinemas)

  // console.log(
  //   stage.hero.popularity,
  //   stage.lists.map((p) => p.popularity)
  // )

  return (
    <main>
      <SectionStage
        // hero={hero}
        // lists={Array.from(Array(20).keys())}
        {...stage}
        orientation='portrait'
        // orientation='circle'
      />
      {/* <div>
        {[...stage.hero.media.posters, ...stage.hero.media.backdrops].map(
          (url, i) => (
            <div key={i}>
              <img
                src={`https://image.tmdb.org/t/p/w300${url}`}
                // src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                alt=''
              />
            </div>
          )
        )}
      </div> */}
    </main>
  )
}
