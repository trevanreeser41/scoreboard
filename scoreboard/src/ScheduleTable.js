import React, { Component } from 'react';
import { UpdateScore } from './UpdateScore';
import './Rankings.css';

export class ScheduleTable extends Component {

    constructor(props) {
        super(props)
		this.state = {
			team: props.team,
			title: props.title,
            id: props.id,
            matchups: [],
            loading: true,
            sport: props.sport,
            league: props.league,
            homeScores: [],
            awayScores: [],
        };
    }

    async componentDidMount() {
        await this.populateSchedule();
    }

    populateSchedule = () => { 
        this.setState({ matchups: [] })
        fetch(`http://site.api.espn.com/apis/site/v2${window.location.pathname}`)
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
                    // var homeScores = this.state.homeScores.concat(games[index].competitors[1].score.displayValue);
                    // var awayScores = this.state.awayScores.concat(games[index].competitors[0].score.displayValue);
                    this.setState({ 
                        matchups: joined,
                        // homeScores: homeScores,
                        // awayScores: awayScores,
                    })
                }
                this.setState({ loading: false })
            })
            .catch(function (error) {
            console.log("Error: ", error.message);
        });
    }

    getMatchup(x){
        return this.state.matchups[x]
    }

    getHomeTeam(index){
        return this.state.matchups[index].competitors[0]
    }

    getAwayTeam(index){
        return this.state.matchups[index].competitors[1]
    }

    openToVenue(matchup){
        return "https://www.google.com/maps/search/?api=1&query=" + matchup.venue.fullName + " " + matchup.venue.address.city + " " + matchup.venue.address.state;
    }

    render() {
        if (this.state.loading===false){
            let tableData = [];
            let team1Record = '';
            let team2Record = '';
            var AwayRanking;
            var HomeRanking;

            // for (let x = 0; x < this.state.matchups.length; x++) {
            //     if (this.state.season !== "Off Season") {
            //         this.state.matchups[x].competitors[1].record !== undefined ? team1Record = this.state.matchups[x].competitors[1].record[0].displayValue : team1Record = "0-0"
            //         this.state.matchups[x].competitors[0].record !== undefined ? team2Record = this.state.matchups[x].competitors[0].record[0].displayValue : team2Record = "0-0"
            //     }
            //     tableData.push(
            //         <tbody className="scoreboard">
            //         <tr>
            //             <td id="logo"><img id="thumb" alt="" src={this.state.matchups[x].competitors[1].team.logos[0].href}/></td>
            //             {this.state.matchups[x].competitors[1].winner === true ? <td id="teams"><strong>{AwayRanking} {this.state.matchups[x].competitors[1].team.displayName} <span id="record">({team1Record})</span></strong></td>: <td id="teams">{AwayRanking} {this.state.matchups[x].competitors[1].team.displayName} <span id="record">({team1Record})</span></td>}
            //             <UpdateScore index={x} teamIndex={1} sport={this.state.sport} league={this.state.league} scores={this.state.homeScores}/>
            //         </tr>
            //         <tr>
            //             <td id="logo"><img id="thumb" alt="" src={this.state.matchups[x].competitors[0].team.logos[0].href}/></td>
            //             {this.state.matchups[x].competitors[0].winner === true ? <td id="teams"><strong>{HomeRanking} {this.state.matchups[x].competitors[0].team.displayName} <span id="record">({team2Record})</span></strong></td>: <td id="teams">{HomeRanking} {this.state.matchups[x].competitors[0].team.displayName} <span id="record">({team2Record})</span></td>}
            //             <UpdateScore index={x} teamIndex={0} sport={this.state.sport} league={this.state.league} scores={this.state.awayScores}/>
            //         </tr>
            //         <tr>
            //             <td colSpan="3">{this.state.matchups[x].date}</td>
            //         </tr>            
            //         </tbody>
            //     )   
            // }

            var tableData1 = []
            for (let index = 0; index < this.state.matchups.length; index++) {
                var matchup = this.getMatchup[index]
                var homeTeam = this.getHomeTeam(index)
                var awayTeam = this.getAwayTeam(index)
                //let location = this.openToVenue(matchup)
                if (this.state.season !== "Off Season") {
                    this.state.matchups[index].competitors[0].record !== undefined ? team1Record = this.state.matchups[index].competitors[1].record[0].displayValue : team1Record = "0-0"
                    this.state.matchups[index].competitors[1].record !== undefined ? team2Record = this.state.matchups[index].competitors[0].record[0].displayValue : team2Record = "0-0"
                }
                tableData1.push(
                    <tr>
                        <td>{this.state.matchups[index].date}</td>
                        <td id="logo"><img id="thumb" alt="logo" src={awayTeam.team.logos[0].href}/></td>
                        <td class="rank">{awayTeam.team.displayName} ({team2Record})</td>
                        <td>@</td>
                        <td id="logo"><img id="thumb" alt="logo" src={homeTeam.team.logos[0].href}/></td>
                        <td class="rank">{homeTeam.team.displayName} ({team1Record})</td>
                        {/* <td>{awayTeam.score.value} - {homeTeam.score.value}</td> */}
                        {/* <td>
                        {matchup.venue.fullName.includes("(" || ")") ? <a href={location} target="_blank" rel="noopener noreferrer" id="venue">{matchup.venue.fullName}</a> : <a href={location} target="_blank" rel="noopener noreferrer" id="venue">{matchup.venue.fullName} ({matchup.venue.address.city}, {matchup.venue.address.state})</a>}
                        </td> */}
                    </tr>
                )   
            }
            // var newData = []
            // for (let index = 0; index < tableData1.length; index++) {
            //     newData.push(
            //         <table class="rankingsTable">
            //             {tableData1}
            //         </table>
            //     )
            // }

            return (
                <div class="rankingsTable"> 
                    {tableData1}
                </div>
            )
        }
        else{
            return(
                <h1>Loading...</h1>
            )}
    }
}