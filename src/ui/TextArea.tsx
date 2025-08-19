"use client";
import styled from "styled-components";

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 10px 12px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  resize: vertical;
  &:focus { border-color: #999; }
`;
export default TextArea;
