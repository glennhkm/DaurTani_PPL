import { ArrowRight, MapPin, Package, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { dmSans } from "../fonts/dmSans";
import { dmSerifDisplay } from "../fonts/dmSerifDisplay";
import { UnitPrice } from '@/types/product';

export interface ProductCardProps {
  id?: string;
  image: string;
  title: string;
  description: string;
  price: string;
  rating: number;
  location: string;
  stock: number;
  featured?: boolean;
  imageUrls?: string[];
  unitPrices?: UnitPrice[];
}

export const ProductCard = ({
  id,
  image,
  title,
  description,
  price,
  rating,
  location,
  stock,
  featured,
  imageUrls,
  unitPrices
}: ProductCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (id) {
      router.push(`/marketplace/product/${id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer hover:scale-105 duration-200 ${featured ? 'ring-2 ring-brand01/20' : ''}`}
    >
      <div className="relative h-48">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
        {featured && (
          <div className="absolute top-2 left-2 bg-brand01 text-white px-2 py-1 rounded-lg text-xs font-medium">
            Unggulan
          </div>
        )}
      </div>

      <div className="p-2 md:p-4">
        <h3 className="text-sm md:text-lg font-bold text-slate-800 mb-1">
          {title}
        </h3>
        
        <p className="text-slate-600 text-xs md:text-sm mb-3 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between mb-2">
          <span className="text-sm md:text-lg font-bold text-brand01">
            {price}
          </span>
          
          <div className="flex items-center">
            <Star className="w-3 h-3 md:w-6 md:h-6 text-amber-400 mr-1" fill="currentColor" />
            <span className="text-slate-600 text-xs md:text-sm">{rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center">
            <MapPin className="w-3 h-3 md:w-6 md:h-6 mr-1" />
            <span className="text-[10px] md:text-sm">{location}</span>
          </div>
          <div className="flex items-center">
            <Package className="w-3 h-3 md:w-6 md:h-6 mr-1" />
            <span className="text-[10px] md:text-sm">{stock} tersedia</span>
          </div>
        </div>
      </div>
    </div>
  );
};
