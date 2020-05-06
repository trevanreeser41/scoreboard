import React from 'react';
import { useLayoutEffect, useState } from "react";
import './Scoreboard.css';
import useFetchAppDataScoreboard from './Hooks';
import {Link} from 'react-router-dom';

const ScoreboardTable = (props) => {

    //CONSTRUCTORS
    const matchups = useFetchAppDataScoreboard(props.league, props.sport)
    const [width] = useMediaQuery();
    let status = '';
    let team1Record = '';
    let team2Record = '';
    var AwayRanking;
    var HomeRanking;

    var tableData = matchups.map(matchup => {
        var array = []
        var homeTeam = getHomeTeam(matchup)
        var awayTeam = getAwayTeam(matchup)
        homeTeam.records !== undefined ? team1Record = homeTeam.records[0].summary : team1Record = "0-0"
        awayTeam.records !== undefined ? team2Record = awayTeam.records[0].summary : team2Record = "0-0"
        

        AwayRanking = includeRankings(props.league, matchup)[1]
        AwayRanking = includeRankings(props.league, matchup)[0]
        status = intoOT(matchup.status.type.completed, matchup.status.period, props.league, matchup)

        array.push(
            <span key={matchup.id} id="matchup">
                <table className="card-table">
                <tbody className="scoreboard">
                {awayTeamBox(matchup, AwayRanking, team1Record, props)}
                {homeTeamBox(matchup, HomeRanking, team2Record, props)}
                <tr id="status">
                    <td colSpan="3">{status}</td>
                </tr>
                </tbody>
                </table>
                <h5 colSpan="3">
                    {matchup.venue.fullName.includes("(" || ")") ? <a href={openToVenue(matchup)} target="_blank" rel="noopener noreferrer" id="venue">{matchup.venue.fullName}</a> : <a href={openToVenue(matchup)} target="_blank" rel="noopener noreferrer" id="venue">{matchup.venue.fullName} {returnVenueLocation(matchup)}</a>}
                </h5>
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

function intoOT(completed, period, league, matchup){
    var OT;
    if (league === "college-football"){
        OT=5
    }
    else if (league=== "nba"){
        OT=5
    }
    else if (league=== "mens-college-basketball"){
        OT=3
    }
    else if (league=== "nfl"){
        OT=5
    }
    else if (league=== "mlb"){
        OT=10
    }
    else if (league=== "nhl"){
        OT=4
    }
    if (completed === true) {
        if (period === OT) {
            return <b>FINAL/OT</b>
        }
        else if (matchup.status.period > OT){
            if (league === 'mlb'){
                return <b>FINAL/{period} innings</b>
            }
            else{
                let overtime_period = period - (OT-1)
                return <b>FINAL/{overtime_period}OT</b>
            }
        }
        else {
            return <b>FINAL</b>
        }
    }
    else if (period < OT && period > 0) {
        if(league !== 'mlb'){
            return <span>Q{period} - {matchup.status.displayClock}</span>
        }
        else {
            return matchup.status.type.detail //once games are live, figure out where innings are displayed in the response
        }
    } 
    else if (period === 0) {
        return matchup.status.type.detail
    } else {
        
    }
}

function awayTeamBox(matchup, AwayRanking, team1Record, props){
    return <tr>
    <td id="logo"><img id="thumb" alt="" src={matchup.competitors[1].team.logo}/></td>
    {matchup.competitors[1].winner === true ? 
    <td id="teams">
        <b>
            <Link to={`/${props.sport}/${props.league}/${getTeamIdentifier(props.league, matchup.competitors[1].team)}`}>
                {AwayRanking} {matchup.competitors[1].team.displayName + " "} 
            </Link>    
            <span id="record">
                ({team1Record})
            </span>
        </b>
    </td>: 
    <td id="teams">
        <Link to={`/${props.sport}/${props.league}/${getTeamIdentifier(props.league,matchup.competitors[1].team)}`}>
            {awayTeamBox} {matchup.competitors[1].team.displayName + " "} 
        </Link>
        <span id="record">
            ({team1Record})
        </span>
    </td>}
    <td id="scores">{matchup.competitors[1].score}</td>
</tr>

}

function homeTeamBox(matchup, HomeRanking, team2Record, props){
    return <tr>
        <td id="logo"><img id="thumb" alt="" src={matchup.competitors[0].team.logo}/></td>
        {matchup.competitors[0].winner === true ? 
        <td id="teams">
            <b>
                <Link to={`${props.sport}/${props.league}/${getTeamIdentifier(props.league, matchup.competitors[0].team)}`}>
                    {HomeRanking} {matchup.competitors[0].team.displayName + " "} 
                </Link>    
                <span id="record">
                    ({team2Record})
                </span>
            </b>
        </td>: 
        <td id="teams">
            <Link to={`${props.sport}/${props.league}/${getTeamIdentifier(props.league,matchup.competitors[0].team)}`}>
                {HomeRanking} {matchup.competitors[0].team.displayName + " "} 
            </Link>
            <span id="record">
                ({team2Record})
            </span>
        </td>}
        <td id="scores">{matchup.competitors[0].score}</td>
    </tr>
}


function getHomeTeam(matchup){
    return matchup.competitors[1]
}

function getAwayTeam(matchup){
    return matchup.competitors[0]
}

function getTeamIdentifier(league, team) {
    if (league === 'college-football' && team.location.indexOf(' ') <= 0) {
        let teamName = team.location.replace("'", "").replace("&", "").replace("\"", "").replace(/ /g, "");
        return teamName;
    }
    else if (league === 'mens-college-basketball') {
        let teamName = team.location.replace("'", "").replace("&", "").replace("\"", "").replace(/ /g, "").replace("State", "St");
        return teamName;
    }
    else {
        return team.abbreviation;
    }
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