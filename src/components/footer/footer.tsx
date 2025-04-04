import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-neutral01 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              DaurTani
            </h3>
            <p className="text-gray-600">
              Solusi daur ulang limbah pertanian untuk masa depan yang lebih
              berkelanjutan
            </p>
          </div>
          <div>
            <h4 className="text-gray-900 font-medium mb-4">Produk</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/marketplace"
                  className="text-gray-600 hover:text-green-600"
                >
                  Marketplace
                </a>
              </li>
              <li>
                <a
                  href="/panduan"
                  className="text-gray-600 hover:text-green-600"
                >
                  Panduan
                </a>
              </li>
              <li>
                <a
                  href="/komunitas"
                  className="text-gray-600 hover:text-green-600"
                >
                  Komunitas
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-900 font-medium mb-4">Perusahaan</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-gray-600 hover:text-green-600">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-600 hover:text-green-600"
                >
                  Kontak
                </a>
              </li>
              <li>
                <a href="/blog" className="text-gray-600 hover:text-green-600">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-900 font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/privacy"
                  className="text-gray-600 hover:text-green-600"
                >
                  Privasi
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-600 hover:text-green-600">
                  Syarat & Ketentuan
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-12 pt-8">
          <p className="text-gray-600 text-center">
            © {new Date().getFullYear()} DaurTani. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
