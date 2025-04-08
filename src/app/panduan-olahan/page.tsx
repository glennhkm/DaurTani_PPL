"use client";

import { dmSerifDisplay } from "@/components/fonts/dmSerifDisplay";
import React, { useState } from "react";
import AISection from "./AISection";
import ArticleVideoSection from "./articleVideoSection";
import { Leaf, BookOpen, Bot } from "lucide-react";
import Image from "next/image";

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
    <div className="flex flex-col min-h-screen ">
      <div
        className={`transition-all duration-300 relative px-4 lg:pt-24 flex flex-col gap-6 items-center justify-center h-[60vh] md:h-[70vh]`}
      >
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/bgHero.webp"
            alt="Background pertanian"
            fill
            className="object-cover "
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand03/60 to-brand03/85 backdrop-blur-sm" />
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20 -z-[9]">
          <div className="absolute top-20 left-[10%] w-32 h-32 rounded-full bg-brand01 blur-3xl"></div>
          <div className="absolute bottom-20 right-[10%] w-40 h-40 rounded-full bg-brand02 blur-3xl"></div>
        </div>
        <h2
          className={`sm:text-5xl text-neutral01 text-4xl md:text-6xl max-w-2xl text-center ${dmSerifDisplay.className}`}
        >
          Panduan Pengolahan <span className="text-brand02">Limbah</span>{" "}
          Pertanian
        </h2>

        <p className="text-neutral01/80 mt-2 max-w-2xl mb-10 text-lg text-center">
          Temukan berbagai artikel, video, dan jawaban AI tentang cara mengelola
          limbah pertanian secara berkelanjutan dan menguntungkan.
        </p>
        <div className="sm:px-6 lg:px-20 absolute -bottom-0 w-full"  >
          <div className="w-full flex justify-between bg-neutral01/10 backdrop-blur-md border-2 border-brand02/20 border-b-0 rounded-t-2xl shadow-md overflow-hidden">
            {panduanMenu.map((item, index) => {
              return (
                <button
                  key={index}
                  onClick={() => setActiveMenu(item.id)}
                  className={`${
                    item.id === activeMenu
                      ? "bg-brand02 hover:bg-brand02 font-semibold"
                      : "hover:bg-brand02/20 hover:font-semibold"
                  } text-center duration-200 cursor-pointer py-4 w-full flex items-center justify-center gap-2 text-neutral01`}
                >
                  {item.icon}
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="sm:px-6 lg:px-20 bg-gradient-to-b from-brand02/20 via-neutral01 to-neutral01 py-12">
        {showActiveSectionComponent()}
      </div>
    </div>
  );
};

export default Panduan;
