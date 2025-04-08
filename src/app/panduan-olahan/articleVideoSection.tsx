"use client";

import {
  ArticleVideoCard,
  ArticleVideoProps,
} from "@/components/cards/articleVideoCard";
import { Search, Calendar, FileType, SlidersHorizontal } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";

const data: ArticleVideoProps[] = [
  {
    title: "Mengubah Sekam Padi Menjadi Briket Ramah Lingkungan",
    type: "article",
    publishDate: "Senin, 20 April 2025",
    description:
      "Sekam padi sering kali dibuang begitu saja, padahal bisa diolah menjadi briket sebagai bahan bakar alternatif. Artikel ini membahas langkah-langkah praktis membuat briket sekam padi serta peluang bisnis yang dapat dikembangkan dari limbah ini.",
    imageUrl: "/images/sekamPadi.png",
    url: "/briket-dari-sekam-padi",
  },
  {
    title: "Cara Mengolah Tongkol Jagung Menjadi Pakan Ternak",
    type: "video",
    publishDate: "Senin, 20 April 2025",
    description:
      "Dalam video ini, kami tunjukkan bagaimana tongkol jagung yang biasanya dibuang bisa dijadikan pakan ternak bergizi tinggi. Proses ini mudah dilakukan di rumah dan dapat menekan biaya pakan peternak secara signifikan.",
    imageUrl: "/images/tongkolJagung.png",
    url: "/video-olah-tongkol-jagung",
  },
  {
    title: "Pemanfaatan Ampas Tebu untuk Kompos Organik",
    type: "article",
    publishDate: "Senin, 20 April 2025",
    description:
      "Ampas tebu yang melimpah di area penggilingan ternyata sangat cocok untuk dijadikan kompos. Artikel ini membahas cara pengomposan yang benar, kandungan hara dari ampas tebu, dan manfaatnya bagi kesuburan tanah.",
    imageUrl: "/images/marketplace.jpg",
    url: "/kompos-dari-ampas-tebu",
  },
  {
    title: "Cara Mengolah Tongkol Jagung Menjadi Pakan Ternak",
    type: "video",
    publishDate: "Senin, 20 April 2025",
    description:
      "Dalam video ini, kami tunjukkan bagaimana tongkol jagung yang biasanya dibuang bisa dijadikan pakan ternak bergizi tinggi. Proses ini mudah dilakukan di rumah dan dapat menekan biaya pakan peternak secara signifikan.",
    imageUrl: "/images/tongkolJagung.png",
    url: "/video-olah-tongkol-jagung",
  },
  {
    title: "Pemanfaatan Ampas Tebu untuk Kompos Organik",
    type: "article",
    publishDate: "Senin, 20 April 2025",
    description:
      "Ampas tebu yang melimpah di area penggilingan ternyata sangat cocok untuk dijadikan kompos. Artikel ini membahas cara pengomposan yang benar, kandungan hara dari ampas tebu, dan manfaatnya bagi kesuburan tanah.",
    imageUrl: "/images/marketplace.jpg",
    url: "/kompos-dari-ampas-tebu",
  },
  {
    title: "Mengubah Sekam Padi Menjadi Briket Ramah Lingkungan",
    type: "article",
    publishDate: "Senin, 20 April 2025",
    description:
      "Sekam padi sering kali dibuang begitu saja, padahal bisa diolah menjadi briket sebagai bahan bakar alternatif. Artikel ini membahas langkah-langkah praktis membuat briket sekam padi serta peluang bisnis yang dapat dikembangkan dari limbah ini.",
    imageUrl: "/images/sekamPadi.png",
    url: "/briket-dari-sekam-padi",
  },
];

const ArticleVideoSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredResults, setFilteredResults] = useState(data);

  useEffect(() => {
    const results = data
      .filter((item) => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === "all" || item.type === filterType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        const dateA = new Date(a.publishDate);
        const dateB = new Date(b.publishDate);
        return sortOrder === "newest" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
      });

    setFilteredResults(results);
  }, [searchQuery, filterType, sortOrder]);

  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.type)));
  }, []);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-brand03">Temukan Panduan</h3>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-brand01 hover:text-brand01/80 transition-colors"
          >
            <SlidersHorizontal size={16} className="text-brand03" />
            <span className="text-sm text-brand03">{showFilters ? "Sembunyikan Filter" : "Tampilkan Filter"}</span>
          </button>
        </div>

        <div className="flex items-center gap-4 bg-neutral01 rounded-xl p-3 shadow-sm border border-brand01/20">
          <Search width={20} height={20} className="text-brand01 ml-2" />
          <input
            type="text"
            placeholder="Cari panduan pengolahan limbah pertanian..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full focus:outline-none bg-transparent placeholder:italic placeholder:opacity-50 text-brand03/80"
          />
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-brand01/5 rounded-xl border border-brand01/20 animate-fadeIn">
            <div className="flex items-center gap-3">
              <FileType size={18} className="text-brand01" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="p-2 rounded-lg border border-brand01/30 text-brand03/80 bg-neutral01 focus:outline-none focus:ring-2 focus:ring-brand01/30 w-full"
              >
                <option value="all">Semua Tipe</option>
                {uniqueTypes.map((type, i) => (
                  <option key={i} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-brand01" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="p-2 rounded-lg border border-brand01/30 text-brand03/80 bg-neutral01 focus:outline-none focus:ring-2 focus:ring-brand01/30 w-full"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {filteredResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {filteredResults.map((item, index) => (
            <ArticleVideoCard key={index} {...item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-brand01/30 rounded-xl bg-brand01/5">
          <Search size={48} className="text-brand01/40 mb-4" />
          <h4 className="text-lg font-medium text-brand03">Tidak Ada Hasil</h4>
          <p className="text-brand03/60 mt-2">Coba ubah kata kunci pencarian atau filter yang Anda gunakan</p>
        </div>
      )}

      {filteredResults.length > 0 && (
        <div className="flex justify-between items-center mt-6 text-sm text-brand03/60">
          <span>Menampilkan {filteredResults.length} dari {data.length} panduan</span>
          <button className="text-brand01 hover:underline">Lihat Semua</button>
        </div>
      )}
    </section>
  );
};

export default ArticleVideoSection;
