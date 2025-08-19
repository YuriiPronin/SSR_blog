import reducer, {
  setQ,
  setTag,
  setSort,
  reset,
} from "@/store/slices/filtersSlice";
import { describe, it, expect } from "vitest";

describe("filtersSlice", () => {
  it("has sensible initial state", () => {
    const s = reducer(undefined, { type: "@@init" });
    expect(s).toEqual({ q: "", tag: null, sort: "newest" });
  });

  it("updates fields", () => {
    let s = reducer(undefined, setQ("hello"));
    s = reducer(s, setTag("react"));
    s = reducer(s, setSort("oldest"));
    expect(s).toEqual({ q: "hello", tag: "react", sort: "oldest" });
  });

  it("resets", () => {
    const s = reducer({ q: "x", tag: "t", sort: "oldest" }, reset());
    expect(s).toEqual({ q: "", tag: null, sort: "newest" });
  });
});
