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
  Clock,
  MessageSquare,
  Phone,
  Instagram,
  Facebook,
  Globe,
} from "lucide-react";
import API from "@/lib/utils/apiCreate";
import { supabase } from "@/lib/supabase/client";
import { AddProductModal } from "@/components/modals/AddProductModal";
import type { Product } from "@/components/modals/AddProductModal";
import { DeleteProductModal } from '@/components/modals/DeleteProductModal';
import { EditStoreModal } from "@/components/modals/EditStoreModal";
import toast from "react-hot-toast";

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
  storeAddress: string;
  description: string;
  averageRating: number;
  whatsAppNumber?: string;
  instagram?: string;
  facebook?: string;
  officialWebsite?: string;
  createdAt: string;
  updatedAt: string;
}

interface StoreWithProducts {
  store: Store;
  products: StoreProduct[];
}

interface Review {
  _id: string;
  userId: string;
  farmWasteId: string;
  rating: number;
  description?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
  user?: {
    fullName: string;
    email: string;
  };
}

const StorePage = () => {
  const router = useRouter();;
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
  const [isEditStoreModalOpen, setIsEditStoreModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [productReviews, setProductReviews] = useState<{ [key: string]: Review[] }>({});
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'reviews'>('products');

  useEffect(() => {
    const fetchStores = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast.error("Anda harus login terlebih dahulu.");
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

  // Fetch reviews for all products
  useEffect(() => {
    const fetchAllReviews = async () => {
      if (!stores.length || !currentAccessToken) return;

      setLoadingReviews(true);
      const reviewsByProduct: { [key: string]: Review[] } = {};

      try {
        // For each store, fetch reviews for all its products
        for (const storeData of stores) {
          for (const product of storeData.products) {
            const response = await API.get(`/reviews/${product._id}`);
            reviewsByProduct[product._id] = response.data.data || [];
          }
        }

        setProductReviews(reviewsByProduct);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoadingReviews(false);
      }
    };

    if (stores.length > 0) {
      fetchAllReviews();
    }
  }, [stores, currentAccessToken]);

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

  const handleEditStore = (store: Store) => {
    setSelectedStore(store);
    setIsEditStoreModalOpen(true);
  };

  const handleStoreUpdated = () => {
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
        toast.success("Toko berhasil diperbarui");
      } catch (err) {
        console.error("Error refreshing stores:", err);
      }
    };

    fetchStores();
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Calculate total reviews for a store
  const getTotalReviews = (storeProducts: StoreProduct[]) => {
    let total = 0;
    storeProducts.forEach(product => {
      total += (productReviews[product._id]?.length || 0);
    });
    return total;
  };

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center pt-44">
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
        <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6 text-center shadow-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
          <h3 className="text-xl font-medium text-red-700 mb-2">Gagal memuat data toko</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            onClick={() => router.refresh()}
            className="bg-red-100 hover:bg-red-200 text-red-700 px-6 py-2 rounded-lg transition-colors shadow-sm hover:shadow"
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
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-10 text-center border border-slate-100">
          <div className="w-24 h-24 bg-gradient-to-br from-brand01/20 to-brand02/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <StoreIcon className="w-12 h-12 text-brand01/70" />
          </div>
          
          <h1 className={`text-3xl font-bold text-brand03 mb-3 ${dmSerifDisplay.className}`}>
            Anda belum memiliki toko
          </h1>
          
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Buat toko Anda sendiri untuk mulai menjual limbah pertanian di marketplace DaurTani
          </p>
          
          <Link 
            href="/marketplace/store/create"
            className="inline-flex items-center bg-brand01 hover:bg-brand01/90 text-white py-3 px-8 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
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
          <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-8 relative overflow-hidden">
            {/* <div className="absolute top-0 left-0 w-full h-[48%] "></div> */}
            
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10 bg-gradient-to-r from-brand01 to-neutral01 -m-8 p-8">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-100 mb-12">
                <StoreIcon className="w-10 h-10 text-brand01" />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className={`text-2xl md:text-3xl font-bold text-white ${dmSerifDisplay.className}`}>
                      {storeData.store.storeName}
                    </h1>
                    
                    <div className="flex items-center gap-3 mt-2 text-white/80">
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.round(storeData.store.averageRating || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}
                            />
                          ))}
                        </div>
                        <span className="ml-1">{storeData.store.averageRating.toFixed(1) || "N/A"}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{storeData.store.storeAddress}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleEditStore(storeData.store)}
                    className="inline-flex items-center bg-white hover:bg-slate-50 text-slate-700 py-2 px-4 rounded-lg border border-slate-300 transition-all text-sm shadow-sm hover:shadow"
                  >
                    <PenLine className="w-4 h-4 mr-2" />
                    Edit Toko
                  </button>
                </div>
                
                <div className="mt-10 flex flex-wrap gap-3">
                  <div className="bg-white/10 text-white px-3 py-1 rounded-full text-sm flex items-center">
                    <Package className="w-4 h-4 mr-1" />
                    <span>{storeData.products.length} Produk</span>
                  </div>
                  <div className="bg-white/10 text-white px-3 py-1 rounded-full text-sm flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    <span>{getTotalReviews(storeData.products)} Ulasan</span>
                  </div>
                  <div className="bg-white/10 text-white px-3 py-1 rounded-full text-sm flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Bergabung {new Date(storeData.store.createdAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long'
                    })}</span>
                  </div>
                </div>
                
                {storeData.store.description && (
                  <div className="bg-slate-50/90 p-4 rounded-lg mt-4 max-w-3xl border border-slate-100 shadow-sm">
                    <p className="text-slate-600">
                      {storeData.store.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Store Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-200">
              {storeData.store.whatsAppNumber && (
                <a 
                  href={`https://wa.me/${storeData.store.whatsAppNumber.replace(/^0/, "62")}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Phone className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800">WhatsApp</span>
                </a>
              )}
              
              {storeData.store.instagram && (
                <a 
                  href={`https://instagram.com/${storeData.store.instagram.replace("@", "")}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Instagram className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-purple-800">{storeData.store.instagram}</span>
                </a>
              )}
              
              {storeData.store.facebook && (
                <a 
                  href={storeData.store.facebook.startsWith("http") ? storeData.store.facebook : `https://facebook.com/${storeData.store.facebook}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Facebook className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-blue-800">Facebook</span>
                </a>
              )}
              
              {storeData.store.officialWebsite && (
                <a 
                  href={storeData.store.officialWebsite.startsWith("http") ? storeData.store.officialWebsite : `https://${storeData.store.officialWebsite}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center p-3 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors"
                >
                  <Globe className="w-5 h-5 text-cyan-600 mr-2" />
                  <span className="text-cyan-800">Website</span>
                </a>
              )}
            </div>
          </div>
          
          {/* Tabs */}
          <div className="mb-6 border-b border-slate-200">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-3 px-1 font-medium text-lg transition-colors relative ${
                  activeTab === 'products' ? 'text-brand01' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Produk
                  <span className="ml-2 text-sm bg-brand02 text-neutral01 px-2 py-0.5 rounded-full">
                    {storeData.products.length}
                  </span>
                </div>
                {activeTab === 'products' && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand01"></div>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-3 px-1 font-medium text-lg transition-colors relative ${
                  activeTab === 'reviews' ? 'text-brand01' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Ulasan
                  <span className="ml-2 text-sm bg-brand02 text-neutral01 px-2 py-0.5 rounded-full">
                    {getTotalReviews(storeData.products)}
                  </span>
                </div>
                {activeTab === 'reviews' && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand01"></div>
                )}
              </button>
            </div>
          </div>
          
          {/* Products Tab */}
          {activeTab === 'products' && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className={`text-xl md:text-2xl font-bold text-brand03 ${dmSerifDisplay.className} flex items-center`}>
                  <Package className="w-5 h-5 mr-2 text-brand01" />
                  Produk Toko
                  <span className="ml-3 text-sm font-normal bg-brand01/10 text-brand01 px-2 py-0.5 rounded-full">
                    {storeData.products.length} item
                  </span>
                </h2>
                
                <button 
                  onClick={() => handleAddProduct(storeData.store._id)}
                  className="inline-flex items-center shadow-md bg-brand01 hover:bg-brand01/90 text-white py-2.5 px-5 rounded-lg transition-all text-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Produk
                </button>
              </div>
              
              {storeData.products.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-10 text-center border border-slate-100">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-700 mb-2">Belum ada produk</h3>
                  <p className="text-slate-500 mb-6 max-w-md mx-auto">Tambahkan produk limbah pertanian untuk mulai berjualan di marketplace DaurTani</p>
                  <button
                    onClick={() => handleAddProduct(storeData.store._id)}
                    className="inline-flex items-center bg-brand01 hover:bg-brand01/90 text-white py-3 px-6 rounded-lg transition-all text-sm cursor-pointer shadow-md hover:shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Produk Pertama
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {storeData.products.map((product) => (
                    <div key={product._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-slate-100 hover:border-brand01/20 group">
                      <div className="relative h-48">
                        {product.imageUrls && product.imageUrls.length > 0 ? (
                          <Image
                            src={product.imageUrls[0]}
                            alt={product.wasteName}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                            <ImageIcon className="w-10 h-10 text-slate-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-brand01 transition-colors">
                          {product.wasteName}
                        </h3>
                        
                        <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                          {product.description || "Limbah pertanian berkualitas tinggi"}
                        </p>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-bold text-brand01">
                            Rp {getLowestPrice(product.unitPrices).toLocaleString('id-ID')}/{getBaseUnit(product.unitPrices)}
                          </span>
                          
                          <div className="flex items-center bg-slate-50 px-2 py-1 rounded-full">
                            <Star className="w-4 h-4 text-amber-400 mr-1 fill-amber-400" />
                            <span className="text-slate-600 text-sm">{product.averageRating || "N/A"}</span>
                          </div>
                        </div>
                        
                        <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                          <span className="flex items-center text-xs text-slate-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(product.createdAt).toLocaleDateString('id-ID')}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditProduct(storeData.store._id, product)}
                              className="text-sm text-brand01 hover:text-brand01/80 hover:underline flex items-center"
                            >
                              <PenLine className="w-3 h-3 mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClick(product)}
                              className="text-sm text-red-500 hover:text-red-600 hover:underline flex items-center ml-3"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          
          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              <h2 className={`text-xl md:text-2xl font-bold text-brand03 ${dmSerifDisplay.className} flex items-center mb-6`}>
                <MessageSquare className="w-5 h-5 mr-2 text-brand01" />
                Ulasan Produk
                <span className="ml-3 text-sm font-normal bg-brand01/10 text-brand01 px-2 py-0.5 rounded-full">
                  {getTotalReviews(storeData.products)} ulasan
                </span>
              </h2>
              
              {loadingReviews ? (
                <div className="text-center py-16">
                  <Loader2 className="w-10 h-10 text-brand01 animate-spin mx-auto mb-4" />
                  <p className="text-slate-500">Memuat ulasan...</p>
                </div>
              ) : getTotalReviews(storeData.products) === 0 ? (
                <div className="bg-slate-50 rounded-xl p-10 text-center">
                  <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-slate-700 mb-2">Belum ada ulasan</h3>
                  <p className="text-slate-500">Produk Anda belum mendapatkan ulasan dari pembeli</p>
                </div>
              ) : (
                storeData.products.map((product) => {
                  const reviews = productReviews[product._id] || [];
                  if (reviews.length === 0) return null;
                  
                  return (
                    <div key={product._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100 mb-6">
                      <div className="p-6 border-b border-slate-100 flex items-center">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden mr-4">
                          {product.imageUrls && product.imageUrls.length > 0 ? (
                            <Image
                              src={product.imageUrls[0]}
                              alt={product.wasteName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-slate-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-800">{product.wasteName}</h3>
                          <div className="flex items-center text-sm text-slate-500">
                            <div className="flex mr-2">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3 h-3 ${i < Math.round(product.averageRating || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                                />
                              ))}
                            </div>
                            <span>{product.averageRating.toFixed(1)}</span>
                            <span className="mx-2">•</span>
                            <span>{reviews.length} ulasan</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="divide-y divide-slate-100">
                        {reviews.map((review) => (
                          <div key={review._id} className="p-6">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <div className="flex items-center mb-1">
                                  <h4 className="font-medium text-slate-800 mr-2">{review.user?.fullName || "Pengguna"}</h4>
                                  <span className="text-xs text-slate-500">{formatDate(review.createdAt)}</span>
                                </div>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            {review.description && (
                              <p className="text-slate-600 mt-2">{review.description}</p>
                            )}
                            
                            {review.images && review.images.length > 0 && (
                              <div className="flex mt-4 space-x-3">
                                {review.images.map((img, index) => (
                                  <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    <Image
                                      src={img}
                                      alt={`Review image ${index + 1}`}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }).filter(Boolean)
              )}
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

      {/* Edit Store Modal */}
      {selectedStore && currentAccessToken && (
        <EditStoreModal
          isOpen={isEditStoreModalOpen}
          onClose={() => {
            setIsEditStoreModalOpen(false);
            setSelectedStore(null);
          }}
          store={selectedStore}
          accessToken={currentAccessToken}
          onSuccess={handleStoreUpdated}
        />
      )}
    </div>
  );
};

export default StorePage;


