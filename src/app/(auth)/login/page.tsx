import { dmSerifDisplay } from "@/components/fonts/dmSerifDisplay";
import Link from "next/link";
import React from "react";

const Login = () => {
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

      <form className="space-y-4 mt-3">
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
            placeholder="Tulis Kata Sandi Anda"
            className="w-full text-xs mt-1 p-2.5 border border-gray-300 rounded-lg focus:outline-brand01"
            required
          />
        </div>

        <div className="flex flex-row justify-between">
          <p className="text-sm text-gray-600">
            belum punya akun?{" "}
            <a href="/register" className="text-brand01 hover:underline">
              Daftar sekarang
            </a>
          </p>
          <a href="/login" className="text-sm text-brand01 hover:underline">
            Lupa kata sandi?
          </a>
        </div>

        <Link href="/">
          <button
            type="submit"
            className={`w-1/2 rounded-lg mt-12 mx-auto block bg-brand01 hover:bg-[#55774F] text-neutral01 py-2 px-4 transition-all duration-200 cursor-pointer shadow-lg ${dmSerifDisplay.className}`}
          >
            Masuk
          </button>
        </Link>
      </form>
    </div>
  );
};

export default Login;
