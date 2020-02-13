import React, { Component } from 'react';
import './Scoreboard.css';

export class Scoreboard extends Component {

    constructor(props) {
        super(props)
		this.state = {
			team: props.team,
			title: props.title,
            id: props.id,
            matchups: [],
            loading: true
        };
    }

    async componentWillMount() {
        await this.populateScoreboard();
    }

    populateScoreboard = () => { 
        fetch('http://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard')
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
                    this.setState({ matchups: joined })
                    
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
            for (let x = 0; x < this.state.matchups.length; x++) {
                if (this.state.matchups[x].status.displayClock === "0.0" && this.state.matchups[x].status.period > 3){
                    status = <tr><strong>FINAL</strong></tr>
                }
                else if (this.state.matchups[x].status.period < 5) {
                    status = <tr>Q{this.state.matchups[x].status.period} - {this.state.matchups[x].status.displayClock}</tr>
                } else {
                    let overtime_period = '';
                    if (this.state.matchups[x].status.period > 5) {
                        overtime_period = Number(this.state.matchups[x].status.period) - 4
                    }
                    status = <tr><strong>FINAL/{overtime_period}OT</strong></tr>
                }
                tableData.push(
                    <tbody className="scoreboard">
                    <tr>
                        <td><img id="thumb" alt="" src={this.state.matchups[x].competitors[0].team.logo}/></td>
                        <td id="teams">{this.state.matchups[x].competitors[0].team.displayName}</td>
                        <td id="scores">{this.state.matchups[x].competitors[0].score}</td>
                    </tr>
                    <tr>
                        <td><img id="thumb" alt="" src={this.state.matchups[x].competitors[1].team.logo}/></td>
                        <td id="teams">{this.state.matchups[x].competitors[1].team.displayName}</td>
                        <td id="scores">{this.state.matchups[x].competitors[1].score}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>{status}</td>
                        <td></td>
                    </tr>
                    <br/>
                    </tbody>
                )   
            }

            return (
                //image src link found in json under team > links > logo
                <table>
                    {tableData}
                </table>
            )
        }
        else{
        return(
            <h1>Loading...</h1>
        )}
    }
}