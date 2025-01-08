export * from './options'
export * from './certification'
export * from './credits'
export * from './companies'
export * from './networks'
export * from './configuration'
export * from './changes'
export * from './movies'
export * from './search'
export * from './tv-shows'
export * from './watch-providers'
export * from './people'
export * from './discover'
export * from './review'
export * from './trending'
export * from './find'
export * from './keywords'
export * from './collections'
export * from './tv-episode'
export * from './tv-seasons'

export interface ErrorResponse {
  status_code: number
  status_message: string
  success: boolean
}

export type MediaType = 'movie' | 'tv' | 'person'

export interface AuthorDetails {
  name: string
  username: string
  avatar_path: string
  rating?: number
}

export type KnownFor = MovieWithMediaType | TVWithMediaType

export interface Person {
  id: number
  name: string
  original_name: string
  known_for: KnownFor[]
  profile_path: string
  adult: boolean
  known_for_department: string
  gender: number
  popularity: number
}

export interface PersonWithMediaType extends Person {
  media_type: 'person'
}

export interface Movie {
  id: number
  poster_path: string
  adult: boolean
  overview: string
  release_date: string
  genre_ids: number[]
  original_title: string
  original_language: string
  title: string
  backdrop_path: string
  popularity: number
  vote_count: number
  video: boolean
  vote_average: number
}

export interface MovieWithMediaType extends Movie {
  media_type: 'movie'
}

export interface Company {
  id: number
  logo_path: string
  name: string
  origin_country: string
}

export interface TV {
  id: number
  adult?: boolean
  name: string
  first_air_date: string
  backdrop_path: string
  genre_ids: number[]
  origin_country: string[]
  original_language: string
  original_name: string
  overview: string
  poster_path: string
  popularity: number
  vote_count: number
  vote_average: number
}

export interface TVWithMediaType extends TV {
  media_type: 'tv'
}

export type EntityTVorMovie = TV | Movie | KnownFor

export type EntityAll = EntityTVorMovie | Person | PersonWithMediaType

export interface Genre {
  id: number
  name: string
}

export interface ExternalIds {
  imdb_id: string
  facebook_id: string
  instagram_id: string
  twitter_id: string
  tvdb_id?: number
  freebase_mid?: string
  freebase_id?: string
  tvrage_id?: number
  wikidata_id: string
  tiktok_id?: string
  youtube_id?: string
  id: number
}

export interface ProductionCompany {
  id: number
  logo_path: string
  name: string
  origin_country: string
}

export interface ProductionCountry {
  iso_3166_1: CountryCode
  name: string
}

export interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

export interface ContentRatings {
  results: ContentRatingsResult[]
  id: number
}

export interface ContentRatingsResult {
  descriptor: unknown[]
  iso_3166_1: CountryCode
  rating: string
}

export interface Recommendation {
  adult: boolean
  backdrop_path?: string
  genre_ids: number[]
  id: number
  original_language: string
  original_title: string
  overview: string
  release_date: string
  poster_path?: string
  popularity: number
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

export interface Recommendations {
  page: number
  results: Recommendation[]
  total_pages: number
  total_results: number
}

export interface Review {
  author: string
  author_details: AuthorDetails
  content: string
  created_at: string
  id: string
  updated_at: string
  url: string
}

export interface Reviews {
  id: number
  page: number
  results: Review[]
  total_pages: number
  total_results: number
}

export interface TranslationData {
  title: string
  overview: string
  homepage: string
}

export interface Translation {
  iso_3166_1: CountryCode
  iso_639_1: string
  name: string
  english_name: string
  data: TranslationData
}

export interface Translations {
  id: number
  translations: Translation[]
}

export interface Image {
  aspect_ratio: number
  file_path: string
  height: number
  iso_639_1: string
  vote_average: number
  vote_count: number
  width: number
}

export interface Images {
  id: number
  backdrops: Image[]
  logos: Image[]
  posters: Image[]
}

export const CountryCodes = [
  'AE',
  'AR',
  'AT',
  'AU',
  'BE',
  'BG',
  'BO',
  'BR',
  'CA',
  'CH',
  'CL',
  'CO',
  'CR',
  'CV',
  'CZ',
  'DE',
  'DK',
  'EC',
  'EE',
  'EG',
  'ES',
  'FI',
  'FR',
  'GB',
  'GH',
  'GR',
  'GT',
  'HK',
  'HN',
  'HU',
  'ID',
  'IE',
  'IL',
  'IN',
  'IT',
  'JP',
  'LT',
  'LV',
  'MU',
  'MX',
  'MY',
  'MZ',
  'NL',
  'NO',
  'NZ',
  'PE',
  'PH',
  'PL',
  'PT',
  'PY',
  'RU',
  'SA',
  'SE',
  'SG',
  'SI',
  'SK',
  'TH',
  'TR',
  'TW',
  'UG',
  'US',
  'VE',
  'ZA',
] as const

export type CountryCode = (typeof CountryCodes)[number]

// Custom

export const Genres = [
  {
    id: 28,
    name: 'Action',
  },
  {
    id: 12,
    name: 'Adventure',
  },
  {
    id: 36,
    name: 'History',
  },
  {
    id: 27,
    name: 'Horror',
  },
  {
    id: 10402,
    name: 'Music',
  },
  {
    id: 10749,
    name: 'Romance',
  },
  {
    id: 878,
    name: 'Science Fiction',
  },
  {
    id: 10770,
    name: 'TV Movie',
  },
  {
    id: 53,
    name: 'Thriller',
  },
  //
  {
    id: 10759,
    name: 'Action & Adventure',
  },
  {
    id: 16,
    name: 'Animation',
  },
  {
    id: 35,
    name: 'Comedy',
  },
  {
    id: 80,
    name: 'Crime',
  },
  {
    id: 99,
    name: 'Documentary',
  },
  {
    id: 18,
    name: 'Drama',
  },
  {
    id: 10751,
    name: 'Family',
  },
  {
    id: 10762,
    name: 'Kids',
  },
  {
    id: 9648,
    name: 'Mystery',
  },
  {
    id: 10763,
    name: 'News',
  },
  {
    id: 10764,
    name: 'Reality',
  },
  {
    id: 10765,
    name: 'Sci-Fi & Fantasy',
  },
  {
    id: 10766,
    name: 'Soap',
  },
  {
    id: 10767,
    name: 'Talk',
  },
  {
    id: 10768,
    name: 'War & Politics',
  },
  {
    id: 37,
    name: 'Western',
  },
]

export type HeroMedia = {
  media: { [P in 'posters' | 'backdrops']: string[] }
}
