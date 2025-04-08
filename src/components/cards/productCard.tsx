import { MapPin, Star } from "lucide-react";
import Image from "next/image";

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
      className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
        featured ? "ring-2 ring-brand02" : ""
      }`}
    >
      {featured && (
        <div className="absolute top-4 right-4 z-10 bg-brand03 text-neutral01 text-xs font-medium px-2 py-1 rounded-full">
          Terlaris
        </div>
      )}
      <div className="h-56 relative">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="p-6 h-64 flex flex-col justify-end">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-brand03">{title}</h3>
          <div className="flex items-center text-brand02">
            <Star size={16} className="fill-brand02" />
            <span className="text-sm ml-1">{rating}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-3">{description}</p>

        <div className="flex items-center text-gray-500 text-xs mb-4">
          <MapPin size={14} className="mr-1" />
          <span>{location}</span>
          <div className="w-1 h-1 rounded-full bg-gray-300 mx-2"></div>
          <span>Stok: {stock} kg</span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <p className="font-bold text-lg text-brand03">{price}</p>
          <div className="text-xs px-2 py-1 bg-brand01/10 text-brand01 rounded-full">
            Tersedia
          </div>
        </div>
        <button className="bg-brand02 hover:bg-brand02/90 text-neutral01 py-2 rounded-lg text-sm transition-all duration-300 font-medium cursor-pointer">
          Beli
        </button>
      </div>
    </div>
  );
};
