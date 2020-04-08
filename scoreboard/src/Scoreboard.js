import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { UpdateScore } from './UpdateScore';
import './Scoreboard.css';

export class Scoreboard extends Component {

    constructor(props) {
        super(props)
		this.state = {
            matchups: [],
            loading: true,
            sport: props.sport,
            league: props.league,
            homeScores: [],
            awayScores: [],
        };
    }

    async componentDidMount() {
        await this.populateScoreboard();
    }

    //MARK: Fetch statement, this calls the API and stores the information in this.State
    populateScoreboard = () => { 
        this.setState({ matchups: [] })
        fetch(`http://site.api.espn.com/apis/site/v2/sports/${this.state.sport}/${this.state.league}/scoreboard`)
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
                return games
            })
            .then(games => {
                for (let index = 0; index < games.length; index++) {
                    var joined = this.state.matchups.concat(games[index]);
                    var homeScores = this.state.homeScores.concat(games[index].competitors[1].score);
                    var awayScores = this.state.awayScores.concat(games[index].competitors[0].score);
                    this.setState({ 
                        matchups: joined,
                        homeScores: homeScores,
                        awayScores: awayScores
                    })
                }
                this.setState({ loading: false })
            })
            .catch(function (error) {
            console.log("Error: ", error.message);
        });
    }


    //MARK: Helper Functions to build each matchups card
    includeRankings(league, x){
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

    intoOT(completed, period, league, x){
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
            if(league !== 'mlb'){
                return <tr id="status"><strong>Q{period} - {this.state.matchups[x].status.displayClock}</strong></tr>
            }
            else {
                return <tr id="status"><strong>{this.state.matchups[x].status.type.detail}</strong></tr> //once games are live, figure out where innings are displayed in the response
            }
        } 
        else if (period === 0) {
            return <tr id="status">{this.state.matchups[x].status.type.detail}</tr>
        } else {
            
        }
    }

    homeTeamBox(x, AwayRanking, team1Record, matchup){
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

    awayTeamBox(x, HomeRanking, team2Record, matchup){
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

    getMatchup(x){
        return this.state.matchups[x]
    }

    getHomeTeam(matchup){
        return matchup.competitors[1]
    }

    getAwayTeam(matchup){
        return matchup.competitors[0]
    }

    getTeamIdentifier(league, team) {
        if (league === 'college-football' && team.location.indexOf(' ') <= 0) {
            return team.location;
        }
        else {
            return team.abbreviation;
        }
    }

    openToVenue(matchup){
        return "https://www.google.com/maps/search/?api=1&query=" + matchup.venue.fullName + " " + matchup.venue.address.city + " " + matchup.venue.address.state;
    }


    //MARK: Render logic using the helper functions and outputing the correct html
    render() {
        if (this.state.loading===false){
            let tableData = [];
            let status = '';
            let team1Record = '';
            let team2Record = '';
            var AwayRanking;
            var HomeRanking;

            for (let x = 0; x < this.state.matchups.length; x++) {
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
        else{
            return(
                <h1>Loading...</h1>
            )}
    }
}