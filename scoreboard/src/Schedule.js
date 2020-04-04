import React, { Component } from 'react';
import { UpdateScore } from './UpdateScore';
import './Scoreboard.css';

export class Schedule extends Component {

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
                    var homeScores = this.state.homeScores.concat(games[index].competitors[1].score.displayValue);
                    var awayScores = this.state.awayScores.concat(games[index].competitors[0].score.displayValue);
                    this.setState({ 
                        matchups: joined,
                        homeScores: homeScores,
                        awayScores: awayScores,
                    })
                }
                this.setState({ loading: false })
            })
            .catch(function (error) {
            console.log("Error: ", error.message);
        });
    }

    render() {
        if (this.state.loading===false){
            let tableData = [];
            let status = '';
            let team1Record = '';
            let team2Record = '';
            var AwayRanking;
            var HomeRanking;

            for (let x = 0; x < this.state.matchups.length; x++) {
                if (this.state.season !== "Off Season") {
                    this.state.matchups[x].competitors[1].record !== undefined ? team1Record = this.state.matchups[x].competitors[1].record[0].displayValue : team1Record = "0-0"
                    this.state.matchups[x].competitors[0].record !== undefined ? team2Record = this.state.matchups[x].competitors[0].record[0].displayValue : team2Record = "0-0"
                }
                tableData.push(
                    <tbody className="scoreboard">
                    <tr>
                        <td id="logo"><img id="thumb" alt="" src={this.state.matchups[x].competitors[1].team.logos[0].href}/></td>
                        {this.state.matchups[x].competitors[1].winner === true ? <td id="teams"><strong>{AwayRanking} {this.state.matchups[x].competitors[1].team.displayName} <span id="record">({team1Record})</span></strong></td>: <td id="teams">{AwayRanking} {this.state.matchups[x].competitors[1].team.displayName} <span id="record">({team1Record})</span></td>}
                        <UpdateScore index={x} teamIndex={1} sport={this.state.sport} league={this.state.league} scores={this.state.homeScores}/>
                    </tr>
                    <tr>
                        <td id="logo"><img id="thumb" alt="" src={this.state.matchups[x].competitors[0].team.logos[0].href}/></td>
                        {this.state.matchups[x].competitors[0].winner === true ? <td id="teams"><strong>{HomeRanking} {this.state.matchups[x].competitors[0].team.displayName} <span id="record">({team2Record})</span></strong></td>: <td id="teams">{HomeRanking} {this.state.matchups[x].competitors[0].team.displayName} <span id="record">({team2Record})</span></td>}
                        <UpdateScore index={x} teamIndex={0} sport={this.state.sport} league={this.state.league} scores={this.state.awayScores}/>
                    </tr>
                    <tr>
                        <td colSpan="3">{this.state.matchups[x].date}</td>
                    </tr>            
                    </tbody>
                )   
            }
            var newData = []
            for (let index = 0; index < tableData.length; index++) {
                newData.push(
                    <div class="grid-item">
                        <table className="card-table">
                            {tableData[index]}
                        </table>
                    </div>
                )
            }

            return (
                <div class="flex-container"> 
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