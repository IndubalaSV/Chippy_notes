"use client";

import { useEffect, useState, useMemo } from "react";
import { Note } from "@prisma/client";
import { SidebarGroupContent as SidebarGroupContentShadCN } from "./ui/sidebar";
import { Delete, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Fuse from "fuse.js";
import DeleteNoteButton from "./DeleteNoteButton";

type Props = {
  notes: Note[];
};

function SidebarGroupContent({ notes }: Props) {
  // const router = useRouter();
  const [searchText, setSearchText] = useState<string>("");
  const [localNotes, setLocalNotes] = useState<Note[]>(notes);

  // Update local notes when props change
  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  const fuse = useMemo(
    () =>
      new Fuse(localNotes, {
        keys: ["text"],
        threshold: 0.4,
      }),
    [localNotes]
  );

  const filteredNotes = searchText
    ? fuse.search(searchText).map((item) => item.item)
    : localNotes;

  // Callback function to update local state after deletion
  const handleDeleteSuccess = (noteId: string) => {
    setLocalNotes((prev) => prev.filter((note) => note.id !== noteId));
  };

  return (
    <SidebarGroupContentShadCN>
      <div className="relative flex items-center space-x-2 mb-4 mt-4">
        <SearchIcon className="h-4 w-4 text-muted-foreground absolute" />
        <Input
          value={searchText}
          placeholder="Search your notes.."
          className="border-none pl-8"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <SidebarMenu>
        {filteredNotes.map((item) => (
          <SidebarMenuItem
            key={item.id}
            className="flex items-center justify-between"
          >
            <SidebarMenuButton asChild>
              <a
                href={`/?noteId=${item.id}`}
                className="w-full overflow-hidden truncate text-ellipsis"
              >
                <span>{item.text}</span>
              </a>
            </SidebarMenuButton>
            <DeleteNoteButton
              noteId={item.id}
              onDeleteSuccess={() => handleDeleteSuccess(item.id)}
            >
              <Delete />
            </DeleteNoteButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContentShadCN>
  );
}

export default SidebarGroupContent;
