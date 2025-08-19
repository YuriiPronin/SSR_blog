import Header from "./_ui/Header";
import { ssrFetchPosts } from "@/features/posts/api/server";
import { SWRConfig } from "swr";
import PostsList from "@/features/posts/components/PostsList";
import PostForm from "@/features/posts/components/PostForm";

export default async function Page() {
  const initial = await ssrFetchPosts();
  return (
    <>
      <Header />
      <main style={{ maxWidth: 880, margin: "0 auto", padding: "24px 16px" }}>
        <PostForm />
        <SWRConfig value={{ fallback: { "/posts": initial } }}>
          <PostsList />
        </SWRConfig>
      </main>
    </>
  );
}
