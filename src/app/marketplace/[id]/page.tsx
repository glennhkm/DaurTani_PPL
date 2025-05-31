"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  ChevronLeft,
  ShoppingCart,
  MapPin,
  Package,
  Store,
  Truck,
  Info,
  Loader2,
  AlertCircle,
  Plus,
  Minus,
} from "lucide-react";
import { dmSerifDisplay } from "@/components/fonts/dmSerifDisplay";
import { getFarmWasteById, FarmWaste, UnitPrice } from "@/lib/api/marketplaceApi";
import { MarketplaceProvider, useMarketplace } from "@/contexts/MarketplaceContext";

// Unit Selection Component
const UnitSelection = ({
  units,
  selectedUnit,
  setSelectedUnit,
  quantity,
  setQuantity,
}: {
  units: UnitPrice[];
  selectedUnit: UnitPrice | null;
  setSelectedUnit: (unit: UnitPrice) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-slate-700 mb-2">Pilih Unit</h3>
        <div className="flex flex-wrap gap-2">
          {units.map((unit) => (
            <button
              key={unit._id}
              onClick={() => setSelectedUnit(unit)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedUnit?._id === unit._id
                  ? "bg-brand01 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {unit.unit} - Rp {unit.pricePerUnit.toLocaleString("id-ID")}
              {unit.isBaseUnit && (
                <span className="ml-1 text-xs opacity-75">(Base)</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-slate-700 mb-2">Kuantitas</h3>
        <div className="flex items-center">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-l-lg disabled:opacity-50"
          >
            <Minus size={16} />
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-16 text-center border-y border-slate-200 py-2 focus:outline-none text-slate-700"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            disabled={
              selectedUnit?.stock !== undefined &&
              quantity >= selectedUnit.stock
            }
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-r-lg disabled:opacity-50"
          >
            <Plus size={16} />
          </button>
          <span className="ml-2 text-slate-500">
            {selectedUnit?.unit || "unit"}
          </span>
          {selectedUnit?.stock !== undefined && (
            <span className="ml-2 text-sm text-slate-500">
              (Stok: {selectedUnit.stock})
            </span>
          )}
        </div>
      </div>

      {selectedUnit && (
        <div className="pt-4 border-t border-slate-200">
          <div className="flex justify-between items-center">
            <span className="text-slate-700">Subtotal:</span>
            <span className="text-xl font-bold text-brand01">
              Rp {(selectedUnit.pricePerUnit * quantity).toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Product Detail Content Component
const ProductDetailContent = () => {
  const params = useParams();
  const router = useRouter();
  const { addToCart, cart } = useMarketplace();
  
  const [product, setProduct] = useState<FarmWaste | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<UnitPrice | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);
  const [addToCartSuccess, setAddToCartSuccess] = useState<boolean>(false);
  
  // Get product ID from URL params
  const productId = params.id as string;
  
  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getFarmWasteById(productId);
        setProduct(data);
        
        // Set default selected unit to base unit or first unit
        const baseUnit = data.unitPrices.find(unit => unit.isBaseUnit);
        setSelectedUnit(baseUnit || data.unitPrices[0]);
      } catch (err) {
        setError('Failed to fetch product details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);
  
  // Handle add to cart
  const handleAddToCart = async () => {
    if (!product || !selectedUnit) return;
    
    setAddingToCart(true);
    try {
      // For demo purposes, we're using a fixed user ID
      // In a real app, this would come from authentication
      const userId = "user123";
      
      await addToCart(userId, product._id, selectedUnit._id, quantity);
      
      setAddToCartSuccess(true);
      setTimeout(() => setAddToCartSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to add item to cart:', err);
    } finally {
      setAddingToCart(false);
    }
  };
  
  // Calculate total stock in base units
  const calculateTotalStock = (unitPrices: UnitPrice[]): number => {
    if (!unitPrices || unitPrices.length === 0) return 0;
    
    // Find the base unit
    const baseUnit = unitPrices.find(up => up.isBaseUnit);
    if (!baseUnit) return 0;
    
    // Calculate total stock in base units
    return unitPrices.reduce((total, up) => {
      const stockInBaseUnits = up.isBaseUnit 
        ? (up.stock || 0) 
        : (up.stock || 0) * (up.equalWith || 1);
      return total + stockInBaseUnits;
    }, 0);
  };
  
  return (
    <div className="min-h-screen bg-neutral01 pt-8 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          href="/marketplace"
          className="inline-flex items-center text-slate-600 hover:text-brand01 mb-6 transition-colors"
        >
          <ChevronLeft size={20} />
          <span>Kembali ke Marketplace</span>
        </Link>
        
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-brand01 animate-spin" />
            <span className="ml-2 text-brand03 text-lg">Memuat detail produk...</span>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center my-10">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
            <h3 className="text-lg font-medium text-red-700">Gagal memuat detail produk</h3>
            <p className="text-red-600 mt-1">{error}</p>
            <div className="mt-4 flex justify-center gap-4">
              <button 
                onClick={() => router.back()}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors"
              >
                Kembali
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )}
        
        {/* Product Detail */}
        {!loading && !error && product && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Product Image */}
            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/ampasTebu.png" // Default image, should be replaced with actual product image
                alt={product.wasteName}
                fill
                className="object-cover"
              />
            </div>
            
            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className={`text-3xl lg:text-4xl font-bold text-slate-800 ${dmSerifDisplay.className}`}>
                  {product.wasteName}
                </h1>
                <div className="flex items-center mt-2 gap-4">
                  <div className="flex items-center">
                    <Star size={18} className="text-amber-400" fill="currentColor" />
                    <span className="ml-1 text-slate-700 font-medium">
                      {product.averageRating || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center text-slate-500">
                    <Store size={16} />
                    <Link 
                      href={`/marketplace/store/${product.store._id}`}
                      className="ml-1 hover:text-brand01 transition-colors"
                    >
                      {product.store.storeName}
                    </Link>
                  </div>
                  <div className="flex items-center text-slate-500">
                    <Package size={16} />
                    <span className="ml-1">
                      {calculateTotalStock(product.unitPrices)} tersedia
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-b border-slate-200 py-6">
                <p className="text-slate-600 leading-relaxed">
                  {product.description || "Limbah pertanian berkualitas tinggi yang dapat digunakan untuk berbagai keperluan industri dan pertanian."}
                </p>
              </div>
              
              <UnitSelection 
                units={product.unitPrices}
                selectedUnit={selectedUnit}
                setSelectedUnit={setSelectedUnit}
                quantity={quantity}
                setQuantity={setQuantity}
              />
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || !selectedUnit}
                  className="flex-1 bg-brand01 hover:bg-brand01/90 text-white py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                >
                  {addingToCart ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Menambahkan...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      <span>Tambah ke Keranjang</span>
                    </>
                  )}
                </button>
              </div>
              
              {/* Success Message */}
              {addToCartSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                  <div className="bg-green-100 rounded-full p-1 mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-green-700">Produk berhasil ditambahkan ke keranjang!</span>
                </div>
              )}
              
              {/* Additional Info */}
              <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                <h3 className="font-medium text-slate-800 flex items-center gap-2">
                  <Info size={18} />
                  Informasi Tambahan
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Asal Produk</p>
                    <p className="font-medium text-slate-700">{product.store.storeName}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Pengiriman</p>
                    <p className="font-medium text-slate-700">Tersedia ke seluruh Indonesia</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Kategori</p>
                    <p className="font-medium text-slate-700">Limbah Pertanian</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Tanggal Update</p>
                    <p className="font-medium text-slate-700">
                      {new Date(product.updatedAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Wrapper component that provides the MarketplaceContext
export default function ProductDetail() {
  return (
    <MarketplaceProvider>
      <ProductDetailContent />
    </MarketplaceProvider>
  );
} 