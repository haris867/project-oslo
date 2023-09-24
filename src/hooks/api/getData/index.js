import { useState, useEffect } from "react";
import { load, save } from "../../storage";

export default function useGetData(url) {
  const [data, setData] = useState([]);
  const [isFetchLoading, setIsFetchLoading] = useState(false);
  const [isFetchError, setIsFetchError] = useState(false);

  useEffect(() => {
    async function getData() {
      try {
        const cachedData = load(url);
        if (cachedData) {
          setData(cachedData);
        } else {
          setIsFetchLoading(true);
          setIsFetchError(false);
          const fetchedData = await fetch(url);
          const json = await fetchedData.json();
          const result = json.result;
          save(url, result);
          setData(result);
        }
      } catch (error) {
        setIsFetchError(true);
      } finally {
        setIsFetchLoading(false);
      }
    }
    getData();
  }, [url]);
  return { data, isFetchLoading, isFetchError };
}
