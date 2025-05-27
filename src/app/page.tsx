"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, MapPin, Package } from "lucide-react";
import { MainLogo } from "@/components/iconAndLogo/mainLogo";
import { Typewriter } from "react-simple-typewriter";
import { dmSerifDisplay } from "@/components/fonts/dmSerifDisplay";
import { dmSans } from "@/components/fonts/dmSans";
import { useState, useRef, useEffect } from "react";
import { ProductCard, ProductCardProps } from "@/components/cards/productCard";

export default function Home() {
  const [hoverIndex, setHoverIndex] = useState<Number | null>(null);
  const [circleHoverIndex, setCircleHoverIndex] = useState<Number | null>(null);
  const [activeCategory, setActiveCategory] = useState<Number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sumberRef = useRef<HTMLDivElement>(null);
  const waktuRef = useRef<HTMLDivElement>(null);
  const wujudRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
        "Temukan berbagai artikel, video tutorial, dan panduan praktis untuk mengolah limbah pertanian menjadi produk yang bermanfaat seperti kompos, pakan ternak, atau biogas. Fitur ini juga dilengkapi dengan AI Assistant berbasis LLM (Large Language Model) yang siap menjawab pertanyaan Anda secara langsung, memberikan referensi pengolahan limbah sesuai kebutuhan Anda. Belajar jadi lebih mudah, cepat, dan tepat sasaran.",
      url: "/panduan-olahan",
    },
    {
      judul: "Kolaborasi Komunitas",
      bg_url: "/images/kolaborasi.jpg",
      deskripsi:
        "Bangun koneksi antara petani, komunitas urban farming, startup agritech, dan industri dalam ekosistem kolaboratif. Fitur ini menyediakan direktori interaktif, forum diskusi, dan program kemitraan untuk mendukung kerja sama dalam pengelolaan limbah. Bersama, wujudkan pertanian yang lebih cerdas, ramah lingkungan, dan saling menguntungkan.",
      url: "/kolaborasi",
    },
  ];

  const wasteCategories = [
    {
      title: "Sumber",
      icon: "/images/sayuran.jpg",
      description:
        "Limbah berdasarkan sumbernya berasal dari tanaman pangan, hortikultura, perkebunan, peternakan, atau perkotaan.",
      ref: sumberRef,
      color: "from-emerald-500 to-teal-600",
      details: [
        "<strong>Tanaman Pangan</strong>: Sekam padi, jerami, tongkol jagung dapat diolah menjadi pupuk organik atau pembungkus makanan tradisional.",
        "<strong>Hortikultura</strong>: Sisa sayuran (daun bawang, kubis) atau buah rusak dapat menjadi pakan ternak atau kompos.",
        "<strong>Perkebunan</strong>: Sabut kelapa diolah menjadi kerajinan (keset, tali) atau arang; limbah kelapa sawit menjadi pupuk.",
        "<strong>Peternakan</strong>: Kotoran sapi, ayam, atau kambing diolah menjadi pupuk kandang atau biogas.",
        "<strong>Perkotaan</strong>: Sisa organik dari pasar (sayuran) dapat diolah menjadi pupuk atau bioenergi.",
      ],
    },
    {
      title: "Waktu",
      icon: "/images/panen.jpg",
      description:
        "Limbah muncul pada tahap prapanen, saat panen, atau pascapanen dalam siklus pertanian.",
      ref: waktuRef,
      color: "from-amber-500 to-orange-600",
      details: [
        "<strong>Prapanen</strong>: Gulma, daun, atau kotoran ternak yang dapat diolah menjadi kompos atau pakan ternak.",
        "<strong>Saat Panen</strong>: Jerami padi, pelepah pisang, atau daun sorgum yang cocok untuk pakan ternak atau kompos.",
        "<strong>Pascapanen</strong>: Sekam padi, sabut kelapa, atau ampas tahu yang dapat digunakan untuk pupuk, biogas, atau kerajinan.",
      ],
    },
    {
      title: "Wujud",
      icon: "/images/jerami.jpg",
      description:
        "Limbah dapat berwujud padat (jerami), cair (air irigasi), atau gas (metana dari kotoran ternak).",
      ref: wujudRef,
      color: "from-blue-500 to-indigo-600",
      details: [
        "<strong>Padat</strong>: Tempurung kelapa, jerami, atau ampas tahu dapat diolah menjadi kompos, pakan ternak, atau kerajinan.",
        "<strong>Cair</strong>: Air limbah irigasi atau pencucian hasil panen perlu disaring untuk mencegah pencemaran air.",
        "<strong>Gas</strong>: Emisi metana dari kotoran ternak dapat dimanfaatkan sebagai biogas atau disalurkan melalui filter.",
      ],
    },
  ];

  const productsData: ProductCardProps[] = [
    {
      image: "/images/ampasTebu.png",
      title: "Ampas Tebu Premium",
      description: "Limbah ampas tebu fresh berkualitas tinggi",
      price: "Rp 2.500/kg",
      rating: 4.8,
      location: "Jawa Timur",
      stock: 320,
    },
    {
      image: "/images/ampasTebu.png",
      title: "Ampas Tebu Organik",
      description: "Ampas tebu bebas bahan kimia untuk pupuk organik",
      price: "Rp 3.200/kg",
      rating: 4.9,
      location: "Jawa Barat",
      stock: 150,
      featured: true,
    },
    {
      image: "/images/ampasTebu.png",
      title: "Ampas Tebu Industri",
      description: "Kualitas terbaik untuk kebutuhan industri bioethanol",
      price: "Rp 2.100/kg",
      rating: 4.7,
      location: "Lampung",
      stock: 500,
    },
  ];

  const handleScrollToSection = (
    ref: React.RefObject<HTMLDivElement>,
    index: number
  ) => {
    setActiveCategory(index);
    if (ref.current) {
      const offsetTop =
        ref.current.getBoundingClientRect().top + window.scrollY;
      const middleOfScreen =
        offsetTop - window.innerHeight / 2 + ref.current.offsetHeight / 2;
      window.scrollTo({ top: middleOfScreen, behavior: "smooth" });
    }
  };

  return (
    <main className="overflow-x-hidden">
      {/* Hero Section - Keep existing design */}
      <section className="min-h-screen bg-gradient-to-b from-neutral01 to-white flex relative overflow-hidden">
        <div className="absolute inset-0 before:absolute before:inset-0">
          <Image
            src="/images/imageHero.png"
            alt="Background Image"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand03/60 to-brand03/85 backdrop-blur-sm" />
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
                className={`bg-brand01 text-white px-8 py-3 font-medium hover:bg-brand01/90 transition-all duration-300 rounded-lg transform hover:scale-105 shadow-lg hover:shadow-xl ${dmSerifDisplay.className}`}
              >
                Mulai Sekarang
                <ArrowRight className="inline-block ml-2" size={20} />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-6 max-w-xl self-end pb-8 md:pb-16">
            <h2 className={`${dmSerifDisplay.className} text-brand02 text-4xl`}>
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

      {/* About Section - Enhanced with modern gradient and animations */}
      <section className="py-32 bg-gradient-to-br from-slate-50 via-white to-emerald-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-brand01/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-emerald-500/10 to-transparent rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2
              className={`text-7xl font-bold bg-brand01 bg-clip-text text-transparent mb-8 ${dmSerifDisplay.className}`}
            >
              Apa Itu DaurTani?
            </h2>
            <div className="w-24 h-1 bg-brand01 mx-auto mb-8 rounded-full"></div>
            <p
              className={`text-xl text-slate-700 max-w-4xl mx-auto leading-relaxed ${dmSans.className}`}
            >
              DaurTani adalah platform yang menjembatani petani dan pelaku
              industri untuk mengelola limbah pertanian, baik mentah maupun
              olahan, menjadi produk bernilai tinggi seperti pupuk kompos, pakan
              ternak, atau biogas. Proses ini mendukung ekonomi sirkular,
              mengurangi dampak lingkungan, dan menciptakan peluang ekonomi baru
              bagi petani.
            </p>
          </div>

          {/* Enhanced Interactive Circle Visualization */}
          <div className="relative flex justify-center items-center my-32">
            <div className="relative w-[400px] h-[400px] flex justify-center items-center">
              {/* Main circle with glassmorphism effect */}
              <div className="relative w-80 h-80 rounded-full bg-gradient-to-br from-brand01/90 via-brand01 to-emerald-600 flex items-center justify-center shadow-2xl backdrop-blur-lg border border-white/20">
                <div className="absolute inset-4 rounded-full bg-white/10 backdrop-blur-md border border-white/30"></div>
                <span
                  className={`text-white text-2xl font-bold text-center z-10 ${dmSerifDisplay.className}`}
                >
                  Limbah
                  <br />
                  Pertanian
                </span>

                {/* Animated pulse rings */}
                <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
                <div className="absolute inset-8 rounded-full border border-white/20 animate-pulse"></div>
              </div>

              {/* Category circles with enhanced effects */}
              {wasteCategories.map((category, index) => (
                <div
                  key={index}
                  className={`absolute w-48 h-48 cursor-pointer transition-all duration-500 hover:scale-110 group ${
                    circleHoverIndex === index ? "z-20" : "z-10"
                  }`}
                  style={{
                    transform: `rotate(${
                      index * 120
                    }deg) translate(240px) rotate(-${index * 120}deg)`,
                    transformOrigin: "center center",
                  }}
                  onMouseEnter={() => setCircleHoverIndex(index)}
                  onMouseLeave={() => setCircleHoverIndex(null)}
                  onClick={() =>
                    handleScrollToSection(
                      category.ref as React.RefObject<HTMLDivElement>,
                      index
                    )
                  }
                >
                  <div
                    className={`relative w-full h-full rounded-full bg-gradient-to-br ${category.color} shadow-xl overflow-hidden border-4 border-white/30 backdrop-blur-sm`}
                  >
                    <Image
                      src={category.icon}
                      alt={`${category.title} Icon`}
                      fill
                      className="object-cover opacity-30 group-hover:opacity-20 transition-opacity duration-300"
                    />

                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent backdrop-blur-sm"></div>

                    <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-6 text-center">
                      <span
                        className={`text-white text-xl font-bold mb-2 ${dmSerifDisplay.className}`}
                      >
                        {category.title}
                      </span>

                      <div
                        className={`text-white text-xs leading-tight overflow-hidden transition-all duration-500 ${
                          circleHoverIndex === index
                            ? "max-h-32 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        {category.description}
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Detail Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            {wasteCategories.map((category, index) => (
              <div
                key={index}
                ref={category.ref}
                className={`bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 ${
                  activeCategory === index ? "ring-2 ring-brand01/50" : ""
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} mb-6 flex items-center justify-center shadow-lg`}
                >
                  <span
                    className={`text-white text-xl font-bold ${dmSerifDisplay.className}`}
                  >
                    {category.title[0]}
                  </span>
                </div>

                <h3
                  className={`text-2xl font-bold text-slate-800 mb-4 ${dmSerifDisplay.className}`}
                >
                  Berdasarkan {category.title}
                </h3>

                <p className={`text-slate-600 mb-6 ${dmSans.className}`}>
                  {category.description}
                </p>

                <div className="space-y-3">
                  {category.details.map((detail, detailIndex) => (
                    <div
                      key={detailIndex}
                      className="p-3 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100"
                      dangerouslySetInnerHTML={{ __html: detail }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Marketplace Section */}
      <section className="py-32 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50 relative overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-brand01 rounded-full"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-emerald-500 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-teal-500 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2
              className={`text-7xl font-bold text-brand01 bg-clip-text mb-8 ${dmSerifDisplay.className}`}
            >
              Marketplace
            </h2>
            <div className="w-24 h-1 bg-brand02 mx-auto mb-8 rounded-full"></div>
            <p
              className={`text-xl text-slate-700 mb-8 max-w-3xl mx-auto leading-relaxed ${dmSans.className}`}
            >
              Temukan berbagai limbah pertanian berkualitas untuk kebutuhan
              industri, peternakan, atau usaha Anda. Semua produk diverifikasi
              dan tersedia dari berbagai daerah di Indonesia.
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-12 mb-12">
              <div className="text-center">
                <div
                  className={`text-3xl font-bold text-brand01 ${dmSerifDisplay.className}`}
                >
                  1000+
                </div>
                <div className="text-slate-600">Produk Tersedia</div>
              </div>
              <div className="text-center">
                <div
                  className={`text-3xl font-bold text-brand01 ${dmSerifDisplay.className}`}
                >
                  500+
                </div>
                <div className="text-slate-600">Penjual Terpercaya</div>
              </div>
              <div className="text-center">
                <div
                  className={`text-3xl font-bold text-brand01 ${dmSerifDisplay.className}`}
                >
                  34
                </div>
                <div className="text-slate-600">Provinsi</div>
              </div>
            </div>
          </div>

          {/* Enhanced Product Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {productsData.map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100 hover:scale-105"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {item.featured && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Star size={14} fill="currentColor" />
                      Featured
                    </div>
                  )}

                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <ArrowRight size={16} className="text-brand01" />
                  </div>
                </div>

                <div className="p-6">
                  <h3
                    className={`text-xl font-bold text-slate-800 mb-2 ${dmSerifDisplay.className}`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-slate-600 mb-4 text-sm ${dmSans.className}`}
                  >
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-2xl font-bold text-brand01 ${dmSerifDisplay.className}`}
                    >
                      {item.price}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star
                        size={16}
                        className="text-amber-400"
                        fill="currentColor"
                      />
                      <span className="text-slate-600 font-medium">
                        {item.rating}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      {item.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Package size={14} />
                      {item.stock} tersedia
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link
              href="/marketplace"
              className={`inline-flex items-center bg-brand01 text-white px-12 py-4 rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${dmSerifDisplay.className}`}
            >
              Lihat Semua Produk
              <ArrowRight className="ml-3" size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section className="pt-0">
        <div className="w-full mx-auto">
          {/* <h2
            className={`text-6xl font-bold text-center text-brand03 mb-12 ${dmSerifDisplay.className}`}
          >
            Produk Kami
          </h2> */}
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

      {/* Enhanced CTA Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-brand01"></div>

        {/* Floating elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-brand02/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-lg animate-bounce"></div>

        {/* Geometric patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-20 h-20 border-2 border-white rotate-45 animate-spin-slow"></div>
          <div className="absolute bottom-20 left-10 w-16 h-16 border-2 border-brand02 rotate-12 animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Main content */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-12 shadow-2xl">
            <h2
              className={`text-5xl md:text-6xl font-bold text-white mb-6 ${dmSerifDisplay.className}`}
            >
              Bergabung Sekarang
            </h2>

            <div className="w-24 h-1 bg-gradient-to-r from-brand02 to-amber-400 mx-auto mb-8 rounded-full"></div>

            <p
              className={`text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed ${dmSans.className}`}
            >
              Jadilah bagian dari gerakan pertanian berkelanjutan. Mulai daur
              ulang limbah pertanian Anda hari ini dan bergabung dengan ribuan
              petani yang telah merasakan manfaatnya.
            </p>

            {/* Features grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="w-16 h-16 bg-gradient-to-br from-brand02 to-amber-400 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Package size={24} className="text-slate-900" />
                </div>
                <h3
                  className={`text-white font-semibold mb-2 ${dmSerifDisplay.className}`}
                >
                  Marketplace Terpercaya
                </h3>
                <p className="text-white/80 text-sm">
                  Jual beli limbah pertanian dengan aman dan transparan
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Star size={24} className="text-white" />
                </div>
                <h3
                  className={`text-white font-semibold mb-2 ${dmSerifDisplay.className}`}
                >
                  Panduan Lengkap
                </h3>
                <p className="text-white/80 text-sm">
                  Akses panduan dan tutorial pengolahan limbah pertanian
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <MapPin size={24} className="text-white" />
                </div>
                <h3
                  className={`text-white font-semibold mb-2 ${dmSerifDisplay.className}`}
                >
                  Komunitas Aktif
                </h3>
                <p className="text-white/80 text-sm">
                  Bergabung dengan komunitas petani di seluruh Indonesia
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className={`group bg-gradient-to-r from-white to-slate-100 text-brand01 px-12 py-4 rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center ${dmSerifDisplay.className}`}
              >
                Daftar Gratis
                <ArrowRight
                  className="ml-3 group-hover:translate-x-1 transition-transform duration-300"
                  size={20}
                />
              </Link>

              <Link
                href="/marketplace"
                className={`group bg-transparent border-2 border-white/50 text-white px-12 py-4 rounded-2xl font-bold hover:bg-white/10 hover:border-white transition-all duration-300 transform hover:scale-105 flex items-center ${dmSerifDisplay.className}`}
              >
                Jelajahi Marketplace
                <ArrowRight
                  className="ml-3 group-hover:translate-x-1 transition-transform duration-300"
                  size={20}
                />
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 pt-8 border-t border-white/20">
              <p className="text-white/70 text-sm mb-4">Dipercaya oleh:</p>
              <div className="flex justify-center items-center gap-8 text-white">
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold  ${dmSerifDisplay.className}`}
                  >
                    10,000+
                  </div>
                  <div className="text-xs">Pengguna Aktif</div>
                </div>
                <div className="w-px h-8 bg-white/20"></div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold  ${dmSerifDisplay.className}`}
                  >
                    500+
                  </div>
                  <div className="text-xs">Transaksi Sukses</div>
                </div>
                <div className="w-px h-8 bg-white/20"></div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold  ${dmSerifDisplay.className}`}
                  >
                    34
                  </div>
                  <div className="text-xs">Provinsi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Glass morphism effects */
        .glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom gradient text */
        .gradient-text {
          background: linear-gradient(135deg, #10b981, #059669, #047857);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </main>
  );
}
