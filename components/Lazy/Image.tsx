'use client'

import { FC, JSX, useEffect, useRef, useState } from 'react'

const LazyImage: FC<JSX.IntrinsicElements['img']> = ({ src, ...props }) => {
  const [url, setUrl] = useState('')
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!wrapperRef.current || !src) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLDivElement
          if (entry.isIntersecting && src) {
            setUrl(src)
            observer.unobserve(target)
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(wrapperRef.current)
    return () => observer.disconnect()
  }, [src])

  if (!url) {
    return <div ref={wrapperRef} className={props.className} />
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img {...props} src={url} />
  )
}

export default LazyImage
