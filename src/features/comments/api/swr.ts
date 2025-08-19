"use client";

import useSWR, { mutate } from "swr";
import { fetchComments, createComment, fetchCommentsCount } from "./client";
import type { Comment, NewComment } from "../model/types";


export function useComments(postId?: string) {
  const key = postId ? `/posts/${postId}/comments` : null;
  return useSWR<Comment[]>(key, () => fetchComments(postId!), { revalidateOnFocus: false });
}

export const commentsMutate = {
  async add(postId: string, payload: NewComment) {
    const key = `/posts/${postId}/comments`;
    const optimistic: Comment = {
      id: "temp",
      postId,
      text: payload.text,
      authorUid: payload.authorUid,
      authorName: payload.authorName,
      createdAt: Date.now(),
    };

    await mutate(
      key,
      async (current = []) => {
        await createComment(postId, payload);
        await mutate(`/posts/${postId}/comments/count`, (c?: number) => (typeof c === "number" ? c + 1 : 1), false);
        return fetchComments(postId);
      },
      { optimisticData: (current?: Comment[]) => ([...(current ?? []), optimistic]),
        rollbackOnError: true, revalidate: false }
    );
  },
};

export function useCommentsCount(postId?: string) {
  return useSWR<number>(
    postId ? `/posts/${postId}/comments/count` : null,
    () => fetchCommentsCount(postId!)
  );
}
