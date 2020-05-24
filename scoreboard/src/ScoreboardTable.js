import React from 'react';
import { useLayoutEffect, useState, useEffect } from "react";
import './Scoreboard.css';
import useFetchAppDataScoreboard from './Hooks';
import {Link} from 'react-router-dom';
import GameStatus from './GameStatus';

let intervalId = null;
localStorage.clear();
const ScoreboardTable = (props) => {

    //CONSTRUCTORS
    const [matchups, setMatchups] = useFetchAppDataScoreboard(props.league, props.sport, "scoreboard", "/site");
    const [isActive, setIsActive] = useState(true);
    const [buttonDisplay, setButtonDisplay] = useState("#5cb85c");
    const [buttonText, setButtonText] = useState("Get Live Scores");
    const [width] = useMediaQuery();
    const [initialRender, setInitialRender] = useState(true);
    let team1Record = '';
    let team2Record = '';
    var AwayRanking;
    var HomeRanking;                    

    var tableData = matchups.map(matchup => {
        var array = [];        
        var homeTeam = getHomeTeam(matchup)
        var awayTeam = getAwayTeam(matchup)
        homeTeam.records !== undefined ? team1Record = homeTeam.records[0].summary : team1Record = "0-0"
        awayTeam.records !== undefined ? team2Record = awayTeam.records[0].summary : team2Record = "0-0"

        AwayRanking = includeRankings(props.league, matchup)[1]
        AwayRanking = includeRankings(props.league, matchup)[0]       

        array.push(
            <span key={matchup.uid} id="matchup">
                <table id="card-table">
                <tbody className="scoreboard">
                {awayTeamBox(matchup, AwayRanking, team1Record, props, initialRender)}
                {homeTeamBox(matchup, HomeRanking, team2Record, props, initialRender)}
                <tr id="status">
                    <td colSpan="3"><GameStatus league={props.league} period={matchup.status.period} matchup={matchup} completed={matchup.status.type.completed}/></td>
                </tr>
                </tbody>
                </table>
                <h5 colSpan="3">
                    {matchup.venue.fullName.includes("(" || ")") ? <a href={openToVenue(matchup)} target="_blank" rel="noopener noreferrer" id="venue">{matchup.venue.fullName}</a> : <a href={openToVenue(matchup)} target="_blank" rel="noopener noreferrer" id="venue">{matchup.venue.fullName} {returnVenueLocation(matchup)}</a>}
                </h5>
                <br/>
            </span>  
        );
        saveState(matchup.uid, [matchup.competitors[0].score, matchup.competitors[1].score]);
                     
        return array
    });

    var newData = []
    if (width > 769) {
        newData.push(
            <div key="desktop-live-btn" style={{backgroundColor: buttonDisplay}} className="btn btn-success desktop-live-btn" onClick={() => refetch(props.league, props.sport, "scoreboard", "/site")}>
                {buttonText}
            </div>
        );
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
        newData.push(
            <div key="footer-btn">
                <br/><br/><br/>
            <div className="footer" style={{backgroundColor: buttonDisplay}} onClick={() => refetch(props.league, props.sport, "scoreboard", "/site")} href="#top">
                {buttonText}
            </div>
            </div>
        )
    }

    async function retrieveData(league, sport, page, site) {
        const URL_API = `http://site.api.espn.com/apis${site}/v2/sports/${sport}/${league}/${page}`;
        let response = await fetch(URL_API)
        let json = await response.json();
        setMatchups(loadScoreboard(json));
    }

    function refetch(league, sport, page, site) {        
        setIsActive(!isActive);
        setInitialRender(!initialRender);       
        if (isActive) {            
            setButtonDisplay("#d9534f");
            setButtonText("Disable Live Scores");
            retrieveData(league, sport, page, site);                      
            intervalId = setInterval(async () => {
                retrieveData(league, sport, page, site);
            }, 30000);
            saveState(intervalId.toString(), intervalId);
        }
        else {
            setButtonDisplay("#5cb85c");
            setButtonText("Get Live Scores");
            clearInterval(intervalId);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isActive){
                console.log("Live fetching timed out due to inactivity. Button will be reset.");
                setButtonDisplay("#5cb85c");
                setButtonText("Get Live Scores");
                for (var i = 1; i <= Number(intervalId); i++){
                    clearInterval(loadState(i.toString()));
                    localStorage.removeItem(i.toString());
                }                
                if (document.hasFocus()){
                    alert("Live fetching timed out due to inactivity. Button will be reset.");
                }
            }
        }, 900000);
        return () => clearTimeout(timer);
    }, [isActive]);

    return (
        <span> 
            {newData}
        </span>
    )
};

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

