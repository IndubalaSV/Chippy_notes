"use server";

import { getUser } from "@/auth/server";
import { handleError } from "@/lib/utils";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";

export const updateNoteAction = async (noteId: string, text: string) => {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("User not found");
    }
    await prisma.note.update({
      where: { id: noteId },
      data: { text },
    });
  } catch (error) {
    return handleError(error);
  }
};

export const createNoteAction = async (uuid: string) => {
  const user = await getUser();
  if (!user) {
    throw new Error("User not found");
  }
  try {
    await prisma.note.create({
      data: {
        id: uuid,
        authorId: user.id,
        text: "BLANK NOTE",
      },
    });
  } catch (error) {
    return handleError(error);
  }
};

export async function deleteNoteAction(noteId: string) {
  try {
    await prisma.note.delete({
      where: {
        id: noteId,
      },
    });

    // Revalidate the homepage to refresh the notes list
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error deleting note:", error);
    return {
      success: false,
      error: "Failed to delete note",
    };
  }
}

export const askAIAboutNotesAction = async (
  newQuestions: string[],
  responses: string[]
) => {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("You must be logged in to ask questions");
    }

    const notes = await prisma.note.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      select: { text: true },
    });

    if (notes.length === 0) {
      return "You don't have any notes yet";
    }

    const notesText = notes.map((note) => note.text).join("\n\n");

    const messages = [
      {
        role: "developer",
        contents: `You are a helpful assistant. You will be given a list of notes. Answer the question based on the notes.
        Make sure the answers are not verbose and speak succintly.
        Your responses should be formatted in clean, valid HTML with proper structure. Use tags like <p>, <strong>, and <em> when appropriate. Do not wrap the entire response in a single <p> tag unless it's a single paragraph.
        Render like this in JSX:
        <p dangerouslySetInnerHTML={{ __html: "YOUR RESPONSE" }} />
    
        Here are the user's notes:
        ${notesText}`,
      },
    ];

    for (let i = 0; i < newQuestions.length; i++) {
      messages.push({ role: "user", contents: newQuestions[i] });
      if (responses.length > 1) {
        messages.push({ role: "assistant", contents: responses[i] });
      }
    }

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// export async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.0-flash",
//     contents: `You are a helpful assistant. You will be given a list of notes. Answer the question based on the notes.
//     Make sure the answers are not verbose and speak succintly.
//     Your responses should be formatted in clean, valid HTML with proper structure. Use tags like <p>, <strong>, and <em> when appropriate. Do not wrap the entire response in a single <p> tag unless it's a single paragraph.
//     Render like this in JSX:
//     <p dangerouslySetInnerHTML={{ __html: "YOUR RESPONSE" }} />

//     Here are the user's notes:
//     notes`,
//   });
//   console.log(response.text);
// }
