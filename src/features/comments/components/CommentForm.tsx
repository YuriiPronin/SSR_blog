"use client";

import styled from "styled-components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentFormSchema, type CommentFormValues } from "../model/schema";
import TextArea from "@/ui/TextArea";
import Button from "@/ui/Button";
import { useAppSelector } from "@/store/hooks";
import { commentsMutate } from "../api/swr";
import { useState } from "react";

const Wrap = styled.form`
  display: grid;
  gap: 8px;
  border-top: 1px solid #eee;
  padding-top: 12px;

  @media (min-width: 640px) {
    gap: 10px;
    padding-top: 14px;
  }
`;

const Row = styled.div`
  display: grid;
  gap: 6px;
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
`;

export default function CommentForm({ postId }: { postId: string }) {
  const { user } = useAppSelector((s) => s.auth);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: { text: "" },
  });

  async function onSubmit(values: CommentFormValues) {
    if (!user?.uid) {
      alert("Не авторизовано. Онови сторінку або зачекай анонімний логін.");
      return;
    }
    setSubmitting(true);
    try {
      await commentsMutate.add(postId, {
        postId,
        text: values.text.trim(),
        authorUid: user.uid,
        authorName: user.displayName ?? "Anon",
      });
      reset({ text: "" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Wrap onSubmit={handleSubmit(onSubmit)} noValidate>
      <Row>
        <Label htmlFor="comment">Коментар</Label>
        <TextArea
          id="comment"
          placeholder="Напишіть щось корисне…"
          {...register("text")}
        />
        {errors.text && <Error>{errors.text.message}</Error>}
      </Row>
      <Actions>
        <Button type="submit" disabled={submitting} aria-busy={submitting}>
          {submitting ? "Надсилаю…" : "Додати коментар"}
        </Button>
      </Actions>
    </Wrap>
  );
}
