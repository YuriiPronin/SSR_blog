import { describe, it, expect, vi } from "vitest";
import type { Post } from "@/features/posts/model/types";

const h = vi.hoisted(() => {
  return {
    addDoc: vi.fn(
      async (_col: { path: string }, doc: Record<string, unknown>) =>
        ({ id: "newid", _doc: doc })
    ),
    collection: vi.fn(
      (_db: unknown, path: string) => ({ path })
    ),
  };
});


vi.mock("@/features/auth/initFirebaseClient", () => ({
  db: {} as unknown,
}));


vi.mock("firebase/firestore", async () => {
  const actual = await vi.importActual<typeof import("firebase/firestore")>("firebase/firestore");
  return {
    ...actual,
    addDoc: h.addDoc,
    collection: h.collection,
  };
});


import { createPost } from "@/features/posts/api/client";

describe("createPost", () => {
  it("adds createdAt/updatedAt and forwards payload", async () => {
    const payload: Pick<Post, "title" | "content" | "tags" | "authorUid" | "authorName"> = {
      title: "Hello",
      content: "World content",
      tags: ["react"],
      authorUid: "u1",
      authorName: "Anon",
    };

    const id = await createPost(payload);
    expect(id).toBe("newid");

    expect(h.collection).toHaveBeenCalled();
    const [, path] = h.collection.mock.calls[0] as [unknown, string];
    expect(path).toBe("posts");

    expect(h.addDoc).toHaveBeenCalledTimes(1);
    const [, sentDoc] = h.addDoc.mock.calls[0] as [{ path: string }, Record<string, unknown>];

    expect(sentDoc).toMatchObject(payload);
    expect(typeof sentDoc.createdAt).toBe("number");
    expect(typeof sentDoc.updatedAt).toBe("number");
  });
});
