import Image from "next/image";
import React from "react";
import { MainLogoSmall } from "../iconAndLogo/mainLogoSmall";
import { dmSerifDisplay } from "../fonts/dmSerifDisplay";

export const Navbar = () => {
  return (
    <nav className="fixed w-full bg-brand03/40 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-brand01">
                <MainLogoSmall width="120"/>
            </a>
          </div>
          <div className="hidden md:block">
            <div className={`flex items-center space-x-4 ${dmSerifDisplay.className}`}>
              <a
                href="/marketplace"
                className="text-neutral01 hover:text-brand01 px-3 py-2"
              >
                Marketplace
              </a>
              <a
                href="/panduan"
                className="text-neutral01 hover:text-brand01 px-3 py-2"
              >
                Panduan
              </a>
              <a
                href="/komunitas"
                className="text-neutral01 hover:text-brand01 px-3 py-2"
              >
                Komunitas
              </a>
              <a
                href="/login"
                className="text-neutral01 hover:text-brand01 px-3 py-2"
              >
                Masuk
              </a>
              <a
                href="/register"
                className="bg-brand01 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Daftar
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
