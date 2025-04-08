import { Star } from "lucide-react";

export interface TestimonialCardProps {
    quote: string;
    name: string;
    role: string;
    rating: number;
}

export const TestimonialCard = ({ quote, name, role, rating }: TestimonialCardProps) => {
  return (
    <div className="bg-neutral01 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < Math.floor(rating)
                ? "fill-brand02 text-brand02"
                : "text-gray-300"
            }
          />
        ))}
        {rating % 1 > 0 && (
          <Star size={16} className="fill-brand02 text-brand02" />
        )}
      </div>
      <p className="text-gray-700 italic mb-6">"{quote}"</p>
      <div className="flex items-center">
        <div className="w-12 h-12 bg-brand01/20 rounded-full flex items-center justify-center text-brand01 font-bold">
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div className="ml-3">
          <p className="font-medium text-brand03">{name}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
};
