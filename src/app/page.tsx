"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, Recycle, Users } from "lucide-react";
import { MainLogo } from "@/components/iconAndLogo/mainLogo";
import { Typewriter } from "react-simple-typewriter";
import { dmSerifDisplay } from "@/components/fonts/dmSerifDisplay";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-b from-neutral01 to-white flex items-center relative">
        <div className="w-screen h-screen absolute inset-0 bg-brand03/55 backdrop-blur-md z-10"></div>
        <div className="absolute inset-0 before:absolute before:inset-0">
          <Image
            src="/images/imageHero.png"
            alt="Background Image"
            fill
            className="object-cover"
          />
        </div>
        <div className="max-w-7xl px-4 sm:px-6 lg:px-20 mt-auto py-12 md:py-24 z-10">
          <div className="flex flex-col gap-6">
            <MainLogo width="500" />
            <h1
              className={`text-4xl font-bold text-brand02 -mt-7 ${dmSerifDisplay.className}`}
            >
              <Typewriter
                words={["Pertanian Berkelanjutan.", "Kelola Limbah.", "Hijaukan Bumi."]}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={100}
                deleteSpeed={100}
                delaySpeed={1000}
              />
            </h1>
            <p className="text-xl text-neutral01 max-w-xl mx-auto">
              Mengubah limbah pertanian menjadi produk bernilai tinggi untuk
              masa depan pertanian yang lebih berkelanjutan
            </p>
            <div className="flex gap-4">
              <Link
                href="/register"
                className={`bg-brand01 text-white px-8 py-3 font-medium hover:bg-brand01/90 transition-colors ${dmSerifDisplay.className}`}
              >
                Mulai Sekarang
                <ArrowRight className="inline-block ml-2" size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-brand03 mb-12">
            Fitur Utama
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-brand01/20">
              <div className="w-12 h-12 bg-neutral01 rounded-lg flex items-center justify-center mb-4">
                <Recycle className="text-brand01" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-brand03">
                Marketplace Limbah
              </h3>
              <p className="text-brand03/80">
                Platform jual-beli limbah pertanian yang menghubungkan petani
                dengan industri pengolahan
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-brand01/20">
              <div className="w-12 h-12 bg-neutral01 rounded-lg flex items-center justify-center mb-4">
                <Leaf className="text-brand01" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-brand03">
                Panduan Pengolahan
              </h3>
              <p className="text-brand03/80">
                Informasi dan tutorial lengkap tentang metode pengolahan limbah
                menjadi produk bernilai
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-brand01/20">
              <div className="w-12 h-12 bg-neutral01 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-brand01" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-brand03">
                Komunitas
              </h3>
              <p className="text-brand03/80">
                Forum diskusi dan berbagi pengalaman antar pelaku daur ulang
                limbah pertanian
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#B69A1D] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Bergabung Sekarang
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Jadilah bagian dari gerakan pertanian berkelanjutan. Mulai daur
            ulang limbah pertanian Anda hari ini.
          </p>
          <Link
            href="/register"
            className="bg-neutral01 text-[#B69A1D] px-8 py-3 rounded-lg font-medium hover:bg-white transition-colors inline-flex items-center"
          >
            Daftar Gratis
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>
    </main>
  );
}
