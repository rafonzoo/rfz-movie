'use client'

import { EntityAll } from '@/types'
import {
  getImageOf,
  getPosterBackdropOf,
  getTitleOrName,
  isTVorMovie,
} from '@/utils/helper'
import { tw } from '@/utils/lib'
import { FC } from 'react'

type PosterDefaultProps = {
  lists: EntityAll[]
  orientation?: 'portrait' | 'landscape' | 'circle'
}

const PosterDefault: FC<PosterDefaultProps> = ({
  lists,
  orientation = 'landscape',
}) => {
  return (
    <div className='mx-auto w-full max-w-[1920px] overflow-hidden pb-10 md:px-10 md:pb-12'>
      <div
        data-scrollbar='hide'
        className={[
          'grid grid-flow-col gap-x-3 overflow-auto whitespace-nowrap text-[0] max-md:px-6 md:snap-x md:snap-mandatory md:gap-x-5',
          orientation === 'portrait' ? 'auto-cols-[min(36.24%,130.5px)]' : '',
          orientation === 'landscape' ? 'auto-cols-[min(54.795%,200px)]' : '',
          ['portrait', 'landscape'].includes(orientation)
            ? 'md:auto-cols-[calc((100%_-_5_*_20px)_/_6)] lg:auto-cols-[calc((100%_-_6_*_20px)_/_7)] xl:auto-cols-[calc((100%_-_7_*_20px)_/_8)]'
            : 'auto-cols-[min(28.0725%,102.45px)] md:auto-cols-[calc((100%_-_7_*_20px)_/_8)] lg:auto-cols-[calc((100%_-_8_*_20px)_/_9)] xl:auto-cols-[calc((100%_-_9_*_20px)_/_10)] 2xl:auto-cols-[calc((100%_-_10_*_20px)_/_11)]',
          // ? 'md:auto-cols-[calc((100%_-_3_*_20px)_/_4)] lg:auto-cols-[calc((100%_-_4_*_20px)_/_5)] xl:auto-cols-[calc((100%_-_5_*_20px)_/_6)]'
          // : 'auto-cols-[min(28.0725%,102.45px)] md:auto-cols-[calc((100%_-_7_*_20px)_/_8)] lg:auto-cols-[calc((100%_-_8_*_20px)_/_9)] xl:auto-cols-[calc((100%_-_9_*_20px)_/_10)] 2xl:auto-cols-[calc((100%_-_10_*_20px)_/_11)]',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {lists.map((item, i) => (
          <div
            key={i}
            className={[
              'relative inline-block overflow-hidden whitespace-normal bg-zinc-800 text-base md:snap-start',
              orientation === 'circle' ? 'rounded-full' : 'rounded-lg',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div>
              <div
                // prettier-ignore
                className={tw([
                  // orientation === 'portrait' ? 'pt-[56.25%] max-md:pt-[150%]' : '',
                  // orientation === 'landscape' ? 'pt-[56.25%]' : '',
                  orientation === 'portrait' ? 'pt-[150%]' : '',
                  orientation === 'landscape' ? 'pt-[150%]' : '',
                  orientation === 'circle' ? 'pt-[100%]' : '',
                ])}
              >
                <picture>
                  {orientation !== 'circle' && isTVorMovie(item) && (
                    <>
                      {/* <source
                        media='(min-width: 1280px)'
                        srcSet={`https://image.tmdb.org/t/p/w780${getPosterBackdropOf('backdrop_path', item)}`}
                      />
                      <source
                        media='(min-width: 768px)'
                        srcSet={`https://image.tmdb.org/t/p/w300${getPosterBackdropOf('backdrop_path', item)}`}
                      /> */}
                    </>
                  )}
                  <img
                    loading='lazy'
                    className='absolute left-0 top-0 h-full w-full'
                    src={`https://image.tmdb.org/t/p/w300${getImageOf(item)}`}
                    alt={getTitleOrName(item)}
                  />
                </picture>
                {/* <div className='absolute bottom-0 right-0 pb-1 pr-3 max-md:hidden'>
                  <span className='text-4.5xl font-semibold'>
                    {i + 1}
                  </span>
                </div> */}
              </div>
              <span className='absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 text-black'>
                {/* {isTVorMovie(item) ? item} */}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PosterDefault
