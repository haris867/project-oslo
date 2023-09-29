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
import { AiOutlineArrowUp } from "react-icons/ai";
import { ScrollToTop } from "../../utils/helpers";

const AccessContainer = styled.div`
  max-width: 300px;
  gap: 10px;
`;

export const AccessInput = styled.input`
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
    ScrollToTop();
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
      <div className="home-headings text-center pt-5">
        <MainHeading>Olivia og Haris</MainHeading>
        <SubHeading>PÅ EVENTYR</SubHeading>
      </div>
      <div className="globe fade-in">
        <Globe />
      </div>
      {!isCorrect ? (
        <>
          <div className="fade-in love-letter-container mx-auto">
            <h3 className="princess-sofia">Til min kjære Olivia</h3>
            <p>
              Ti år har flydd forbi, og i løpet av det siste tiåret har vi skapt
              utallige minner sammen. Hver ferie, hvert eventyr, hver
              latterkrampe – de har alle gjort livet mitt verdt å leve. For ti
              år siden, innså jeg at livet mitt aldri ville være det samme. Og
              jeg hadde rett.
            </p>
            <p>
              Din kjærlighet, din latter, din skjønnhet og ditt nærvær har
              påvirket meg på måter som ord ikke kan beskrive. Du er så morsom,
              sterk, kjærlig, hardtarbeidende, og ditt nærvær lyser opp mine
              mørkeste dager. Selv om det ikke alltid virker sånn.
            </p>
            <p>
              Når jeg tenker på fremtiden, ser jeg oss utforske verden sammen,
              hånd i hånd. Vi skal bo i Barcelona, blant annet, og vi skal reise
              jorden rundt (flere ganger). Likevel er det ingenting som gleder
              meg mer enn å vite at jeg kan legge meg inntil deg og bli spoonet
              hver eneste kveld. Det er uvurdelig og jeg er så stolt av det vi
              er. Med deg så ser fremtiden lys ut, og det er ingenting vakrere
              enn det.
            </p>
            <p>
              Selv som alle våre reiser og eventyr har vært helt fantastiske, er
              det ingenting sammenlignet med vår reise sammen. Vi har vokst så
              mye, sammen og hver for oss. Vi har opplevd det verste sammen, men
              også det beste. Det er ikke noe jeg kan si som forklarer hvor
              takknemlig jeg er for deg. Og jeg kan ikke vente med å se hva vi
              blir.
            </p>
            <p>
              Det er på tide at vi kan dokumentere alle våre eventyr sammen, for
              det begynner å bli ganske mange. Derfor har jeg laget dette - et
              sted vi kan se tilbake på alle våre eventyr, og alle våre minner.
              Uansett når og hvor vi er.
            </p>
            <p>Jeg elsker deg over alt på jord.</p>
            <p>Deg og meg, for alltid.</p>
            <p>Uansett hva.</p>
            <h3 className="princess-sofia">For alltid din, Haris</h3>
          </div>
          <AccessContainer className="fade-in d-flex flex-column justify-content-center w-75 mx-auto mt-4">
            <AccessInput
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Datoen vår (ddmmåå)"
            />
            <PrimaryButton className="mx-auto" onClick={handleSubmit}>
              ÅPNE
            </PrimaryButton>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </AccessContainer>
        </>
      ) : (
        <div className="fade-in">
          <AdventureCards />
          <h1 className="text-center">
            <a href="#top" className="scroll-arrow">
              <AiOutlineArrowUp />
            </a>
          </h1>
        </div>
      )}
    </div>
  );
}
