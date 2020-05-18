import React from 'react';
import { useLayoutEffect, useState } from "react";
import './Standings.css';
import useFetchAppDataScoreboard from './Hooks';
import {Link} from 'react-router-dom';

const Standings = (props) => {

    //Constructor
    // eslint-disable-next-line
    const [divisions, setDivisions] = useFetchAppDataScoreboard(props.league, props.sport, props.page, "");
    const [width] = useMediaQuery();

    var tableData = divisions.map(division => {
        var array = [];
        array.push(
            <span key={division.uid} id="standings-card-table">
                <table>
                <thead>
                    {generateHeading(division, width, props)}
                </thead>
                <tbody className="scoreboard">
                    {generateTeamBox(division, width, props)}
                </tbody>
                </table>
                <br/>
            </span>
        )   
        return array
    })

    var newData = []
    if (width > 769) {
        for (let index = 0; index < tableData.length; index=index+3) {
            newData.push(
                <div key={props.league + index.toString()} className="flexcontainer">                        
                    {tableData[index]}
                    {tableData[index+1]}
                    {tableData[index+2]}
                </div>
            )
        }
    }
    else {
        for (let index = 0; index < tableData.length; index++) {
            newData.push(
                <div key={props.league + index.toString()} className="flexcontainer-mobile">
                    {tableData[index]}
                </div>
            )
        }
    }
    return (
        <span> 
            {newData}
        </span>
    )
};

//HELPER FUNCTIONS TO BUILD HTML

function generateHeading(division, width, props) {
    if (props.sport === "soccer") {
        return soccerTeamHeading(division, width);
    }
    else {
        return teamHeading(division, width);
    }
}

function soccerTeamHeading(division, width) {
    return <tr style={{border: "solid 2.5px grey", fontSize: "3vh"}}>
        <th id={width > 769 ? "scores" : "scores-mobile"} style={{backgroundColor: "#428bca"}} colSpan="2">{division.name}</th>
        <th id={width > 769 ? "scores" : "scores-mobile"} style={{backgroundColor: "#428bca"}}>W</th>
        <th id={width > 769 ? "scores" : "scores-mobile"} style={{backgroundColor: "#428bca"}}>D</th>
        <th id={width > 769 ? "scores" : "scores-mobile"} style={{backgroundColor: "#428bca"}}>L</th>
    </tr>
}

function teamHeading(division, width) {
    return <tr style={{border: "solid 2.5px grey", fontSize: "3vh"}}>
        <th id={width > 769 ? "scores" : "scores-mobile"} style={{backgroundColor: "#428bca"}} colSpan="2">{division.name}</th>
        <th id={width > 769 ? "scores" : "scores-mobile"} style={{backgroundColor: "#428bca"}}>W</th>
        <th id={width > 769 ? "scores" : "scores-mobile"} style={{backgroundColor: "#428bca"}}>L</th>
        <th id={width > 769 ? "scores" : "scores-mobile"} style={{backgroundColor: "#428bca"}}>STRK</th>
    </tr>
}

function generateTeamBox(division, width, props){
    let entries = [];
    for (var e = 0; e < division.standings.entries.length; e++) {
      entries.push(division.standings.entries[e]);
    }    
    var teams = [];
    if (props.sport === "soccer") {
        entries.sort((a, b) => (Number(a.stats[8].displayValue) > Number(b.stats[8].displayValue)) ? 1 : -1)
        for (var t = 0; t < entries.length; t++){
            teams.push(soccerTeamBox(entries[t], width));
        };
    }
    else if (props.league !== undefined) {
        entries.sort((a, b) => (Number(a.stats[0].displayValue) > Number(b.stats[0].displayValue)) ? 1 : -1)
        let streak = {"nfl": 9, "nba": 8, "nhl": 7, "mlb": 15}
        for (var u = 0; u < entries.length; u++){
            teams.push(teamBox(entries[u], width, streak[`${props.league}`]));
        };
    }
    else {
        return <tr>No Data Available</tr>
    }
    return teams;
}

function teamBox (entries, width, index) {
    return <tr key={entries.team.id}>
        <td id="scores-mobile" style={{backgroundColor: "#A9A9A9"}}><b>{entries.stats[0].displayValue}</b></td>
        <td id="standings-logo"><img id="thumb" alt="" src={entries.team.logos[0].href} style={{marginRight: "0.5em"}}/>
            <Link to={`${entries.team.id}`}>
                <b>{width > 769 ? entries.team.displayName : entries.team.shortDisplayName}</b>
            </Link>
        </td>
        <td id="scores-mobile">{entries.stats[1].displayValue}</td>
        <td id="scores-mobile">{entries.stats[2].displayValue}</td>
        <td id="scores-mobile">{entries.stats[index].displayValue}</td>
    </tr>
}

function soccerTeamBox (entries, width) {
    return <tr key={entries.team.id}>
    <td id="scores-mobile" style={{backgroundColor: "#A9A9A9"}}><b>{entries.stats[8].displayValue}</b></td>
    <td id="standings-logo"><img id="thumb" alt="" src={entries.team.logos[0].href} style={{marginRight: "0.5em"}}/>
        <Link to={`${entries.team.id}`}>
            <b>{width > 769 ? entries.team.displayName : entries.team.shortDisplayName}</b>
        </Link>
    </td>
    <td id="scores-mobile">{entries.stats[0].displayValue}</td>
    <td id="scores-mobile">{entries.stats[2].displayValue}</td>
    <td id="scores-mobile">{entries.stats[1].displayValue}</td>
    </tr>
};

function useMediaQuery() {
    const [screenSize, setScreenSize] = useState([0, 0]);
    
    useLayoutEffect(() => {
      function updateScreenSize() {
        setScreenSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener("resize", updateScreenSize);
      updateScreenSize();
      return () => window.removeEventListener("resize", updateScreenSize);
    }, []);
    
    return screenSize;
  }  

export default Standings;
