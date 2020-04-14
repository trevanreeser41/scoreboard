import React, { Component } from 'react';
import './Rankings.css';

export class ScheduleTable extends Component {

    constructor(props) {
        super(props)
		this.state = {
            team: props.team,
            color: props.color,
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
        let color;
        let team;
        fetch(`http://site.api.espn.com/apis/site/v2${window.location.pathname}`)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }

                throw new Error("Unable to retrieve required data from server.");
            })
            .then(function (data) {
                let events = data.events;
                color = data.team.color;
                team = data.team.displayName;
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
                        team: team,
                        color: color,
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

    changeTeam(teamName) {
        console.log(teamName);
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
            let team1Record = '';
            let team2Record = '';
            var tableData1 = []
            for (let index = 0; index < this.state.matchups.length; index++) {
                var homeTeam = this.getHomeTeam(index)
                var awayTeam = this.getAwayTeam(index)
                if (this.state.season !== "Off Season") {
                    this.state.matchups[index].competitors[0].record !== undefined ? team1Record = this.state.matchups[index].competitors[0].record[0].displayValue : team1Record = "0-0"
                    this.state.matchups[index].competitors[1].record !== undefined ? team2Record = this.state.matchups[index].competitors[1].record[0].displayValue : team2Record = "0-0"
                }
                tableData1.push(
                    <tr key={this.state.matchups[index].id}>
                        <td>{this.state.matchups[index].date.substr(0,10)}</td>
                        <td id="logo-schedule"><img id="thumb" alt="logo" src={awayTeam.team.logos[0].href}/></td>
                        <td className="schedule">{awayTeam.team.location} ({team2Record})</td>
                        <td id="thumb">@</td>
                        <td id="logo-schedule"><img id="thumb" alt="logo" src={homeTeam.team.logos[0].href}/></td>
                        <td className="schedule">{homeTeam.team.location} ({team1Record})</td>
                    </tr>
                )   
            }

            return (
                <div className="flexcontainer">
                    <table className="scheduleTable">                         
                        <th style={{ 
                            backgroundColor: `#${this.state.color}`,
                            border: `1px solid #${this.state.color}`, 
                        }} colSpan="6">
                            {this.state.team} Schedule
                        </th>                        
                        {tableData1}                        
                    </table>
                </div>
            )
        }
        else{
            return(
                <h1>Loading...</h1>
            )}
    }
}