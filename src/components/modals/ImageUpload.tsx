import { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';

interface ImageUploadProps {
  images: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export const ImageUpload = ({ images, onChange, maxImages = 3 }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loadedImages, setLoadedImages] = useState<string[]>([]);

  // Keep track of loaded images
  useEffect(() => {
    setLoadedImages(images || []);
    console.log(images);
  }, [images]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if adding new files would exceed the limit
    if (loadedImages.length + files.length > maxImages) {
      setError(`Maksimal ${maxImages} gambar yang dapat diunggah`);
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Sesi login tidak valid. Silakan login ulang.');
        return;
      }

      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setError('Hanya file gambar yang diperbolehkan');
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError('Ukuran file maksimal 5MB');
          continue;
        }

        // Generate unique filename with user ID prefix for better organization
        const fileExt = file.name.split('.').pop();
        const fileName = `${session.user.id}/${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `product-images/${fileName}`;

        // Upload to Supabase Storage with proper authentication
        const { data, error: uploadError } = await supabase.storage
          .from('daurtani')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          setError('Gagal mengunggah gambar: ' + uploadError.message);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('daurtani')
          .getPublicUrl(filePath);

        newUrls.push(publicUrl);
      }

      if (newUrls.length > 0) {
        const updatedImages = [...loadedImages, ...newUrls];
        setLoadedImages(updatedImages);
        onChange(updatedImages);
      }
    } catch (err) {
      console.error('Error uploading images:', err);
      setError('Gagal mengunggah gambar');
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleRemoveImage = async (urlToRemove: string) => {
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Sesi login tidak valid. Silakan login ulang.');
        return;
      }

      // Extract file path from URL
      const filePath = urlToRemove.split('product-images/').pop();
      if (filePath) {
        // Delete from Supabase Storage
        const { error: deleteError } = await supabase.storage
          .from('daurtani')
          .remove([`product-images/${filePath}`]);

        if (deleteError) {
          console.error('Error deleting file:', deleteError);
          setError('Gagal menghapus gambar: ' + deleteError.message);
          return;
        }

        // Update state with remaining URLs
        const updatedImages = loadedImages.filter(url => url !== urlToRemove);
        setLoadedImages(updatedImages);
        onChange(updatedImages);
      }
    } catch (err) {
      console.error('Error removing image:', err);
      setError('Gagal menghapus gambar');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Foto Produk {loadedImages.length}/{maxImages}
          </label>
          <p className="text-sm text-slate-500 mt-1">
            Unggah maksimal {maxImages} foto produk (maks. 5MB/foto)
          </p>
        </div>

        {loadedImages.length < maxImages && (
          <label className="cursor-pointer bg-brand01/10 hover:bg-brand01/20 text-brand01 px-4 py-2 rounded-lg transition-colors flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            <span>Unggah Foto</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {loadedImages.map((url, index) => (
          <div key={`${url}-${index}`} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
            <Image
              src={url}
              alt={`Product image ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={index === 0}
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(url)}
              className="absolute top-2 right-2 bg-white/80 hover:bg-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ))}

        {loadedImages.length === 0 && (
          <div className="aspect-square rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
            <ImageIcon className="w-8 h-8 mb-2" />
            <span className="text-sm">Belum ada foto</span>
          </div>
        )}
      </div>

      {uploading && (
        <div className="text-sm text-brand01 flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Mengunggah foto...
        </div>
      )}
    </div>
  );
}; 