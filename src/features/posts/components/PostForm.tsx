"use client";

import styled from "styled-components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postFormSchema, type PostFormValues } from "../model/schema";
import Input from "@/ui/Input";
import TextArea from "@/ui/TextArea";
import Button from "@/ui/Button";
import { useAppSelector } from "@/store/hooks";
import { createPost } from "../api/client";
import { mutate } from "swr";
import { useState } from "react";

const Card = styled.section`
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  @media (min-width: 640px) {
    padding: 20px;
    margin-bottom: 20px;
  }
`;
const Title = styled.h2`
  margin: 0 0 12px;
  font-size: clamp(18px, 2.5vw, 22px);
  font-weight: 700;
`;
const Grid = styled.div`
  display: grid;
  gap: 12px;
  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
`;
const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  grid-column: 1 / -1;
  @media (min-width: 640px) {
    &.half {
      grid-column: span 1;
    }
  }
`;

const Label = styled.label`
  font-size: 13px;
  opacity: 0.8;
`;
const Error = styled.span`
  color: #c00;
  font-size: 12px;
`;
const Actions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 8px;
`;

export default function PostForm() {
  const { user } = useAppSelector((s) => s.auth);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: { title: "", content: "", tagsCsv: "" },
  });

  async function onSubmit(values: PostFormValues) {
    if (!user?.uid) {
      alert("Не авторизовано. Онови сторінку або зачекай анонімний логін.");
      return;
    }
    setSubmitting(true);
    try {
      const tags = values.tagsCsv
        ? values.tagsCsv
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      await createPost({
        title: values.title,
        content: values.content,
        tags,
        authorUid: user.uid,
        authorName: user.displayName ?? "Anon",
      });

      reset({ title: "", content: "", tagsCsv: "" });
      (document.getElementById("title") as HTMLInputElement | null)?.focus();
      await mutate("/posts");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card aria-label="Створити пост">
      <Title>Новий пост</Title>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid>
          <Row className="half">
            <Label htmlFor="title">Заголовок</Label>
            <Input
              id="title"
              placeholder="Напр. Мій перший пост"
              {...register("title")}
            />
            {errors.title && <Error>{errors.title.message}</Error>}
          </Row>

          <Row className="half">
            <Label htmlFor="tagsCsv">Теги (через кому)</Label>
            <Input
              id="tagsCsv"
              placeholder="react, nextjs, firestore"
              {...register("tagsCsv")}
            />
          </Row>

          <Row>
            <Label htmlFor="content">Контент</Label>
            <TextArea
              id="content"
              placeholder="Текст поста…"
              {...register("content")}
            />
            {errors.content && <Error>{errors.content.message}</Error>}
          </Row>
        </Grid>

        <Actions>
          <Button type="submit" disabled={submitting} aria-busy={submitting}>
            {submitting ? "Збереження…" : "Створити"}
          </Button>
        </Actions>
      </form>
    </Card>
  );
}
