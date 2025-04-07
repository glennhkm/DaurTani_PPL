"use client";
import React, { useEffect, useState } from "react";
import { MainLogo } from "../iconAndLogo/mainLogo";
import { dmSerifDisplay } from "../fonts/dmSerifDisplay";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const [atTop, setAtTop] = useState(true);
  const pathname = usePathname()
  const navMenu = [
    {
      name: "Marketplace",
      url: "/marketplace",
    },
    {
      name: "Panduan Olahan",
      url: "/panduan-olahan",
    },
    {
      name: "Komunitas",
      url: "/komunitas",
    },
  ];

  const isHomePage = () => {
    return pathname === '/'
  }

  useEffect(() => {
    const handleScroll = () => {
      setAtTop(window.scrollY === 0);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 backdrop-blur-md border-b transition-colors duration-200 ${
        atTop && isHomePage()
          ? "bg-transparent border-neutral01/10"
          : "bg-neutral01/10 border-brand03/10"
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
            className={`flex items-center space-x-4 ${
              dmSerifDisplay.className
            } ${atTop && isHomePage()  ? "text-neutral01" : "text-brand03"}`}
          >
            {navMenu.map((item, index) => (
              <a
                key={index}
                href={item.url}
                className=" hover:text-brand01 duration-200 px-3 py-2"
              >
                {item.name}
              </a>
            ))}
            <a
              href="/register"
              className="bg-brand01 px-4 py-2 hover:opacity-80 duration-200 transition-colors text-neutral01"
            >
              Masuk/Daftar
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
