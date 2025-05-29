"use client";

import React, { useEffect, useState } from "react";
import { MainLogo } from "../iconAndLogo/mainLogo";
import { dmSerifDisplay } from "../fonts/dmSerifDisplay";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import axios from "axios";

export const Navbar = () => {
  const [atTop, setAtTop] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const hiddenPaths = ["/login", "/register"];
  const isHidden = hiddenPaths.includes(pathname);

  const navMenu = [
    { name: "Marketplace", url: "/marketplace" },
    { name: "Panduan Olahan", url: "/panduan-olahan" },
    { name: "Komunitas", url: "/komunitas" },
  ];

  const handleTransactionClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      router.push('/login');
    }
  };

  const handleLoginClick = async () => {
    try {
      const response = await axios.get("http://localhost:3000/auth/login-oauth");
      if (response.status === 200) {
        console.log("Redirecting to:", response.data.data.url);
        router.push(response.data.data.url);
      } else {
        console.error("Failed to initiate login");
      }
    } catch (error) {
      console.error("Network error during login:", error);
    }
  }

  useEffect(() => {
    const handleScroll = () => setAtTop(window.scrollY === 0);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isHidden) return null;

  return (
    <nav
      className={`fixed w-full z-50 transition-colors border-b duration-200 ${
        atTop
          ? "bg-transparent border-neutral01/10 backdrop-blur-md"
          : "bg-neutral01 border-brand03/10 shadow-md"
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-20">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-brand01">
            <MainLogo width="120" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:block">
          <div
            className={`flex items-center space-x-4 ${
              dmSerifDisplay.className
            } ${atTop ? "text-neutral01" : "text-brand03"}`}
          >
            {navMenu.map((item, index) => (
              <Link
                key={index}
                href={item.url}
                className={`px-3 py-2 duration-200 ${pathname === item.url ? "text-brand01" : (atTop ? "text-neutral01" : "text-brand03")} hover:text-brand01`}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <div className="relative group">
                <button className="flex items-center hover:text-brand01 duration-200">
                  <span>{user.name}</span>
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl hidden group-hover:block">
                  <Link
                    href="/marketplace/cart"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Keranjang
                  </Link>
                  <Link
                    href="/marketplace/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Pesanan Saya
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* <Link
                  href="/login"
                  className={`px-3 py-2 duration-200 ${pathname === "/login" ? "text-brand01" : (atTop ? "text-neutral01" : "text-brand03")} hover:text-brand01`}
                >
                  Masuk
                </Link> */}
                <button
                  // href="/register"
                  onClick={handleLoginClick}
                  className={`bg-brand01 px-4 py-2 hover:opacity-80 duration-200 transition-colors text-neutral01 rounded-lg ${pathname === "/register" ? "text-brand01" : ""}`}
                >
                  Daftar/Masuk
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`${atTop ? "text-neutral01" : "text-brand03"} hover:text-brand01`}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navMenu.map((item, index) => (
              <Link
                key={index}
                href={item.url}
                className={`block px-3 py-2 duration-200 ${pathname === item.url ? "text-brand01" : ""} hover:text-brand01`}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <>
                <div className="px-3 py-2">
                  <span>{user.name}</span>
                </div>
                <Link
                  href="/marketplace/cart"
                  className={`block px-3 py-2 duration-200 ${pathname === "/marketplace/cart" ? "text-brand01" : ""} hover:text-brand01`}
                >
                  Keranjang
                </Link>
                <Link
                  href="/marketplace/orders"
                  className={`block px-3 py-2 duration-200 ${pathname === "/marketplace/orders" ? "text-brand01" : ""} hover:text-brand01`}
                >
                  Pesanan Saya
                </Link>
                <button
                  onClick={logout}
                  className={`block w-full text-left px-3 py-2 duration-200 ${pathname === "/logout" ? "text-brand01" : ""} hover:text-brand01`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* <Link
                  href="/login"
                  className={`block px-3 py-2 duration-200 ${pathname === "/login" ? "text-brand01" : ""} hover:text-brand01`}
                >
                  Masuk
                </Link> */}
                <Link
                  href="/register"
                  className={`block px-3 py-2 duration-200 ${pathname === "/register" ? "text-brand01" : ""} hover:text-brand01`}
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
