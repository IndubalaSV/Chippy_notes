"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { deleteNoteAction } from "@/actions/notes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type DeleteNoteButtonProps = {
  noteId: string;
  children: React.ReactNode;
  onDeleteSuccess?: () => void;
};

function DeleteNoteButton({
  noteId,
  children,
  onDeleteSuccess,
}: DeleteNoteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const { success, error } = await deleteNoteAction(noteId);

      if (success) {
        toast.success("Note deleted successfully");

        // Call the callback if provided
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }

        // Force a router refresh in addition to navigation
        router.refresh();

        // If we're currently viewing this note, navigate to homepage
        const url = new URL(window.location.href);
        const currentNoteId = url.searchParams.get("noteId");
        if (currentNoteId === noteId) {
          router.replace("/");
        }
      } else {
        toast.error(error || "Failed to delete note");
      }
    } catch (err) {
      toast.error("An error occurred while deleting the note");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={isDeleting}
      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
    >
      {children}
    </Button>
  );
}

export default DeleteNoteButton;
