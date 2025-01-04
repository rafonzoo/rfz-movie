import { useEffect, useRef } from 'react'

const cachedLastVisit = new Map<string, [string, number]>()

export function useLastVisit() {
  return {
    get: (key: string) => cachedLastVisit.get(key) || ['', 0],
    set: (key: string, val: [string, number]) => cachedLastVisit.set(key, val),
  }
}

export function useMountEffect(cb: () => void) {
  const cbRef = useRef(cb)
  useEffect(() => cbRef.current(), [])
}
