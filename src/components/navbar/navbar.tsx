"use client";

import React, { useEffect, useState, useRef } from "react";
import { MainLogo } from "../iconAndLogo/mainLogo";
import { dmSerifDisplay } from "../fonts/dmSerifDisplay";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { User, Store, LogOut, ChevronDown } from "lucide-react";
import { dmSans } from "../fonts/dmSans";

export const Navbar = () => {
  const [atTop, setAtTop] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const homeRelatedRoute = ["marketplace", "panduan-olahan", "/"];

  const navMenu = [
    { name: "Marketplace", url: "/marketplace" },
    { name: "Panduan Olahan", url: "/panduan-olahan" },
  ];

  useEffect(() => {
    const handleScroll = () => setAtTop(window.scrollY === 0);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    }
    if (showUserDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserDropdown]);

  const isMarketplaceRelated = pathname.includes("/marketplace");
  const isHomeRelated = homeRelatedRoute.includes(
    pathname.split("/")[pathname.split("/").length - 1] || "/"
  );

  const handleProfileClick = () => {
    setShowUserDropdown(false);
    // Navigate to profile page when implemented
    router.push("/profile");
  };

  const handleStoreClick = () => {
    router.push("/marketplace/store");
    setShowUserDropdown(false);
  };

  const handleLogout = async () => {
    setShowUserDropdown(false);
    logout();
    router.push("/");
  };

  if (pathname.includes("/auth")) return null;

  return (
    <nav
      className={`fixed w-full z-40 transition-colors border-b duration-200 ${
        atTop && isHomeRelated
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
            } ${atTop && isHomeRelated ? "text-neutral01" : "text-brand03"}`}
          >
            {navMenu.map((item, index) => (
              <Link
                key={index}
                href={item.url}
                className={`px-3 py-2 duration-200 ${
                  pathname === item.url ||
                  (item.url === "/marketplace" && isMarketplaceRelated)
                    ? "text-brand01"
                    : atTop && isHomeRelated
                    ? "text-neutral01"
                    : "text-brand03"
                } hover:text-brand01`}
              >
                {item.name}
              </Link>
            ))}

            {user ? (
              <div className={`ml-4`} ref={userDropdownRef}>
                <button
                  className={`flex gap-2 items-center text-neutral01 rounded-full py-2 px-4 bg-brand01 shadow-md focus:outline-none cursor-pointer hover:shadow-2xl hover:shadow-brand01 duration-200 transition-all`}
                  onClick={() => setShowUserDropdown((v) => !v)}
                >
                  <User size={21} />
                  <p>{user.fullName}</p>
                  <ChevronDown />
                </button>

                {showUserDropdown && (
                  <div
                    className={`fixed right-20 mt-2 w-40 bg-neutral01 rounded-xl shadow-lg py-2 z-50 border border-gray-100 ${dmSans.className}`}
                  >
                    <Link href={'/profile'} className={`flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-brand01/30 hover:font-semibold duration-200 cursor-pointer ${
                        pathname === "/profile"
                          ? "text-brand01"
                          : "text-brand03"
                      }`}
                    >
                      <User className="w-4 h-4" /> Profil
                    </Link>
                    <Link
                      href="/marketplace/store"
                      className={`flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-brand01/30 hover:font-semibold duration-200 cursor-pointer ${
                        pathname === "/marketplace/store"
                          ? "text-brand01"
                          : "text-brand03"
                      }`}
                    >
                      <Store className="w-4 h-4" /> Toko Anda
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-brand03 hover:bg-brand01/30 hover:font-semibold duration-200 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className={`bg-brand01 px-4 py-2 cursor-pointer hover:opacity-80 duration-200 transition-colors text-neutral01 rounded-lg`}
              >
                Daftar/Masuk
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`${
              atTop && isHomeRelated ? "text-neutral01" : "text-brand03"
            } hover:text-brand01`}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className={`px-2 pt-2 space-y-1 sm:px-3 ${!user ? "pb-6" : "pb-2"}`}>
            {navMenu.map((item, index) => (
              <Link
                key={index}
                href={item.url}
                className={`block px-3 py-2 duration-200 ${
                  pathname === item.url ||
                  (item.url === "/marketplace" && isMarketplaceRelated)
                    ? "text-brand01"
                    : atTop && isHomeRelated
                    ? "text-neutral01"
                    : "text-brand03"
                } hover:text-brand01`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div
              className={`h-[1px] w-[96%] mx-auto ${
                atTop && isHomeRelated ? "bg-neutral01/10" : "bg-brand03/10"
              } ${!user ? "mb-6" : ""}`}
            ></div>
            {user ? (
              <div className="w-full flex justify-end">
                <button
                  onClick={handleProfileClick}
                  className={`flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-brand01/30 hover:font-semibold duration-200 cursor-pointer ${
                    atTop && isHomeRelated
                      ? "text-neutral01"
                      : pathname === "/profile"
                      ? "text-brand01"
                      : "text-brand03"
                  }`}
                >
                  <User className="w-4 h-4" /> Profil
                </button>
                <button
                  onClick={handleStoreClick}
                  className={`flex items-center justify-center gap-2 w-full text-left px-4 py-2 hover:bg-brand01/30 hover:font-semibold duration-200 cursor-pointer ${
                    atTop && isHomeRelated
                      ? "text-neutral01"
                      : pathname === "/marketplace/store"
                      ? "text-brand01"
                      : "text-brand03"
                  }`}
                >
                  <Store className="w-4 h-4" /> Toko Anda
                </button>
                <button
                  onClick={handleLogout}
                  className={`flex items-center justify-end gap-2 w-full text-left px-4 py-2 hover:bg-brand01/30 hover:font-semibold duration-200 cursor-pointer ${
                    atTop && isHomeRelated ? "text-neutral01" : "text-brand03"
                  }`}
                >
                  <LogOut className="w-4 h-4" /> Keluar
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className={`bg-brand01 px-4 py-2 ml-2 cursor-pointer hover:opacity-80 duration-200 transition-colors text-neutral01 rounded-lg`}
              >
                Daftar/Masuk
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
