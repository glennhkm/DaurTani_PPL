"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Ambil hash dari URL
    const hash = window.location.hash.substring(1); // hapus '#'
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      // Redirect ke halaman utama/marketplace
      router.replace("/marketplace");
    } else {
      // Handle error, misal tampilkan pesan gagal login
      router.replace("/login?error=oauth");
    }
  }, [router]);

  return <div>Logging in...</div>;
}