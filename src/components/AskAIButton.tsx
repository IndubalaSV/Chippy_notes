"use client";

import { useRouter } from "next/navigation";
import React, { Fragment, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpIcon } from "lucide-react";
import { askAIAboutNotesAction } from "@/actions/notes";

type Props = {
  user: User;
};

export function AskAIButton({ user }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [questionText, setQuestionText] = useState<string>("");
  const [responses, setResponses] = useState<string[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const [isPending, startTransition] = React.useTransition();

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (questionText.trim() === "") return;
    const newQuestions = [...questions, questionText];
    setQuestions(newQuestions);
    setQuestionText("");
    setTimeout(scrollToBottom, 100);

    startTransition(async () => {
      const response = await askAIAboutNotesAction(newQuestions, responses);
      setResponses((prev) => [...prev, response]);

      setTimeout(scrollToBottom, 100);
    });
  };

  const handleInput = (): void => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleClickInput = (): void => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const scrollToBottom = (): void => {
    contentRef.current?.scrollTo({
      top: contentRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleOnOpenChange = (isOpen: boolean): void => {
    if (!user) {
      alert("Please log in to use this feature.");
      router.push("/login");
    } else {
      if (isOpen) {
        setQuestionText("");
        setResponses([]);
        setQuestions([]);
      }
      setOpen(isOpen);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Ask AI</Button>
      </DialogTrigger>
      <DialogContent className="flex h-[85vh] w-full max-w-4xl flex-col overflow-y-auto ">
        <DialogHeader>
          <DialogTitle>Ask AI</DialogTitle>
          <DialogDescription>Ask ai about your notes</DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-4">
          {questions.map((question, index) => (
            <Fragment key={index}>
              <p>{question}</p>
              {responses[index] && (
                <p
                  className="bot-response text-muted-foreground text-sm"
                  dangerouslySetInnerHTML={{
                    __html: responses[index],
                  }}
                />
              )}
            </Fragment>
          ))}
          {isPending && <p className="animate-pulse text-sm">Thinking...</p>}
        </div>

        <div
          className="mt-auto flex cursor-text rounded-lg border p-2 relative"
          onClick={handleClickInput}
        >
          <Textarea
            ref={textareaRef}
            placeholder="Ask AI about your notes"
            style={{
              minHeight: "0",
              lineHeight: "normal",
            }}
            rows={1}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="border-none resize-none focus:ring-1 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-primary/20"
          />
          <Button className="ml-auto size-6 rounded-full absolute right-2">
            <ArrowUpIcon className="text-background" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
