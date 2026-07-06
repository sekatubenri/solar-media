import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = {
  title: { default: '太陽光発電ナビ | 費用・補助金・業者比較', template: '%s | 太陽光発電ナビ' },
  description: '太陽光発電の設置費用・補助金・業者比較を徹底解説。蓄電池との組み合わせや売電収入シミュレーションも。',
  verification: { google: 'XcyMImXtiMlMj5NBeiKQBcD_Vqrw3EDW0TDFBVTAtaA' },
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50 text-gray-800">
        <header className="bg-yellow-500 text-white shadow">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold tracking-tight">☀️ 太陽光発電ナビ</a>
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <a href="/category/cost" className="hover:text-yellow-100">費用・補助金</a>
              <a href="/category/panel" className="hover:text-yellow-100">パネル選び</a>
              <a href="/category/company" className="hover:text-yellow-100">業者比較</a>
              <a href="/category/beginner" className="hover:text-yellow-100">入門ガイド</a>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        <footer className="bg-gray-800 text-gray-400 text-sm mt-16">
          <div className="max-w-5xl mx-auto px-4 py-8 text-center">
            <p>© 2025 太陽光発電ナビ | 費用・補助金・業者比較</p>
            <p className="mt-1 text-xs">※本サイトにはアフィリエイト広告が含まれます</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
