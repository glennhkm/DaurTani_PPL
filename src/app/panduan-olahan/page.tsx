"use client";

import { dmSerifDisplay } from "@/components/fonts/dmSerifDisplay";
import React, { useState } from "react";
import AISection from "./AISection";
import ArticleVideoSection from "./articleVideoSection";
import { Leaf, BookOpen, Bot } from "lucide-react";

const Panduan = () => {
  const [activeMenu, setActiveMenu] = useState("ar/vid");
  
  const panduanMenu = [
    {
      id: "ar/vid",
      name: "Artikel/Video",
      icon: <BookOpen size={18} />,
      sectionComponent: <ArticleVideoSection />,
    },
    {
      id: "ai",
      name: "Tanya AI",
      icon: <Bot size={18} />,
      sectionComponent: <AISection />,
    },
  ];

  const showActiveSectionComponent = () => {
    const menuActive = panduanMenu.find((item) => item.id === activeMenu);
    return menuActive?.sectionComponent;
  };

  return (
    <div className="flex flex-col gap-12 lg:py-24 px-4 sm:px-6 lg:px-20 min-h-screen bg-gradient-to-b from-neutral01 to-brand01/5">
      <div className={`transition-all duration-300`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-8 rounded-full bg-brand01 flex items-center justify-center">
            <Leaf size={20} className="text-neutral01" />
          </div>
          <h2 className={`text-4xl sm:text-5xl text-brand03 ${dmSerifDisplay.className}`}>
            Panduan Pengolahan Limbah Pertanian
          </h2>
        </div>
        
        <p className="text-brand03/70 max-w-2xl mb-10 text-lg">
          Temukan berbagai artikel, video, dan jawaban AI tentang cara mengelola limbah pertanian secara berkelanjutan dan menguntungkan.
        </p>
        
        <div className="w-full flex justify-between bg-neutral01/80 rounded-t-2xl shadow-md overflow-hidden">
          {panduanMenu.map((item, index) => {
            return (
              <button
                key={index}
                onClick={() => setActiveMenu(item.id)}
                className={`${
                  item.id === activeMenu
                    ? "bg-brand01 text-neutral01 hover:bg-brand01 font-semibold"
                    : "hover:bg-brand01/20 text-brand03 hover:font-semibold"
                } text-center duration-200 cursor-pointer py-4 w-full rounded-t-2xl flex items-center justify-center gap-2`}
              >
                {item.icon}
                {item.name}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="bg-neutral01/60 p-6 rounded-2xl shadow-md border border-brand01/10">
        {showActiveSectionComponent()}
      </div>
    </div>
  );
};

export default Panduan;