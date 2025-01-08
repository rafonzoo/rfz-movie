'use client'

import React, { FC, JSX, useId, useRef } from 'react'

type ImageProps = JSX.IntrinsicElements['img'] & {
  errorMap?: Map<string, [number, string]>
}

const Image: FC<ImageProps> = ({ ...props }) => {
  const interval = useRef<NodeJS.Timeout>(void 0)
  const defaultId = useId()
  const id = props.id || defaultId
  const errorMap = new Map<string, [number, string]>()

  function errorRetryable(e: React.SyntheticEvent<HTMLImageElement>) {
    props.onError?.(e)
    // if (!errorMap) return

    const target = e.currentTarget as HTMLImageElement
    const [attempt, url] = errorMap.get(id) || [0, target.src]

    if (attempt >= 3) {
      return clearInterval(interval.current)
    }

    errorMap.set(id, [attempt + 1, url])
    clearInterval(interval.current)

    interval.current = setInterval(() => {
      target.src = `${url}?retry=${attempt + 1}`
      target.onload = retry
      target.onerror = () => {
        if (attempt >= 5) retry()
      }
    }, 2_000)

    function retry() {
      errorMap?.delete(id)
      clearInterval(interval.current)
    }
  }

  return (
    <img
      {...props}
      id={id}
      loading={props.loading || 'lazy'}
      alt={props.alt || ''}
      onError={errorRetryable}
    />
  )
}

export default Image
