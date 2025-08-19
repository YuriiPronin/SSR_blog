import { ssrFetchPost } from "@/features/posts/api/server";
import { SWRConfig } from "swr";
import PostView from "@/features/posts/components/PostView";
import Header from "@/app/_ui/Header";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = { id: string };

export default async function PostPage(
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;
  const safeId = id?.trim();
  if (!safeId) return notFound();

  const post = await ssrFetchPost(safeId);
  if (!post) return notFound();

  return (
    <>
      <Header />
      <main style={{ maxWidth: 880, margin: "0 auto", padding: "24px 16px" }}>
        <SWRConfig value={{ fallback: { [`/posts/${safeId}`]: post } }}>
          <PostView postId={safeId} />
        </SWRConfig>
      </main>
    </>
  );
}
