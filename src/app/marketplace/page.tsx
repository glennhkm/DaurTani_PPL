import Image from "next/image";
import { Search, Star, Users, TrendingUp } from "lucide-react";
import { dmSerifDisplay } from "@/components/fonts/dmSerifDisplay";
import {
  TestimonialCard,
  TestimonialCardProps,
} from "@/components/cards/testimonialCard";
import { ProductCard, ProductCardProps } from "@/components/cards/productCard";
import { StatCard, StatCardProps } from "@/components/cards/statCard";

export default function Marketplace() {
  const keyBenefitsData = [
    {
      icon: <Users size={16} />,
      text: "5,000+ Pengguna",
    },
    {
      icon: <Star size={16} />,
      text: "Kualitas Terjamin",
    },
    {
      icon: <TrendingUp size={16} />,
      text: "Harga Terbaik",
    },
  ];
  const statsData: StatCardProps[] = [
    {
      number: "10K+",
      label: "Produk Tersedia",
    },
    {
      number: "5K+",
      label: "Pengguna Aktif",
    },
    {
      number: "2K+",
      label: "Transaksi Sukses",
    },
    {
      number: "32",
      label: "Provinsi Terjangkau",
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
  const testimonialsData: TestimonialCardProps[] = [
    {
      quote:
        "Platform ini sangat membantu bisnis saya untuk mendapatkan limbah ampas tebu berkualitas dengan harga terjangkau.",
      name: "Ahmad Sulaiman",
      role: "Pemilik Pabrik Bioethanol",
      rating: 5,
    },
    {
      quote:
        "Saya bisa menjual limbah pertanian saya dengan harga lebih baik dibandingkan dijual ke pengepul tradisional.",
      name: "Siti Rahayu",
      role: "Petani Tebu",
      rating: 4.5,
    },
    {
      quote:
        "Kualitas produk yang saya dapatkan selalu konsisten dan sesuai dengan deskripsi yang diberikan penjual.",
      name: "Budi Santoso",
      role: "Produsen Pupuk Organik",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-neutral01">
      <div className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/marketplace.jpg"
            alt="Background pertanian"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand03/60 to-brand03/85 backdrop-blur-sm" />
        </div>
        <div className="absolute top-0 left-0 w-full h-full z-1 opacity-20">
          <div className="absolute top-20 left-[10%] w-32 h-32 rounded-full bg-brand01 blur-3xl"></div>
          <div className="absolute bottom-20 right-[10%] w-40 h-40 rounded-full bg-brand02 blur-3xl"></div>
        </div>
        <div className="relative z-10 text-center px-4 md:px-8 max-w-4xl mx-auto">
          <h1
            className={`text-4xl md:text-6xl font-bold text-neutral01 mb-4 ${dmSerifDisplay.className} tracking-wide`}
          >
            Marketplace <span className="text-brand02">Limbah</span> Pertanian
          </h1>
          <p className="text-lg text-neutral01/90 mb-10 mt-3 font-light max-w-2xl mx-auto">
            Platform terpercaya untuk menjual dan membeli limbah pertanian
            berkualitas untuk kebutuhan industri dan pertanian berkelanjutan
          </p>
          <div className="flex max-w-lg mx-auto">
            <div className="relative flex-grow bg-white/10 backdrop-blur-lg rounded-l-2xl border border-white/20 shadow-2xl shadow-brand03/30">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral01/70"
                size={20}
              />
              <input
                type="text"
                placeholder="Mau cari apa?"
                className="w-full py-4 px-12 bg-transparent border-0 focus:outline-none text-neutral01 placeholder:text-neutral01/50"
              />
            </div>
            <button className="bg-brand02 cursor-pointer hover:bg-brand02/90 text-neutral01 px-8 py-4 rounded-r-2xl transition-all duration-300 font-medium shadow-lg shadow-brand02/30 hover:shadow-xl hover:shadow-brand02/40">
              Cari
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-neutral01/90">
            {keyBenefitsData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {item.icon}
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-b from-brand02/20 via-neutral01 to-neutral01 py-16 md:pb-20 pt-36 relative">
        <div className="w-full md:w-auto mx-auto absolute left-1/2 -translate-x-1/2 -top-[2rem] lg:-top-[4.5rem]">
          <div className="bg-neutral01 rounded-2xl p-2 lg:p-6 shadow-xl grid grid-cols-4 gap-4 md:gap-6">
            {statsData.map((item, index) => (
              <StatCard key={index} number={item.number} label={item.label} />
            ))}
          </div>
        </div>
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-20">
          <div className="text-center mb-10">
            <h2
              className={`text-3xl font-bold text-brand03 ${dmSerifDisplay.className}`}
            >
              Produk Unggulan
            </h2>
            <div className="h-1 w-24 bg-brand02 mx-auto mt-4 mb-4 rounded-full"></div>
            <p className="text-brand03/80 max-w-2xl mx-auto">
              Produk-produk limbah pertanian terbaik dengan kualitas premium
              yang siap digunakan untuk berbagai kebutuhan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {productsData.map((item, index) => (
              <ProductCard
                key={index}
                image={item.image}
                title={item.title}
                description={item.description}
                price={item.price}
                rating={item.rating}
                location={item.location}
                stock={item.stock}
                featured={item.featured}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-brand01 hover:bg-brand01/90 text-neutral01 px-8 py-3 cursor-pointer rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg">
              Lihat Semua Produk
            </button>
          </div>
        </div>
      </div>
      <div className="py-16 md:py-20 bg-brand01">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-20">
          <div className="text-center mb-12">
            <h2
              className={`text-3xl font-bold text-neutral01 ${dmSerifDisplay.className}`}
            >
              Testimoni Pengguna
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-neutral01/80">
              Apa kata mereka yang telah menggunakan platform kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((item, index) => (
              <TestimonialCard
                key={index}
                quote={item.quote}
                name={item.name}
                role={item.role}
                rating={item.rating}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
