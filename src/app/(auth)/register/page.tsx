import { dmSerifDisplay } from "@/components/fonts/dmSerifDisplay";
import React from "react";

const Register = () => {
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

      <form className="space-y-4 mt-5">
        <div>
          <label
            htmlFor="nama"
            className="block text-sm font-medium text-brand03/80"
          >
            Nama Lengkap
          </label>
          <input
            type="text"
            id="nama"
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
            placeholder="Tulis Email Anda"
            className="w-full text-xs mt-1 p-2.5 border border-gray-300 rounded-lg focus:outline-brand01"
            required
          />
        </div>

        <div>
          <label
            htmlFor="no_telepon"
            className="block text-sm font-medium text-brand03/80"
          >
            Nomor Telepon
          </label>
          <input
            type="tel"
            id="no_telepon"
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
            placeholder="Tulis Kata Sandi Anda"
            className="w-full text-xs mt-1 p-2.5 border border-gray-300 rounded-lg focus:outline-brand01"
            required
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className={`w-1/2 rounded-lg mx-auto block bg-brand01 hover:bg-[#55774F] text-neutral01 py-2 px-4 transition-all duration-200 cursor-pointer shadow-lg ${dmSerifDisplay.className}`}
          >
            Daftar
          </button>
        </div>
      </form>

      <p className="text-center text-sm text-brand03/80 ">
        Sudah punya akun?{" "}
        <a href="/login" className="text-brand01 underline">
          Masuk di sini
        </a>
      </p>
    </div>
  );
};

export default Register;
