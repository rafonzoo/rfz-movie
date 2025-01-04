'use client'

import { EntityAll } from '@/types'
import { getTitleOrName } from '@/utils/helper'
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
    <div className='mx-auto w-full max-w-[1680px] overflow-hidden pb-10 md:px-10 md:pb-12'>
      <div
        data-scrollbar='hide'
        className={[
          'grid grid-flow-col gap-x-3 overflow-auto whitespace-nowrap text-[0] max-md:px-6 md:snap-x md:snap-mandatory md:gap-x-5',
          orientation === 'portrait' ? 'auto-cols-[min(36.24%,130.5px)]' : '',
          orientation === 'landscape' ? 'auto-cols-[min(54.795%,200px)]' : '',
          ['portrait', 'landscape'].includes(orientation)
            ? 'md:auto-cols-[calc((100%_-_3_*_20px)_/_4)] lg:auto-cols-[calc((100%_-_4_*_20px)_/_5)] xl:auto-cols-[calc((100%_-_5_*_20px)_/_6)]'
            : 'auto-cols-[min(28.0725%,102.45px)] md:auto-cols-[calc((100%_-_7_*_20px)_/_8)] lg:auto-cols-[calc((100%_-_8_*_20px)_/_9)] xl:auto-cols-[calc((100%_-_9_*_20px)_/_10)] 2xl:auto-cols-[calc((100%_-_10_*_20px)_/_11)]',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {lists.map((item, i) => (
          <div
            key={i}
            className={[
              'relative inline-block overflow-hidden whitespace-normal bg-blue-300 text-base md:snap-start',
              orientation === 'circle' ? 'rounded-full' : 'rounded-lg',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div
              // prettier-ignore
              className={[
                orientation === 'portrait' ? 'pt-[56.25%] max-md:pt-[150%]' : '',
                orientation === 'landscape' ? 'pt-[56.25%]' : '',
                orientation === 'circle' ? 'pt-[100%]' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black'>
                {getTitleOrName(item)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PosterDefault
