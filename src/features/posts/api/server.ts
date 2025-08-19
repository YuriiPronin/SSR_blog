import { adminDb } from "@/features/auth/initFirebaseAdmin";
import type { DocumentData, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { Post } from "../model/types";

type HasToMillis = { toMillis: () => number };
type MaybeTs = number | HasToMillis | null | undefined;

const toMs = (v: MaybeTs): number => {
  if (typeof v === "number") return v;
  if (v && typeof (v as HasToMillis).toMillis === "function") {
    return (v as HasToMillis).toMillis();
  }
  return Date.now();
};

const normalize = (doc: QueryDocumentSnapshot<DocumentData>): Post => {
  const data = doc.data();
  const tags = Array.isArray(data.tags) ? (data.tags as string[]) : [];
  return {
    id: doc.id,
    title: typeof data.title === "string" ? data.title : "",
    content: typeof data.content === "string" ? data.content : "",
    tags,
    authorUid: typeof data.authorUid === "string" ? data.authorUid : "",
    authorName: typeof data.authorName === "string" ? data.authorName : "",
    createdAt: toMs(data.createdAt as MaybeTs),
    updatedAt: toMs(data.updatedAt as MaybeTs),
  };
};

export async function ssrFetchPosts(): Promise<Post[]> {
  const snap = await adminDb
    .collection("posts")
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  return snap.docs.map(normalize);
}

export async function ssrFetchPost(id: string): Promise<Post | null> {
  const doc = await adminDb.collection("posts").doc(id).get();
  if (!doc.exists) return null;

  const data = doc.data() as DocumentData | undefined;
  if (!data) return null;

  const tags = Array.isArray(data.tags) ? (data.tags as string[]) : [];
  return {
    id: doc.id,
    title: typeof data.title === "string" ? data.title : "",
    content: typeof data.content === "string" ? data.content : "",
    tags,
    authorUid: typeof data.authorUid === "string" ? data.authorUid : "",
    authorName: typeof data.authorName === "string" ? data.authorName : "",
    createdAt: toMs(data.createdAt as MaybeTs),
    updatedAt: toMs(data.updatedAt as MaybeTs),
  };
}
