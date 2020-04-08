import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
// import { UpdateScore } from './UpdateScore';
import React from 'react';


export default function useFetchAppDataScoreboard(league, sport) {
    const URL_API = "http://site.api.espn.com/apis/site/v2/sports/";
    const[matchups, setMatchups] = useState([]);
    const[isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isLoading===true){
            async function fetchData() {
                let response = await fetch(URL_API+`${sport}/${league}/scoreboard`)
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
    }, [isLoading, setMatchups])

    return matchups;
}

