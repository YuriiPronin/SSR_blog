import { ssrFetchPost } from "@/features/posts/api/server";
import { SWRConfig } from "swr";
import PostView from "@/features/posts/components/PostView";
import Header from "@/app/_ui/Header";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PostPage({ params }: { params: { id: string } }) {
  const id = Array.isArray(params.id) ? params.id[0] : params.id?.trim();
  if (!id) return notFound();

  const post = await ssrFetchPost(id);
  if (!post) return notFound();

  return (
    <>
      <Header />
      <main style={{ maxWidth: 880, margin: "0 auto", padding: "24px 16px" }}>
        <SWRConfig value={{ fallback: { [`/posts/${id}`]: post } }}>
          <PostView postId={id} />
        </SWRConfig>
      </main>
    </>
  );
}
