'use client'

import { EntityTVorMovie } from '@/types/entities'
import { FC, useEffect, useRef } from 'react'
import { getFirstGenre, getMediaType, getTitleOrName } from '@/helpers/entities'
import { useMemoCache } from '@/hooks'
import Link from 'next/link'
import Image from '@/components/Image'

export type MovieOrTVWithMedia = EntityTVorMovie & {
  media: { [P in 'logo' | 'poster' | 'backdrop']: string }
}

type FeaturedPosterProps = {
  lists: MovieOrTVWithMedia[]
}

const FeaturedPoster: FC<FeaturedPosterProps> = ({ lists }) => {
  const memoCache = useMemoCache()
  const prev = memoCache.get('from') || ''

  // Refs for tracking state
  const prevIndex = useRef(prev.includes('featured') ? +prev.split('-')[1] : 0)
  const wrapper = useRef<HTMLDivElement | null>(null)
  const autoplay = useRef<NodeJS.Timeout>(void 0)
  const allowNext = useRef<NodeJS.Timeout>(void 0)
  const selected = useRef(prevIndex.current)
  const lastScrollY = useRef(0)
  const disableAutoplay = useRef(true)

  // Navigate to the next item in the list
  const goNext = useRef((index = selected.current) => {
    const current = wrapper.current
    const children = current?.children

    // If autoplay disabled exit early
    if (!current || !children || disableAutoplay.current) {
      return
    }

    if (index !== selected.current) {
      selected.current = index
    }

    clearInterval(autoplay.current)
    autoplay.current = setInterval(() => {
      let target = null

      if (selected.current === children.length - 1) {
        target = children[0]
      } else {
        target = children[selected.current]?.nextElementSibling
      }

      target?.scrollIntoView()
      window.scroll({ top: lastScrollY.current })
    }, 5_000)
  })

  // Navigate to the next item on click
  const onPaddleClick = useRef((index: number) => {
    const divAsButton = wrapper.current?.children[index]
    const target = divAsButton as HTMLButtonElement | null

    if (!target) return

    wrapper.current?.focus()
    wrapper.current?.setAttribute('data-unfocus', '1')

    // This timeout fix safari instant snapping scroll
    setTimeout(() => {
      target.scrollIntoView()
      window.scroll({ top: lastScrollY.current })

      // Update selected index with current index
      goNext.current(index)
    }, 0)
  })

  useEffect(() => {
    if (!wrapper.current) return

    const elementIndices: { [key: string]: number } = {}
    const children = Array.from(wrapper.current.children)
    const navElements = Array.from(
      wrapper.current?.nextElementSibling?.children || []
    )

    // Observer to track visible elements
    const observer = new IntersectionObserver(
      (entries) => {
        const activatedEntry = entries.reduce(function (max, entry) {
          return entry.intersectionRatio > max.intersectionRatio ? entry : max
        })

        if (activatedEntry.intersectionRatio > 0) {
          const id = activatedEntry.target.getAttribute('data-id')
          const currentIndex = elementIndices[id || '']
          selected.current = currentIndex

          navElements.forEach((nav, index) => {
            nav.firstElementChild?.classList.toggle(
              'bg-white',
              index === currentIndex
            )
          })
        }
      },
      {
        root: wrapper.current,
        threshold: 0.75,
      }
    )

    // Map indices and observe children
    children.forEach((child, index) => {
      elementIndices[child.getAttribute('data-id') || ''] = index
      observer.observe(child)
    })

    // Scroll to last visited child
    prevIndex.current !== 0 && wrapper.current?.focus()
    children[prevIndex.current]?.scrollIntoView({ behavior: 'instant' })

    return () => {
      observer.disconnect()
      clearInterval(autoplay.current)
    }
  }, [])

  // Track last position of scroll Y
  useEffect(() => {
    const lastPosY = (e: Event) => {
      lastScrollY.current = (e.currentTarget as Window).scrollY
    }

    window.addEventListener('scroll', lastPosY)
    return () => window.removeEventListener('scroll', lastPosY)
  }, [])

  // Disable or enable autoplay based on visibility of the scroller
  useEffect(() => {
    const scroller = wrapper.current

    if (disableAutoplay.current || !scroller) {
      return
    }

    const visibilityChange = () => {
      if (document.hidden) {
        clearTimeout(autoplay.current)
      } else {
        goNext.current()
      }
    }

    const handleScroll = (e: Event) => {
      const { scrollLeft, offsetWidth } = e.currentTarget as HTMLElement
      const timeout = scrollLeft % offsetWidth === 0 ? 0 : 150

      clearInterval(allowNext.current)
      clearTimeout(autoplay.current)

      allowNext.current = setTimeout(() => {
        if (timeout === 0) goNext.current()
      }, timeout)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            goNext.current()
          } else {
            clearTimeout(autoplay.current)
          }
        })
      },
      { threshold: 0.4 }
    )

    observer.observe(scroller)
    document.addEventListener('visibilitychange', visibilityChange, false)
    scroller.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('visibilitychange', visibilityChange, false)
      scroller.removeEventListener('scroll', handleScroll)
      observer.disconnect()
      clearTimeout(allowNext.current)
    }
  }, [])

  if (!lists.length) {
    return null
  }

  return (
    <section className='mx-auto lg:w-[var(--max-width)] lg:rounded-lg'>
      <div
        ref={wrapper}
        tabIndex={0}
        data-scrollbar='hide'
        data-unfocus='0'
        onBlur={(e) => e.currentTarget.setAttribute('data-unfocus', '0')}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            return e.currentTarget.setAttribute('data-unfocus', '1')
          }
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.currentTarget.setAttribute('data-unfocus', '0')
            return goNext.current()
          }
          if (e.key === 'Enter') {
            const link = e.currentTarget.children[selected.current]
            if (link instanceof HTMLAnchorElement) {
              link.click()
            }
          }
        }}
        className={[
          'group/featured mx-auto max-w-full snap-x snap-mandatory overflow-auto scroll-smooth whitespace-nowrap text-[0] outline-none',
          'after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:right-0 after:top-0 after:z-[1]',
          'after:focus-visible:ring-4 after:focus-visible:ring-inset after:focus-visible:ring-blue-400 after:data-[unfocus=1]:ring-0',
        ].join(' ')}
      >
        {lists.map((list, index) => (
          <Link
            tabIndex={-1}
            key={list.id}
            data-id={list.id}
            onClick={() => memoCache.set('from', `featured-${index}`)}
            className='relative inline-block w-full snap-center overflow-hidden text-base outline-none max-md:aspect-[.5625] max-md:max-h-[calc(90svh_-_53px)] max-md:min-h-[454px] md:h-auto md:pt-[56.25%] lg:pt-[calc(56.25%_-_100px)]'
            href={`/${getMediaType(list)}/${getTitleOrName(list)
              .toLowerCase()
              .replace(/[^\w\s]/gi, '')
              .replace(/\s/g, '-')}/${list.id}`}
          >
            <div className='absolute bottom-0 left-0 right-0 top-0 flex items-end'>
              <picture className='absolute left-0 top-0 h-full'>
                <source
                  media='(min-width: 768px)'
                  srcSet={`https://image.tmdb.org/t/p/w1280${list.media.backdrop}`}
                />
                <Image
                  src={`https://image.tmdb.org/t/p/w780${list.media.poster}`}
                  alt={getTitleOrName(list)}
                  className='absolute left-0 top-0 h-full bg-zinc-800 object-cover'
                />
              </picture>
              <div className='pointer-events-none absolute bottom-0 left-0 right-0 top-0 z-[1]'>
                <div className='absolute -bottom-px left-0 right-0 top-0'></div>
                <div className='absolute -bottom-px left-0 right-0 top-0 z-[1] bg-[linear-gradient(rgba(0,_0,_0,_0)_40%,_rgba(0,_0,_0,_.7)_100%)]'></div>
              </div>
              <div className='relative z-[2] mx-auto mb-12 mt-[70px] w-[min(85.334%,320px)] md:w-[89.583%] lg:mb-20 lg:w-[87.5%]'>
                <div className='w-fit origin-bottom-left max-md:w-full lg:scale-110'>
                  <h2 className='sr-only'>{getTitleOrName(list)}</h2>
                  <img
                    src={`https://image.tmdb.org/t/p/w300${list.media.logo}`}
                    alt={getTitleOrName(list) + ' Logo'}
                    loading='lazy'
                    className='block max-h-[60px] w-auto max-w-[240px] max-md:mx-auto md:max-h-[80px]'
                  />
                  <div className='whitespace-normal max-md:mx-auto'>
                    <div className='mb-1 mt-2 flex items-center text-[11px] font-semibold uppercase leading-4 tracking-wider text-zinc-300/80 max-md:justify-center'>
                      <p className='rounded-md bg-red-600 px-1.5 py-1 text-[10px] leading-3 text-white'>
                        Trending
                      </p>
                      <span className='mx-1 block'>/</span>
                      <p>{getFirstGenre(list).replace(/^([\w-]+).*/g, '$1')}</p>
                    </div>
                    <p className='line-clamp-2 text-sm tracking-normal text-white max-md:text-center md:max-w-[320px] md:text-base'>
                      {list.overview}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className='absolute bottom-0 left-0 right-0 z-[3] flex justify-center pb-4'>
        {lists.map((list, index) => (
          <div
            key={list.id}
            className='flex h-5 w-5 cursor-pointer items-center justify-center rounded-full'
            onClick={() => onPaddleClick.current(index)}
          >
            <span className='block h-2 w-2 rounded-full [&:not(.bg-white)]:bg-white/30' />
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturedPoster
