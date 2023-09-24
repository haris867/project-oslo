import styled from "styled-components";

export const PrimaryButton = styled.button`
  background-color: #ffb085;
  border: none;
  border-radius: 5px;
  color: #2c3e50;
  transition: all 0.3s ease-in;
  font-size: 1.2em;
  font-weight: 100;
  padding: 10px;
  width: 100%;
  min-width: 110px;
  max-width: 180px;
  &:focus {
    outline: none;
  }
  &:hover {
    background-color: #2c3e50;
    color: #fae5d3;
  }
`;

export const SecondaryButton = styled(PrimaryButton)`
  background-color: transparent;
  color: var(--color-secondary);
  border: 2px solid var(--color-secondary);
`;
