import { useState } from "react";
import { accessToken } from "../../../utils/constants";

export default function useSendData() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  async function sendData(data, url, method) {
    var result;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const options = {
      headers,
      method: method.toUpperCase(),
      body: JSON.stringify(data),
    };

    try {
      setIsLoading(true);
      setIsError(false);

      const response = await fetch(url, options);

      result = await response.json();
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }

    return result;
  }

  return { sendData, isLoading, isError };
}
