"use client";

import styled from "styled-components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postFormSchema, type PostFormValues } from "../model/schema";
import Input from "@/ui/Input";
import TextArea from "@/ui/TextArea";
import Button from "@/ui/Button";
import { postsMutate } from "../api/swr";
import type { Post } from "../model/types";
import { useState } from "react";

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

export default function EditPostForm({
  post,
  onDone,
}: {
  post: Post;
  onDone: () => void;
}) {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: post.title,
      content: post.content,
      tagsCsv: (post.tags ?? []).join(", "),
    },
  });

  async function onSubmit(v: PostFormValues) {
    setSaving(true);
    try {
      const tags = v.tagsCsv
        ? v.tagsCsv
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];
      await postsMutate.update(post.id, {
        title: v.title,
        content: v.content,
        tags,
      });
      onDone();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid>
        <Row className="half">
          <Label htmlFor="title">Заголовок</Label>
          <Input id="title" {...register("title")} />
          {errors.title && <Error>{errors.title.message}</Error>}
        </Row>
        <Row className="half">
          <Label htmlFor="tagsCsv">Теги (через кому)</Label>
          <Input id="tagsCsv" {...register("tagsCsv")} />
        </Row>
        <Row>
          <Label htmlFor="content">Контент</Label>
          <TextArea id="content" {...register("content")} />
          {errors.content && <Error>{errors.content.message}</Error>}
        </Row>
      </Grid>
      <Actions>
        <Button type="button" onClick={onDone}>
          Скасувати
        </Button>
        <Button type="submit" disabled={saving} aria-busy={saving}>
          {saving ? "Збереження…" : "Зберегти"}
        </Button>
      </Actions>
    </form>
  );
}
