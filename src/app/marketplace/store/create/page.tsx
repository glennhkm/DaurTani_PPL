"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Loader2,
  AlertCircle,
  Store as StoreIcon,
} from "lucide-react";
import { dmSerifDisplay } from "@/components/fonts/dmSerifDisplay";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import API from "@/lib/utils/apiCreate";
import { supabase } from "@/lib/supabase/client";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Form for creating a new store
export default function CreateStore() {
  const router = useRouter();
  const { accessToken, user } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    storeName: "",
    description: "",
    // In a real app, these would be handled properly
    // storeAddressId: "placeholder_address_id", // This would come from an address form
  });
  
  // Loading and error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          router.push("/auth/login");
        }
      } catch (error) {
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
      setError("Nama toko harus diisi.");
      return;
    }

    if (!accessToken) {
      setError("Anda harus login terlebih dahulu.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await API.post(`/stores`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      setSuccess(true);
      
      // Redirect to the store page after a short delay
      setTimeout(() => {
        router.push(`/marketplace/store`);
      }, 2000);
    } catch (err: any) {
      console.error("Error creating store:", err);
      setError(err.response?.data?.message || "Gagal membuat toko. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-neutral01 pt-8 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        
        <h1 className={`text-3xl font-bold text-slate-800 mb-8 ${dmSerifDisplay.className}`}>
          Buat Toko Baru
        </h1>
        
        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center mb-6">
            <div className="bg-green-100 rounded-full p-1 mr-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-green-700">Toko berhasil dibuat! Mengalihkan ke halaman toko...</span>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mb-6">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <span className="text-red-700">{error}</span>
          </div>
        )}
        
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