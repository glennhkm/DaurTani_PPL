"use client";

import { dmSerifDisplay } from "@/components/fonts/dmSerifDisplay";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // const res = await fetch("/api/auth/login", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(formData),
      // });

      // const data = await res.json();

      // if (!res.ok) {
      //   throw new Error(data.error || "Login failed");
      // }

      // // Login menggunakan AuthContext
      // login(data.token, data.user);
      
      // Redirect ke home page
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center w-full md:w-1/2 p-10 space-y-6 bg-neutral01">
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

      <form onSubmit={handleSubmit} className="space-y-4 mt-3">
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
            htmlFor="password"
            className="block text-sm font-medium text-brand03/80"
          >
            Kata Sandi
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Tulis Kata Sandi Anda"
            className="w-full text-xs mt-1 p-2.5 border border-gray-300 rounded-lg focus:outline-brand01"
            required
          />
        </div>

        <div className="flex flex-row justify-between">
          <p className="text-sm text-gray-600">
            belum punya akun?{" "}
            <Link href="/register" className="text-brand01 hover:underline">
              Daftar sekarang
            </Link>
          </p>
          <Link href="/forgot-password" className="text-sm text-brand01 hover:underline">
            Lupa kata sandi?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-1/2 rounded-lg mt-12 mx-auto block bg-brand01 hover:bg-[#55774F] text-neutral01 py-2 px-4 transition-all duration-200 cursor-pointer shadow-lg ${dmSerifDisplay.className} ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </div>
  );
};

export default Login;
