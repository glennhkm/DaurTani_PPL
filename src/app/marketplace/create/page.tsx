"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  Info,
} from "lucide-react";
import { dmSerifDisplay } from "@/components/fonts/dmSerifDisplay";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Form for creating a new farm waste listing
export default function CreateListing() {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState({
    wasteName: "",
    description: "",
    storeId: "", // In a real app, this would come from the user's store
  });
  
  // Units state
  const [units, setUnits] = useState([
    { unit: "", pricePerUnit: 0, isBaseUnit: true, stock: 0, equalWith: 1 },
  ]);
  
  // Loading and error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [stores, setStores] = useState<any[]>([]);
  const [loadingStores, setLoadingStores] = useState(false);
  
  // Fetch user's stores
  useEffect(() => {
    const fetchStores = async () => {
      setLoadingStores(true);
      try {
        const response = await axios.get(`${API_URL}/stores`);
        setStores(response.data.data || []);
      } catch (err) {
        console.error("Error fetching stores:", err);
        setError("Failed to load stores. Please try again later.");
      } finally {
        setLoadingStores(false);
      }
    };
    
    fetchStores();
  }, []);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle unit input changes
  const handleUnitChange = (index: number, field: string, value: any) => {
    const updatedUnits = [...units];
    
    // If changing the isBaseUnit field
    if (field === "isBaseUnit" && value === true) {
      // Set all other units' isBaseUnit to false
      updatedUnits.forEach((unit, i) => {
        if (i !== index) {
          unit.isBaseUnit = false;
        }
      });
    }
    
    // Update the specific field
    updatedUnits[index] = {
      ...updatedUnits[index],
      [field]: value,
    };
    
    // If this is the base unit, set equalWith to 1
    if (field === "isBaseUnit" && value === true) {
      updatedUnits[index].equalWith = 1;
    }
    
    setUnits(updatedUnits);
  };
  
  // Add a new unit
  const addUnit = () => {
    setUnits([
      ...units,
      { unit: "", pricePerUnit: 0, isBaseUnit: false, stock: 0, equalWith: 0 },
    ]);
  };
  
  // Remove a unit
  const removeUnit = (index: number) => {
    // Don't remove if it's the only unit
    if (units.length <= 1) return;
    
    const updatedUnits = [...units];
    updatedUnits.splice(index, 1);
    
    // If we removed the base unit, set the first unit as the base unit
    if (units[index].isBaseUnit && updatedUnits.length > 0) {
      updatedUnits[0].isBaseUnit = true;
      updatedUnits[0].equalWith = 1;
    }
    
    setUnits(updatedUnits);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.wasteName || !formData.storeId) {
      setError("Please fill in all required fields.");
      return;
    }
    
    // Validate units
    const hasBaseUnit = units.some(unit => unit.isBaseUnit);
    if (!hasBaseUnit) {
      setError("Please designate one unit as the base unit.");
      return;
    }
    
    for (const unit of units) {
      if (!unit.unit || unit.pricePerUnit <= 0) {
        setError("Please fill in all unit information correctly.");
        return;
      }
      
      if (!unit.isBaseUnit && (!unit.equalWith || unit.equalWith <= 0)) {
        setError(`Please provide a valid 'Equal With' value for ${unit.unit}.`);
        return;
      }
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_URL}/farm-wastes`, {
        ...formData,
        unitPrices: units,
      });
      
      setSuccess(true);
      
      // Redirect to the new product page after a short delay
      setTimeout(() => {
        router.push(`/marketplace/${response.data.data.farmWaste._id}`);
      }, 2000);
    } catch (err: any) {
      console.error("Error creating farm waste:", err);
      setError(err.response?.data?.message || "Failed to create listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-neutral01 pt-8 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Back Button */}
        <Link 
          href="/marketplace"
          className="inline-flex items-center text-slate-600 hover:text-brand01 mb-6 transition-colors"
        >
          <ChevronLeft size={20} />
          <span>Kembali ke Marketplace</span>
        </Link>
        
        <h1 className={`text-3xl font-bold text-slate-800 mb-8 ${dmSerifDisplay.className}`}>
          Tambah Produk Limbah Pertanian
        </h1>
        
        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center mb-6">
            <div className="bg-green-100 rounded-full p-1 mr-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-green-700">Produk berhasil ditambahkan! Mengalihkan ke halaman produk...</span>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mb-6">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <span className="text-red-700">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Informasi Dasar</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="storeId" className="block text-sm font-medium text-slate-700 mb-1">
                  Toko <span className="text-red-500">*</span>
                </label>
                {loadingStores ? (
                  <div className="flex items-center">
                    <Loader2 className="w-4 h-4 text-brand01 animate-spin mr-2" />
                    <span className="text-sm text-slate-500">Memuat toko...</span>
                  </div>
                ) : stores.length > 0 ? (
                  <select
                    id="storeId"
                    name="storeId"
                    value={formData.storeId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand01/20 focus:border-brand01 outline-none transition-all"
                    required
                  >
                    <option value="">Pilih Toko</option>
                    {stores.map(store => (
                      <option key={store._id} value={store._id}>
                        {store.storeName}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center text-amber-700 bg-amber-50 px-4 py-2 rounded-lg">
                    <Info size={16} className="mr-2" />
                    <span className="text-sm">
                      Anda belum memiliki toko. 
                      <Link href="/marketplace/store/create" className="ml-1 underline hover:text-amber-800">
                        Buat toko baru
                      </Link>
                    </span>
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="wasteName" className="block text-sm font-medium text-slate-700 mb-1">
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="wasteName"
                  name="wasteName"
                  value={formData.wasteName}
                  onChange={handleInputChange}
                  placeholder="Contoh: Sekam Padi Premium"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand01/20 focus:border-brand01 outline-none transition-all"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                  Deskripsi Produk
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Jelaskan tentang produk limbah pertanian Anda..."
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand01/20 focus:border-brand01 outline-none transition-all"
                />
              </div>
            </div>
          </div>
          
          {/* Units and Pricing */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-800">Unit dan Harga</h2>
              <button
                type="button"
                onClick={addUnit}
                className="text-sm flex items-center text-brand01 hover:text-brand01/80 font-medium"
              >
                <Plus size={16} className="mr-1" />
                Tambah Unit
              </button>
            </div>
            
            <div className="space-y-6">
              {units.map((unit, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-slate-800">Unit #{index + 1}</h3>
                    {units.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeUnit(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Nama Unit <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={unit.unit}
                        onChange={(e) => handleUnitChange(index, "unit", e.target.value)}
                        placeholder="Contoh: kg, ton, karung"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand01/20 focus:border-brand01 outline-none transition-all"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Harga per Unit (Rp) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={unit.pricePerUnit}
                        onChange={(e) => handleUnitChange(index, "pricePerUnit", Number(e.target.value))}
                        min="0"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand01/20 focus:border-brand01 outline-none transition-all"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Stok
                      </label>
                      <input
                        type="number"
                        value={unit.stock}
                        onChange={(e) => handleUnitChange(index, "stock", Number(e.target.value))}
                        min="0"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand01/20 focus:border-brand01 outline-none transition-all"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`baseUnit-${index}`}
                        checked={unit.isBaseUnit}
                        onChange={(e) => handleUnitChange(index, "isBaseUnit", e.target.checked)}
                        className="mr-2 h-4 w-4 text-brand01 focus:ring-brand01/20 border-slate-300 rounded"
                      />
                      <label htmlFor={`baseUnit-${index}`} className="text-sm font-medium text-slate-700">
                        Unit Dasar
                      </label>
                      <div className="ml-1 group relative">
                        <Info size={14} className="text-slate-400" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-slate-800 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          Unit dasar digunakan sebagai referensi untuk konversi antar unit.
                        </div>
                      </div>
                    </div>
                    
                    {!unit.isBaseUnit && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Setara dengan (dalam unit dasar) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={unit.equalWith}
                          onChange={(e) => handleUnitChange(index, "equalWith", Number(e.target.value))}
                          min="0"
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand01/20 focus:border-brand01 outline-none transition-all"
                          required
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          Contoh: Jika 1 ton setara dengan 1000 kg (unit dasar), masukkan 1000
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Submit Button */}
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
                <span>Tambahkan Produk</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 