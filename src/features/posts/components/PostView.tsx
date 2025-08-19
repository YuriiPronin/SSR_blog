"use client";

import styled from "styled-components";
import { usePost } from "../api/swr";
import Comments from "@/features/comments/components/Comments";
import Button from "@/ui/Button";
import { useAppSelector } from "@/store/hooks";
import EditPostForm from "./EditPostForm";
import { postsMutate } from "../api/swr";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Skel, SkelRow, SkelCard } from "@/ui/Skeleton";
import Link from "next/link";

const Wrap = styled.article`
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 16px;
  @media (min-width: 640px) {
    padding: 20px;
  }
`;
const BackBar = styled.div`
  margin-bottom: 12px;
`;
const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #eee;
  border-radius: 999px;
  padding: 6px 10px;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.12s ease, transform 0.08s ease,
    box-shadow 0.12s ease;
  &:hover {
    background: #fafafa;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transform: translateY(-1px);
  }
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.35);
  }
`;
const Title = styled.h1`
  margin: 0 0 8px;
  font-size: clamp(22px, 4vw, 30px);
  line-height: 1.2;
`;
const Meta = styled.div`
  font-size: 12px;
  opacity: 0.7;
  margin-bottom: 14px;
`;
const Body = styled.div`
  font-size: clamp(15px, 2.3vw, 16px);
  line-height: 1.6;
  white-space: pre-wrap;
`;
const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;
const Tag = styled.span`
  border: 1px solid #ddd;
  border-radius: 999px;
  padding: 2px 10px;
  font-size: 12px;
`;
const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

export default function PostView({ postId }: { postId: string }) {
  const { data, isLoading, error } = usePost(postId);
  const { user } = useAppSelector((s) => s.auth);
  const [editing, setEditing] = useState(false);
  const router = useRouter();

  if (isLoading) return <p>Завантаження…</p>;
  if (error) return <p>Помилка завантаження</p>;
  if (!data) return <p>Пост не знайдено</p>;

   const post = data as NonNullable<typeof data>;

  if (isLoading) {
    return (
      <SkelCard aria-busy="true">
        <Skel h={28} />
        <Skel h={12} />
        <SkelRow>
          <Skel />
          <Skel />
          <Skel />
        </SkelRow>
      </SkelCard>
    );
  }
  if (error) return <p role="alert">Помилка завантаження поста.</p>;

  const date = new Date(data.createdAt).toLocaleString();
  const isAuthor = user?.uid && user.uid === data.authorUid;

  async function onDelete() {
    if (!isAuthor) return;
    if (confirm("Видалити пост? Це дію не можна скасувати.")) {
      await postsMutate.remove(post.id);
      router.push("/");
    }
  }

  return (
    <Wrap>
      {isAuthor && !editing && (
        <Actions>
          <Button type="button" onClick={() => setEditing(true)}>
            Редагувати
          </Button>
          <Button type="button" onClick={onDelete}>
            Видалити
          </Button>
        </Actions>
      )}

      <BackBar>
        <BackLink href="/">← До списку</BackLink>
      </BackBar>

      <Title>{data.title}</Title>
      <Meta>
        Автор: {data.authorName || "—"} • {date}
      </Meta>

      {editing ? (
        <EditPostForm post={data} onDone={() => setEditing(false)} />
      ) : (
        <>
          <Body>{data.content}</Body>
          {!!data.tags?.length && (
            <Tags>
              {data.tags.map((t) => (
                <Tag key={t}>#{t}</Tag>
              ))}
            </Tags>
          )}
        </>
      )}

      <Comments postId={data.id} />
    </Wrap>
  );
}
