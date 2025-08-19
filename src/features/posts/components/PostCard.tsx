"use client";

import styled from "styled-components";
import Link from "next/link";
import { Post } from "../model/types";
import { useAppDispatch } from "@/store/hooks";
import { setTag } from "@/store/slices/filtersSlice";
import { useCommentsCount } from "@/features/comments/api/swr";

const Card = styled.article`
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 16px;
  transition: transform 0.08s ease, box-shadow 0.12s ease,
    border-color 0.12s ease;
  &:hover,
  &:focus-within {
    border-color: #dcdcdc;
    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.06);
    transform: translateY(-1px);
  }
`;

const ClickArea = styled(Link)`
  display: block;
  color: inherit;
  text-decoration: none;
  outline: none;
  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.35);
    border-radius: 10px;
  }
  cursor: pointer;
`;

const Title = styled.h3`
  margin: 0 0 8px;
  font-size: 18px;
`;

const Meta = styled.div`
  font-size: 12px;
  opacity: 0.7;
  margin-bottom: 8px;
`;

const Excerpt = styled.p`
  margin: 0 0 8px;
`;

const Tags = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const TagBtn = styled.button`
  border: 1px solid #ddd;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 12px;
  background: #fff;
  cursor: pointer;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  opacity: 0.8;
`;
const Bubble = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #eee;
  background: #fafafa;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 12px;
`;

export default function PostCard({ post }: { post: Post }) {
  const date = new Date(post.createdAt).toLocaleString();
  const dispatch = useAppDispatch();
  const { data: count, isLoading } = useCommentsCount(post.id);

  return (
    <Card>
      <ClickArea
        href={`/posts/${post.id}`}
        aria-label={`Відкрити пост "${post.title}"`}
      >
        <Title>{post.title}</Title>
        <Meta>
          Автор: {post.authorName || "—"} • {date}
        </Meta>
        <Excerpt>
          {post.content.slice(0, 160)}
          {post.content.length > 160 ? "…" : ""}
        </Excerpt>

        <MetaRow>
          <Bubble aria-live="polite" title="Кількість коментарів">
            💬 {isLoading ? "—" : typeof count === "number" ? count : 0}
          </Bubble>
        </MetaRow>
      </ClickArea>

      {!!post.tags?.length && (
        <Tags>
          {post.tags.map((t) => (
            <TagBtn key={t} onClick={() => dispatch(setTag(t))}>
              #{t}
            </TagBtn>
          ))}
        </Tags>
      )}
    </Card>
  );
}
