
import "@testing-library/jest-dom";
import React, { type AnchorHTMLAttributes, type ReactNode } from "react";
import { vi } from "vitest";

type NextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children?: ReactNode;
};

vi.mock("next/link", () => {
  const Link = ({ href, children, ...props }: NextLinkProps) =>
    React.createElement("a", { href, ...props }, children);
  return { default: Link };
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    prefetch: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}));
