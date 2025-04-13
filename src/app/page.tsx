import { getUser } from "@/auth/server";
import { AskAIButton } from "@/components/AskAIButton";
import { NewNoteButton } from "@/components/NewNoteButton";
import { NoteTextInput } from "@/components/NoteTextInput";
import { prisma } from "@/db/prisma";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: Props) {
  const user = await getUser();
  const noteIdParam = (await searchParams).noteId;
  const noteId = Array.isArray(noteIdParam)
    ? noteIdParam[0]
    : noteIdParam || "";

  const note = await prisma.note.findUnique({
    where: {
      id: noteId,
      authorId: user?.id,
    },
  });

  return (
    <div className="flex flex-col h-screen w-full items-center gap-4">
      <div className="flex w-full max-w-4xl justify-end gap-2">
        {user && <AskAIButton user={user} />}
        {user && <NewNoteButton user={user} />}
      </div>

      <NoteTextInput noteId={noteId} startingNoteText={note?.text || ""} />
    </div>
  );
}
