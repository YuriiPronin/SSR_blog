"use client";
import { Skel, SkelCard, SkelRow } from "@/ui/Skeleton";

export default function PostSkeleton() {
  return (
    <SkelCard aria-busy="true" aria-label="Завантаження поста">
      <Skel h={20} />
      <SkelRow>
        <Skel />
        <Skel />
      </SkelRow>
      <Skel h={12} />
    </SkelCard>
  );
}
