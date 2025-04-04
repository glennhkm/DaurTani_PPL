import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-[#F9F5EC] border-t border-brand01/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-brand03 mb-4">
              DaurTani
            </h3>
            <p className="text-brand03/80">
              Solusi daur ulang limbah pertanian untuk masa depan yang lebih
              berkelanjutan
            </p>
          </div>
          <div>
            <h4 className="text-brand03 font-medium mb-4">Produk</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/marketplace"
                  className="text-brand03/80 hover:text-brand01"
                >
                  Marketplace
                </a>
              </li>
              <li>
                <a
                  href="/panduan"
                  className="text-brand03/80 hover:text-brand01"
                >
                  Panduan
                </a>
              </li>
              <li>
                <a
                  href="/komunitas"
                  className="text-brand03/80 hover:text-brand01"
                >
                  Komunitas
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-brand03 font-medium mb-4">Perusahaan</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/about"
                  className="text-brand03/80 hover:text-brand01"
                >
                  Tentang Kami
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-brand03/80 hover:text-brand01"
                >
                  Kontak
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="text-brand03/80 hover:text-brand01"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-brand03 font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/privacy"
                  className="text-brand03/80 hover:text-brand01"
                >
                  Privasi
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-brand03/80 hover:text-brand01"
                >
                  Syarat & Ketentuan
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-brand01/20 mt-12 pt-8">
          <p className="text-brand03/80 text-center">
            © {new Date().getFullYear()} DaurTani. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
