"use client";
import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

export const Skel = styled.div<{ h?: number }>`
  border-radius: 8px;
  height: ${({ h }) => (h ? `${h}px` : "14px")};
  background: #eee;
  background-image: linear-gradient(90deg, #eee 0, #f5f5f5 40%, #eee 80%);
  background-size: 400px 100%;
  animation: ${shimmer} 1.2s infinite linear;
`;

export const SkelRow = styled.div`
  display: grid;
  gap: 8px;
`;

export const SkelCard = styled.div`
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 16px;
  display: grid;
  gap: 10px;
  @media (min-width: 640px) {
    padding: 20px;
    gap: 12px;
  }
`;
