"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Loader2,
  AlertCircle,
  Store as StoreIcon,
  Phone,
  Instagram,
  Facebook,
  Globe,
  MapPin,
} from "lucide-react";
import { dmSerifDisplay } from "@/components/fonts/dmSerifDisplay";
import { useAuth } from "@/contexts/AuthContext";
import API from "@/lib/utils/apiCreate";
import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function CreateStore() {
  const router = useRouter();
  const { accessToken, user } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    storeName: "",
    storeAddress: "",
    description: "",
    whatsAppNumber: "",
    instagram: "",
    facebook: "",
    officialWebsite: "",
  });
  
  // Loading and error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          toast.error("Anda harus login terlebih dahulu.");
          router.push("/auth/login");
        }
      } catch (error) {
        toast.error("Anda harus login terlebih dahulu.");
        router.push("/auth/login");
      }
    };
    checkAuth();
  }, [accessToken, router]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.storeName) {
      toast.error("Nama toko harus diisi.");
      return;
    }

    if (!formData.storeAddress) {
      toast.error("Lokasi toko harus diisi.");
      return;
    }

    // Validate at least one contact method is provided
    if (!formData.whatsAppNumber && !formData.instagram && !formData.facebook && !formData.officialWebsite) {
      toast.error("Setidaknya satu metode kontak harus diisi (WhatsApp, Instagram, Facebook, atau Website).");
      return;
    }

    if (!accessToken) {
      toast.error("Anda harus login terlebih dahulu.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await API.post(`/stores`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      setSuccess(true);
      toast.success("Toko berhasil dibuat! Mengalihkan ke halaman toko...");
      
      // Redirect to the store page after a short delay
      setTimeout(() => {
        router.push(`/marketplace/store`);
      }, 2000);
    } catch (err: any) {
      console.error("Error creating store:", err);
      toast.error(err.response?.data?.message || "Gagal membuat toko. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        
        <h1 className={`text-3xl font-bold text-slate-800 mb-8 ${dmSerifDisplay.className}`}>
          Buat Toko Baru
        </h1>      
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
              <StoreIcon className="w-10 h-10 text-slate-400" />
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="storeName" className="block text-sm font-medium text-slate-700 mb-1">
                Nama Toko <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="storeName"
                name="storeName"
                value={formData.storeName}
                onChange={handleInputChange}
                placeholder="Contoh: Tani Makmur"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand01/20 focus:border-brand01 outline-none transition-all"
                required
              />
            </div>
            
            <div>
              <label htmlFor="storeAddress" className="block text-sm font-medium text-slate-700 mb-1">
                Lokasi Toko <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="storeAddress"
                  name="storeAddress"
                  value={formData.storeAddress}
                  onChange={handleInputChange}
                  placeholder="Contoh: Banda Aceh, Aceh"
                  className="w-full px-4 py-2 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand01/20 focus:border-brand01 outline-none transition-all"
                  required
                />
                <MapPin className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                Deskripsi Toko
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Jelaskan tentang toko Anda..."
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand01/20 focus:border-brand01 outline-none transition-all"
              />
            </div>

            <div className="border-t border-slate-200 pt-4">
              <h3 className="font-medium text-slate-800 mb-3">Informasi Kontak <span className="text-red-500">*</span></h3>
              <p className="text-sm text-slate-500 mb-4">Setidaknya isi salah satu metode kontak di bawah ini.</p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 flex items-center justify-center bg-green-50 rounded-lg mr-3">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="whatsAppNumber" className="block text-sm font-medium text-slate-700 mb-1">
                      Nomor WhatsApp
                    </label>
                    <input
                      type="text"
                      id="whatsAppNumber"
                      name="whatsAppNumber"
                      value={formData.whatsAppNumber}
                      onChange={handleInputChange}
                      placeholder="Contoh: 08123456789"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand01/20 focus:border-brand01 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 flex items-center justify-center bg-purple-50 rounded-lg mr-3">
                    <Instagram className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="instagram" className="block text-sm font-medium text-slate-700 mb-1">
                      Instagram
                    </label>
                    <input
                      type="text"
                      id="instagram"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      placeholder="Contoh: @tanimakmur"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand01/20 focus:border-brand01 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-lg mr-3">
                    <Facebook className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="facebook" className="block text-sm font-medium text-slate-700 mb-1">
                      Facebook
                    </label>
                    <input
                      type="text"
                      id="facebook"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleInputChange}
                      placeholder="Contoh: TaniMakmur atau URL Facebook"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand01/20 focus:border-brand01 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 flex items-center justify-center bg-cyan-50 rounded-lg mr-3">
                    <Globe className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="officialWebsite" className="block text-sm font-medium text-slate-700 mb-1">
                      Website
                    </label>
                    <input
                      type="text"
                      id="officialWebsite"
                      name="officialWebsite"
                      value={formData.officialWebsite}
                      onChange={handleInputChange}
                      placeholder="Contoh: https://tanimakmur.com"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand01/20 focus:border-brand01 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-500 mb-6">
                Dengan membuat toko, Anda dapat mulai menjual produk limbah pertanian di DaurTani.
              </p>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || success}
                  className="bg-brand01 hover:bg-brand01/90 text-white py-3 px-8 rounded-xl font-medium flex items-center justify-center transition-all disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <span>Buat Toko</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 