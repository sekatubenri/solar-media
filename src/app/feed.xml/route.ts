import { getAllArticles } from '@/lib/articles'
const BASE_URL = 'https://solar-media.vercel.app'
export async function GET() {
  const articles = getAllArticles().slice(0, 20)
  const items = articles.map(a => `<item><title><![CDATA[]]></title><link>/article/</link><guid>/article/</guid><pubDate></pubDate><description><![CDATA[]]></description></item>`).join('')
  const rss = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>太陽光発電ナビ</title><link></link><description>太陽光発電の費用・補助金・業者比較</description><language>ja</language></channel></rss>`  
  return new Response(rss, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}