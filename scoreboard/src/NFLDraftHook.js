import { useEffect, useState, useRef } from 'react';

export default function useFetchAppDataNFLDraft() {
    const [draftInfo, setDraftInfo] = useState(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isLoading===true){
            async function fetchData() {
                const URL_API = ` http://site.api.espn.com/apis/site/v2/sports/football/nfl/draft`;
                let response = await fetch(URL_API)
                let json = await response.json();
                setDraftInfo(json)
            }
            fetchData()
            setIsLoading(false)
        }
    }, [isLoading, draftInfo, setDraftInfo])

    return draftInfo;
}

export function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }


