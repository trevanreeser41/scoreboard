import React, { Component, useEffect } from 'react';
import './Scoreboard.css';

export class UpdateScore extends Component{

    constructor(props) {
        super(props)
        this.state = {
            matchups: [],
            scores: [],
        }
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            fetch(`http://site.api.espn.com/apis/site/v2/sports/${this.props.sport}/${this.props.league}/scoreboard`)
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
                        var scores = this.state.scores.concat(games[index].competitors[0].score);
                        this.setState({ 
                            matchups: joined,
                            scores: scores
                        })
                    }
                })
                .catch(function (error) {
                console.log("Error: ", error.message);
                //this.usePersistedState("newScores", this.state.scores);
                // localStorage.setItem('newScores', this.state.scores);
            });
        }, 60000); //only refresh often if in primetime (16:00-23:59)
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    // usePersistedState(key, defaultValue) {
    //     const [state, setState] = React.useState(
    //       () => JSON.parse(localStorage.getItem(key)) || defaultValue
    //     );
    //     useEffect(() => {
    //       localStorage.setItem(key, JSON.stringify(state));
    //     }, [key, state]);
    //     return [state, setState];
    // }      

    render() {
        return (
            <td id="scores">{this.state.scores[this.props.index]}</td>
        )
    }
}