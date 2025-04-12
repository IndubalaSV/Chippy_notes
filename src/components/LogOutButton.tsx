"use client";

import React from "react";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/actions/users";

function LogOutButton() {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const handleLogout = async () => {
    setLoading(true);
    const { errorMessage } = await logoutAction();
    if (errorMessage === null) {
      toast("Logged out", {
        description: "Logged out successfully",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      router.push("/");
    } else {
      toast.error("Logout failed");
      setLoading(false);
      return;
    }
    setLoading(false);
  };
  return (
    <Button onClick={handleLogout} disabled={loading}>
      {loading ? (
        <Loader className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <span>Log out</span>
      )}
    </Button>
  );
}

export default LogOutButton;
