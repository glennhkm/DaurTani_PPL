import { ArrowRight, MapPin, Package, Star } from "lucide-react";
import Image from "next/image";
import { dmSans } from "../fonts/dmSans";
import { dmSerifDisplay } from "../fonts/dmSerifDisplay";

export interface ProductCardProps {
  image: string;
  title: string;
  description: string;
  price: string;
  rating: number;
  location: string;
  stock: number;
  featured?: boolean;
}

export const ProductCard = ({
  image,
  title,
  description,
  price,
  rating,
  location,
  stock,
  featured = false,
}: ProductCardProps) => {
  return (
    <div
      className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100 hover:scale-105"
    >
      <div className="relative h-64 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {featured && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <Star size={14} fill="currentColor" />
            Featured
          </div>
        )}

        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <ArrowRight size={16} className="text-brand01" />
        </div>
      </div>

      <div className="p-6">
        <h3
          className={`text-xl font-bold text-slate-800 mb-2 ${dmSerifDisplay.className}`}
        >
          {title}
        </h3>
        <p className={`text-slate-600 mb-4 text-sm ${dmSans.className}`}>
          {description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span
            className={`text-2xl font-bold text-brand01 ${dmSerifDisplay.className}`}
          >
            {price}
          </span>
          <div className="flex items-center gap-1">
            <Star size={16} className="text-amber-400" fill="currentColor" />
            <span className="text-slate-600 font-medium">{rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            {location}
          </div>
          <div className="flex items-center gap-1">
            <Package size={14} />
            {stock} tersedia
          </div>
        </div>
      </div>
    </div>
  );
};
