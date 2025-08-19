"use client";

import useSWR, { mutate } from "swr";
import { fetchPosts, fetchPost, updatePost, deletePost } from "./client";
import { Post } from "../model/types";

export function usePosts() {
  return useSWR<Post[]>("/posts", fetchPosts, { revalidateOnFocus: false });
}

export function usePost(id?: string) {
  return useSWR<Post | null>(id ? `/posts/${id}` : null, () => fetchPost(id!));
}

export const postsMutate = {
  async update(id: string, patch: Partial<Pick<Post, "title" | "content" | "tags">>) {
    await updatePost(id, patch);
    await Promise.all([mutate(`/posts/${id}`), mutate("/posts")]);
  },
  async remove(id: string) {
    await deletePost(id);
    await Promise.all([
      mutate("/posts"),
      mutate(`/posts/${id}`, null, { revalidate: false })
    ]);
  }
};
