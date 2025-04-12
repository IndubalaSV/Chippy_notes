"use client";

import { createContext, useState } from "react";

type NoteProviderContextType = {
  noteText: string;
  setNoteText: (text: string) => void;
};

export const NoteProviderContext = createContext<
  NoteProviderContextType | undefined
>(undefined);

export const NoteProvider = ({ children }: { children: React.ReactNode }) => {
  const [noteText, setNoteText] = useState<string>("");

  return (
    <NoteProviderContext.Provider value={{ noteText, setNoteText }}>
      {children}
    </NoteProviderContext.Provider>
  );
};
