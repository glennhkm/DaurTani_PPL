"use client";

import { dmSerifDisplay } from "@/components/fonts/dmSerifDisplay";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Redirect ke login page
      router.push("/login");
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
          Daftar
        </h2>
        <p className="mt-3 text-sm text-brand03/60">
          Gabunglah dengan kami untuk mendapatkan informasi terbaru.
        </p>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 mt-5">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-brand03/80"
          >
            Nama Lengkap
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tulis Nama Lengkap Anda"
            className="w-full text-xs mt-1 p-2.5 border border-gray-300 rounded-lg focus:outline-brand01"
            required
          />
        </div>

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
            htmlFor="phone"
            className="block text-sm font-medium text-brand03/80"
          >
            Nomor Telepon
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Contoh: +62 822 8766 3232"
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
            minLength={6}
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-1/2 rounded-lg mx-auto block bg-brand01 hover:bg-[#55774F] text-neutral01 py-2 px-4 transition-all duration-200 cursor-pointer shadow-lg ${dmSerifDisplay.className} ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </div>
      </form>

      <p className="text-center text-sm text-brand03/80 ">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-brand01 underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
};

export default Register;
