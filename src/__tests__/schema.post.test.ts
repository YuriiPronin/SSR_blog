import { postFormSchema } from "@/features/posts/model/schema";
import { commentFormSchema } from "@/features/comments/model/schema";
import { describe, it, expect } from "vitest";

describe("postFormSchema", () => {
  it("passes with valid data", () => {
    const ok = postFormSchema.safeParse({
      title: "Valid title",
      content: "long enough content here",
      tagsCsv: "react, nextjs",
    });
    expect(ok.success).toBe(true);
  });

  it("fails on short title/content", () => {
    const bad = postFormSchema.safeParse({
      title: "hi",
      content: "short",
      tagsCsv: "",
    });
    expect(bad.success).toBe(false);
  });
});

describe("commentFormSchema", () => {
  it("requires min length", () => {
    const ok = commentFormSchema.safeParse({ text: "ok" });
    const bad = commentFormSchema.safeParse({ text: "" });
    expect(ok.success).toBe(true);
    expect(bad.success).toBe(false);
  });
});
