"use client";

import { db } from "@/features/auth/initFirebaseClient";
import {
  collection, query, orderBy, limit, getDocs, addDoc,
  type DocumentData, type QueryDocumentSnapshot,
  getCountFromServer,
} from "firebase/firestore";
import type { Comment, NewComment } from "../model/types";

type HasToMillis = { toMillis: () => number };
type MaybeTs = number | HasToMillis | null | undefined;
const toMs = (v: MaybeTs): number => {
  if (typeof v === "number") return v;
  if (v && "toMillis" in v && typeof v.toMillis === "function") return v.toMillis();
  return Date.now();
};

const toComment = (d: QueryDocumentSnapshot<DocumentData>, postId: string): Comment => {
  const data = d.data();
  return {
    id: d.id,
    postId,
    text: (data.text as string) ?? "",
    authorUid: (data.authorUid as string) ?? "",
    authorName: (data.authorName as string) ?? "",
    createdAt: toMs(data.createdAt as MaybeTs),
  };
};

export async function fetchComments(postId: string): Promise<Comment[]> {
  const col = collection(db, `posts/${postId}/comments`);
  const q = query(col, orderBy("createdAt", "asc"), limit(200));
  const snap = await getDocs(q);
  return snap.docs.map(d => toComment(d, postId));
}

export async function createComment(postId: string, payload: NewComment): Promise<string> {
  const col = collection(db, `posts/${postId}/comments`);
  const now = Date.now();
  const ref = await addDoc(col, { ...payload, createdAt: now });
  return ref.id;
}

export async function fetchCommentsCount(postId: string): Promise<number> {
  const col = collection(db, `posts/${postId}/comments`);
  const snap = await getCountFromServer(col);
  return snap.data().count;
}
