export interface Comment {
  id: string;
  postId: string;
  text: string;
  authorUid: string;
  authorName: string;
  createdAt: number;
}

export type NewComment = Omit<Comment, "id" | "createdAt">;
