"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Star,
  Users,
  TrendingUp,
  Search,
  Filter,
  ArrowUpDown,
  MapPin,
  Package,
} from "lucide-react";
import { dmSerifDisplay } from "@/components/fonts/dmSerifDisplay";
import { ProductCard, ProductCardProps } from "@/components/cards/productCard";
import { StatCard, StatCardProps } from "@/components/cards/statCard";

export default function Marketplace() {
  const [tempQuery, setTempQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sortBy, setSortBy] = useState("featured"); // featured, price-low, price-high, rating, stock
  const [showFilters, setShowFilters] = useState(false);

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
    {
      image: "/images/ampasTebu.png",
      title: "Serbuk Gergaji Halus",
      description: "Limbah kayu berkualitas untuk media tanam",
      price: "Rp 1.800/kg",
      rating: 4.6,
      location: "Jawa Tengah",
      stock: 200,
    },
    {
      image: "/images/ampasTebu.png",
      title: "Sekam Padi Premium",
      description: "Sekam padi pilihan untuk pupuk dan media tanam",
      price: "Rp 1.200/kg",
      rating: 4.5,
      location: "Jawa Barat",
      stock: 450,
    },
    {
      image: "/images/ampasTebu.png",
      title: "Kulit Kacang Tanah",
      description: "Limbah kulit kacang untuk pakan ternak berkualitas",
      price: "Rp 2.800/kg",
      rating: 4.8,
      location: "Jawa Timur",
      stock: 180,
    },
  ];

  // Get unique locations for filter
  const locations = [
    ...new Set(productsData.map((product) => product.location)),
  ];

  // Extract price number for sorting
  const extractPrice = (priceStr: string) => {
    return parseInt(priceStr.replace(/[^\d]/g, ""));
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = productsData.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation =
        !selectedLocation || product.location === selectedLocation;

      return matchesSearch && matchesLocation;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return extractPrice(a.price) - extractPrice(b.price);
        case "price-high":
          return extractPrice(b.price) - extractPrice(a.price);
        case "rating":
          return b.rating - a.rating;
        case "stock":
          return b.stock - a.stock;
        case "featured":
        default:
          // Featured items first, then by rating
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
      }
    });

    return filtered;
  }, [searchQuery, selectedLocation, sortBy]);

  const getSortLabel = (value: string) => {
    const labels = {
      featured: "Unggulan",
      "price-low": "Harga Terendah",
      "price-high": "Harga Tertinggi",
      rating: "Rating Tertinggi",
      stock: "Stok Terbanyak",
    };
    return labels[value as keyof typeof labels] || "Unggulan";
  };

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

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-20 py-16 md:pb-20 pt-16 relative">
        <div className="w-full md:w-auto mx-auto absolute left-1/2 -translate-x-1/2 -top-[2rem] lg:-top-[4.5rem]">
          <div className="bg-neutral01 rounded-2xl p-2 lg:p-6 shadow-xl grid grid-cols-4 gap-4 md:gap-6">
            {statsData.map((item, index) => (
              <StatCard key={index} number={item.number} label={item.label} />
            ))}
          </div>
        </div>
        {/* Search and Filter Section */}
        <div className="mb-12 mt-16 space-y-6">
          {/* Search, Filter and Sort Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 order-3 lg:order-1 w-full">
              <div className="relative flex">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand03/60 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari produk limbah pertanian..."
                  value={tempQuery}
                  onChange={(e) => setTempQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setSearchQuery(tempQuery.trim());
                    }
                  }}
                  className="flex-1 pl-12 pr-16 py-3 rounded-2xl border border-brand03/20 focus:border-brand01 focus:ring-2 focus:ring-brand01/20 outline-none transition-all duration-300 bg-neutral01 text-brand03 placeholder-brand03/60 shadow-sm"
                />
                <button
                  onClick={() => {
                  }}
                  className="absolute h-full right-0 bg-brand01 hover:bg-brand01/90 text-neutral01 px-8 py-1.5 rounded-r-2xl transition-all duration-300 text-sm font-medium"
                >
                  Cari
                </button>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex gap-3 order-2 lg:order-2">
              {/* Location Filter */}
              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="appearance-none bg-neutral01 border border-brand03/20 rounded-2xl px-4 py-3 pr-10 text-brand03 focus:border-brand01 focus:ring-2 focus:ring-brand01/20 outline-none transition-all duration-300 cursor-pointer shadow-sm"
                >
                  <option value="">Semua Lokasi</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand03/60 w-4 h-4 pointer-events-none" />
              </div>

              {/* Toggle Filters Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl border transition-all duration-300 ${
                  showFilters
                    ? "bg-brand01 text-neutral01 border-brand01"
                    : "bg-neutral01 text-brand03 border-brand03/20 hover:border-brand01"
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filter</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative order-1 lg:order-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-neutral01 border border-brand03/20 rounded-2xl px-4 py-3 pr-10 text-brand03 focus:border-brand01 focus:ring-2 focus:ring-brand01/20 outline-none transition-all duration-300 cursor-pointer shadow-sm min-w-[160px]"
              >
                <option value="featured">Unggulan</option>
                <option value="price-low">Harga Terendah</option>
                <option value="price-high">Harga Tertinggi</option>
                <option value="rating">Rating Tertinggi</option>
                <option value="stock">Stok Terbanyak</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand03/60 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-brand03/70">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span>
                Menampilkan {filteredAndSortedProducts.length} dari{" "}
                {productsData.length} produk
              </span>
            </div>
            {(searchQuery || selectedLocation) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedLocation("");
                }}
                className="text-brand01 hover:text-brand01/80 font-medium transition-colors duration-300"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {filteredAndSortedProducts.map((item, index) => (
              <ProductCard
                key={`${item.title}-${index}`}
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
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand03/10 flex items-center justify-center">
                <Search className="w-8 h-8 text-brand03/40" />
              </div>
              <h3 className="text-xl font-semibold text-brand03 mb-2">
                Produk Tidak Ditemukan
              </h3>
              <p className="text-brand03/70 mb-6">
                Coba ubah kata kunci pencarian atau filter yang Anda gunakan
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedLocation("");
                }}
                className="bg-brand01 hover:bg-brand01/90 text-neutral01 px-6 py-2.5 rounded-2xl transition-all duration-300 font-medium"
              >
                Reset Pencarian
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
