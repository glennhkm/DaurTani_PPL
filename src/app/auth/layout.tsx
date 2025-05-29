"use client";

import { dmSerifDisplay } from "@/components/fonts/dmSerifDisplay";
import { MainLogoWithTypografi } from "@/components/iconAndLogo/mainLogoWithTypografi";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex items-center justify-center min-h-screen bg-[url('/images/mainBackground.webp')] bg-cover bg-center p-8">
      <div className="flex w-full max-w-5xl shadow-lg overflow-hidden border border-brand01/20 rounded-lg">
        {/* Kiri - Logo */}
        <div className="hidden md:flex items-center justify-center w-1/2 p-8 backdrop-blur-sm border-r border-brand01/20">
          <MainLogoWithTypografi width="360" />
        </div>
        {/* Kanan - Form */}
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
