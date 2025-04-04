import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Leaf, Recycle, Users } from 'lucide-react'

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              DaurTani
              <span className="block text-2xl md:text-3xl text-green-600 mt-2">
                Solusi Daur Ulang Limbah Pertanian Berkelanjutan
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Mengubah limbah pertanian menjadi produk bernilai tinggi untuk masa depan pertanian yang lebih berkelanjutan
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                href="/register"
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Mulai Sekarang
                <ArrowRight className="inline-block ml-2" size={20} />
              </Link>
              <Link
                href="/about"
                className="bg-white text-green-600 border-2 border-green-600 px-8 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Fitur Utama
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Recycle className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Marketplace Limbah</h3>
              <p className="text-gray-600">
                Platform jual-beli limbah pertanian yang menghubungkan petani dengan industri pengolahan
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Leaf className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Panduan Pengolahan</h3>
              <p className="text-gray-600">
                Informasi dan tutorial lengkap tentang metode pengolahan limbah menjadi produk bernilai
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Komunitas</h3>
              <p className="text-gray-600">
                Forum diskusi dan berbagi pengalaman antar pelaku daur ulang limbah pertanian
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Bergabung Sekarang
          </h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto">
            Jadilah bagian dari gerakan pertanian berkelanjutan. Mulai daur ulang limbah pertanian Anda hari ini.
          </p>
          <Link
            href="/register"
            className="bg-white text-green-600 px-8 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors inline-flex items-center"
          >
            Daftar Gratis
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>
    </main>
  )
}