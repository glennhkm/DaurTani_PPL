import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, Recycle, Users } from "lucide-react";
import { MainLogoLarge } from "@/components/iconAndLogo/mainLogoLarge";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative">
        <div className="w-screen h-screen absolute inset-0 -z-10">
          <Image
            src="/images/bgHero.webp"
            alt="Hero Image"
            fill
            className="object-cover"
          />
        </div>
        <div className="w-screen h-screen absolute inset-0 bg-gradient-to-t from-brand03 to-transparent -z-[9]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <div className="text-center flex flex-col items-center">
            <MainLogoLarge width="500" />
            <p className={`text-xl mb-8 max-w-3xl mx-auto mt-10 text-neutral01`}>
              Mengubah limbah pertanian menjadi produk bernilai tinggi untuk
              masa depan pertanian yang lebih berkelanjutan
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/register"
                className="bg-brand01 text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-colors"
              >
                Mulai Sekarang
                <ArrowRight className="inline-block ml-2" size={20} />
              </Link>
              {/* <Link
                href="/about"
                className="bg-white text-brand01 border-2 border-brand01 px-8 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors"
              >
                Pelajari Lebih Lanjut
              </Link> */}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-brand03 from-10%% to-80% to-neutral01">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-neutral01 mb-12">
            Fitur Utama
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Recycle className="text-brand01" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Marketplace Limbah</h3>
              <p className="text-gray-600">
                Platform jual-beli limbah pertanian yang menghubungkan petani
                dengan industri pengolahan
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Leaf className="text-brand01" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Panduan Pengolahan</h3>
              <p className="text-gray-600">
                Informasi dan tutorial lengkap tentang metode pengolahan limbah
                menjadi produk bernilai
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-brand01" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Komunitas</h3>
              <p className="text-gray-600">
                Forum diskusi dan berbagi pengalaman antar pelaku daur ulang
                limbah pertanian
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand01 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Bergabung Sekarang
          </h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto">
            Jadilah bagian dari gerakan pertanian berkelanjutan. Mulai daur
            ulang limbah pertanian Anda hari ini.
          </p>
          <Link
            href="/register"
            className="bg-white text-brand01 px-8 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors inline-flex items-center"
          >
            Daftar Gratis
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>
    </main>
  );
}
