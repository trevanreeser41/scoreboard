import React, { Component } from 'react';
import './Scoreboard.css';

export class UpdateScore extends Component{

    constructor(props) {
        super(props)
        this.state = {
            matchups: [],
            index: props.index,
            teamIndex: props.teamIndex,
            sport: props.sport,
            league: props.league,
            score: props.score
        }
    }

    componentDidMount() {
        this.interval = setInterval(() => {
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
                    for (let z = 0; z < games.length; z++) {
                        this.setState({ 
                            // period: joined[this.state.index].status.period,
                            // clock: joined[this.state.index].status.displayClock,
                            score: games[z].competitors[this.state.teamIndex].score                                  
                        })
                    }
                })
                .catch(function (error) {
                console.log("Error: ", error.message);
            });
        }, 10000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <td id="scores">{this.state.score}</td>
        )
    }
}