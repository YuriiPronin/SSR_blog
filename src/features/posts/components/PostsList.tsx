"use client";

import styled from "styled-components";
import { usePosts } from "../api/swr";
import PostCard from "./PostCard";
import { useAppSelector } from "@/store/hooks";
import PostSkeleton from "./PostSkeleton";

const List = styled.div` display: flex; flex-direction: column; gap: 12px; `;

export default function PostsList() {
  const { data, isLoading, error } = usePosts();
  const { q, tag, sort } = useAppSelector(s => s.filters);

  if (isLoading) {
    return (
      <List role="status" aria-live="polite">
        <PostSkeleton /><PostSkeleton /><PostSkeleton />
      </List>
    );
  }
  if (error) return <p role="alert">Помилка завантаження постів. Спробуйте оновити сторінку.</p>;
  if (!data) return <p>Поки що немає постів.</p>;

  const qlc = q.trim().toLowerCase();
  let items = data.filter(p => {
    const okQ = !qlc || p.title.toLowerCase().includes(qlc) || p.content.toLowerCase().includes(qlc);
    const okTag = !tag || (p.tags ?? []).includes(tag);
    return okQ && okTag;
  });

  items = [...items].sort((a, b) => sort === "oldest" ? a.createdAt - b.createdAt : b.createdAt - a.createdAt);

  if (items.length === 0) return <p>Нічого не знайдено за поточними фільтрами.</p>;

  return <List>{items.map(p => <PostCard key={p.id} post={p} />)}</List>;
}
