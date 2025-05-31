"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Trash2,
  ChevronLeft,
  Plus,
  Minus,
  Loader2,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";
import { dmSerifDisplay } from "@/components/fonts/dmSerifDisplay";
import { MarketplaceProvider, useMarketplace } from "@/contexts/MarketplaceContext";

// Cart Item Component
const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating,
  isRemoving,
}: {
  item: any;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  isUpdating: boolean;
  isRemoving: boolean;
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-slate-200 rounded-lg bg-white">
      {/* Product Image */}
      <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0">
        <Image
          src="/images/ampasTebu.png" // Default image, should be replaced with actual product image
          alt={item.farmWaste.wasteName}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-grow">
        <Link 
          href={`/marketplace/${item.farmWaste._id}`}
          className="font-medium text-slate-800 hover:text-brand01 transition-colors"
        >
          {item.farmWaste.wasteName}
        </Link>
        <p className="text-sm text-slate-500 mt-1">
          {item.store.storeName}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-slate-600">
            Rp {item.pricePerUnit.toLocaleString("id-ID")}/{item.unit}
          </span>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center mt-2 sm:mt-0">
        <button
          onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
          disabled={item.quantity <= 1 || isUpdating}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-l-lg disabled:opacity-50"
        >
          <Minus size={14} />
        </button>
        <span className="w-10 text-center border-y border-slate-200 py-1.5 text-slate-700">
          {item.quantity}
        </span>
        <button
          onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
          disabled={isUpdating}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-r-lg disabled:opacity-50"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Price */}
      <div className="flex items-center justify-between w-full sm:w-auto sm:ml-4">
        <span className="font-semibold text-slate-800 sm:text-right sm:w-24">
          Rp {item.totalPriceItem.toLocaleString("id-ID")}
        </span>
        <button
          onClick={() => onRemove(item._id)}
          disabled={isRemoving}
          className="text-red-500 hover:text-red-700 p-1 transition-colors"
          aria-label="Remove item"
        >
          {isRemoving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Trash2 size={16} />
          )}
        </button>
      </div>
    </div>
  );
};

// Order Summary Component
const OrderSummary = ({
  subtotal,
  onCheckout,
  isProcessing,
}: {
  subtotal: number;
  onCheckout: () => void;
  isProcessing: boolean;
}) => {
  // For this implementation, we'll use fixed shipping cost and no tax
  const shipping = 10000; // Rp 10,000
  const total = subtotal + shipping;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 sticky top-4">
      <h2 className={`text-xl font-bold text-slate-800 mb-4 ${dmSerifDisplay.className}`}>
        Ringkasan Pesanan
      </h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span>Rp {subtotal.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Biaya Pengiriman</span>
          <span>Rp {shipping.toLocaleString("id-ID")}</span>
        </div>
        <div className="border-t border-slate-200 pt-3 flex justify-between font-semibold text-slate-800">
          <span>Total</span>
          <span>Rp {total.toLocaleString("id-ID")}</span>
        </div>
      </div>
      
      <button
        onClick={onCheckout}
        disabled={subtotal === 0 || isProcessing}
        className="w-full bg-brand01 hover:bg-brand01/90 text-white py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-70"
      >
        {isProcessing ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Memproses...</span>
          </>
        ) : (
          <>
            <ShoppingBag size={18} />
            <span>Lanjutkan ke Pembayaran</span>
          </>
        )}
      </button>
      
      <p className="text-xs text-slate-500 mt-4 text-center">
        Dengan melanjutkan, Anda menyetujui syarat dan ketentuan yang berlaku.
      </p>
    </div>
  );
};

// Empty Cart Component
const EmptyCart = () => {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
        <ShoppingCart size={32} className="text-slate-400" />
      </div>
      <h2 className={`text-2xl font-bold text-slate-800 mb-2 ${dmSerifDisplay.className}`}>
        Keranjang Anda Kosong
      </h2>
      <p className="text-slate-600 mb-8">
        Anda belum menambahkan produk apapun ke keranjang.
      </p>
      <Link
        href="/marketplace"
        className="inline-flex items-center justify-center bg-brand01 hover:bg-brand01/90 text-white py-3 px-6 rounded-xl font-medium transition-colors"
      >
        Mulai Belanja
      </Link>
    </div>
  );
};

// Cart Content Component
const CartContent = () => {
  const router = useRouter();
  const { cart, fetchCart, updateCartItemQuantity, removeFromCart, loading, error } = useMarketplace();
  
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState<boolean>(false);
  
  // For demo purposes, we're using a fixed user ID
  // In a real app, this would come from authentication
  const userId = "user123";
  
  useEffect(() => {
    fetchCart(userId);
  }, []);
  
  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setUpdatingItemId(itemId);
    try {
      await updateCartItemQuantity(itemId, quantity);
    } catch (err) {
      console.error('Failed to update item quantity:', err);
    } finally {
      setUpdatingItemId(null);
    }
  };
  
  const handleRemoveItem = async (itemId: string) => {
    setRemovingItemId(itemId);
    try {
      await removeFromCart(itemId);
    } catch (err) {
      console.error('Failed to remove item:', err);
    } finally {
      setRemovingItemId(null);
    }
  };
  
  const handleCheckout = () => {
    setIsProcessingCheckout(true);
    // In a real app, this would navigate to a checkout page or process
    setTimeout(() => {
      alert('Fitur pembayaran belum tersedia.');
      setIsProcessingCheckout(false);
    }, 1000);
  };
  
  // Calculate subtotal
  const subtotal = cart?.items.reduce((total, item) => total + item.totalPriceItem, 0) || 0;
  
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
        
        <h1 className={`text-3xl font-bold text-slate-800 mb-8 ${dmSerifDisplay.className}`}>
          Keranjang Belanja
        </h1>
        
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-brand01 animate-spin" />
            <span className="ml-2 text-brand03 text-lg">Memuat keranjang...</span>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center my-10">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
            <h3 className="text-lg font-medium text-red-700">Gagal memuat keranjang</h3>
            <p className="text-red-600 mt-1">{error}</p>
            <button 
              onClick={() => fetchCart(userId)}
              className="mt-4 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}
        
        {/* Cart Content */}
        {!loading && !error && (
          <>
            {cart && cart.items.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {cart.items.map(item => (
                    <CartItem 
                      key={item._id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                      isUpdating={updatingItemId === item._id}
                      isRemoving={removingItemId === item._id}
                    />
                  ))}
                </div>
                
                {/* Order Summary */}
                <div>
                  <OrderSummary 
                    subtotal={subtotal}
                    onCheckout={handleCheckout}
                    isProcessing={isProcessingCheckout}
                  />
                </div>
              </div>
            ) : (
              <EmptyCart />
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Wrapper component that provides the MarketplaceContext
export default function Cart() {
  return (
    <MarketplaceProvider>
      <CartContent />
    </MarketplaceProvider>
  );
} 