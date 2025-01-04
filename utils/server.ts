'server-only'

import { RequestInit } from 'next/dist/server/web/spec-extension/request'

export async function api<T>(path: string, opt?: RequestInit) {
  const url = `${process.env.TMDB_API_URL}${path}`
  const options = {
    cache: 'force-cache' as const,
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    },
  }

  const res = await fetch(url, { ...options, ...opt })
  const json = await res.json()
  return json as T
}
