import React /*,{ useState }*/ from 'react';
import './Scoreboard.css';
import useFetchAppDataScoreboard from './Hooks';
//import ScoreboardHTML from './Hooks';
import {Link} from 'react-router-dom';



export default function Scoreboardtable(props){

    //CONSTRUCTORS
    const matchups = useFetchAppDataScoreboard(props.league, props.sport)
    //const [homeScores, setHomeScores] =useState([])
    //const [awayScores, setAwayScores] =useState([])
    
    let tableData = []
    let status = '';
    let team1Record = '';
    let team2Record = '';
    var AwayRanking;
    var HomeRanking;


    matchups.map(matchup => {
        var matchup = matchup
        var homeTeam = getHomeTeam(matchup)
        var awayTeam = getAwayTeam(matchup)
        homeTeam.records !== undefined ? team1Record = homeTeam.records[0].summary : team1Record = "0-0"
        awayTeam.records !== undefined ? team2Record = awayTeam.records[0].summary : team2Record = "0-0"
        

        AwayRanking = includeRankings(props.league, matchup)[1]
        AwayRanking = includeRankings(props.league, matchup)[0]
        status = intoOT(matchup.status.type.completed, matchup.status.period, props.league, matchup)

        let location = openToVenue(matchup)

        tableData.push(
            <span>
            <tbody className="scoreboard">
            {homeTeamBox(matchup, AwayRanking, team1Record, props)}
            {awayTeamBox(matchup, HomeRanking, team2Record, props )}
            <tr>
                <td colSpan="3">{status}</td>
            </tr>
            </tbody>
            <tfoot>
                <td colSpan="3">
                    {matchup.venue.fullName.includes("(" || ")") ? <a href={location} target="_blank" rel="noopener noreferrer" id="venue">{matchup.venue.fullName}</a> : <a href={location} target="_blank" rel="noopener noreferrer" id="venue">{matchup.venue.fullName} ({matchup.venue.address.city}, {matchup.venue.address.state})</a>}
                </td>
            </tfoot>
            <br/>
            <br/>
            </span>
        )   
    })

    var newData = []
    for (let index = 0; index < tableData.length; index=index+3) {
        newData.push(
            <div class="flexcontainer">
                <table className="card-table">
                    {tableData[index]}
                </table>
                <table className="card-table">
                    {tableData[index+1]}
                </table>
                <table className="card-table">
                    {tableData[index+2]}
                </table>
            </div>
        )
    }

    return (
        <div class=""> 
            {newData}
        </div>
    )
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
            return <tr id="status"><strong>FINAL/OT</strong></tr>
        }
        else if (matchup.status.period > OT){
            if (league === 'mlb'){
                return <tr id="status"><strong>FINAL/{period} innings</strong></tr>
            }
            else{
                let overtime_period = period - (OT-1)
                return <tr id="status"><strong>FINAL/{overtime_period}OT</strong></tr>
            }
        }
        else {
            return <tr id="status"><strong>FINAL</strong></tr>
        }
    }
    else if (period < OT && period > 0) {
        return <tr id="status"><strong>Q{period} - {matchup.status.displayClock}</strong></tr>
    } 
    else if (period === 0) {
        return <tr id="status">{matchup.status.type.detail}</tr>
    } else {
        
    }
}

function homeTeamBox(matchup, AwayRanking, team1Record, props){
    return <tr>
    <td id="logo"><img id="thumb" alt="" src={matchup.competitors[1].team.logo}/></td>
    {matchup.competitors[1].winner === true ? 
    <td id="teams">
        <strong>
            <Link to={`sports/${props.sport}/${props.league}/teams/${getTeamIdentifier(props.league, matchup.competitors[1].team)}/schedule`}>
                {AwayRanking} {matchup.competitors[1].team.displayName + " "} 
            </Link>    
            <span id="record">
                ({team1Record})
            </span>
        </strong>
    </td>: 
    <td id="teams">
        <Link to={`sports/${props.sport}/${props.league}/teams/${getTeamIdentifier(props.league,matchup.competitors[1].team)}/schedule`}>
            {awayTeamBox} {matchup.competitors[1].team.displayName + " "} 
        </Link>
        <span id="record">
            ({team1Record})
        </span>
    </td>}
    {/*/////THIS NEED TO BE FIXED***********************************************************/}
    {/* <UpdateScore index={x} teamIndex={0} sport={this.state.sport} league={this.state.league} scores={this.state.awayScores}/> */}
</tr>

}

function awayTeamBox(matchup, HomeRanking, team2Record, props){
    return <tr>
        <td id="logo"><img id="thumb" alt="" src={matchup.competitors[0].team.logo}/></td>
        {matchup.competitors[0].winner === true ? 
        <td id="teams">
            <strong>
                <Link to={`sports/${props.sport}/${props.league}/teams/${getTeamIdentifier(props.league, matchup.competitors[0].team)}/schedule`}>
                    {HomeRanking} {matchup.competitors[0].team.displayName + " "} 
                </Link>    
                <span id="record">
                    ({team2Record})
                </span>
            </strong>
        </td>: 
        <td id="teams">
            <Link to={`sports/${props.sport}/${props.league}/teams/${getTeamIdentifier(props.league,matchup.competitors[0].team)}/schedule`}>
                {HomeRanking} {matchup.competitors[0].team.displayName + " "} 
            </Link>
            <span id="record">
                ({team2Record})
            </span>
        </td>}
        {/*/////THIS NEED TO BE FIXED************************************************************/}
        {/* <UpdateScore index={x} teamIndex={0} sport={this.state.sport} league={this.state.league} scores={this.state.awayScores}/> */}
    </tr>
}

// function getMatchup(x, matchups){
//     return matchups[x]
// }

function getHomeTeam(matchup){
    return matchup.competitors[1]
}

function getAwayTeam(matchup){
    return matchup.competitors[0]
}

function getTeamIdentifier(league, team) {
    if (league === 'college-football' && team.location.indexOf(' ') <= 0) {
        return team.location;
    }
    else {
        return team.abbreviation;
    }
}

function openToVenue(matchup){
    return "https://www.google.com/maps/search/?api=1&query=" + matchup.venue.fullName + " " + matchup.venue.address.city + " " + matchup.venue.address.state;
}

