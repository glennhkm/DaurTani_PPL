"use client";

import { usePathname } from "next/navigation";
import { MainLogoWithTypografi } from "@/components/iconAndLogo/mainLogoWithTypografi";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  if (pathname === "/auth/callback") {
    return <>{children}</>;
  }

  return (
    <main className="flex items-center justify-center min-h-screen p-8 bg-gradient-to-tr from-brand01/60 via-brand01/20 to-neutral01">
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
