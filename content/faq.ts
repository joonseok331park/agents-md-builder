import type { FaqItem } from "@/lib/types";

export const homeFaqItems: FaqItem[] = [
  {
    question: "Does AGENTS.md Builder use AI to generate the file?",
    answer: "No. The file is assembled from local preset data, form input, and deterministic string-building logic in your browser.",
  },
  {
    question: "Does it scan my repository?",
    answer: "No. You enter project details manually and the builder never reads your repository automatically.",
  },
  {
    question: "Will my draft survive a refresh?",
    answer: "Yes. The current draft is saved to localStorage and restored in the same browser unless you clear it.",
  },
  {
    question: "Can I download the result directly as AGENTS.md?",
    answer: "Yes. The download action always saves the file as `AGENTS.md`.",
  },
];

export const guideFaqItems: FaqItem[] = [
  {
    question: "What should an AGENTS.md file contain?",
    answer: "A strong AGENTS.md explains project purpose, hard constraints, setup and verification commands, code conventions, safety rules, Git workflow rules, and architecture notes.",
  },
  {
    question: "Why use presets instead of a blank editor?",
    answer: "Presets reduce omissions. They seed realistic commands, forbidden actions, and stack-specific guidance so you are editing a strong draft instead of starting from zero.",
  },
  {
    question: "Why does the lint panel warn about vague language?",
    answer: "Phrases like “do the right thing” do not constrain coding agents. Clear, imperative guidance is easier for agents to follow consistently.",
  },
];
