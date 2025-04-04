import { ArrowRight } from 'lucide-react'

export default function Marketplace() {
  return (
    <main className="pt-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Marketplace Limbah Pertanian
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Temukan dan jual limbah pertanian Anda di sini. Hubungkan langsung dengan pembeli dan pengolah limbah pertanian.
          </p>
        </div>

        {/* Temporary content - will be replaced with actual marketplace items */}
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Marketplace sedang dalam pengembangan</p>
          <a 
            href="/register"
            className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Daftar untuk Update
            <ArrowRight className="ml-2" size={20} />
          </a>
        </div>
      </div>
    </main>
  )
}