import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { load } from "../storage";

export default function useAuthentication() {
  const navigate = useNavigate();
  const isLoggedIn = load("accessCode");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);
}
