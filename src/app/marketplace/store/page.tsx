"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { dmSerifDisplay } from "@/components/fonts/dmSerifDisplay";
// import { ProductCard } from "@/components/cards/productCard";
import {
  Store as StoreIcon,
  Package,
  Star,
  MapPin,
  Plus,
  Loader2,
  AlertCircle,
  PenLine,
  ShoppingBag,
  ImageIcon,
  Trash2,
} from "lucide-react";
import API from "@/lib/utils/apiCreate";
import { supabase } from "@/lib/supabase/client";
import { AddProductModal } from "@/components/modals/AddProductModal";
import type { Product } from "@/components/modals/AddProductModal";
import { DeleteProductModal } from '@/components/modals/DeleteProductModal';

interface StoreProduct {
  _id: string;
  wasteName: string;
  description: string;
  averageRating: number;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
  store: {
    _id: string;
    storeName: string;
    description: string;
    averageRating: number;
  };
  unitPrices: {
    _id: string;
    unit: string;
    pricePerUnit: number;
    isBaseUnit: boolean;
    stock?: number;
    equalWith?: number;
  }[];
}

interface Store {
  _id: string;
  storeName: string;
  description: string;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

interface StoreWithProducts {
  store: Store;
  products: StoreProduct[];
}

const StorePage = () => {
  const router = useRouter();
  const { accessToken, user } = useAuth();
  const [stores, setStores] = useState<StoreWithProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [currentAccessToken, setCurrentAccessToken] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProductToDelete, setSelectedProductToDelete] = useState<StoreProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchStores = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/auth/login");
        return;
      }

      setCurrentAccessToken(data.session.access_token);

      try {
        setLoading(true);
        const response = await API.get(`/stores/products`, {
          headers: {
            Authorization: `Bearer ${data.session?.access_token}`,
          },
        });
        
        const storesData = response.data.data || [];
        setStores(storesData);
        
        // Redirect to store creation page if no stores found
        if (storesData.length === 0) {
          router.push("/marketplace/store/create");
        }
      } catch (err: any) {
        console.error("Error fetching stores:", err);
        setError(err.response?.data?.message || "Failed to fetch stores");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [router]);

  const handleAddProduct = (storeId: string) => {
    setSelectedStoreId(storeId);
    setSelectedProduct(undefined);
    setIsAddProductModalOpen(true);
  };

  const handleEditProduct = (storeId: string, product: StoreProduct) => {
    // Convert StoreProduct to Product type
    const convertedProduct: Product = {
      _id: product._id,
      wasteName: product.wasteName,
      description: product.description,
      imageUrls: product.imageUrls || [],
      unitPrices: product.unitPrices.map(up => ({
        _id: up._id,
        unit: up.unit,
        pricePerUnit: up.pricePerUnit,
        isBaseUnit: up.isBaseUnit,
        stock: up.stock || 0,
        equalWith: up.equalWith || 1
      }))
    };
    
    setSelectedStoreId(storeId);
    setSelectedProduct(convertedProduct);
    setIsAddProductModalOpen(true);
  };

  const handleProductSaved = () => {
    // Refresh the stores data
    const fetchStores = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;

      try {
        const response = await API.get(`/stores/products`, {
          headers: {
            Authorization: `Bearer ${data.session?.access_token}`,
          },
        });
        setStores(response.data.data || []);
      } catch (err) {
        console.error("Error refreshing stores:", err);
      }
    };

    fetchStores();
  };

  // Helper function to get the lowest price for a product
  const getLowestPrice = (unitPrices: StoreProduct["unitPrices"]) => {
    if (!unitPrices || unitPrices.length === 0) return 0;
    return Math.min(...unitPrices.map(up => up.pricePerUnit));
  };

  // Helper function to get the base unit for a product
  const getBaseUnit = (unitPrices: StoreProduct["unitPrices"]) => {
    if (!unitPrices || unitPrices.length === 0) return "unit";
    const baseUnit = unitPrices.find(up => up.isBaseUnit);
    return baseUnit ? baseUnit.unit : unitPrices[0].unit;
  };

  const handleDeleteClick = (product: StoreProduct) => {
    setSelectedProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProductToDelete || !currentAccessToken) return;

    setIsDeleting(true);
    try {
      await API.delete(`/farm-wastes/${selectedProductToDelete._id}`, {
        headers: { Authorization: `Bearer ${currentAccessToken}` }
      });

      // Remove product from UI
      setStores(stores.map(store => ({
        ...store,
        products: store.products.filter(p => p._id !== selectedProductToDelete._id)
      })));

      setIsDeleteModalOpen(false);
      setSelectedProductToDelete(null);
    } catch (err) {
      console.error('Error deleting product:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-brand01 animate-spin mx-auto mb-4" />
          <p className="text-brand03 text-lg">Memuat data toko...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
          <h3 className="text-xl font-medium text-red-700 mb-2">Gagal memuat data toko</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            onClick={() => router.refresh()}
            className="bg-red-100 hover:bg-red-200 text-red-700 px-6 py-2 rounded-lg transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // If no stores found, show create store prompt
  if (stores.length === 0) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <StoreIcon className="w-12 h-12 text-slate-400" />
          </div>
          
          <h1 className={`text-3xl font-bold text-brand03 mb-3 ${dmSerifDisplay.className}`}>
            Anda belum memiliki toko
          </h1>
          
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Buat toko Anda sendiri untuk mulai menjual limbah pertanian di marketplace DaurTani
          </p>
          
          <Link 
            href="/marketplace/store/create"
            className="inline-flex items-center bg-brand01 hover:bg-brand01/90 text-white py-3 px-8 rounded-xl font-medium transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Buat Toko Baru
          </Link>
        </div>
      </div>
    );
  }

  // If stores found, display them with their products
  return (
    <div className="min-h-screen p-4 md:p-8">
      {stores.map((storeData) => (
        <div key={storeData.store._id} className="max-w-7xl mx-auto mb-16">
          {/* Store Header */}
          <div className="bg-gradient-to-br from-brand02/30 via-neutral01 to-neutral01 rounded-xl shadow-md p-6 md:p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                <StoreIcon className="w-10 h-10 text-slate-400" />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className={`text-2xl md:text-3xl font-bold text-brand03 ${dmSerifDisplay.className}`}>
                      {storeData.store.storeName}
                    </h1>
                    
                    <div className="flex items-center gap-3 mt-2 text-slate-500">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-amber-400 mr-1" fill="currentColor" />
                        <span>{storeData.store.averageRating || "N/A"}</span>
                      </div>
                      <div className="flex items-center">
                        <Package className="w-4 h-4 mr-1" />
                        <span>{storeData.products.length} Produk</span>
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/marketplace/store/${storeData.store._id}/edit`}
                    className="inline-flex items-center bg-transparent hover:bg-slate-100 text-slate-700 py-2 px-4 rounded-lg border border-slate-300 transition-all text-sm"
                  >
                    <PenLine className="w-4 h-4 mr-2" />
                    Edit Toko
                  </Link>
                </div>
                
                {storeData.store.description && (
                  <p className="text-slate-600 mt-4 max-w-3xl">
                    {storeData.store.description}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Products Section */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className={`text-xl md:text-2xl font-bold text-brand03 ${dmSerifDisplay.className}`}>
              Produk Toko
            </h2>
            
            <button 
              onClick={() => handleAddProduct(storeData.store._id)}
              className="inline-flex items-center shadow-md shadow-black/30 bg-brand01 hover:bg-brand01/90 text-white py-2 px-4 rounded-lg transition-all text-sm cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1" />
              Tambah Produk
            </button>
          </div>
          
          {storeData.products.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-700 mb-2">Belum ada produk</h3>
              <p className="text-slate-500 mb-6">Tambahkan produk limbah pertanian untuk mulai berjualan</p>
              <button
                onClick={() => handleAddProduct(storeData.store._id)}
                className="inline-flex items-center bg-brand01 hover:bg-brand01/90 text-white py-2 px-4 rounded-lg transition-all text-sm cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-1" />
                Tambah Produk Pertama
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {storeData.products.map((product) => (
                <div key={product._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <div className="relative h-48">
                    {product.imageUrls && product.imageUrls.length > 0 ? (
                      <Image
                        src={product.imageUrls[0]}
                        alt={product.wasteName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-slate-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-slate-800 mb-1">
                      {product.wasteName}
                    </h3>
                    
                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                      {product.description || "Limbah pertanian berkualitas tinggi"}
                    </p>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-brand01">
                        Rp {getLowestPrice(product.unitPrices).toLocaleString('id-ID')}/{getBaseUnit(product.unitPrices)}
                      </span>
                      
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-amber-400 mr-1" fill="currentColor" />
                        <span className="text-slate-600">{product.averageRating || "N/A"}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        onClick={() => handleEditProduct(storeData.store._id, product)}
                        className="text-sm text-brand01 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="text-sm text-red-500 hover:underline ml-3"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Add/Edit Product Modal */}
      {selectedStoreId && currentAccessToken && (
        <AddProductModal
          isOpen={isAddProductModalOpen}
          onClose={() => {
            setIsAddProductModalOpen(false);
            setSelectedStoreId(null);
            setSelectedProduct(undefined);
          }}
          storeId={selectedStoreId}
          accessToken={currentAccessToken}
          onSuccess={handleProductSaved}
          product={selectedProduct}
        />
      )}

      {/* Delete Confirmation Modal */}
      {selectedProductToDelete && (
        <DeleteProductModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedProductToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          productName={selectedProductToDelete.wasteName}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default StorePage;


