"use server";

import { getUser } from "@/auth/server";
import { handleError } from "@/lib/utils";
import { prisma } from "../../prisma/prisma";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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

    type NoteWithText = {
      text: string;
    };

    const notes = await prisma.note.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      select: { text: true },
    });

    if (notes.length === 0) {
      return { response: "You don't have any notes yet", errorMessage: null };
    }

    const notesText = notes.map((note: NoteWithText) => note.text).join("\n\n");
    const latestQuestion = newQuestions[newQuestions.length - 1];

    // Create the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare the prompt with context from previous Q&A
    let chatHistory = "";
    for (let i = 0; i < newQuestions.length - 1; i++) {
      if (responses[i]) {
        chatHistory += `User: ${newQuestions[i]}\nAssistant: ${responses[i]}\n\n`;
      }
    }

    const prompt = `
    You are a helpful assistant. You will be given a list of notes. Answer the question based on the notes.
    Make sure the answers are not verbose and speak succinctly.
    Your responses should be formatted in clean, valid HTML with proper structure. Use tags like <p>, <strong>, and <em> when appropriate. Do not wrap the entire response in a single <p> tag unless it's a single paragraph.
    
    IMPORTANT: If the user asks for a quiz, follow these formatting guidelines:
    1. Format each question with a number, followed by the question text in <strong> tags
    2. List each answer option with a bullet point
    3. Include the correct answer at the end of each question, marked as "Answer: [correct option]"
    4. Separate questions with <hr> tags for better readability

    For non-quiz responses, use clean, valid HTML with proper structure. Use tags like <p>, <strong>, and <em> when appropriate.
    
    Here are the user's notes:
    ${notesText}
    
    ${chatHistory ? "Previous conversation:\n" + chatHistory : ""}
    
    User's question: ${latestQuestion}
    `;

    // Generate the response
    const result = await model.generateContent(prompt);
    let response = result.response.text();

    // Remove Markdown code block syntax if still present
    response = response.replace(/```html|```/g, "").trim();

    return {
      response: response,
      errorMessage: null,
    };
  } catch (error) {
    console.error("Error asking AI about notes:", error);
    return {
      response: null,
      errorMessage:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};
