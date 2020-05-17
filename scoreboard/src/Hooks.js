import { useEffect, useState, useRef } from 'react';
import React from 'react';

export default function useFetchAppDataScoreboard(league, sport, page, site) {
    const [matchups, setMatchups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isLoading===true){
            async function fetchData() {
                const URL_API = `http://site.api.espn.com/apis${site}/v2/sports/${sport}/${league}/${page}`;
                let response = await fetch(URL_API)
                let json = await response.json();
                if (page === "scoreboard") {
                  setMatchups(matchups => matchups.concat(loadScoreboard(json)));
                }               
                else {
                  setMatchups(matchups => matchups.concat(loadStandings(json)));
                }
            }
            fetchData();
            setIsLoading(false);
        }
    }, [isLoading, setMatchups, sport, league, page, site])

    return matchups;
}

function loadScoreboard(json) {
  let events = json.events;
  var games = [];
  for (var i = 0; i < events.length; i++) {
      for (var j = 0; j < events[i].competitions.length; j++) {
          games.push(events[i].competitions[j]);
      }
  }
  return games;
}

function loadStandings(json) {
  return json.children;
}

export function usePersistedState(key, defaultValue) {
  const [state, setState] = React.useState(
    JSON.parse(localStorage.getItem(key)) || defaultValue
  );
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
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

  