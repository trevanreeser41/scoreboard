import { useEffect, useState } from 'react';


export function useFetchAppDataScoreboard(league, sport) {
    const URL_API = "http://site.api.espn.com/apis/site/v2/sports/";
    const[matchups, setMatchups] = useState([]);
    const[isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(URL_API+`${this.state.sport}/${this.state.league}/scoreboard`)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }

                throw new Error("Unable to retrieve required data from server.");
            })
            .then(function (data) {
                let events = data.events;
                var games = [];
                for (var i = 0; i < events.length; i++) {
                    for (var j = 0; j < events[i].competitions.length; j++) {
                        games.push(events[i].competitions[j]);
                    }
                }
                setMatchups(games)
                setIsLoading(false)
            })
            .catch(function (error) {
            console.log("Error: ", error.message);
        });
    });

    return {matchups };
}

export function getScoreboardHTML(matchups){
    let tableData = [];
    let status = '';
    let team1Record = '';
    let team2Record = '';
    var AwayRanking;
    var HomeRanking;

    for (let x = 0; x < matchups.length; x++) {
        var matchup = this.getMatchup(x)
        var homeTeam =this.getHomeTeam(matchup)
        var awayTeam =this.getAwayTeam(matchup)
        homeTeam.records !== undefined ? team1Record = homeTeam.records[0].summary : team1Record = "0-0"
        awayTeam.records !== undefined ? team2Record = awayTeam.records[0].summary : team2Record = "0-0"
        

        AwayRanking = this.includeRankings(this.state.league, x, matchup)[1]
        AwayRanking = this.includeRankings(this.state.league, x, matchup)[0]
        status = this.intoOT(matchup.status.type.completed, matchup.status.period, this.state.league, x )

        let location = this.openToVenue(matchup)

        tableData.push(
            <span>
            <tbody className="scoreboard">
            {this.homeTeamBox(x, AwayRanking, team1Record)}
            {this.awayTeamBox(x, HomeRanking, team2Record )}
            <tr>
                <td colSpan="3">{status}</td>
            </tr>
            </tbody>
            <tfoot>
                <td colSpan="3">
                    {matchup.venue.fullName.includes("(" || ")") ? <a href={location} target="_blank" rel="noopener noreferrer" id="venue">{this.state.matchups[x].venue.fullName}</a> : <a href={location} target="_blank" rel="noopener noreferrer" id="venue">{matchup.venue.fullName} ({matchup.venue.address.city}, {matchup.venue.address.state})</a>}
                </td>
            </tfoot>
            <br/>
            <br/>
            </span>
        )   
    }

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
function includeRankings(league, x){
    if (league.includes('college')){
                    
        var AwayRanking = this.state.matchups[x].competitors[1].curatedRank.current
        var  HomeRanking = this.state.matchups[x].competitors[0].curatedRank.current
        if (HomeRanking > 25 || HomeRanking===0){
            HomeRanking=''
        }
        if (AwayRanking > 25 || AwayRanking===0){
            AwayRanking=''
        }

    }
    return [HomeRanking, AwayRanking]
}

function intoOT(completed, period, league, x){
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
        else if (this.state.matchups[x].status.period > OT){
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
        return <tr id="status"><strong>Q{period} - {this.state.matchups[x].status.displayClock}</strong></tr>
    } 
    else if (period === 0) {
        return <tr id="status">{this.state.matchups[x].status.type.detail}</tr>
    } else {
        
    }
}

function homeTeamBox(x, AwayRanking, team1Record, matchup){
    return <tr>
            <td id="logo"><img id="thumb" alt="" src={this.state.matchups[x].competitors[1].team.logo}/></td>
            {this.state.matchups[x].competitors[1].winner === true ? 
            <td id="teams">
                <strong>
                    <Link to={`sports/${this.state.sport}/${this.state.league}/teams/${this.getTeamIdentifier(this.state.league, this.state.matchups[x].competitors[1].team)}/schedule`}>
                        {AwayRanking} {this.state.matchups[x].competitors[1].team.displayName + " "} 
                    </Link>    
                    <span id="record">
                        ({team1Record})
                    </span>
                </strong>
            </td>: 
            <td id="teams">
                <Link to={`sports/${this.state.sport}/${this.state.league}/teams/${this.getTeamIdentifier(this.state.league, this.state.matchups[x].competitors[1].team)}/schedule`}>
                    {AwayRanking} {this.state.matchups[x].competitors[1].team.displayName + " "} 
                </Link> 
                <span id="record">
                    ({team1Record})
                </span>
            </td>}
            <UpdateScore index={x} teamIndex={1} sport={this.state.sport} league={this.state.league} scores={this.state.homeScores}/>
        </tr>
}

function awayTeamBox(x, HomeRanking, team2Record, matchup){
    return <tr>
        <td id="logo"><img id="thumb" alt="" src={this.state.matchups[x].competitors[0].team.logo}/></td>
        {this.state.matchups[x].competitors[0].winner === true ? 
        <td id="teams">
            <strong>
                <Link to={`sports/${this.state.sport}/${this.state.league}/teams/${this.getTeamIdentifier(this.state.league, this.state.matchups[x].competitors[0].team)}/schedule`}>
                    {HomeRanking} {this.state.matchups[x].competitors[0].team.displayName + " "} 
                </Link>    
                <span id="record">
                    ({team2Record})
                </span>
            </strong>
        </td>: 
        <td id="teams">
            <Link to={`sports/${this.state.sport}/${this.state.league}/teams/${this.getTeamIdentifier(this.state.league, this.state.matchups[x].competitors[0].team)}/schedule`}>
                {HomeRanking} {this.state.matchups[x].competitors[0].team.displayName + " "} 
            </Link>
            <span id="record">
                ({team2Record})
            </span>
        </td>}
        <UpdateScore index={x} teamIndex={0} sport={this.state.sport} league={this.state.league} scores={this.state.awayScores}/>
    </tr>
}

function getMatchup(x){
    return this.state.matchups[x]
}

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
