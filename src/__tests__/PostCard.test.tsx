import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import PostCard from "@/features/posts/components/PostCard";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import filters from "@/store/slices/filtersSlice";
import auth from "@/store/slices/authSlice";
import { Post } from "@/features/posts/model/types";

function setupStore() {
  return configureStore({ reducer: { filters, auth } });
}

const post: Post = {
  id: "p1",
  title: "Test title",
  content: "Some content that is long enough",
  tags: ["react", "nextjs"],
  authorUid: "u1",
  authorName: "Anon",
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

describe("PostCard", () => {
  it("renders title and sets tag on click", async () => {
    const store = setupStore();
    render(
      <Provider store={store}>
        <PostCard post={post} />
      </Provider>
    );

    expect(screen.getByText("Test title")).toBeInTheDocument();

    const tagBtn = screen.getByRole("button", { name: /#react/i });
    await userEvent.click(tagBtn);

    const state = store.getState().filters;
    expect(state.tag).toBe("react");
  });
});
