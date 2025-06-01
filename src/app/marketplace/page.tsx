"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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
  AlertCircle,
  Loader2,
} from "lucide-react";
import { dmSerifDisplay } from "@/components/fonts/dmSerifDisplay";
import { ProductCard, ProductCardProps } from "@/components/cards/productCard";
import { StatCard, StatCardProps } from "@/components/cards/statCard";
import API from "@/lib/utils/apiCreate";

// Search Controls Component
const SearchControls = ({
  isSticky = false,
  tempQuery,
  setTempQuery,
  handleSearch,
  searchQuery,
  selectedLocation,
  setSelectedLocation,
  locations,
  showFilters,
  setShowFilters,
  sortBy,
  setSortBy,
  resetFilters,
  filteredAndSortedProducts,
  productsData,
}: {
  isSticky?: boolean;
  tempQuery: string;
  setTempQuery: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => void;
  searchQuery: string;
  selectedLocation: string;
  setSelectedLocation: React.Dispatch<React.SetStateAction<string>>;
  locations: string[];
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  resetFilters: () => void;
  filteredAndSortedProducts: ProductCardProps[];
  productsData: ProductCardProps[];
}) => (
  <div
    className={`space-y-6 ${
      isSticky
        ? "bg-neutral01 px-20 pb-2 pt-2 shadow-lg border-b border-brand03/10"
        : ""
    }`}
  >
    {/* Search, Filter and Sort Controls */}
    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
      {/* Search Bar */}
      <div className="relative w-full lg:w-2/3">
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
                handleSearch();
              }
            }}
            className="flex-1 pl-12 pr-16 py-3 bg-neutral01 rounded-2xl border border-brand03/20 focus:border-brand01 focus:ring-2 focus:ring-brand01/20 outline-none transition-all duration-300 text-brand03 placeholder-brand03/60 shadow-sm"
          />
          <button
            onClick={handleSearch}
            className="absolute h-full right-0 bg-brand01 hover:bg-brand01/90 text-neutral01 px-8 py-1.5 rounded-r-2xl transition-all duration-300 text-sm font-medium"
          >
            Cari
          </button>
        </div>
      </div>
      <div className="flex w-full lg:w-1/3 gap-2">
        {/* Filter Controls */}
        <div className="flex gap-3 w-1/2">
          {/* Location Filter */}
          <div className="relative w-full">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="appearance-none bg-neutral01 w-full border border-brand03/20 rounded-2xl px-4 py-3 pr-10 text-brand03 focus:border-brand01 focus:ring-2 focus:ring-brand01/20 outline-none transition-all duration-300 cursor-pointer shadow-sm"
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
        </div>
        {/* Sort Dropdown */}
        <div className="relative w-1/2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none w-full bg-neutral01 border border-brand03/20 rounded-2xl px-4 py-3 pr-10 text-brand03 focus:border-brand01 focus:ring-2 focus:ring-brand01/20 outline-none transition-all duration-300 cursor-pointer shadow-sm min-w-[160px]"
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
          onClick={resetFilters}
          className="text-brand01 hover:text-brand01/80 font-medium transition-colors duration-300"
        >
          Reset Filter
        </button>
      )}
    </div>
  </div>
);

// Update interfaces
interface UnitPrice {
  _id: string;
  unit: string;
  pricePerUnit: number;
  isBaseUnit: boolean;
  stock: number;
  equalWith: number;
}

interface Product {
  _id: string;
  wasteName: string;
  description: string;
  imageUrls: string[];
  averageRating: number;
  createdAt: string;
  updatedAt: string;
  store: {
    _id: string;
    storeName: string;
    storeAddress: string;
  };
  unitPrices: UnitPrice[];
}

