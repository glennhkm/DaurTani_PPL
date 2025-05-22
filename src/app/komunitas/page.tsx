"use client";

import { dmSerifDisplay } from "@/components/fonts/dmSerifDisplay";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";

const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: string }) => (
  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-neutral01/10 hover:border-brand02/30 transition-all">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className={`${dmSerifDisplay.className} text-xl mb-2 text-brand02`}>{title}</h3>
    <p className="text-neutral01/80">{description}</p>
  </div>
);

const TestimonialCard = ({ name, role, content, image }: { name: string; role: string; content: string; image: string }) => (
  <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-neutral01/10">
    <div className="flex items-center gap-4 mb-4">
      <Image src={image} alt={name} width={60} height={60} className="rounded-full" />
      <div>
        <h4 className="text-brand02 font-semibold">{name}</h4>
        <p className="text-neutral01/60 text-sm">{role}</p>
      </div>
    </div>
    <p className="text-neutral01/80 italic">&ldquo;{content}&rdquo;</p>
  </div>
);

const StatCard = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center p-6">
    <div className={`${dmSerifDisplay.className} text-4xl text-brand02 mb-2`}>{value}</div>
    <div className="text-neutral01/80">{label}</div>
  </div>
);

const EventCard = ({ date, title, description }: { date: string; title: string; description: string }) => (
  <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-neutral01/10 hover:border-brand02/30 transition-all">
    <div className="text-brand02 font-semibold mb-2">{date}</div>
    <h4 className={`${dmSerifDisplay.className} text-xl mb-2`}>{title}</h4>
    <p className="text-neutral01/80">{description}</p>
    <button className="mt-4 text-brand02 hover:text-brand02/80 transition-all">Daftar →</button>
  </div>
);

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-neutral01/10">
      <button
        className="w-full py-4 flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg text-neutral01">{question}</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      <div className={`overflow-hidden transition-all ${isOpen ? 'max-h-48' : 'max-h-0'}`}>
        <p className="pb-4 text-neutral01/80">{answer}</p>
      </div>
    </div>
  );
};

