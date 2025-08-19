"use client";

import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setQ, setSort, setTag } from "@/store/slices/filtersSlice";

const Bar = styled.header`
  display: flex; gap: 12px; align-items: center;
  padding: 16px; border-bottom: 1px solid #eaeaea; flex-wrap: wrap;
`;
const Title = styled.h1` margin: 0; font-size: 20px; font-weight: 700; `;
const Grow = styled.div` flex: 1; min-width: 220px; `;
const Input = styled.input`
  width: 100%; padding: 10px 12px; border: 1px solid #dcdcdc; border-radius: 8px; font-size: 14px; outline: none;
  &:focus { border-color: #999; }
`;
const Select = styled.select`
  padding: 10px 12px; border: 1px solid #dcdcdc; border-radius: 8px; font-size: 14px; background: white;
`;
const TagPill = styled.button`
  border: 1px solid #ddd; background: #fafafa; border-radius: 999px; padding: 6px 10px; font-size: 12px; cursor: pointer;
`;

export default function Header() {
  const dispatch = useAppDispatch();
  const { q, sort, tag } = useAppSelector(s => s.filters);

  return (
    <Bar>
      <Title>SSR Blog</Title>
      <Grow>
        <Input
          placeholder="Пошук по заголовку/контенту…"
          value={q}
          onChange={(e) => dispatch(setQ(e.target.value))}
        />
      </Grow>
      <Select
        value={sort}
        onChange={(e) => dispatch(setSort(e.target.value as "newest" | "oldest"))}
      >
        <option value="newest">Новіші</option>
        <option value="oldest">Старіші</option>
      </Select>
      {tag && (
        <TagPill onClick={() => dispatch(setTag(null))}>
          #{tag} ×
        </TagPill>
      )}
    </Bar>
  );
}
