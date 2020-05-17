import React from 'react';
import { useLayoutEffect, useState } from "react";
import './Scoreboard.css';
import useFetchAppDataScoreboard from './Hooks';
import {Link} from 'react-router-dom';
import GameStatus from './GameStatus';
//import { UpdateScore } from './UpdateScore';

//var fetchNeeded = true;

const ScoreboardTable = (props) => {

    //CONSTRUCTORS
    const [matchups, setMatchups] = useFetchAppDataScoreboard(props.league, props.sport, "scoreboard", "/site");
    const [isActive, setIsActive] = useState(true);
    const [buttonDisplay, setButtonDisplay] = useState("#5cb85c");
    const [buttonText, setButtonText] = useState("Get Live Scores");
    const [width] = useMediaQuery();
    let team1Record = '';
    let team2Record = '';
    var AwayRanking;
    var HomeRanking;    
    let intervalId = null;

    var tableData = matchups.map(matchup => {
        var array = []
        var homeTeam = getHomeTeam(matchup)
        var awayTeam = getAwayTeam(matchup)
        homeTeam.records !== undefined ? team1Record = homeTeam.records[0].summary : team1Record = "0-0"
        awayTeam.records !== undefined ? team2Record = awayTeam.records[0].summary : team2Record = "0-0"

        AwayRanking = includeRankings(props.league, matchup)[1]
        AwayRanking = includeRankings(props.league, matchup)[0]

        array.push(
            <span key={matchup.id} id="matchup">
                <table id="card-table">
                <tbody className="scoreboard">
                {awayTeamBox(matchup, AwayRanking, team1Record, props)}
                {homeTeamBox(matchup, HomeRanking, team2Record, props)}
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
        return array
    });

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
        newData.push(
            <div key="footer-btn">
                <br/><br/><br/>
            <div className="footer" style={{backgroundColor: buttonDisplay}}onClick={() => refetch(props.league, props.sport, "scoreboard", "/site")} href="#top">
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
        if (isActive) {
            setButtonDisplay("#d9534f");
            setButtonText("Disable Live Scores");
            retrieveData(league, sport, page, site);
            intervalId = setInterval(async () => {
                retrieveData(league, sport, page, site);
            }, 30000);
        }
        else {
            setButtonDisplay("#5cb85c");
            setButtonText("Get Live Scores");
            return () => clearInterval(intervalId);
        }        
        return () => clearInterval(intervalId);
    }

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

function awayTeamBox(matchup, AwayRanking, team1Record, props){
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
    {/* <UpdateScore sport={props.sport} league={props.league} index={1} refetch={fetchNeeded}/>
    {fetchNeeded = false} */}
    <td id="scoreboard-scores">{matchup.competitors[1].score}</td>
</tr>
}

function homeTeamBox(matchup, HomeRanking, team2Record, props){
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
        <td id="scoreboard-scores">{matchup.competitors[0].score}</td>
        {/* <UpdateScore sport={props.sport} league={props.league} index={0} refetch={fetchNeeded}/> */}
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

export default ScoreboardTable;