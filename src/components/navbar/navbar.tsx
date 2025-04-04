"use client";
import React, { useEffect, useState } from "react";
import { MainLogo } from "../iconAndLogo/mainLogo";
import { dmSerifDisplay } from "../fonts/dmSerifDisplay";

export const Navbar = () => {
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setAtTop(window.scrollY === 0);
    };

    // Cek saat awal load
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 backdrop-blur-md border-b transition-colors duration-200 ${
        atTop ? "bg-transparent border-neutral01/10" : "bg-neutral01/10 border-brand03/10"
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-20">
        <div className="flex items-center">
          <a href="/" className="text-xl font-bold text-brand01">
            <MainLogo width="120" />
          </a>
        </div>
        <div className="hidden md:block">
          <div
            className={`flex items-center space-x-4 ${dmSerifDisplay.className} ${
              atTop ? "text-neutral01" : "text-brand03"
            }`}
          >
            <a
              href="/marketplace"
              className=" hover:text-brand01 px-3 py-2"
            >
              Marketplace
            </a>
            <a
              href="/panduan"
              className=" hover:text-brand01 px-3 py-2"
            >
              Panduan
            </a>
            <a
              href="/komunitas"
              className=" hover:text-brand01 px-3 py-2"
            >
              Komunitas
            </a>
            <a
              href="/register"
              className="bg-brand01 px-4 py-2 hover:bg-brand01/90 transition-colors"
            >
              Masuk/Daftar
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};