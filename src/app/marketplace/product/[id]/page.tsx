"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  MapPin,
  Package,
  Store,
  ArrowLeft,
  Truck,
  Shield,
  Clock,
  ChevronRight,
  Heart,
  Share2,
  Loader2,
  Check,
  Info,
  Phone,
  Instagram,
  Facebook,
  Globe,
  Send,
  Trash2,
  MessageSquare,
  Edit,
} from "lucide-react";
import { dmSerifDisplay } from "@/components/fonts/dmSerifDisplay";
import API from "@/lib/utils/apiCreate";
import { Product, UnitPrice } from "@/types/product";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { ReviewImageUpload } from "@/components/ReviewImageUpload";
import toast from "react-hot-toast";
import Link from "next/link";

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

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<UnitPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewDescription, setReviewDescription] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [reviewImages, setReviewImages] = useState<string[]>([]);

  useEffect(() => {
    const getToken = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setAccessToken(data.session.access_token);
      }
    };
    getToken();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/farm-wastes/${params.id}`);
        setProduct(response.data.data);
        // Set default selected unit to base unit
        const baseUnit = response.data.data.unitPrices.find(
          (up: UnitPrice) => up.isBaseUnit
        );
        setSelectedUnit(baseUnit || response.data.data.unitPrices[0]);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        const response = await API.get(`/reviews/${params.id}`);
        setReviews(response.data.data || []);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoadingReviews(false);
      }
    };

    if (params.id) {
      fetchProduct();
      fetchReviews();
    }
  }, [params.id]);

  const handleSubmitReview = async () => {
    if (!accessToken) {
      setReviewError("Anda harus login untuk memberikan ulasan");
      return;
    }

    if (reviewRating < 1 || reviewRating > 5) {
      setReviewError("Rating harus antara 1-5");
      return;
    }

    setSubmittingReview(true);
    setReviewError(null);

    try {
      const response = await API.post(
        `/reviews`,
        {
          farmWasteId: params.id,
          rating: reviewRating,
          description: reviewDescription,
          images: reviewImages,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Add the new review to the list
      setReviews([
        {
          ...response.data.data,
          user: {
            fullName: user?.fullName || "Anonymous",
            email: user?.email || "",
          },
        },
        ...reviews,
      ]);

      // Reset form
      setReviewDescription("");
      setReviewRating(5);
      setReviewImages([]);

      // Refresh product to get updated average rating
      const productResponse = await API.get(`/farm-wastes/${params.id}`);
      setProduct(productResponse.data.data);

      toast.success("Ulasan berhasil dikirim");
    } catch (err: any) {
      console.error("Error submitting review:", err);
      setReviewError(err.response?.data?.message || "Gagal mengirim ulasan");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!accessToken) return;

    try {
      await API.delete(`/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Remove the deleted review from the list
      setReviews(reviews.filter((review) => review._id !== reviewId));

      // Refresh product to get updated average rating
      const productResponse = await API.get(`/farm-wastes/${params.id}`);
      setProduct(productResponse.data.data);
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-brand01 animate-spin mx-auto mb-4" />
          <p className="text-brand03 text-lg">Memuat detail produk</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-brand03 mb-2">
            Gagal memuat produk
          </h2>
          <p className="text-brand03/70 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-brand01 text-white px-6 py-2 rounded-lg hover:bg-brand01/90 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center mb-6 text-sm text-slate-600">
          <button
            onClick={() => router.back()}
            className="flex items-center hover:text-brand01 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Kembali</span>
          </button>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link
            href="/marketplace"
            className="hover:text-brand01 transition-colors"
          >
            Marketplace
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-brand01 font-medium">{product.wasteName}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div className="space-y-6">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-lg border border-slate-200">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent z-10 pointer-events-none"></div>
              <Image
                src={
                  product.imageUrls[currentImageIndex] ||
                  "/images/placeholder.png"
                }
                alt={product.wasteName}
                fill
                className="object-cover"
                priority
              />
            </div>
            {product.imageUrls.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.imageUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-200 transform hover:scale-105 ${
                      currentImageIndex === index
                        ? "ring-2 ring-brand01 shadow-md"
                        : "ring-1 ring-slate-200 hover:ring-brand01/50"
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`${product.wasteName} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            {/* Description */}
            <div className="space-y-4 bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-xl font-semibold text-brand03 flex items-center">
                <Info className="w-5 h-5 mr-2 text-brand01" />
                Deskripsi Produk
              </h2>
              <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                {product.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full">
                  Organik
                </span>
                <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full">
                  Berkualitas
                </span>
                <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full">
                  Ramah Lingkungan
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center mb-3 bg-brand01/10 text-brand01 text-xs font-medium px-3 py-1 rounded-full">
                <Package className="w-3 h-3 mr-1" />
                <span>Limbah Pertanian</span>
              </div>
              <h1
                className={`text-3xl font-bold text-brand03 mb-2 ${dmSerifDisplay.className}`}
              >
                {product.wasteName}
              </h1>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(product.averageRating)
                            ? "fill-amber-400"
                            : "fill-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-1 text-slate-600">
                    {product.averageRating.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center text-slate-600">
                  <Store className="w-4 h-4 mr-1" />
                  <span>{product.store.storeName}</span>
                </div>
              </div>
            </div>

            {/* Price and Unit Information */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-slate-100 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold text-brand01">
                  Rp {selectedUnit?.pricePerUnit.toLocaleString("id-ID")}
                </span>
                <span className="text-slate-600">/{selectedUnit?.unit}</span>
              </div>

              {/* Unit Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Satuan yang tersedia
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[...product.unitPrices]
                    .sort((a, b) => (b.isBaseUnit ? 1 : 0) - (a.isBaseUnit ? 1 : 0))
                    .map((unit) => (
                    <button
                      key={unit._id}
                      onClick={() => setSelectedUnit(unit)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedUnit?._id === unit._id
                          ? "bg-brand01 text-white shadow-md"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{unit.unit}</span>
                        {unit.isBaseUnit && (
                          <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                            Dasar
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-600 pt-4 border-t border-slate-100">
                <div className="flex items-center">
                  <Package className="w-4 h-4 mr-1" />
                  <span>
                    Stok: {selectedUnit?.stock || 0} {selectedUnit?.unit}
                  </span>
                </div>
                {selectedUnit && !selectedUnit.isBaseUnit && (
                  <div className="bg-slate-50 px-3 py-1 rounded-full text-xs">
                    <span>
                      1 {selectedUnit.unit} = {selectedUnit.equalWith}{" "}
                      {product.unitPrices.find((u) => u.isBaseUnit)?.unit}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-slate-200">
              <div className="text-center group">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-brand01/10 flex items-center justify-center group-hover:bg-brand01/20 transition-all duration-300 shadow-sm">
                  <Truck className="w-6 h-6 text-brand01" />
                </div>
                <span className="text-sm text-slate-600 group-hover:text-brand01 transition-colors duration-300">
                  Pengiriman Cepat
                </span>
              </div>
              <div className="text-center group">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-brand01/10 flex items-center justify-center group-hover:bg-brand01/20 transition-all duration-300 shadow-sm">
                  <Shield className="w-6 h-6 text-brand01" />
                </div>
                <span className="text-sm text-slate-600 group-hover:text-brand01 transition-colors duration-300">
                  Kualitas Terjamin
                </span>
              </div>
              <div className="text-center group">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-brand01/10 flex items-center justify-center group-hover:bg-brand01/20 transition-all duration-300 shadow-sm">
                  <Clock className="w-6 h-6 text-brand01" />
                </div>
                <span className="text-sm text-slate-600 group-hover:text-brand01 transition-colors duration-300">
                  Respon Cepat
                </span>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-brand01/10 rounded-xl p-6 shadow-md border border-brand01/20">
              <h3 className="text-lg font-semibold text-brand03 mb-3 flex items-center">
                <Phone className="w-5 h-5 mr-2 text-brand01" />
                Tertarik dengan produk ini?
              </h3>
              <p className="text-slate-600 mb-4">
                Hubungi penjual langsung melalui kontak yang tersedia untuk
                mendapatkan penawaran terbaik dan informasi lebih lanjut.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.store.whatsAppNumber && (
                  <a
                    href={`https://wa.me/${product.store.whatsAppNumber.replace(
                      /^0/,
                      "62"
                    )}?text=Halo, saya tertarik dengan produk ${encodeURIComponent(
                      product.wasteName
                    )} di DaurTani. Apakah masih tersedia?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-3 bg-brand01 text-white rounded-lg hover:bg-brand01/90 transition-colors shadow-sm"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    <span className="font-medium">Hubungi via WhatsApp</span>
                  </a>
                )}

                {product.store.instagram && (
                  <a
                    href={`https://instagram.com/${product.store.instagram.replace(
                      "@",
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-3 bg-brand02 text-white rounded-lg hover:bg-brand02/90 transition-colors shadow-sm"
                  >
                    <Instagram className="w-5 h-5 mr-2" />
                    <span className="font-medium">Kunjungi Instagram</span>
                  </a>
                )}
              </div>
            </div>

            {/* Store Info with Contact */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-slate-100 hover:border-brand01/20 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-brand01 to-brand02 rounded-full flex items-center justify-center shadow-md">
                    <Store className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand03 text-lg">
                      {product.store.storeName}
                    </h3>
                    <div className="flex items-center text-sm text-slate-600">
                      <Check className="w-4 h-4 mr-1 text-green-500" />
                      <span>Toko Terverifikasi</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg mb-4">
                <div className="flex items-center mb-1">
                  <MapPin className="w-4 h-4 mr-1 text-brand01" />
                  <span>
                    Lokasi:{" "}
                    <span className="text-slate-700">Banda Aceh, Aceh</span>
                  </span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-amber-400 fill-amber-400" />
                  <span>
                    Rating:{" "}
                    <span className="text-slate-700">
                      {product.store.averageRating.toFixed(1)}/5.0
                    </span>
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <h4 className="font-medium text-slate-700 mb-3">
                Hubungi Penjual:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.store.whatsAppNumber && (
                  <a
                    href={`https://wa.me/${product.store.whatsAppNumber.replace(
                      /^0/,
                      "62"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-800">WhatsApp</span>
                  </a>
                )}

                {product.store.instagram && (
                  <a
                    href={`https://instagram.com/${product.store.instagram.replace(
                      "@",
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <Instagram className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="text-purple-800">
                      {product.store.instagram}
                    </span>
                  </a>
                )}

                {product.store.facebook && (
                  <a
                    href={
                      product.store.facebook.startsWith("http")
                        ? product.store.facebook
                        : `https://facebook.com/${product.store.facebook}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Facebook className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-blue-800">Facebook</span>
                  </a>
                )}

                {product.store.officialWebsite && (
                  <a
                    href={
                      product.store.officialWebsite.startsWith("http")
                        ? product.store.officialWebsite
                        : `https://${product.store.officialWebsite}`
                    }
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
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 border-t border-slate-200 pt-10">
          <h2
            className={`text-2xl font-bold text-brand03 mb-6 flex items-center ${dmSerifDisplay.className}`}
          >
            <MessageSquare className="w-6 h-6 mr-2 text-brand01" />
            Ulasan Produk
            <span className="ml-3 text-sm font-normal bg-brand01/10 text-brand01 px-2 py-0.5 rounded-full">
              {reviews.length} ulasan
            </span>
          </h2>

          {/* Add Review Form */}
          {accessToken ? (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 mb-8">
              <h3 className="font-medium text-slate-800 mb-4">
                Berikan Ulasan Anda
              </h3>

              {reviewError && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
                  {reviewError}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= reviewRating
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="review"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Deskripsi (Opsional)
                </label>
                <textarea
                  id="review"
                  rows={4}
                  value={reviewDescription}
                  onChange={(e) => setReviewDescription(e.target.value)}
                  placeholder="Bagaimana pengalaman Anda dengan produk ini?"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand01/20 focus:border-brand01 outline-none transition-all"
                />
              </div>

              {/* Image Upload Component */}
              <div className="mb-6">
                <ReviewImageUpload
                  onImagesUploaded={setReviewImages}
                  maxImages={3}
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSubmitReview}
                  disabled={submittingReview}
                  className="bg-brand01 text-white px-6 py-2 rounded-lg hover:bg-brand01/90 transition-colors flex items-center"
                >
                  {submittingReview ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      <span>Kirim Ulasan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-8 flex items-center">
              <Info className="w-5 h-5 mr-2" />
              <span>Login untuk memberikan ulasan pada produk ini</span>
            </div>
          )}

          {/* Reviews List */}
          {loadingReviews ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 text-brand01 animate-spin mx-auto mb-2" />
              <p className="text-slate-500">Memuat ulasan...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-slate-50 rounded-xl p-8 text-center">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-700 mb-2">
                Belum ada ulasan
              </h3>
              <p className="text-slate-500">
                Jadilah yang pertama memberikan ulasan untuk produk ini
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center mb-1">
                        <h4 className="font-medium text-slate-800 mr-2">
                          {review.user?.fullName || "Pengguna"}
                        </h4>
                        <span className="text-xs text-slate-500">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {user && review.userId === user.id && (
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {review.description && (
                    <p className="text-slate-600 mt-2">{review.description}</p>
                  )}

                  {review.images && review.images.length > 0 && (
                    <div className="flex mt-4 space-x-3">
                      {review.images.map((img, index) => (
                        <div
                          key={index}
                          className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                        >
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
          )}
        </div>
      </div>
    </div>
  );
}
