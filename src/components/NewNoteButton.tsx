"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { createNoteAction } from "@/actions/notes";

type Props = {
  user: User;
};

export function NewNoteButton({ user }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClickNewNoteButton = async () => {
    if (!user) {
      router.push("/login");
    } else {
      setLoading(true);
      //
      const uuid = uuidv4();
      await createNoteAction(uuid);
      // Redirect to the new note page
      router.push(`/?noteId=${uuid}`);
      toast.success("New note created!");

      setLoading(false);
    }
  };
  return (
    <Button
      variant="secondary"
      className="w-24"
      onClick={handleClickNewNoteButton}
      disabled={loading}
    >
      {loading ? <Loader2 /> : "New Note"}
    </Button>
  );
}
