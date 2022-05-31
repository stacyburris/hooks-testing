import { useState, useEffect } from 'react';

const CACHE = {}; // cache for the last value of the useStaleRefresh hook

export default function useStaleRefresh(url, defaultValue = []) {
  const [data, setData] = useState(defaultValue); // data is the value of the hook
  const [isLoading, setIsLoading] = useState(true); // isLoading is true when the hook is loading

  useEffect(() => {
    // cacheID is how a chache is identified against a unique request
    const cacheID = url;
    // looks in the response and set a response if it is pres
    if (CACHE[cacheID] !== undefined) {
      setData(CACHE[cacheID]);
      setIsLoading(false);
    } else {
      // set loading to true
      setIsLoading(true);
      setData(defaultValue);
  }

  // fetch new data
  fetch(url)
    .then(res => res.json())
    .then(newData => {
      CACHE[cacheID] = newData;
      setData(newData);
      setIsLoading(false);
    });
  }, [url, defaultValue]);

  return [data, isLoading];

}