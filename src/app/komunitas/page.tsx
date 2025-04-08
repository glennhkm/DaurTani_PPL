import { dmSerifDisplay } from "@/components/fonts/dmSerifDisplay";
import Image from "next/image";
import React from "react";

const Komunitas = () => {
  return (
    <div className="flex flex-col min-h-screen ">
      <div
        // className={`transition-all duration-300 relative px-4 lg:pt-24 flex flex-col gap-6 items-center justify-center h-[60vh] md:h-[70vh]`}
        className={`transition-all duration-300 relative px-4 lg:pt-24 flex flex-col gap-6 items-center justify-center h-[60vh] md:h-[100vh]`}
      >
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
        <h2
          className={`sm:text-5xl text-neutral01 text-4xl md:text-6xl max-w-2xl text-center ${dmSerifDisplay.className}`}
        >
          Komunitas Kolaborasi <span className="text-brand02">Limbah</span>{" "}
          Pertanian
        </h2>
        <p className="text-neutral01/80 mt-2 max-w-2xl mb-10 text-lg text-center">
          Bangun koneksi antara petani, komunitas urban farming, startup
          agritech, dan industri dalam ekosistem kolaboratif.
        </p>
        <h2
          className={`sm:text-5xl text-brand02 text-4xl md:text-6xl max-w-2xl text-center ${dmSerifDisplay.className}`}
        >
          Coming <span className="text-neutral01">Soon!</span>
        </h2>
      </div>
    </div>
  );
};

export default Komunitas;
