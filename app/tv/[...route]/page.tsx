import { notFound } from 'next/navigation'

async function TVDetail({ params }: { params: Promise<{ route: string }> }) {
  const [, id] = (await params).route

  if (!id) {
    return notFound()
  }

  return (
    <main>
      <p>hellow</p>
    </main>
  )
}

export default TVDetail
