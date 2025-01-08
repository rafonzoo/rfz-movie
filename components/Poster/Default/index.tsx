'use client'

import { FC } from 'react'
import { EntityAll } from '@/types/entities'
import {
  getFirstGenre,
  getImageOf,
  getTitleOrName,
  isTVorMovie,
} from '@/helpers/entities'
import { tw } from '@/lib'

type PosterDefaultProps = {
  items: EntityAll[]
  children?: React.ReactNode
  orientation?: 'portrait' | 'landscape' | 'circle'
}

const PosterDefault: FC<PosterDefaultProps> = ({
  items,
  children,
  orientation = 'landscape',
}) => {
  return (
    <div className='mx-auto w-full overflow-hidden pb-10 md:px-10 md:pb-12 lg:w-[var(--max-width)]'>
      <h3 className='pb-2 pt-4 text-xl font-bold tracking-tight max-md:px-5 md:pb-2.5 md:pt-6'>
        {children}
      </h3>
      <div
        data-scrollbar='hide'
        className={[
          'grid grid-flow-col gap-x-3 overflow-auto whitespace-nowrap text-[0] max-md:px-5 md:snap-x md:snap-mandatory md:gap-x-5',
          orientation === 'portrait' ? 'auto-cols-[min(34.6491228070175%,130.5px)] md:auto-cols-[calc((100%_-_3_*_20px)_/_4)] lg:auto-cols-[calc((100%_-_4_*_20px)_/_5)] xl:auto-cols-[calc((100%_-_5_*_20px)_/_6)]' : '', // prettier-ignore
          orientation === 'landscape' ? 'auto-cols-[min(54.795%,200px)] md:auto-cols-[calc((100%_-_3_*_20px)_/_4)] lg:auto-cols-[calc((100%_-_4_*_20px)_/_5)] xl:auto-cols-[calc((100%_-_5_*_20px)_/_6)]' : '', // prettier-ignore
          orientation === 'circle' ? 'auto-cols-[min(28.0725%,102.45px)] md:auto-cols-[calc((100%_-_7_*_20px)_/_8)] lg:auto-cols-[calc((100%_-_8_*_20px)_/_9)] xl:auto-cols-[calc((100%_-_9_*_20px)_/_10)] 2xl:auto-cols-[calc((100%_-_10_*_20px)_/_11)]' : '', // prettier-ignore
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className={[
              'inline-block overflow-hidden whitespace-normal text-base md:snap-start',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className='text-xs md:text-sm'>
              <div
                className={tw('relative overflow-hidden', [
                  orientation === 'portrait' ? 'pt-[150%]' : '',
                  orientation === 'landscape' ? 'pt-[56.25%]' : '',
                  orientation === 'circle' ? 'pt-[100%]' : '',
                  orientation === 'circle' ? 'rounded-full' : 'rounded-lg',
                ])}
              >
                <img
                  loading='lazy'
                  className='absolute left-0 top-0 h-full w-full'
                  src={`https://image.tmdb.org/t/p/w300${getImageOf(item)}`}
                  alt={getTitleOrName(item)}
                />
              </div>
              <p className='mt-1 line-clamp-2'>{getTitleOrName(item)}</p>
              {isTVorMovie(item) && (
                <p className='-mt-0.5 line-clamp-1 text-xs opacity-40'>
                  {getFirstGenre(item)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PosterDefault
