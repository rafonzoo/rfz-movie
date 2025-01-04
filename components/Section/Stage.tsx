'use client'

import { EntityAll, EntityTVorMovie, HeroMedia } from '@/types'
import { FC } from 'react'
import PosterDefault from '@/components/Poster/Default'
import { getTitleOrName } from '@/utils/helper'

type SectionStageProps = {
  lists: EntityAll[]
  orientation?: 'portrait' | 'landscape' | 'circle'
  hero: EntityTVorMovie & HeroMedia
}

const SectionStage: FC<SectionStageProps> = (props) => {
  return (
    <section className='bg-zinc-800'>
      <div className='flex max-h-[calc(90lvh_-_44px)] flex-col justify-end max-md:h-[177.777776vw] max-md:min-h-[568px] md:h-[56.25vw]'>
        <div className='absolute bottom-0 left-0 right-0 top-0'>absolute</div>
        <div className='relative z-[1]'>
          <div className='w-full'>
            {getTitleOrName(props.hero)}: {props.hero.popularity}
          </div>
          <PosterDefault {...props} />
        </div>
      </div>
    </section>
  )
}

export default SectionStage
