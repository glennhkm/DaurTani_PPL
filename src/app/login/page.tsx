"use client";

import { dmSerifDisplay } from "@/components/fonts/dmSerifDisplay";
import React from "react";

const loginPage = () => {
    return (
        <main className="flex items-center justify-center min-h-screen bg-[url('/images/mainBackground.webp')] bg-cover bg-center p-8">
            <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="hidden md:flex items-center justify-center w-1/2 p-8">
                    <img
                        src="/images/logo.png"
                        alt="logo_daur_tani"
                        className="max-w-xs h-auto"
                    />
                </div>

                <div className="flex flex-col justify-center w-full md:w-1/2 p-10 space-y-6">
                    <div className="text-center">
                        <h1 className={`text-3xl font-bold text-gray-800 ${dmSerifDisplay}`}>Masuk</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Selamat datang kembali!
                        </p>
                    </div>

                    <form className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Tulis Email Anda"
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-brand01"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Kata Sandi
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Tulis Kata Sandi Anda"
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-brand01"
                                required
                            />
                        </div>

                        <div className="flex flex-row justify-between">
                            <p className="text-sm text-gray-600">
                                belum punya akun?{" "}
                                <a href="/register" className="text-[#74A76B] hover:underline">
                                    daftar sekarang
                                </a>
                            </p>
                            <a href="/login" className="text-sm text-[#74A76B] hover:underline">
                                lupa kata sandi?
                            </a>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-1/2 mx-auto block bg-[#55774F] hover:bg-[#3a5436] text-white py-2 px-4 rounded-lg transition-all duration-200"
                            >
                                Daftar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default loginPage;