import React from "react";
import { Calendar, ArrowRight, Video, FileText } from "lucide-react";
import Image from "next/image";

export interface ArticleVideoProps {
  title: string;
  publishDate: string;
  description: string;
  type: string;
  imageUrl: string;
  url: string;
}

export const ArticleVideoCard = ({
  title,
  publishDate,
  description,
  type,
  imageUrl,
  url,
}: ArticleVideoProps) => {

  return (
    <article className="flex flex-col bg-neutral01 border border-brand01/20 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full group">
      <div className="relative w-full h-48 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-brand03/20 z-10" />
        <div className={`absolute top-3 right-3 ${type === 'video' ? 'bg-brand01' : 'bg-brand03'} text-neutral01 text-xs px-3 py-1 rounded-full flex items-center gap-1 z-20`}>
          {type === 'video' ? <Video size={12} /> : <FileText size={12} />}
          <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
        </div>
        <Image
          src={imageUrl || "/api/placeholder/800/400"}
          alt={title}
          width={800}
          height={400}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      <div className="flex flex-col flex-grow p-4">
        <div className="flex items-center text-xs text-brand03/60 mb-2">
          <Calendar size={14} className="mr-1" />
          <time dateTime={publishDate}>{publishDate}</time>
        </div>
        
        <h3 className="font-semibold text-brand03 mb-2 line-clamp-2 text-sm md:text-lg">{title}</h3>
        
        <p className="text-xs md:text-sm text-brand03/70 mb-4 line-clamp-3 flex-grow">{description}</p>
        
        <a
          href={url}
          className="flex items-center justify-between text-sm text-brand01 font-medium rounded-lg px-4 py-2 border border-brand01/30 hover:bg-brand01/10 transition-colors mt-auto"
        >
          <span>Selengkapnya</span>
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>
    </article>
  );
};