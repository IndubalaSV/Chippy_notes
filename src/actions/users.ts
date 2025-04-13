"use server";

import { createClient } from "@/auth/server";
import { prisma } from "../../prisma/prisma";
import { handleError } from "@/lib/utils";

export const loginAction = async (email: string, password: string) => {
  const { auth } = await createClient();
  const { error } = await auth.signInWithPassword({ email, password });
  if (error) {
    return handleError(error);
  }
  return { errorMessage: null };
};

// signupAction

export const signupAction = async (email: string, password: string) => {
  try {
    const { auth } = await createClient();
    const { data, error } = await auth.signUp({ email, password });
    if (error) throw error;

    const userId = data.user?.id;
    if (!userId) {
      return { errorMessage: "Error signing up" };
    }

    //create user in db
    await prisma.user.create({
      data: {
        id: userId,
        email,
      },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const logoutAction = async () => {
  const { auth } = await createClient();
  const { error } = await auth.signOut();
  if (error) {
    return handleError(error);
  }
  return { errorMessage: null };
};
