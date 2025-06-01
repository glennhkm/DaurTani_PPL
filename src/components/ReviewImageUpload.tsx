import { useState, useRef, useEffect } from "react";
import { X, Upload, ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { v4 as uuidv4 } from "uuid";

interface ReviewImageUploadProps {
  onImagesUploaded: (urls: string[]) => void;
  maxImages?: number;
}

export const ReviewImageUpload = ({ onImagesUploaded, maxImages = 3 }: ReviewImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previewImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const selectedFiles = Array.from(e.target.files);
    const remainingSlots = maxImages - previewImages.length;
    
    if (selectedFiles.length > remainingSlots) {
      alert(`Anda hanya dapat mengunggah maksimal ${maxImages} gambar`);
      return;
    }

    setUploading(true);

    try {
      // Create preview URLs
      const newPreviewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
      
      // Upload files to Supabase
      const uploadedImageUrls = await Promise.all(
        selectedFiles.map(async (file) => {
          const fileExt = file.name.split(".").pop();
          const fileName = `${uuidv4()}.${fileExt}`;
          const filePath = `reviews/${fileName}`;
          
          const { error: uploadError, data } = await supabase.storage
            .from("daurtani")
            .upload(filePath, file);
          
          if (uploadError) {
            throw uploadError;
          }
          
          const { data: { publicUrl } } = supabase.storage
            .from("daurtani")
            .getPublicUrl(filePath);
          
          return publicUrl;
        })
      );

      // Update state
      setPreviewImages([...previewImages, ...newPreviewUrls]);
      setUploadedUrls([...uploadedUrls, ...uploadedImageUrls]);
      
      // Notify parent component
      onImagesUploaded([...uploadedUrls, ...uploadedImageUrls]);
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Gagal mengunggah gambar. Silakan coba lagi.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (index: number) => {
    try {
      // Extract file path from URL
      const url = uploadedUrls[index];
      const pathMatch = url.match(/daurtani\/(.*)/);
      
      if (pathMatch && pathMatch[1]) {
        // Delete from Supabase
        await supabase.storage
          .from("daurtani")
          .remove([pathMatch[1]]);
      }
      
      // Update state
      const newPreviewImages = [...previewImages];
      const newUploadedUrls = [...uploadedUrls];
      
      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(previewImages[index]);
      
      newPreviewImages.splice(index, 1);
      newUploadedUrls.splice(index, 1);
      
      setPreviewImages(newPreviewImages);
      setUploadedUrls(newUploadedUrls);
      
      // Notify parent component
      onImagesUploaded(newUploadedUrls);
    } catch (error) {
      console.error("Error removing image:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-700">
          Gambar Ulasan (Opsional)
        </label>
        <span className="text-xs text-slate-500">
          {previewImages.length}/{maxImages} gambar
        </span>
      </div>

      {/* Image previews */}
      {previewImages.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {previewImages.map((url, index) => (
            <div
              key={index}
              className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 group"
            >
              <Image
                src={url}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {previewImages.length < maxImages && (
        <div className="mt-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
            disabled={uploading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center justify-center w-full p-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-brand01/50 transition-colors"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 text-brand01 animate-spin mr-2" />
                <span className="text-sm text-slate-600">Mengunggah...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 text-slate-400 mr-2" />
                <span className="text-sm text-slate-600">
                  Klik untuk mengunggah gambar
                </span>
              </>
            )}
          </button>
          <p className="text-xs text-slate-500 mt-1">
            Format: JPG, PNG, atau GIF. Maksimal {maxImages} gambar.
          </p>
        </div>
      )}
    </div>
  );
}; 