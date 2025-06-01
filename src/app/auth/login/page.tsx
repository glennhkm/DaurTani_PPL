"use client";

import { dmSerifDisplay } from "@/components/fonts/dmSerifDisplay";
import { GoogleIcon } from "@/components/icons/googleIcon";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";
import API from "@/lib/utils/apiCreate";
import { CornerUpLeft, Loader2 } from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Login = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth(); // Uncomment this line if you are using AuthContext

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleGoogleClick = async () => {
    setIsLoading(true);
    try {
      const response = await API.get("/auth/login-oauth");
      if (response.status === 200) {
        console.log("Redirecting to:", response.data.data.url);
        router.push(response.data.data.url);
        // setIsLoading(false)
      } else {
        console.error("Failed to initiate login");
      }
    } catch (error) {
      console.error("Network error during login:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", formData);
      if (response.status === 200) {
        const { accessToken, refreshToken } = response.data.data;
        console.log("Login successful:", response.data);
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        setAuth(accessToken, response.data.data);
        toast.success("Login berhasil");
        router.push("/");
      }
    } catch (err: any) {
      console.error("Login error:", err.response?.data.message);
      setError(
        err.response?.data.message === "Invalid Credentials"
          ? "Email atau kata sandi salah"
          : "Terjadi kesalahan saat masuk"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center w-full md:w-1/2 p-10 space-y-6 bg-neutral01 relative">
      <Link
        href={"/"}
        className="flex gap-2 absolute top-0 left-0 bg-brand01 p-3 rounded-br-xl items-center text-neutral01 cursor-pointer duration-200 shadow-lg hover:bg-[#55774F]"
      >
        <CornerUpLeft width={16} />
        <p className="text-sm font-bold">Beranda</p>
      </Link>
      <div className="text-center">
        <h2
          className={`text-5xl font-bold text-brand03 ${dmSerifDisplay.className}`}
        >
          Masuk
        </h2>
        <p className="mt-3 text-sm text-brand03/60">Selamat datang kembali!</p>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
      <button
        onClick={handleGoogleClick}
        disabled={isLoading}
        className={`disabled:bg-cyan-800/60 disabled:cursor-not-allowed bg-cyan-700 hover:bg-cyan-800 py-2.5 rounded-xl shadow-lg cursor-pointer text-neutral01 duration-200`}
      >
        {isLoading ? (
          <Loader2
            className="animate-spin mx-auto opacity-50"
            style={{ animationDuration: "3s" }}
          />
        ) : (
          <span className="flex gap-4 justify-center items-center">
            <GoogleIcon width={24} height={24} />
            <span className="text-sm tracking-wide">Masuk dengan Google</span>
          </span>
        )}
      </button>
      <div className="h-[0.4px] bg-black/15 w-full"></div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-brand03/80"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Tulis Email Anda"
            className="w-full text-xs mt-1 p-2.5 border border-gray-300 rounded-lg focus:outline-brand01"
            required
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-brand03/80"
          >
            Kata Sandi
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Tulis Kata sandi Anda"
            className="w-full text-xs mt-1 p-2.5 border border-gray-300 rounded-lg focus:outline-brand01"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-1/2 rounded-lg mt-12 mx-auto block bg-brand01 hover:bg-[#55774F] text-neutral01 py-2 px-4 transition-all duration-200 cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? (
            <Loader2
              className="animate-spin mx-auto opacity-50"
              style={{ animationDuration: "3s" }}
            />
          ) : (
            <span>Masuk</span>
          )}
        </button>
      </form>
      <div className="flex justify-between mx-auto">
        <p className="text-sm text-gray-600">
          belum punya akun?{" "}
          <Link
            href="/auth/register"
            className="text-brand01 underline font-bold"
          >
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
