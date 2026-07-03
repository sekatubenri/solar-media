import { getArticlesByCategory } from '@/lib/articles'
import Link from 'next/link'
import { notFound } from 'next/navigation'
const categoryNames: Record<string, string> = { cost: "費用・補助金", panel: "パネル選び", company: "業者比較", beginner: "入門ガイド" }
export function generateStaticParams() {
  return Object.keys(categoryNames).map(slug => ({ slug }))
}
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const name = categoryNames[slug]
  if (!name) notFound()
  const articles = getArticlesByCategory(slug)
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">{name}の記事一覧</h1>
      {articles.length === 0 ? (<p className="text-gray-500">記事を準備中です。</p>) : (
        <div className="grid md:grid-cols-2 gap-5">{articles.map(a => (
          <Link key={a.slug} href={`/article/${a.slug}`} className="bg-white rounded-xl p-5 shadow hover:shadow-md transition border border-gray-100">
            <h2 className="font-bold mb-1 text-gray-800 line-clamp-2">{a.title}</h2>
            <p className="text-sm text-gray-500 line-clamp-2">{a.description}</p>
            <p className="text-xs text-gray-400 mt-2">{a.date}</p>
          </Link>
        ))}</div>
      )}
    </div>
  )
}