import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DaurTani - Solusi Daur Ulang Limbah Pertanian',
  description: 'Platform marketplace dan komunitas untuk daur ulang limbah pertanian berkelanjutan',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <a href="/" className="text-xl font-bold text-green-600">
                  DaurTani
                </a>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center space-x-4">
                  <a href="/marketplace" className="text-gray-600 hover:text-green-600 px-3 py-2">
                    Marketplace
                  </a>
                  <a href="/panduan" className="text-gray-600 hover:text-green-600 px-3 py-2">
                    Panduan
                  </a>
                  <a href="/komunitas" className="text-gray-600 hover:text-green-600 px-3 py-2">
                    Komunitas
                  </a>
                  <a href="/login" className="text-gray-600 hover:text-green-600 px-3 py-2">
                    Masuk
                  </a>
                  <a
                    href="/register"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Daftar
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
        {children}
        <footer className="bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">DaurTani</h3>
                <p className="text-gray-600">
                  Solusi daur ulang limbah pertanian untuk masa depan yang lebih berkelanjutan
                </p>
              </div>
              <div>
                <h4 className="text-gray-900 font-medium mb-4">Produk</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="/marketplace" className="text-gray-600 hover:text-green-600">
                      Marketplace
                    </a>
                  </li>
                  <li>
                    <a href="/panduan" className="text-gray-600 hover:text-green-600">
                      Panduan
                    </a>
                  </li>
                  <li>
                    <a href="/komunitas" className="text-gray-600 hover:text-green-600">
                      Komunitas
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-gray-900 font-medium mb-4">Perusahaan</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="/about" className="text-gray-600 hover:text-green-600">
                      Tentang Kami
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="text-gray-600 hover:text-green-600">
                      Kontak
                    </a>
                  </li>
                  <li>
                    <a href="/blog" className="text-gray-600 hover:text-green-600">
                      Blog
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-gray-900 font-medium mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="/privacy" className="text-gray-600 hover:text-green-600">
                      Privasi
                    </a>
                  </li>
                  <li>
                    <a href="/terms" className="text-gray-600 hover:text-green-600">
                      Syarat & Ketentuan
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-200 mt-12 pt-8">
              <p className="text-gray-600 text-center">
                © {new Date().getFullYear()} DaurTani. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}