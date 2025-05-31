import { useState, useEffect } from "react";
import { X, Plus, Minus, HelpCircle } from "lucide-react";
import API from "@/lib/utils/apiCreate";
import { ImageUpload } from "./ImageUpload";
import { toast } from "react-hot-toast";

export interface UnitPrice {
  _id?: string;
  unit: string;
  pricePerUnit: number;
  isBaseUnit: boolean;
  stock: number;
  equalWith: number;
}

export interface Product {
  _id?: string;
  wasteName: string;
  description: string;
  imageUrls: string[];
  unitPrices: UnitPrice[];
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: string;
  accessToken: string;
  onSuccess: () => void;
  product?: Product; // Optional product for edit mode
}

export const AddProductModal = ({
  isOpen,
  onClose,
  storeId,
  accessToken,
  onSuccess,
  product,
}: AddProductModalProps) => {
  const [wasteName, setWasteName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [unitPrices, setUnitPrices] = useState<UnitPrice[]>([
    { unit: "", pricePerUnit: 0, isBaseUnit: true, stock: 0, equalWith: 1 },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with product data if in edit mode
  useEffect(() => {
    if (product) {
      setWasteName(product.wasteName);
      setDescription(product.description);
      setImageUrls(product.imageUrls || []);
      setUnitPrices(
        product.unitPrices.map((up) => ({
          ...up,
          pricePerUnit: Number(up.pricePerUnit),
          stock: Number(up.stock),
          equalWith: Number(up.equalWith),
        }))
      );
    } else {
      // Reset form when adding new product
      setWasteName("");
      setDescription("");
      setImageUrls([]);
      setUnitPrices([
        { unit: "", pricePerUnit: 0, isBaseUnit: true, stock: 0, equalWith: 1 },
      ]);
    }
  }, [product]);

  const handleAddUnitPrice = () => {
    setUnitPrices([
      ...unitPrices,
      {
        unit: "",
        pricePerUnit: 0,
        isBaseUnit: false,
        stock: 0,
        equalWith: 1,
      },
    ]);
  };

  const handleRemoveUnitPrice = (index: number) => {
    if (unitPrices.length > 1) {
      const newUnitPrices = unitPrices.filter((_, i) => i !== index);
      // Ensure at least one unit is marked as base unit
      if (unitPrices[index].isBaseUnit && newUnitPrices.length > 0) {
        newUnitPrices[0].isBaseUnit = true;
      }
      setUnitPrices(newUnitPrices);
    }
  };

  const handleUnitPriceChange = (
    index: number,
    field: keyof UnitPrice,
    value: string | number | boolean
  ) => {
    const newUnitPrices = [...unitPrices];
    newUnitPrices[index] = {
      ...newUnitPrices[index],
      [field]: value,
    };

    // If setting a new base unit, unset others
    if (field === "isBaseUnit" && value === true) {
      newUnitPrices.forEach((unit, i) => {
        if (i !== index) {
          unit.isBaseUnit = false;
        }
      });
    }

    setUnitPrices(newUnitPrices);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate that at least one unit is marked as base unit
      const hasBaseUnit = unitPrices.some((unit) => unit.isBaseUnit);
      if (!hasBaseUnit) {
        toast.error("Setidaknya satu unit harus ditandai sebagai unit dasar");
        setIsSubmitting(false);
        return;
      }

      // Validate that all units have valid values
      const invalidUnit = unitPrices.find(
        (unit) => !unit.unit || unit.pricePerUnit <= 0 || unit.stock < 0
      );
      if (invalidUnit) {
        toast.error(
          "Semua unit harus memiliki nama yang valid, harga lebih dari 0, dan stok minimal 0"
        );
        setIsSubmitting(false);
        return;
      }

      // Validate that at least one image is uploaded
      if (imageUrls.length === 0) {
        toast.error("Harap unggah minimal satu foto produk");
        setIsSubmitting(false);
        return;
      }

      const productData = {
        storeId,
        wasteName,
        description,
        imageUrls,
        unitPrices: unitPrices.map((up) => ({
          ...up,
          pricePerUnit: Number(up.pricePerUnit),
          stock: Number(up.stock),
          equalWith: Number(up.equalWith),
        })),
      };

      let response;
      if (product?._id) {
        // Update existing product
        response = await API.put(`/farm-wastes/${product._id}`, productData, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      } else {
        // Create new product
        response = await API.post("/farm-wastes", productData, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }

      if (response.data) {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      console.error("Error saving product:", err);
      toast.error(err.response?.data?.message || "Gagal menyimpan produk");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-brand03">
                {product ? "Edit Produk" : "Tambah Produk Baru"}
              </h2>
              <p className="text-slate-600 mt-1">
                {product
                  ? "Ubah informasi produk limbah pertanian"
                  : "Isi informasi produk limbah pertanian yang akan dijual"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
                {error}
              </div>
            )} */}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-slate-500 mb-2">
                  Masukkan nama produk limbah pertanian yang akan dijual
                </p>
                <input
                  type="text"
                  value={wasteName}
                  onChange={(e) => setWasteName(e.target.value)}
                  placeholder="Contoh: Ampas Tebu, Sekam Padi, dll"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Deskripsi Produk <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-slate-500 mb-2">
                  Jelaskan detail produk, kualitas, dan informasi penting
                  lainnya
                </p>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsikan produk Anda secara detail..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand01 min-h-[100px]"
                  required
                />
              </div>

              <ImageUpload
                images={imageUrls}
                onChange={setImageUrls}
                maxImages={3}
              />

              <div>
                {/* <div className="flex justify-between items-start mb-2"> */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Harga dan Unit <span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-slate-500 mt-1">
                    Tentukan unit penjualan dan harga per unit. Minimal satu
                    unit dasar harus dipilih.
                  </p>
                </div>
                {/* </div> */}

                <div className="bg-slate-50 p-4 rounded-lg mb-4">
                  <div className="flex items-start gap-2">
                    <HelpCircle className="w-5 h-5 text-brand01 flex-shrink-0 mt-1" />
                    <div className="text-sm text-slate-600">
                      <p className="font-medium mb-1">
                        Panduan Pengisian Unit:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>
                          Unit Dasar: Unit utama yang menjadi patokan (contoh:
                          Kilogram)
                        </li>
                        <li>
                          Setara Dengan: Berapa banyak unit ini setara dengan
                          unit dasar (1 Ton = 1000 Kg)
                        </li>
                        <li>Harga: Harga jual per unit dalam Rupiah</li>
                        <li>
                          Stok: Jumlah stok yang tersedia dalam unit tersebut
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddUnitPrice}
                  className="text-sm text-brand01 hover:text-brand01/80 flex items-center ml-auto my-4 bg-brand01/10 px-4 py-2 rounded-lg"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Tambah Unit
                </button>
                <div className="space-y-4">
                  {unitPrices.map((unitPrice, index) => (
                    <div
                      key={index}
                      className="bg-white border border-slate-200 rounded-lg p-4"
                    >
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Nama Unit <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Kg, Ton, Karung"
                            value={unitPrice.unit}
                            onChange={(e) =>
                              handleUnitPriceChange(
                                index,
                                "unit",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand01"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Harga (Rp) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            placeholder="10000"
                            value={unitPrice.pricePerUnit}
                            onChange={(e) =>
                              handleUnitPriceChange(
                                index,
                                "pricePerUnit",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand01"
                            required
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Stok <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            placeholder="100"
                            value={unitPrice.stock}
                            onChange={(e) =>
                              handleUnitPriceChange(
                                index,
                                "stock",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand01"
                            required
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Setara Dengan
                          </label>
                          <input
                            type="number"
                            placeholder="1"
                            value={unitPrice.equalWith}
                            onChange={(e) =>
                              handleUnitPriceChange(
                                index,
                                "equalWith",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand01 disabled:bg-slate-100 disabled:text-slate-500"
                            required
                            min="1"
                            disabled={unitPrice.isBaseUnit}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`baseUnit-${index}`}
                            checked={unitPrice.isBaseUnit}
                            onChange={(e) =>
                              handleUnitPriceChange(
                                index,
                                "isBaseUnit",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 text-brand01 rounded focus:ring-brand01"
                          />
                          <label
                            htmlFor={`baseUnit-${index}`}
                            className="text-sm text-slate-700"
                          >
                            Unit Dasar
                          </label>
                        </div>

                        {unitPrices.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveUnitPrice(index)}
                            className="text-red-500 hover:text-red-600 text-sm flex items-center"
                          >
                            <Minus className="w-4 h-4 mr-1" />
                            Hapus Unit
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-brand01 hover:bg-brand01/90 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Menyimpan...
                  </>
                ) : product ? (
                  "Simpan Perubahan"
                ) : (
                  "Simpan Produk"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
