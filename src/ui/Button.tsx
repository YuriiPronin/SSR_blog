"use client";
import styled from "styled-components";

const Button = styled.button`
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #ddd;
  background: #111;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  &:disabled { opacity: .6; cursor: not-allowed; }
`;
export default Button;