const Komunitas = () => {
  const features = [
    {
      icon: "🌱",
      title: "Kolaborasi Petani",
      description: "Terhubung dengan petani lain untuk berbagi pengalaman dan praktik pengelolaan limbah pertanian."
    },
    {
      icon: "🏢",
      title: "Akses Industri",
      description: "Jalin kerjasama dengan industri yang membutuhkan limbah pertanian sebagai bahan baku."
    },
    {
      icon: "🔄",
      title: "Inovasi Berkelanjutan",
      description: "Pelajari teknik terbaru dalam pengolahan limbah pertanian menjadi produk bernilai tambah."
    },
    {
      icon: "💡",
      title: "Forum Diskusi",
      description: "Diskusikan ide dan solusi untuk mengatasi tantangan dalam pengelolaan limbah pertanian."
    }
  ];

  const testimonials = [
    {
      name: "Pak Slamet",
      role: "Petani Organik",
      content: "Berkat komunitas ini, limbah pertanian saya kini menjadi sumber pendapatan tambahan.",
      image: "/images/testimonial1.jpg"
    },
    {
      name: "Bu Ratna",
      role: "Pengusaha Kompos",
      content: "Platform ini membantu saya menemukan supplier limbah pertanian yang konsisten.",
      image: "/images/testimonial2.jpg"
    },
    {
      name: "Mas Dani",
      role: "Urban Farmer",
      content: "Komunitas ini membuka wawasan saya tentang potensi limbah pertanian untuk urban farming.",
      image: "/images/testimonial3.jpg"
    }
  ];

  const stats = [
    { value: "500+", label: "Anggota Aktif" },
    { value: "50+", label: "Kemitraan Industri" },
    { value: "1000+", label: "Ton Limbah Terkelola" },
    { value: "100+", label: "Proyek Kolaborasi" }
  ];

  const events = [
    {
      date: "15 Juni 2024",
      title: "Workshop Pengolahan Jerami",
      description: "Pelajari teknik terbaru mengolah jerami menjadi pakan ternak berkualitas tinggi."
    },
    {
      date: "22 Juni 2024",
      title: "Seminar Composting",
      description: "Pahami proses pengomposan yang efektif untuk berbagai jenis limbah pertanian."
    },
    {
      date: "29 Juni 2024",
      title: "Temu Bisnis Agrowaste",
      description: "Bertemu langsung dengan pelaku industri yang membutuhkan limbah pertanian."
    }
  ];

  const faqs = [
    {
      question: "Bagaimana cara bergabung dengan komunitas?",
      answer: "Anda dapat mendaftar melalui tombol 'Daftar Sekarang' di atas. Setelah itu, lengkapi profil dan verifikasi email Anda."
    },
    {
      question: "Apakah keanggotaan berbayar?",
      answer: "Tidak, keanggotaan dasar gratis. Namun ada fitur premium untuk akses ke layanan khusus."
    },
    {
      question: "Bagaimana sistem kolaborasi berjalan?",
      answer: "Kami memfasilitasi pertemuan antara petani dan industri melalui platform digital dan event offline."
    },
    {
      question: "Apa manfaat bergabung dengan komunitas?",
      answer: "Akses ke jaringan petani dan industri, pengetahuan pengelolaan limbah, dan peluang bisnis baru."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="transition-all duration-300 relative px-4 lg:pt-24 flex flex-col gap-6 items-center justify-center h-[60vh] md:h-[70vh]">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/kolaborasi.jpg"
            alt="Background pertanian"
            fill
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand03/60 to-brand03/85 backdrop-blur-sm" />
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20 -z-[9]">
          <div className="absolute top-20 left-[10%] w-32 h-32 rounded-full bg-brand01 blur-3xl"></div>
          <div className="absolute bottom-20 right-[10%] w-40 h-40 rounded-full bg-brand02 blur-3xl"></div>
        </div>
        <h2 className={`sm:text-5xl text-neutral01 text-4xl md:text-6xl max-w-2xl text-center ${dmSerifDisplay.className}`}>
          Komunitas Kolaborasi <span className="text-brand02">Limbah</span> Pertanian
        </h2>
        <p className="text-neutral01/80 mt-2 max-w-2xl mb-6 text-lg text-center">
          Bangun koneksi antara petani, komunitas urban farming, startup agritech, dan industri dalam ekosistem kolaboratif.
        </p>
        <button className="bg-brand02 text-neutral01 px-8 py-3 rounded-full hover:bg-brand02/90 transition-all">
          Bergabung Sekarang
        </button>
      </div>

      {/* Stats Section */}
      <div className="bg-brand03/30 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-brand03 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h3 className={`${dmSerifDisplay.className} text-3xl md:text-4xl text-center text-neutral01 mb-12`}>
            Manfaat Bergabung dengan Komunitas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-brand03/50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h3 className={`${dmSerifDisplay.className} text-3xl md:text-4xl text-center text-neutral01 mb-12`}>
            Apa Kata Mereka?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="bg-brand03/30 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h3 className={`${dmSerifDisplay.className} text-3xl md:text-4xl text-center text-neutral01 mb-12`}>
            Event Mendatang
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-brand03/20 py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h3 className={`${dmSerifDisplay.className} text-3xl md:text-4xl text-center text-brand03 mb-12`}>
            Pertanyaan Umum
          </h3>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} {...faq} />
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-brand01/10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className={`${dmSerifDisplay.className} text-3xl md:text-4xl text-brand03 mb-6`}>
            Siap Untuk Bergabung?
          </h3>
          <p className="text-brand03/80 mb-8 text-lg">
            Jadilah bagian dari komunitas yang peduli terhadap keberlanjutan pertanian dan lingkungan. 
            Bersama kita bisa menciptakan perubahan positif.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-brand02 text-neutral01 px-8 py-3 rounded-full hover:bg-brand02/90 transition-all">
              Daftar Sekarang
            </button>
            <button className="border border-brand02 text-brand02 px-8 py-3 rounded-full hover:bg-brand02/10 transition-all">
              Pelajari Lebih Lanjut
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Komunitas;
