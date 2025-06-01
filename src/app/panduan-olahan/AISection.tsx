"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Info, Loader2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';

// Interface untuk pesan
interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface AISectionProps {
  initialQuestion?: string | null;
}

const AISection: React.FC<AISectionProps> = ({ initialQuestion }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "Anda adalah asisten AI yang ahli dalam pengolahan limbah pertanian. Berikan jawaban yang praktis, informatif, dan mudah dipahami dalam bahasa Indonesia."
    },
    {
      role: "assistant", 
      content: "Halo! Saya siap membantu pertanyaan Anda seputar pengolahan limbah pertanian. Silakan ketik pertanyaan Anda."
    }
  ]);
  const [input, setInput] = useState(initialQuestion || "");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const firstMessageRef = useRef<HTMLDivElement | null>(null);
  const inputMessageRef = useRef<HTMLInputElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const initialQuestionProcessedRef = useRef(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const sampleQuestions = [
    "Bagaimana cara mengolah jerami padi menjadi pupuk organik?",
    "Apa manfaat ekonomi dari pengolahan limbah pertanian?",
    "Teknik sederhana pembuatan biogas dari kotoran ternak?",
    "Alat yang dibutuhkan untuk mengolah limbah tebu?"
  ];

  useEffect(() => {
    firstScroll();
  }, []);

  // Handle initial question
  useEffect(() => {
    const processInitialQuestion = async () => {
      if (initialQuestion && !initialQuestionProcessedRef.current && !isTyping) {
        initialQuestionProcessedRef.current = true;
        await handleSend(initialQuestion);
      }
    };

    processInitialQuestion();
  }, [initialQuestion, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  
    setTimeout(() => {
      if (inputMessageRef.current) {
        const len = inputMessageRef.current.value.length;
        inputMessageRef.current.focus();
        inputMessageRef.current.setSelectionRange(len, len);
      }
    }, 400);
  };
  
  const firstScroll = () => {
    firstMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  
    setTimeout(() => {
      if (inputMessageRef.current) {
        const len = inputMessageRef.current.value.length;
        inputMessageRef.current.focus();
        inputMessageRef.current.setSelectionRange(len, len);
      }
    }, 400);
  };

  // Fungsi untuk mengirim pesan ke API dengan streaming
  const sendMessageToAPI = async (messagesHistory: Message[], onChunk: (chunk: string) => void): Promise<void> => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: messagesHistory }),
      signal: abortControllerRef.current?.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No reader available');
    }

    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                onChunk(parsed.content);
              }
            } catch (e) {
              // Skip invalid JSON lines
              continue;
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  };

  const handleSend = async (forcedInput?: string) => {
    const messageToSend = forcedInput || input;
    if (!messageToSend.trim() || isTyping) return;

    // Batalkan request sebelumnya jika ada
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const newUserMessage: Message = {
      role: "user",
      content: messageToSend.trim()
    };
    
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    scrollToBottom();
    setInput("");
    setIsTyping(true);
    setIsGenerating(true);

    try {
      let fullResponse = '';
      
      // Kirim request ke API dengan callback untuk setiap chunk
      await sendMessageToAPI(updatedMessages, (chunk) => {
        fullResponse += chunk;
        const newBotMessage: Message = {
          role: "assistant",
          content: fullResponse
        };
        setMessages([...updatedMessages, newBotMessage]);
        scrollToBottom();
      });

    } catch (error: any) {
      console.error('Error sending message:', error);
      
      // Jangan tampilkan error jika request dibatalkan
      if (error.name === 'AbortError') {
        return;
      }

      // Tampilkan pesan error ke user
      const errorMessage: Message = {
        role: "assistant",
        content: "Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi."
      };

      setMessages(prev => [...prev, errorMessage]);
      scrollToBottom();
    } finally {
      setIsTyping(false);
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsTyping(false);
      setIsGenerating(false);
    }
  };

  const handleSampleQuestion = (question: string) => {
    setInput(question);
    scrollToBottom();
  };

  return (
    <section className="flex flex-col gap-4" ref={firstMessageRef}>
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
            disabled={isTyping}
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
              <div className={`flex gap-3 ${msg.role === "user" && 'justify-end'}`}>
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
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none
                      prose-headings:text-brand03/90 prose-headings:font-semibold prose-headings:mt-4 prose-headings:mb-2
                      prose-p:text-brand03/80 prose-p:leading-relaxed prose-p:my-2
                      prose-strong:text-brand03/90 prose-strong:font-semibold
                      prose-ul:my-2 prose-ul:pl-4
                      prose-ol:my-2 prose-ol:pl-4
                      prose-li:text-brand03/80 prose-li:my-1
                      prose-code:bg-brand01/20 prose-code:px-1 prose-code:rounded prose-code:text-brand03/90
                      prose-pre:bg-brand01/10 prose-pre:border prose-pre:border-brand01/20 prose-pre:rounded-lg
                      prose-blockquote:border-l-4 prose-blockquote:border-brand01/40 prose-blockquote:pl-4 prose-blockquote:italic"
                    >
                      <ReactMarkdown>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
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
        <div className="mt-20"></div>
        <div ref={messagesEndRef} />
      </div>
      
      <div className="flex items-center gap-3 bg-neutral01 rounded-xl p-3 border border-brand01/30 shadow-sm focus-within:ring-2 focus-within:ring-brand01/30 transition-all">
        <input
          type="text"
          ref={inputMessageRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Tanyakan sesuatu seputar limbah pertanian..."
          className="w-full focus:outline-none bg-transparent placeholder:text-brand03/50 text-brand03/80 px-2"
          disabled={isTyping}
        />
        {isGenerating ? (
          <button
            onClick={handleStop}
            className="p-2 rounded-full text-red-500 hover:bg-red-50 transition-colors"
            title="Hentikan generasi"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className={`${
              !input.trim() || isTyping
                ? "text-brand01/50 cursor-not-allowed"
                : "text-brand01 hover:bg-brand01/10"
            } p-2 rounded-full transition-colors`}
          >
            <Send size={20} />
          </button>
        )}
      </div>
      
      <p className="text-xs text-center text-brand03/50 mt-2">
        AI ini memberikan informasi umum. Konsultasikan dengan ahli pertanian untuk implementasi yang spesifik.
      </p>
    </section>
  );
};

export default AISection;