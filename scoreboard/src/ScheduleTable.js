import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import './Rankings.css';
import $ from "jquery";

export class ScheduleTable extends Component {

    constructor(props) {
        super(props)
		this.state = {
            currentUrl: window.location.pathname,
            record: "",
			title: props.title,
            matchups: [],
            loading: true,
            sport: props.sport,
            league: props.league,
            homeScores: [],
            awayScores: [],
        };
    }

    async componentDidMount() {        
        let urlParams = window.location.pathname.split("/");
        this.populateSchedule(urlParams);
    }

    async componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.team !== prevProps.team) {
            let urlParams = window.location.pathname.split("/");
            this.populateSchedule(urlParams);
            this.setState({ loading: true })
        }
    }

    populateSchedule = (urlParams) => { 
        let record;
        let color;
        let team;
        fetch(`http://site.api.espn.com/apis/site/v2/sports/${urlParams[1]}/${urlParams[2]}/teams/${urlParams[3]}/schedule`)
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
                if (data.team.recordSummary !== undefined){
                    record = "(" + data.team.recordSummary + ")"; 
                }
                else {
                    record = "";
                }            
                var games = [];
                for (var i = 0; i < events.length; i++) {
                    for (var j = 0; j < events[i].competitions.length; j++) {
                        games.push(events[i].competitions[j]);
                    }
                }                
                return games
            })
            .then(games => {
                this.setState({ matchups: [] });
                for (let index = 0; index < games.length; index++) {
                    var joined = this.state.matchups.concat(games[index]);
                    this.setState({ 
                        matchups: joined,
                        record: record,
                        team: team,
                        color: color,
                    })
                }
                this.setState({ loading: false })
            })
            .catch(function (error) {
            console.log("Error: ", error.message);
        });
    }

    changeTeam(team) {
        this.setState({
            urlParams: [this.state.sport, this.state.league, team.abbreviation]
        })
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

    getScores(team) {
        try {
            return team.score.displayValue;
        }
        catch {
            return "-";
        }
    }

    getTeamIdentifier(league, team) {
        if (league === "college-football" && team.location.indexOf(" ") <= 0) {
            let teamName = team.location.replace("'", "").replace("&", "").replace("\"", "").replace(" ","");
            return teamName;
        }
        else if (league === "mens-college-basketball") {
            let teamName = team.location.replace("'", "").replace("&", "").replace("\"", "").replace(" ","");
            return teamName;
        }
        else {
            return team.abbreviation;
        }
    }

    checkForWinner(team1, team2, index) {
        try {
            if (team1.team.displayName === this.state.team && team1.winner === true){
                return <td id="win" style={{color: "#5cb85c"}}>W</td>
            }
            else if (team2.team.displayName === this.state.team && team2.winner === true) {
                return <td id="win" style={{color: "#5cb85c"}}>W</td>
            }
            else if (this.getScores(team1) === this.getScores(team2) && this.state.matchups[index].status.type.completed === true) {
                return <td id="win" style={{color: "#505050"}}>D</td>
            }
            else if (team1.winner === false || team2.winner === false){
                return <td id="win" style={{color: "#d9534f"}}>L</td>
            }
            else {
                return <td id="win">-</td>
            }
        }
        catch {
            return "";
        }
    }

    fade() {
        var onDiv = document.getElementById("scheduleTable1");
        var offDiv = document.getElementById("scheduleTable2");
        $(offDiv).animate({ opacity: 1}, 500);
        $(onDiv).animate({ opacity: 0}, 500);
    
        const temp = onDiv;
    
        onDiv = offDiv;
        offDiv = temp;
    
        $(onDiv).css("z-index",1);
        $(offDiv).css("z-index",0);
    }

    openToVenue(matchup){
        if (matchup.venue.address.city !== undefined && matchup.venue.address.state !== undefined) {
            return "https://www.google.com/maps/search/?api=1&query=" + matchup.venue.fullName + " " + matchup.venue.address.city + " " + matchup.venue.address.state;
        }
        else {
            return "https://www.google.com/maps/search/?api=1&query=" + matchup.venue.fullName
        }
    }

    returnVenueLocation(matchup){
        if (matchup.venue.address.city !== undefined && matchup.venue.address.state !== undefined) {
            return "(" + matchup.venue.address.city + ", " + matchup.venue.address.state + ")";
        }
        else {
            return "";
        }
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
                    this.state.matchups[index].competitors[0].record !== undefined && this.state.matchups[index].competitors[0].record[0] !== undefined ? team1Record = this.state.matchups[index].competitors[0].record[0].displayValue : team1Record = "0-0"
                    this.state.matchups[index].competitors[1].record !== undefined && this.state.matchups[index].competitors[1].record[0] !== undefined ? team2Record = this.state.matchups[index].competitors[1].record[0].displayValue : team2Record = "0-0"
                }
                tableData1.push(
                    <tr key={this.state.matchups[index].id + Date.now().toString()}>
                        <td id="date">{this.state.matchups[index].date.substr(0,10)}
                        <br/><a href={this.openToVenue(this.state.matchups[index])} target="_blank" rel="noopener noreferrer" id="scheduleVenue">{this.state.matchups[index].venue.fullName}</a>
                        </td>
                        <td id="logo-schedule"><img id="thumb" alt="logo" src={awayTeam.team.logos !== undefined ? awayTeam.team.logos[0].href : "https://cdn2.sportngin.com/attachments/photo/7726/1525/No_Logo_Available.png"}/></td>
                        <td className="schedule">
                            <Link to={this.getTeamIdentifier(this.props.league, awayTeam.team)}>
                                {awayTeam.team.location} ({team2Record})
                            </Link>
                        </td>
                        <td id="scores">{this.getScores(awayTeam)}</td>
                        <td id="logo-schedule"><img id="thumb" alt="logo.png" src={homeTeam.team.logos !== undefined ? homeTeam.team.logos[0].href : "https://cdn2.sportngin.com/attachments/photo/7726/1525/No_Logo_Available.png"}/></td>
                        <td className="schedule">
                            <Link to={this.getTeamIdentifier(this.props.league, homeTeam.team)}>
                                {homeTeam.team.location} ({team1Record})
                            </Link>
                        </td>
                        <td id="scores">{this.getScores(homeTeam)}</td>
                        {this.checkForWinner(homeTeam, awayTeam, index)}
                        <td>{this.state.matchups[index].status.type.detail}</td>
                    </tr>
                )   
            }

            return (
                <div className="flexcontainer">
                    <table className="scheduleTable">   
                    <thead>  
                        <tr>                    
                        <th style={{ 
                            backgroundColor: `#${this.state.color}`,
                            border: `1px solid #${this.state.color}`, 
                        }} colSpan="10">
                            {this.state.team} Schedule {this.state.record}
                        </th>
                        </tr>  
                        </thead>
                        <tbody style={{fontSize: '12pt'}}>                   
                        {tableData1} 
                        </tbody>                        
                    </table>
                </div>
            )
        }
        else{
            return(
                <div id="loading">
                <h1>Loading</h1>
                <br/>
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
                </div>          
            )}
    }
}