"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface UIContextType {
  isSearchSticky: boolean;
  setIsSearchSticky: (val: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [isSearchSticky, setIsSearchSticky] = useState(false);

  return (
    <UIContext.Provider value={{ isSearchSticky, setIsSearchSticky }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used within a UIProvider");
  return context;
}; 