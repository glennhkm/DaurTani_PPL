"use client";

import { dmSerifDisplay } from "@/components/fonts/dmSerifDisplay";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import { GoogleIcon } from "@/components/icons/googleIcon";
import { CornerUpLeft, Loader2 } from "lucide-react";
import API from "@/lib/utils/apiCreate";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";
// import API from "@/lib/utils/apiCreate";

const Register = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    password: "",
    email: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth(); // Assuming you have an AuthContext to manage authentication

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleGoogleLogin = async () => {
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
      const response = await API.post("/auth/register", formData);
      if (response.status === 201) {
        const { accessToken, refreshToken } = response.data.data;
        console.log("Registration successful:", response.data);
        // Set session with accessToken
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        // Set user data in AuthContext or local state
        const user = {
          id: response.data.data._id || "", 
          email: formData.email,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
        };
        setAuth(accessToken, user); // Assuming setAuth is available from AuthContext
        toast.success("Registrasi berhasil");
        router.push("/");
      }
    } catch (err: any) {
      console.error("Registration failed:", err.response?.data.message);
      setError(
        err.response?.data.message === "Weak Password"
          ? "Kata sandi minimal 6 karakter"
          : "Terjadi kesalahan saat registrasi"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center w-full md:w-1/2 p-10 space-y-6 bg-neutral01 relative">
      <Link href={'/'} className="flex gap-2 absolute top-0 left-0 bg-brand01 p-3 rounded-br-xl items-center text-neutral01 cursor-pointer duration-200 shadow-lg hover:bg-[#55774F]">
        <CornerUpLeft width={16}/>
        <p className="text-sm font-bold">Beranda</p>
      </Link>
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

      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className={`disabled:bg-cyan-800/60 disabled:cursor-not-allowed bg-cyan-700 hover:bg-cyan-800 py-2.5 rounded-xl shadow-lg cursor-pointer text-neutral01 duration-200`}
      >
        {isLoading ? (
          <Loader2 className="animate-spin mx-auto opacity-50" style={{ animationDuration: "3s" }} />
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
            htmlFor="fullName"
            className="block text-sm font-medium text-brand03/80"
          >
            Nama Lengkap
          </label>
          <input
            type="text"
            id="fullName"
            value={formData.fullName}
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
            htmlFor="password"
            className="block text-sm font-medium text-brand03/80"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Tulis Password Anda"
            className="w-full text-xs mt-1 p-2.5 border border-gray-300 rounded-lg focus:outline-brand01"
            required
          />
        </div>

        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-brand03/80"
          >
            Nomor Telepon
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Contoh: +62 822 8766 3232"
            className="w-full text-xs mt-1 p-2.5 border border-gray-300 rounded-lg focus:outline-brand01"
            required
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-1/2 rounded-lg mx-auto block bg-brand01 hover:bg-[#55774F] text-neutral01 py-2 px-4 transition-all duration-200 cursor-pointer shadow-lg ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (<Loader2 className="animate-spin mx-auto opacity-50"/>) : (<span>Daftar</span>)}
          </button>
        </div>
      </form>

      <p className="text-center text-sm text-brand03/80 ">
        Sudah punya akun?{" "}
        <Link href="/auth/login" className="text-brand01 underline font-bold">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
};

export default Register;
