import { getUser } from "@/auth/server";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import SidebarGroupContent from "./SidebarGroupContent";
import Link from "next/link";
import { prisma } from "@/db/prisma";
import { Note } from "@prisma/client";

export async function AppSidebar() {
  const user = await getUser();

  let notes: Note[] = [];

  if (user) {
    notes = await prisma.note.findMany({
      where: {
        authorId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  return (
    <Sidebar>
      <SidebarContent className="overflow-y-scroll h-full">
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg space-y-2">
            {user ? (
              <span>Your notes</span>
            ) : (
              <p>
                <Link href="/login">Login</Link> to see your notes
              </p>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent notes={notes} />
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
    </Sidebar>
  );
}
