import { useState, useEffect } from "react";
import { 
  Store as StoreIcon,
  X,
  Loader2,
  Phone,
  Instagram,
  Facebook,
  Globe,
  MapPin,
} from "lucide-react";
import API from "@/lib/utils/apiCreate";
import toast from "react-hot-toast";

interface Store {
  _id: string;
  storeName: string;
  storeAddress: string;
  description?: string;
  whatsAppNumber?: string;
  instagram?: string;
  facebook?: string;
  officialWebsite?: string;
}

interface EditStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  store: Store;
  accessToken: string;
}

export const EditStoreModal = ({ isOpen, onClose, onSuccess, store, accessToken }: EditStoreModalProps) => {
  const [formData, setFormData] = useState({
    storeName: "",
    storeAddress: "",
    description: "",
    whatsAppNumber: "",
    instagram: "",
    facebook: "",
    officialWebsite: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && store) {
      setFormData({
        storeName: store.storeName || "",
        storeAddress: store.storeAddress || "",
        description: store.description || "",
        whatsAppNumber: store.whatsAppNumber || "",
        instagram: store.instagram || "",
        facebook: store.facebook || "",
        officialWebsite: store.officialWebsite || "",
      });
    }
  }, [isOpen, store]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.storeName) {
      toast.error("Nama toko harus diisi");
      return;
    }

    if (!formData.storeAddress) {
      toast.error("Lokasi toko harus diisi");
      return;
    }

    // Validate at least one contact method is provided
    if (!formData.whatsAppNumber && !formData.instagram && !formData.facebook && !formData.officialWebsite) {
      toast.error("Setidaknya satu metode kontak harus diisi");
      return;
    }

    setIsSubmitting(true);

    try {
      await API.put(`/stores/${store._id}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      // toast.success("Toko berhasil diperbarui");
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Error updating store:", err);
      toast.error(err.response?.data?.message || "Gagal memperbarui toko");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center">
            <StoreIcon className="w-5 h-5 mr-2 text-brand01" />
            Edit Toko
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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

          <div className="flex justify-end pt-4 border-t border-slate-200 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand01 hover:bg-brand01/90 text-white px-6 py-2 rounded-lg font-medium flex items-center justify-center transition-all disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Simpan Perubahan</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 