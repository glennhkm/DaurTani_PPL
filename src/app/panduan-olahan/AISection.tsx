"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Info, Loader2, ArrowDown } from "lucide-react";

const AISection = () => {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: "Halo! Saya siap membantu pertanyaan Anda seputar pengolahan limbah pertanian. Silakan ketik pertanyaan Anda."
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  // Demo questions untuk inspirasi user
  const sampleQuestions = [
    "Bagaimana cara mengolah jerami padi menjadi pupuk organik?",
    "Apa manfaat ekonomi dari pengolahan limbah pertanian?",
    "Teknik sederhana pembuatan biogas dari kotoran ternak?",
    "Alat yang dibutuhkan untuk mengolah limbah tebu?"
  ];

  useEffect(() => {
    scrollToBottom();
  }, []);
  
  useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    
    const handleScroll = () => {
      if (chatContainer) {
        const isScrolledUp = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight > 100;
        setShowScrollButton(isScrolledUp);
      }
    };
    
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
      return () => chatContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const newUserMessage = {
      role: "user",
      content: input
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setIsTyping(true);
    
    // Simulasi respon dari AI dengan delay untuk efek realistis
    setTimeout(() => {
      let response;
      
      // Generate slightly different responses based on question content
      if (input.toLowerCase().includes("jerami") || input.toLowerCase().includes("padi")) {
        response = "Jerami padi dapat diolah menjadi pupuk organik melalui proses pengomposan. Pertama, potong jerami menjadi ukuran 5-10cm, lalu tumpuk dan siram dengan larutan aktivator EM4 yang sudah dicampur air dan molase. Tutup dengan terpal dan biarkan selama 14-21 hari dengan pembalikan setiap 7 hari. Pupuk organik dari jerami padi sangat baik untuk meningkatkan kesuburan tanah dan mengurangi penggunaan pupuk kimia.";
      } else if (input.toLowerCase().includes("biogas") || input.toLowerCase().includes("ternak")) {
        response = "Untuk membuat biogas dari kotoran ternak, Anda memerlukan digester biogas sederhana yang terdiri dari tangki penampung, pipa saluran gas, dan penampung gas. Kotoran ternak dicampur dengan air dengan perbandingan 1:1, kemudian dimasukkan ke dalam digester yang kedap udara. Proses fermentasi anaerob akan menghasilkan gas metana dalam 7-10 hari. Biogas dapat digunakan untuk memasak, penerangan, atau bahkan pembangkit listrik skala kecil.";
      } else if (input.toLowerCase().includes("ekonomi") || input.toLowerCase().includes("manfaat")) {
        response = "Pengolahan limbah pertanian memberikan beberapa manfaat ekonomi: (1) Menciptakan produk bernilai tambah seperti pupuk organik, pakan ternak, dan biogas; (2) Mengurangi biaya produksi pertanian dengan memanfaatkan sumber daya lokal; (3) Membuka peluang usaha baru dan menciptakan lapangan kerja di desa; (4) Mengurangi dampak lingkungan yang dapat menyebabkan kerugian ekonomi jangka panjang. Bahkan limbah seperti sekam padi dapat diolah menjadi arang sekam yang bisa dijual dengan harga cukup tinggi.";
      } else {
        response = `Terima kasih atas pertanyaan Anda tentang "${input}". Limbah pertanian merupakan sumber daya berharga yang dapat diolah menjadi berbagai produk bernilai seperti pupuk organik, pakan ternak, biogas, dan bahan kerajinan. Proses pengolahan yang tepat tidak hanya mengurangi masalah lingkungan tetapi juga memberi nilai tambah ekonomi bagi petani. Untuk informasi lebih spesifik, silakan tanyakan tentang jenis limbah pertanian tertentu yang ingin Anda olah.`;
      }
      
      const newBotMessage = {
        role: "assistant",
        content: response
      };

      setMessages((prev) => [...prev, newBotMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSampleQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="bg-gradient-to-br from-brand01/5 to-brand01/20 rounded-xl p-4 mb-4 flex items-center gap-3 border border-brand01/20">
        <div className="bg-brand01/20 p-2 rounded-full">
          <Info size={16} className="text-brand01" />
        </div>
        <p className="text-sm text-brand03/80">
          AI ini khusus dilatih untuk menjawab pertanyaan seputar pengolahan limbah pertanian. Dapatkan panduan praktis dan solusi langkah demi langkah.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {sampleQuestions.map((question, idx) => (
          <button
            key={idx}
            onClick={() => handleSampleQuestion(question)}
            className="text-left text-sm p-3 bg-brand01/10 hover:bg-brand01/20 rounded-lg border border-brand01/20 transition-colors duration-200 text-brand03/80"
          >
            {question}
          </button>
        ))}
      </div>
      
      <div 
        id="chat-container"
        className="bg-neutral01 rounded-xl shadow-md p-4 mb-4 max-h-[500px] overflow-y-auto border border-brand01/20 relative"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`my-4 flex ${
              msg.role === "user" ? "justify-end" : msg.role === "system" ? "justify-center" : "justify-start"
            }`}
          >
            {msg.role === "system" ? (
              <div className="bg-brand01/10 rounded-2xl px-6 py-4 text-center max-w-md text-brand03/80 border border-brand01/20">
                <div className="flex justify-center mb-3">
                  <Bot size={24} className="text-brand01" />
                </div>
                {msg.content}
              </div>
            ) : (
              <div className="flex gap-3">
                {msg.role === "assistant" && (
                  <div className="h-8 w-8 rounded-full bg-brand01/20 flex items-center justify-center mt-1">
                    <Bot size={16} className="text-brand01" />
                  </div>
                )}
                
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-brand01 text-neutral01 rounded-br-none"
                      : "bg-brand01/10 text-brand03/80 border border-brand01/20 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
                
                {msg.role === "user" && (
                  <div className="h-8 w-8 rounded-full bg-brand01/80 flex items-center justify-center mt-1">
                    <User size={16} className="text-neutral01" />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="my-4 flex justify-start">
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-brand01/20 flex items-center justify-center mt-1">
                <Bot size={16} className="text-brand01" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-brand01/10 border border-brand01/20 rounded-bl-none shadow-sm">
                <Loader2 size={16} className="animate-spin text-brand01" />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
        
        {showScrollButton && (
          <button 
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 bg-brand01 text-neutral01 rounded-full p-2 shadow-md hover:bg-brand01/80 transition-colors"
          >
            <ArrowDown size={16} />
          </button>
        )}
      </div>
      
      <div className="flex items-center gap-3 bg-neutral01 rounded-xl p-3 border border-brand01/30 shadow-sm focus-within:ring-2 focus-within:ring-brand01/30 transition-all">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Tanyakan sesuatu seputar limbah pertanian..."
          className="w-full focus:outline-none bg-transparent placeholder:text-brand03/50 text-brand03/80 px-2"
          disabled={isTyping}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className={`${
            !input.trim() || isTyping 
              ? "text-brand01/50 cursor-not-allowed" 
              : "text-brand01 hover:bg-brand01/10"
          } p-2 rounded-full transition-colors`}
        >
          <Send size={20} />
        </button>
      </div>
      
      <p className="text-xs text-center text-brand03/50 mt-2">
        AI ini memberikan informasi umum. Konsultasikan dengan ahli pertanian untuk implementasi yang spesifik.
      </p>
    </section>
  );
};

export default AISection;