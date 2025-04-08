import { dmSerifDisplay } from "../fonts/dmSerifDisplay";

export interface StatCardProps {
    number: string;
    label: string;
}

export const StatCard = ({ number, label }: StatCardProps) => {
    return (
      <div className="p-4 text-center">
        <p
          className={`text-2xl md:text-3xl font-bold text-brand03 ${dmSerifDisplay.className}`}
        >
          {number}
        </p>
        <p className="text-gray-600 text-sm mt-1">{label}</p>
      </div>
    );
  }