import { useEffect, useRef } from 'react'

const cacheMap = new Map<string, string>()

export function useMemoCache() {
  return {
    get: (key: string, def = '') => cacheMap.get(key) || def,
    set: (key: string, val: string) => cacheMap.set(key, val),
  }
}

export function useMountEffect(cb: () => void) {
  const cbRef = useRef(cb)
  useEffect(() => cbRef.current(), [])
}