//HELPER FUNCTIONS TO BUILD HTML
function includeRankings(league, matchup){
    if (league.includes('college')){
                    
        var AwayRanking = matchup.competitors[1].curatedRank.current
        var  HomeRanking = matchup.competitors[0].curatedRank.current
        if (HomeRanking > 25 || HomeRanking===0){
            HomeRanking=''
        }
        if (AwayRanking > 25 || AwayRanking===0){
            AwayRanking=''
        }
    }
    return [HomeRanking, AwayRanking]
}

function awayTeamBox(matchup, AwayRanking, team1Record, props, initialRender){
    let previousScore;
    if (initialRender === false) {
        previousScore = loadState(matchup.uid)[1];
    }
    else {
        previousScore = matchup.competitors[1].score;
    }
    return <tr>
    <td id="scoreboard-logo"><img id="thumb" alt="" src={matchup.competitors[1].team.logo}/></td>
    {matchup.competitors[1].winner === true ? 
    <td id="scoreboard-teams">
        <b>
            <Link to={`/${props.sport}/${props.league}/${matchup.competitors[1].team.id}`}>
                {AwayRanking} {matchup.competitors[1].team.displayName + " "} 
            </Link>    
            <span id="record">
                ({team1Record})
            </span>
        </b>
    </td>: 
    <td id="scoreboard-teams">
        <Link to={`/${props.sport}/${props.league}/${matchup.competitors[1].team.id}`}>
            {awayTeamBox} {matchup.competitors[1].team.displayName + " "} 
        </Link>
        <span id="record">
            ({team1Record})
        </span>
    </td>}
    <td id="scoreboard-scores" style={previousScore !== matchup.competitors[1].score && matchup.status.type.state === "in" ? {animation: "fadeMe 1s 2"}: {backgroundColor: "lightgrey"}}>{matchup.competitors[1].score}</td>
</tr>
}

function homeTeamBox(matchup, HomeRanking, team2Record, props, initialRender){
    let previousScore;
    if (initialRender === false) {
        previousScore = loadState(matchup.uid)[0];
    }
    else {
        previousScore = matchup.competitors[0].score;
    }
    return <tr>
        <td id="scoreboard-logo"><img id="thumb" alt="" src={matchup.competitors[0].team.logo}/></td>
        {matchup.competitors[0].winner === true ? 
        <td id="scoreboard-teams">
            <b>
                <Link to={`${props.sport}/${props.league}/${matchup.competitors[0].team.id}`}>
                    {HomeRanking} {matchup.competitors[0].team.displayName + " "} 
                </Link>    
                <span id="record">
                    ({team2Record})
                </span>
            </b>
        </td>: 
        <td id="scoreboard-teams">
            <Link to={`${props.sport}/${props.league}/${matchup.competitors[0].team.id}`}>
                {HomeRanking} {matchup.competitors[0].team.displayName + " "} 
            </Link>
            <span id="record">
                ({team2Record})
            </span>
        </td>}
        <td id="scoreboard-scores" style={previousScore !== matchup.competitors[0].score && matchup.status.type.state === "in" ? {animation: "fadeMe 1s 2"}: {backgroundColor: "lightgrey"}}>{matchup.competitors[0].score}</td>
    </tr>
}

function getHomeTeam(matchup){
    return matchup.competitors[1]
}

function getAwayTeam(matchup){
    return matchup.competitors[0]
}

function openToVenue(matchup){
    if (matchup.venue.address.city !== undefined && matchup.venue.address.state !== undefined) {
        return "https://www.google.com/maps/search/?api=1&query=" + matchup.venue.fullName + " " + matchup.venue.address.city + " " + matchup.venue.address.state;
    }
    else {
        return "https://www.google.com/maps/search/?api=1&query=" + matchup.venue.fullName
    }
}

function returnVenueLocation(matchup){
    if (matchup.venue.address.city !== undefined && matchup.venue.address.state !== undefined) {
        return "(" + matchup.venue.address.city + ", " + matchup.venue.address.state + ")";
    }
    else 
    {
        return "";
    }
}

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

function loadState (key) {
    try {
        const serializedState = localStorage.getItem(key);
        if(serializedState === null){
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

function saveState(key, value) {
    try{
        const serializedState = JSON.stringify(value);
        localStorage.setItem(`${key}`, serializedState);
    } catch (err){
        return undefined;
    }
}
export default ScoreboardTable;