"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MainLogo } from "@/components/iconAndLogo/mainLogo";
import { Typewriter } from "react-simple-typewriter";
import { dmSerifDisplay } from "@/components/fonts/dmSerifDisplay";
import { dmSans } from "@/components/fonts/dmSans";
import { useState } from "react";

export default function Home() {
  const [hoverIndex, setHoverIndex] = useState<Number | null>(null);
  const products = [
    {
      judul: "Marketplace Limbah Pertanian",
      bg_url: "/images/marketplace.jpg",
      deskripsi:
        "Jelajahi tempat jual-beli limbah pertanian seperti ampas tebu, sekam padi, hingga kulit kopi. Fitur ini menghubungkan petani, komunitas, dan pelaku industri yang membutuhkan bahan baku ramah lingkungan. Dengan kategori limbah, pencarian cepat, dan notifikasi permintaan terbaru, marketplace ini mempermudah transaksi secara efisien dan transparan, mendukung ekonomi sirkular di sektor pertanian.",
      url: "/marketplace",
    },
    {
      judul: "Panduan Pengolahan Limbah Pertanian",
      bg_url: "/images/bgHero.webp",
      deskripsi:
        "Temukan berbagai artikel, video tutorial, dan panduan praktis untuk mengolah limbah pertanian menjadi produk yang bermanfaat seperti kompos, pakan ternak, atau biogas. Fitur ini juga dilengkapi dengan AI Assistant berbasis LLM (Large Language Model) yang siap menjawab pertanyaan Anda secara langsung—memberikan referensi pengolahan limbah sesuai kebutuhan Anda. Belajar jadi lebih mudah, cepat, dan tepat sasaran.",
      url: "/panduan-pengolahan",
    },
    {
      judul: "Kolaborasi Komunitas",
      bg_url: "/images/kolaborasi.jpg",
      deskripsi:
        "Bangun koneksi antara petani, komunitas urban farming, startup agritech, dan industri dalam ekosistem kolaboratif. Fitur ini menyediakan direktori interaktif, forum diskusi, dan program kemitraan untuk mendukung kerja sama dalam pengelolaan limbah. Bersama, wujudkan pertanian yang lebih cerdas, ramah lingkungan, dan saling menguntungkan.",
      url: "/kolaborasi",
    },
  ];

  return (
    <main>
      <section className="min-h-screen bg-gradient-to-b from-neutral01 to-white flex relative overflow-hidden">
        <div className="w-screen h-screen absolute inset-0 bg-brand03/55 backdrop-blur-md z-10"></div>
        <div className="absolute inset-0 before:absolute before:inset-0">
          <Image
            src="/images/imageHero.png"
            alt="Background Image"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute w-[50%] h-[1px] bg-neutral01/20 z-20 left-1/2 top-1/2 -translate-x-1/2 -rotate-45"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20 flex flex-col justify-between py-12 md:py-16 h-screen">
          <div className="flex flex-col gap-6 max-w-xl self-start pt-8 md:pt-16">
            <MainLogo width="500" />
            <h1
              className={`text-4xl font-bold text-brand02 -mt-7 ${dmSerifDisplay.className}`}
            >
              <Typewriter
                words={[
                  "Pertanian Berkelanjutan.",
                  "Kelola Limbah.",
                  "Hijaukan Bumi.",
                ]}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={100}
                deleteSpeed={100}
                delaySpeed={1000}
              />
            </h1>
            <p className="text-xl text-neutral01">
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

          <div className="flex flex-col gap-6 max-w-xl self-end pb-8 md:pb-16">
            <h2 className={`${dmSerifDisplay.className} text-brand01 text-4xl`}>
              Tentang Kami
            </h2>
            <p className="text-neutral01">
              Kami percaya bahwa pertanian berkelanjutan adalah fondasi masa
              depan yang lebih hijau dan cerdas. Dengan semangat inovasi,
              kolaborasi, dan kepedulian terhadap lingkungan, kami menghadirkan
              platform yang menghubungkan petani, komunitas urban farming, dan
              startup agritech untuk bersama-sama mengubah limbah pertanian
              menjadi solusi bernilai ekonomi. Platform ini tidak hanya
              berfungsi sebagai marketplace untuk jual-beli limbah seperti sekam
              padi, kulit kopi, atau ampas tebu, tetapi juga sebagai pusat
              edukasi untuk membantu masyarakat memahami potensi besar dari
              setiap sisa hasil pertanian.
            </p>
          </div>
        </div>
      </section>
      <section className="pt-12">
        <div className="w-full mx-auto">
          <h2
            className={`text-6xl font-bold text-center text-brand03 mb-12 ${dmSerifDisplay.className}`}
          >
            Produk Kami
          </h2>
          <div className="flex flex-row h-full w-screen">
            {products.map((item, index) => (
              <div
                key={index}
                className={`relative overflow-hidden transition-all duration-500 ease-in-out h-80 hover:cursor-pointer ${
                  hoverIndex === index ? "w-3/5" : "w-1/3"
                }`}
                onMouseOver={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <div
                  className={`w-full h-full absolute inset-0 transition-transform duration-700 ease-in-out ${
                    hoverIndex === index ? "scale-105" : "scale-100"
                  }`}
                >
                  <Image
                    src={item.bg_url}
                    alt="Background Image"
                    fill
                    className={`object-cover transition-all duration-700 ${
                      hoverIndex === index ? "brightness-90" : "brightness-75"
                    }`}
                    style={{
                      objectPosition: `center ${index === 0 ? "70%" : "50%"}`,
                    }}
                  />
                  <div
                    className={`w-full h-full absolute inset-0 bg-brand03/55 transition-opacity duration-500 ${
                      hoverIndex !== index
                        ? "opacity-80 backdrop-blur-md"
                        : "opacity-70 bg-brand03/70"
                    }`}
                  ></div>
                </div>

                <div
                  className={`bg-brand02/20 backdrop-blur-md p-4 rounded-full absolute top-4 right-4 z-40 transition-all duration-200 hover:opacity-80 shadow-lg shadow-black/50 ${
                    hoverIndex === index
                      ? "translate-y-0 opacity-100"
                      : "translate-y-5 opacity-0"
                  }`}
                >
                  <ArrowRight
                    className="text-[#d9a641]"
                    width={30}
                    height={30}
                  />
                </div>
                <div
                  className={`w-full h-full p-6 flex flex-col items-center justify-center relative z-10 ${dmSerifDisplay.className}`}
                >
                  <h3
                    className={`text-3xl font-semibold text-brand02 transition-all duration-500 max-w-xs break-words text-center ${
                      hoverIndex === index
                        ? "transform-none"
                        : "origin-center absolute"
                    }`}
                  >
                    {item.judul}
                  </h3>

                  <div
                    className={`${
                      dmSans.className
                    } text-neutral01 overflow-hidden text-center transition-all duration-500 ease-in-out max-w-xl ${
                      hoverIndex === index
                        ? "max-h-56 opacity-100 mt-6"
                        : "max-h-0 opacity-0 mt-0"
                    }`}
                  >
                    <p>{item.deskripsi}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-brand01 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className={`text-3xl font-bold text-white mb-4 ${dmSerifDisplay.className}`}
          >
            Bergabung Sekarang
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Jadilah bagian dari gerakan pertanian berkelanjutan. Mulai daur
            ulang limbah pertanian Anda hari ini.
          </p>
          <Link
            href="/register"
            className={`bg-neutral01 text-brand01 px-8 py-3 shadow-lg font-medium hover:opacity-90 duration-200 transition-colors inline-flex items-center ${dmSerifDisplay.className}`}
          >
            Daftar Gratis
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>
    </main>
  );
}
