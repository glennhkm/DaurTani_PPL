// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation";
// import {
//   ChevronLeft,
//   Star,
//   MapPin,
//   Package,
//   Store as StoreIcon,
//   Loader2,
//   AlertCircle,
//   ArrowUpDown,
// } from "lucide-react";
// import { dmSerifDisplay } from "@/components/fonts/dmSerifDisplay";
// import { getStoreProducts, FarmWaste, Store } from "@/lib/api/marketplaceApi";
// import { MarketplaceProvider, useMarketplace } from "@/contexts/MarketplaceContext";

// // Product Card Component (simplified version from marketplace page)
// const ProductCard = ({ farmWaste }: { farmWaste: FarmWaste }) => {
//   // Get the base unit price
//   const baseUnitPrice = farmWaste.unitPrices.find(up => up.isBaseUnit);

//   // Get the lowest price if there are multiple unit prices
//   const lowestPrice = Math.min(...farmWaste.unitPrices.map(up => up.pricePerUnit));

//   // Calculate total stock in base units
//   const totalStock = farmWaste.unitPrices.reduce((total, up) => {
//     const stockInBaseUnits = up.isBaseUnit
//       ? (up.stock || 0)
//       : (up.stock || 0) * (up.equalWith || 1);
//     return total + stockInBaseUnits;
//   }, 0);

//   return (
//     <Link
//       href={`/marketplace/${farmWaste._id}`}
//       className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100 hover:scale-105 block"
//     >
//       <div className="relative h-64 overflow-hidden">
//         <Image
//           src="/images/ampasTebu.png" // Default image, should be replaced with actual product image
//           alt={farmWaste.wasteName}
//           fill
//           className="object-cover group-hover:scale-110 transition-transform duration-700"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//       </div>

//       <div className="p-6">
//         <h3
//           className={`text-xl font-bold text-slate-800 mb-2 ${dmSerifDisplay.className}`}
//         >
//           {farmWaste.wasteName}
//         </h3>
//         <p className="text-slate-600 mb-4 text-sm line-clamp-2">
//           {farmWaste.description || "Limbah pertanian berkualitas tinggi"}
//         </p>

//         <div className="flex items-center justify-between mb-4">
//           <span
//             className={`text-2xl font-bold text-brand01 ${dmSerifDisplay.className}`}
//           >
//             Rp {lowestPrice.toLocaleString('id-ID')}/{baseUnitPrice?.unit || 'unit'}
//           </span>
//           <div className="flex items-center gap-1">
//             <Star size={16} className="text-amber-400" fill="currentColor" />
//             <span className="text-slate-600 font-medium">{farmWaste.averageRating || "N/A"}</span>
//           </div>
//         </div>

//         <div className="flex items-center justify-between text-sm text-slate-500">
//           <div className="flex items-center gap-1">
//             <Package size={14} />
//             {totalStock} tersedia
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// };

// // Store Content Component
// const StoreContent = () => {
//   const params = useParams();
//   const router = useRouter();

//   const [storeData, setStoreData] = useState<{ store: Store; products: FarmWaste[] } | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [sortBy, setSortBy] = useState<string>("featured");

//   // Get store ID from URL params
//   const storeId = params.id as string;

//   // Fetch store and its products
//   useEffect(() => {
//     const fetchStoreData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const data = await getStoreProducts(storeId);
//         setStoreData(data);
//       } catch (err) {
//         setError('Failed to fetch store data');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStoreData();
//   }, [storeId]);

//   // Sort products
//   const sortedProducts = () => {
//     if (!storeData) return [];

//     const products = [...storeData.products];

//     products.sort((a, b) => {
//       switch (sortBy) {
//         case "price-low":
//           return Math.min(...a.unitPrices.map(up => up.pricePerUnit)) -
//                  Math.min(...b.unitPrices.map(up => up.pricePerUnit));
//         case "price-high":
//           return Math.max(...b.unitPrices.map(up => up.pricePerUnit)) -
//                  Math.max(...a.unitPrices.map(up => up.pricePerUnit));
//         case "rating":
//           return (b.averageRating || 0) - (a.averageRating || 0);
//         case "featured":
//         default:
//           // Sort by rating as default
//           return (b.averageRating || 0) - (a.averageRating || 0);
//       }
//     });

//     return products;
//   };

