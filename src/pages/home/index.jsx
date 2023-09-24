import Globe from "../../components/globe";
import { useEffect, useState } from "react";
import { save, load } from "../../hooks/storage";
import styled from "styled-components";
import AdventureCards from "../../components/cards";
import { PrimaryButton } from "../../components/commonStyles/buttons";
import {
  MainHeading,
  SubHeading,
} from "../../components/commonStyles/headings";

const AccessContainer = styled.div`
  max-width: 300px;
  gap: 10px;
`;

const AccessInput = styled.input`
  background-color: #fff;
  border: 2px solid #fff;
  border-radius: 5px;
  color: #2c3e50;
  font-size: 1.2em;
  font-weight: 100;
  transition: all 0.3s ease-in;
  padding: 10px;
  width: 100%;
  &:focus {
    outline: none;
    background-color: #fff;
    border: 2px solid #ffb085;
  }
`;

export default function Home() {
  const [isCorrect, setIsCorrect] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const isLoggedIn = load("accessCode");
    if (isLoggedIn) {
      setIsCorrect(true);
    }
  }, []);

  const check = String.fromCharCode(51, 48, 48, 57, 49, 51);

  const handleSubmit = () => {
    if (inputValue === check) {
      setIsCorrect(true);
      save("accessCode", JSON.stringify(inputValue));
      setError("");
    } else {
      setError("Incorrect access code. Please try again.");
    }
  };

  return (
    <div>
      <div className="text-center pt-5">
        <MainHeading>Olivia og Haris</MainHeading>
        <SubHeading>PÅ EVENTYR</SubHeading>
      </div>
      <div className="globe fade-in">
        <Globe />
      </div>
      {!isCorrect ? (
        <AccessContainer className="d-flex flex-column justify-content-center w-75 mx-auto mt-4">
          <AccessInput
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Datoen vår (ddmmåå)"
          />
          <PrimaryButton onClick={handleSubmit}>ÅPNE</PrimaryButton>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </AccessContainer>
      ) : (
        <div>
          <AdventureCards />
        </div>
      )}
    </div>
  );
}
