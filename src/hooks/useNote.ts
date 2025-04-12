"use client";

import { useContext } from "react";
import { NoteProviderContext } from "../provider/NoteProvider";

export function useNote() {
  const context = useContext(NoteProviderContext);
  console.log("useNote context", context);
  if (!context) {
    throw new Error("useNote must be used within a NoteProvider");
  }
  return context;
}
// This hook provides access to the note text and the function to set it.