export default function Marketplace() {
  const [tempQuery, setTempQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchSticky, setIsSearchSticky] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const searchSectionRef = useRef<HTMLDivElement>(null);
  const stickyPlaceholderRef = useRef<HTMLDivElement>(null);

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

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await API.get("/farm-wastes");
        setProducts(response.data.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Convert API products to ProductCardProps format
  const productsData = useMemo(() => {
    return products.map((product) => {
      // Find base unit price
      const baseUnit =
        product.unitPrices.find((up) => up.isBaseUnit) || product.unitPrices[0];
      const pricePerUnit = baseUnit ? baseUnit.pricePerUnit : 0;
      const unit = baseUnit ? baseUnit.unit : "";

      // Calculate total stock across all units
      const totalStock = product.unitPrices.reduce(
        (sum, up) => sum + (up.stock || 0),
        0
      );

      return {
        id: product._id,
        image: product.imageUrls[0] || "/images/placeholder.png",
        title: product.wasteName,
        description: product.description,
        price: `Rp ${pricePerUnit.toLocaleString("id-ID")}/${unit}`,
        rating: product.averageRating || 0,
        location: product.store.storeAddress,
        stock: totalStock,
        imageUrls: product.imageUrls,
        unitPrices: product.unitPrices,
      };
    });
  }, [products]);

  // Intersection Observer for sticky search
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSearchSticky(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: "0px 0px 0px 0px", // Trigger exactly when the element leaves the viewport
      }
    );

    if (searchSectionRef.current) {
      observer.observe(searchSectionRef.current);
    }

    return () => {
      if (searchSectionRef.current) {
        observer.unobserve(searchSectionRef.current);
      }
    };
  }, []);

  // Dynamically set placeholder height to match sticky search bar
  useEffect(() => {
    if (
      isSearchSticky &&
      searchSectionRef.current &&
      stickyPlaceholderRef.current
    ) {
      const height = searchSectionRef.current.getBoundingClientRect().height;
      stickyPlaceholderRef.current.style.height = `${height}px`;
    } else if (stickyPlaceholderRef.current) {
      stickyPlaceholderRef.current.style.height = "0px";
    }
  }, [isSearchSticky]);

  // Get unique locations for filter from actual data
  const locations = useMemo(() => {
    return [...new Set(productsData.map((product) => product.location))];
  }, [productsData]);

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
        default:
          return b.rating - a.rating;
      }
    });

    return filtered;
  }, [searchQuery, selectedLocation, sortBy, productsData]);

  const handleSearch = () => {
    setSearchQuery(tempQuery.trim());
  };

  const resetFilters = () => {
    setTempQuery("");
    setSearchQuery("");
    setSelectedLocation("");
  };

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <Loader2 className="w-12 h-12 text-brand01 animate-spin mx-auto mb-4" />
  //         <p className="text-brand03 text-lg">Memuat produk</p>
  //       </div>
  //     </div>
  //   );
  // }

  // Error state
  // if (error) {
  //   return (
  //     <div className="min-h-screen bg-neutral01 flex items-center justify-center p-4">
  //       <div className="text-center max-w-md">
  //         <div className="text-red-500 mb-4">
  //           <AlertCircle className="w-12 h-12 mx-auto" />
  //         </div>
  //         <h2 className="text-xl font-semibold text-brand03 mb-2">
  //           Gagal memuat produk
  //         </h2>
  //         <p className="text-brand03/70 mb-4">{error}</p>
  //         <button
  //           onClick={() => window.location.reload()}
  //           className="bg-brand01 text-white px-6 py-2 rounded-lg hover:bg-brand01/90 transition-colors"
  //         >
  //           Coba Lagi
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

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
          <div className="absolute inset-0 bg-gradient-to-t from-brand03/40 to-brand03/80 backdrop-blur-sm" />
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

      <div className="w-full mx-auto px-3 lg:px-20 py-16 md:pb-20 relative bg-gradient-to-b from-brand02/30 via-neutral01 to-neutral01 border-t-[6px] border-brand02/55">
        <div className="w-full md:w-auto mx-auto absolute left-1/2 -translate-x-1/2 -top-[2rem] lg:-top-[4.5rem]">
          <div className="bg-neutral01 rounded-3xl p-2 lg:p-6 shadow-xl shadow-brand02/20 grid grid-cols-4 gap-4 md:gap-6 border-2 border-brand02/60">
            {statsData.map((item, index) => (
              <StatCard key={index} number={item.number} label={item.label} />
            ))}
          </div>
        </div>

        {/* Search Section - Original Position */}
        <div ref={searchSectionRef} className="mb-12 mt-16">
          <SearchControls
            tempQuery={tempQuery}
            setTempQuery={setTempQuery}
            handleSearch={handleSearch}
            searchQuery={searchQuery}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            locations={locations}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            sortBy={sortBy}
            setSortBy={setSortBy}
            resetFilters={resetFilters}
            filteredAndSortedProducts={filteredAndSortedProducts}
            productsData={productsData}
          />
        </div>

        {/* Sticky Search Bar */}
        <div
          className={`fixed top-12 -mx-20 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
            isSearchSticky ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="px-4 sm:px-6 lg:px-20 py-4">
            <SearchControls
              isSticky={true}
              tempQuery={tempQuery}
              setTempQuery={setTempQuery}
              handleSearch={handleSearch}
              searchQuery={searchQuery}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              locations={locations}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              sortBy={sortBy}
              setSortBy={setSortBy}
              resetFilters={resetFilters}
              filteredAndSortedProducts={filteredAndSortedProducts}
              productsData={productsData}
            />
          </div>
        </div>

        {/* Placeholder to prevent content jump */}
        <div
          ref={stickyPlaceholderRef}
          className="transition-all duration-300"
        ></div>

        {loading && (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-brand01 animate-spin mx-auto mb-4" />
              <p className="text-brand03 text-lg">Memuat produk</p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {filteredAndSortedProducts.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 md:grid-cols-3 gap-2 md:gap-4 w-full">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                image={product.imageUrls[0] || "/images/placeholder.png"}
                title={product.title}
                description={product.description}
                price={product.price}
                rating={product.rating}
                location={product.location}
                stock={product.stock}
                unitPrices={product.unitPrices}
              />
            ))}
          </div>
        )}
        {(filteredAndSortedProducts.length === 0 && !loading && !error) && (
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
                onClick={resetFilters}
                className="bg-brand01 hover:bg-brand01/90 text-neutral01 px-6 py-2.5 rounded-2xl transition-all duration-300 font-medium"
              >
                Reset Pencarian
              </button>
            </div>
          </div>
        )}
        {error && (
          <div className="min-h-[40vh] flex items-center justify-center p-4">
            <div className="text-center max-w-md">
              <div className="text-red-500 mb-4">
                <AlertCircle className="w-12 h-12 mx-auto" />
              </div>
              <h2 className="text-xl font-semibold text-brand03 mb-2">
                Gagal memuat produk
              </h2>
              <p className="text-brand03/70 mb-4">Silahkan coba beberapa saat kemudian</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-brand01 text-white px-6 py-2 rounded-lg hover:bg-brand01/90 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
