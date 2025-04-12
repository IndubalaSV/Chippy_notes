import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/provider/ModeToggle";
import LogOutButton from "./LogOutButton";
import { getUser } from "@/auth/server";

async function Header() {
  const user = await getUser();
  return (
    <header className="relative flex h-24 w-full items-center justify-between bg-popover px-3 sm:px-8 shadow-lg shadow-blue-500/50">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/chippy.png"
          alt="Chippy"
          width={60}
          height={60}
          className="rounded-full"
          priority
        />
        <h1 className="flex flex-col text-xl font-bold text-blue-500 dark:text-blue-400 leading-6">
          Chippy <span>notes</span>
        </h1>
      </Link>
      <div className="flex gap-4">
        {user ? (
          <LogOutButton />
        ) : (
          <>
            <Button asChild className="hidden sm:block">
              <Link href="/signup">Sign up</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          </>
        )}
        <ModeToggle />
      </div>
    </header>
  );
}

export default Header;
