import "./App.css";
import "./styles/scss/styles.scss";
import { Routes, Route } from "react-router-dom";
import { Home, Adventure } from "./pages";
import Layout from "./components/layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/adventure/:id" element={<Adventure />} />
      </Route>
    </Routes>
  );
}

export default App;
