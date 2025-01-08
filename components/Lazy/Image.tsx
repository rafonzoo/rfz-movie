'use client'

import { FC, JSX, useEffect, useRef, useState } from 'react'

const LazyImage: FC<JSX.IntrinsicElements['img']> = ({ src, ...props }) => {
  const [url, setUrl] = useState('')
  const srcRef = useRef(src || '')
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!wrapperRef.current || !srcRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLDivElement
          if (entry.isIntersecting) {
            setUrl(srcRef.current)
            observer.unobserve(target)
          }
        })
      },
      { threshold: 0.25 }
    )

    observer.observe(wrapperRef.current)
    return () => observer.disconnect()
  }, [])

  if (!url) {
    return <div ref={wrapperRef} className={props.className} />
  }

  return <img {...props} src={url} alt={props.alt || ''} />
}

export default LazyImage
