"use client";

import { db } from "@/features/auth/initFirebaseClient";
import {
  collection, getDocs, orderBy, limit, query,
  addDoc, DocumentData, QueryDocumentSnapshot,
  doc, getDoc, updateDoc, deleteDoc,
} from "firebase/firestore";
import { Post, NewPost } from "../model/types";

const postsCol = collection(db, "posts");

type HasToMillis = { toMillis: () => number };
type MaybeTs = number | HasToMillis | null | undefined;

const toMs = (v: MaybeTs): number => {
  if (typeof v === "number") return v;
  if (v && "toMillis" in v && typeof v.toMillis === "function") return v.toMillis();
  return Date.now();
};

const toPost = (d: QueryDocumentSnapshot<DocumentData>): Post => {
  const data = d.data();
  const tags = Array.isArray(data.tags) ? (data.tags as string[]) : [];
  return {
    id: d.id,
    title: (data.title as string) ?? "",
    content: (data.content as string) ?? "",
    tags,
    authorUid: (data.authorUid as string) ?? "",
    authorName: (data.authorName as string) ?? "",
    createdAt: toMs(data.createdAt as MaybeTs),
    updatedAt: toMs(data.updatedAt as MaybeTs),
  };
};

export async function fetchPosts(): Promise<Post[]> {
  const q = query(postsCol, orderBy("createdAt", "desc"), limit(50));
  const snap = await getDocs(q);
  return snap.docs.map(toPost);
}

export async function createPost(payload: NewPost): Promise<string> {
  const now = Date.now();
  const ref = await addDoc(postsCol, {
    ...payload,
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}

export async function fetchPost(id: string) {
  const ref = doc(postsCol, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return toPost(snap as QueryDocumentSnapshot<DocumentData>);
}

export async function updatePost(id: string, patch: Partial<Pick<Post, "title" | "content" | "tags">>) {
  await updateDoc(doc(postsCol, id), { ...patch, updatedAt: Date.now() });
}

export async function deletePost(id: string) {
  await deleteDoc(doc(postsCol, id));
}

