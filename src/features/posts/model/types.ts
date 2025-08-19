export interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[];
  authorUid: string;
  authorName: string;
  createdAt: number;
  updatedAt: number;
}

export type NewPost = Omit<Post, "id" | "createdAt" | "updatedAt">;