//   return (
//     <div className="min-h-screen bg-neutral01 pt-8 pb-16">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Back Button */}
//         <Link
//           href="/marketplace"
//           className="inline-flex items-center text-slate-600 hover:text-brand01 mb-6 transition-colors"
//         >
//           <ChevronLeft size={20} />
//           <span>Kembali ke Marketplace</span>
//         </Link>

//         {/* Loading State */}
//         {loading && (
//           <div className="flex items-center justify-center py-20">
//             <Loader2 className="w-10 h-10 text-brand01 animate-spin" />
//             <span className="ml-2 text-brand03 text-lg">Memuat data toko...</span>
//           </div>
//         )}

//         {/* Error State */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center my-10">
//             <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
//             <h3 className="text-lg font-medium text-red-700">Gagal memuat data toko</h3>
//             <p className="text-red-600 mt-1">{error}</p>
//             <div className="mt-4 flex justify-center gap-4">
//               <button
//                 onClick={() => router.back()}
//                 className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors"
//               >
//                 Kembali
//               </button>
//               <button
//                 onClick={() => window.location.reload()}
//                 className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors"
//               >
//                 Coba Lagi
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Store Info and Products */}
//         {!loading && !error && storeData && (
//           <>
//             {/* Store Header */}
//             <div className="bg-white rounded-2xl p-8 mb-10 shadow-md">
//               <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
//                 <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
//                   <StoreIcon className="w-12 h-12 text-slate-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
//                 </div>

//                 <div className="flex-grow text-center md:text-left">
//                   <h1 className={`text-3xl font-bold text-slate-800 ${dmSerifDisplay.className}`}>
//                     {storeData.store.storeName}
//                   </h1>

//                   <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-slate-600">
//                     {storeData.store.averageRating && (
//                       <div className="flex items-center">
//                         <Star size={18} className="text-amber-400" fill="currentColor" />
//                         <span className="ml-1 font-medium">{storeData.store.averageRating}</span>
//                       </div>
//                     )}

//                     <div className="flex items-center">
//                       <Package size={18} />
//                       <span className="ml-1">{storeData.products.length} Produk</span>
//                     </div>
//                   </div>

//                   {storeData.store.description && (
//                     <p className="mt-4 text-slate-600 max-w-2xl">
//                       {storeData.store.description}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Products Section */}
//             <div>
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className={`text-2xl font-bold text-slate-800 ${dmSerifDisplay.className}`}>
//                   Produk ({storeData.products.length})
//                 </h2>

//                 <div className="relative">
//                   <select
//                     value={sortBy}
//                     onChange={(e) => setSortBy(e.target.value)}
//                     className="appearance-none bg-transparent border border-slate-300 rounded-lg px-4 py-2 pr-10 text-slate-700 focus:border-brand01 focus:ring-2 focus:ring-brand01/20 outline-none transition-all duration-300 cursor-pointer"
//                   >
//                     <option value="featured">Unggulan</option>
//                     <option value="price-low">Harga Terendah</option>
//                     <option value="price-high">Harga Tertinggi</option>
//                     <option value="rating">Rating Tertinggi</option>
//                   </select>
//                   <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />
//                 </div>
//               </div>

//               {storeData.products.length > 0 ? (
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                   {sortedProducts().map(product => (
//                     <ProductCard key={product._id} farmWaste={product} />
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-16 bg-slate-50 rounded-xl">
//                   <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//                   <h3 className="text-xl font-medium text-slate-700 mb-2">Belum Ada Produk</h3>
//                   <p className="text-slate-500">
//                     Toko ini belum memiliki produk yang tersedia.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// // Wrapper component that provides the MarketplaceContext
// export default function StorePage() {
//   return (
//     <MarketplaceProvider>
//       <StoreContent />
//     </MarketplaceProvider>
//   );
// }

"use client";

import API from "@/lib/utils/apiCreate";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Store {
  storeAddressId: string;
  storeName: string;
  description: string;
  averageRating: string;
}

const Store = () => {
  const params = useParams();
  const [store, setStore] = useState<Store | null>(null);
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await API.get(`/stores/${params.id}`);
        console.log(response.data);
      } catch (error) {}
    };
    fetchStore();
  }, []);
  return <div className="w-full h-full"></div>;
};

export default Store;
