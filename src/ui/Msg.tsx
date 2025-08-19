"use client";
import styled from "styled-components";

const Box = styled.div<{ tone?: "info" | "error" | "empty" }>`
  border: 1px solid
    ${({ tone }) => tone === "error" ? "#ffd4d4" : tone === "empty" ? "#eee" : "#d7eaff"};
  background:
    ${({ tone }) => tone === "error" ? "#fff5f5" : tone === "empty" ? "#fafafa" : "#f7fbff"};
  color: #333;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
`;

export function MsgInfo({ children }: { children: React.ReactNode }) {
  return <Box tone="info">{children}</Box>;
}
export function MsgError({ children }: { children: React.ReactNode }) {
  return <Box tone="error" role="alert">{children}</Box>;
}
export function MsgEmpty({ children }: { children: React.ReactNode }) {
  return <Box tone="empty">{children}</Box>;
}
