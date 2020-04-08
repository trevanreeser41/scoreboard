import { useEffect, useState } from 'react';
// import {Link} from 'react-router-dom';
// import { UpdateScore } from './UpdateScore';
//import React from 'react';


export default function useFetchAppDataScoreboard(league, sport) {
    const [matchups, setMatchups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isLoading===true){
            async function fetchData() {
                const URL_API = `http://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/scoreboard`;
                let response = await fetch(URL_API)
                console.log(response)
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

