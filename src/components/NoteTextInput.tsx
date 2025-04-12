"use client";

import React, { useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useSearchParams } from "next/navigation";
import { useNote } from "@/hooks/useNote";
import { updateNoteAction } from "@/actions/notes";

type Props = {
  noteId: string;
  startingNoteText: string;
};

export const NoteTextInput = ({ noteId, startingNoteText }: Props) => {
  // const router = useRouter();
  const searchParams = useSearchParams();
  const noteIdParam = searchParams.get("noteId") || "";
  const { noteText, setNoteText } = useNote();
  const updateTimeout = useRef<NodeJS.Timeout | null>(null);
  const initialLoadRef = useRef(true);
  const prevNoteIdRef = useRef(noteId);

  const handleUpdateNote = async (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setNoteText(value);

    if (updateTimeout.current) {
      clearTimeout(updateTimeout.current);
    }

    updateTimeout.current = setTimeout(async () => {
      if (noteId) {
        await updateNoteAction(noteId, value);
      }
    }, 100);
  };

  // Track when noteId prop changes (new note created)
  useEffect(() => {
    if (noteId !== prevNoteIdRef.current) {
      setNoteText(startingNoteText);
      initialLoadRef.current = true;
      prevNoteIdRef.current = noteId;
    }
  }, [noteId, startingNoteText, setNoteText]);

  // Update note text when the URL parameter changes or on component mounts
  useEffect(() => {
    if (
      (noteIdParam === noteId &&
        startingNoteText !== "" &&
        initialLoadRef.current) ||
      noteIdParam !== noteId
    ) {
      setNoteText(startingNoteText);
      initialLoadRef.current = false;
    }
  }, [noteIdParam, noteId, startingNoteText, setNoteText]);

  return (
    <Textarea
      value={noteText}
      placeholder="Type your notes here.."
      onChange={handleUpdateNote}
      className="min-h-[300px] resize-none focus:ring-1 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/20"
    />
  );
};
