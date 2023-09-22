import styled from "styled-components";

const MainHeading = styled.h1`
  font-family: "Princess Sofia", sans-serif;
  font-size: 3em;
`;
const SubHeading = styled.h2`
  font-size: 2.8em;
`;

export default function Header() {
  return (
    <header>
      <div className="text-center pt-5">
        <MainHeading>Haris og Olivia</MainHeading>
        <SubHeading>PÅ EVENTYR</SubHeading>
      </div>
    </header>
  );
}
