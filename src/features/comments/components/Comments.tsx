"use client";

import styled from "styled-components";
import { useComments } from "../api/swr";
import CommentForm from "./CommentForm";

import { Skel, SkelRow } from "@/ui/Skeleton";

const Box = styled.section`
  margin-top: 20px;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 12px;

  @media (min-width: 640px) {
    padding: 16px;
  }
`;

const Title = styled.h3`
  margin: 0 0 10px;
  font-size: clamp(16px, 2.6vw, 18px);
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
`;

const Item = styled.li`
  border: 1px solid #f1f1f1;
  border-radius: 10px;
  padding: 10px;
`;

const Meta = styled.div`
  font-size: 12px;
  opacity: 0.7;
  margin-bottom: 6px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Body = styled.p`
  margin: 0;
  white-space: pre-wrap;
`;

export default function Comments({ postId }: { postId: string }) {
  const { data, isLoading, error } = useComments(postId);

  return (
    <Box>
      <Title>Коментарі</Title>
      {isLoading && (
        <div role="status" aria-live="polite">
          <SkelRow>
            <Skel />
            <Skel />
            <Skel />
          </SkelRow>
        </div>
      )}
      {error && <p>Помилка завантаження</p>}
      {!isLoading && !error && (
        <>
          {!data || data.length === 0 ? (
            <p style={{ opacity: 0.7 }}>
              Поки що немає коментарів. Будьте першим!
            </p>
          ) : (
            <List>
              {data.map((c) => {
                const date = new Date(c.createdAt).toLocaleString();
                return (
                  <Item key={c.id}>
                    <Meta>
                      <span>{c.authorName || "Anon"}</span>
                      <span>•</span>
                      <span>{date}</span>
                    </Meta>
                    <Body>{c.text}</Body>
                  </Item>
                );
              })}
            </List>
          )}
          <CommentForm postId={postId} />
        </>
      )}
    </Box>
  );
}
