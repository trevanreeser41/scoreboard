import React, { Component } from 'react';
import './Scoreboard.css';

export class Scoreboard extends Component {

    constructor(props) {
        super(props)
		this.state = {
			team: props.team,
			title: props.title,
            id: props.id,
            matchups: []
        };
    }

    componentDidMount() {
        this.populateScoreboard();
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
                console.log(games)
                return games
            })
            .then(games => 
                this.setState({ matchups: games })
            )           
            .catch(function (error) {
            console.log("Error: ", error.message);
        });
    }

    render() {
        return (
            //image src link found in json under team > links > logo
        <table>
            <thead></thead>
                <tbody className="scoreboard">
                <tr>
                    <td><img id="thumb" alt="" src={this.state.matchups[0].competitors[0].team.logo}/></td>
                    <td id="teams">{this.state.matchups[0].competitors[0].team.displayName}</td>
                    <td id="scores">{this.state.matchups[0].competitors[0].score}</td>
                </tr>
                <tr>
                    <td><img id="thumb" alt="" src={this.state.matchups[0].competitors[1].team.logo}/></td>
                    <td id="teams">{this.state.matchups[0].competitors[1].team.displayName}</td>
                    <td id="scores">{this.state.matchups[0].competitors[1].score}</td>
                </tr>
            </tbody>
            </table>
        )
    }
}