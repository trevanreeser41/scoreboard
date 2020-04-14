import { useEffect, useState, useRef } from 'react';

export default function useFetchAppDataScoreboard(league, sport) {
    const [matchups, setMatchups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isLoading===true){
            async function fetchData() {
                const URL_API = `http://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/scoreboard`;
                let response = await fetch(URL_API)
                //console.log(response)
                let json = await response.json();
                let events = json.events;
                var games = [];
                for (var i = 0; i < events.length; i++) {
                    for (var j = 0; j < events[i].competitions.length; j++) {
                        games.push(events[i].competitions[j]);
                    }
                }
                setMatchups(matchups => matchups.concat(games))
            }
            fetchData()
            setIsLoading(false)
        }
    }, [isLoading, setMatchups, sport, league])

    return matchups;
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

