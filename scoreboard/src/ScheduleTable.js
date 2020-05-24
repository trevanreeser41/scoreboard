import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import './ScheduleTable.css';
import $ from "jquery";

const imgPath = process.env.PUBLIC_URL + '/images';

export class ScheduleTable extends Component {

    constructor(props) {
        super(props)
		this.state = {
            currentUrl: window.location.pathname,
            record: "",
			title: props.title,
            matchups: [],
            loading: true,
            sport: "",
            league: "",
            homeScores: [],
            awayScores: [],
            width: 0,
            height: 0,
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    async componentDidMount() {        
        let urlParams = window.location.pathname.split("/");
        this.populateSchedule(urlParams);
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    async componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.team !== prevProps.team) {
            let urlParams = window.location.pathname.split("/");
            this.populateSchedule(urlParams);
            this.setState({ loading: true, sport: urlParams[1], league: urlParams[2] })
        }
    }

    populateSchedule = (urlParams) => { 
        let record;
        let color;
        let team;
        let conference = this.getConferenceObject(urlParams[2]);
        if (urlParams[3] === "standings") {
            return "";
        }
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
                if (urlParams[2] === "nfl" || urlParams[2] === "mlb" || urlParams[2] === '') {
                    conference = conference[`${data.team.groups.parent.id}`];
                }
                else if (urlParams[2] === "college-football" || urlParams[2] === "mens-college-basketball") {
                    conference = conference[`${data.team.groups.id}`];
                }
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
                        conference: conference,
                        sport: urlParams[1],
                        league: urlParams[2]
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

    getConferenceObject (league) {
        if (league === "college-football") {
            return require('./CFBConf.json');
        }
        else if (league === "mens-college-basketball") {
            return require('./CBBConf.json');
        }
        else if (league === "nfl") {
            return {"7": "NFC", "8": "AFC"};
        }
        else if (league === 'mlb') {
            return {"7": "AL", "8": "NL"};
        }
        else {
            return undefined;
        }
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
                let network = this.state.matchups[index].broadcasts[0].media.shortName;
                let network_logos = ["FOX", "CBS", "NBC", "ESPN", "TNT", "ABC", "NBATV", "NBCSN", "FSN", "BYUTV", "YES", "AT&TSN", "NFL"];
                if (network_logos.includes(network)){
                    return <td id="win">
                        <img id="thumb" src={`${imgPath}/${network}.png`} alt=""/>
                        </td>
                }
                else {
                    return <td id="win" style={{fontSize: '5pt'}}>{network}</td>
                }
            }
        }
        catch {
            return <td id="win">-</td>;
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

    retrieveVenue (matchup) {
        if (matchup.venue !== undefined) {
            return matchup.venue.fullName
        }
        else {
            return "Venue Not Listed";
        }
    }

    openToVenue(matchup){
        if (matchup.venue !== undefined && matchup.venue.address !== undefined) {
            if (matchup.venue.address.city !== undefined && matchup.venue.address.state !== undefined) {
                return "https://www.google.com/maps/search/?api=1&query=" + matchup.venue.fullName + " " + matchup.venue.address.city + " " + matchup.venue.address.state;
            }
            else {
                return "https://www.google.com/maps/search/?api=1&query=" + matchup.venue.fullName
            }
        }
        else {
            return "";
        }
    }

    returnVenueLocation(matchup){
        if (matchup.venue !== undefined) {
            if (matchup.venue.address.city !== undefined && matchup.venue.address.state !== undefined) {
                return "(" + matchup.venue.address.city + ", " + matchup.venue.address.state + ")";
            }
            else {
                return "";
            }
        }
        else {
            return "";
        }
    }

    getContrast(hexcolor){
        // If a leading # is provided, remove it
        if (hexcolor.slice(0, 1) === '#') {
            hexcolor = hexcolor.slice(1);
        }
    
        // Convert to RGB value
        var r = parseInt(hexcolor.substr(0,2),16);
        var g = parseInt(hexcolor.substr(2,2),16);
        var b = parseInt(hexcolor.substr(4,2),16);
    
        // Get YIQ ratio
        var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    
        // Check contrast
        return (yiq >= 128) ? 'black' : 'white';
    };

    render() {
        if (this.state.loading===false){
            let team1Record = '';
            let team2Record = '';
            var tableData1 = []
            var scheduleHeadingSize = '10pt';
            for (let index = 0; index < this.state.matchups.length; index++) {
                var homeTeam = this.getHomeTeam(index)
                var awayTeam = this.getAwayTeam(index)
                if (this.state.season !== "Off Season") {
                    this.state.matchups[index].competitors[0].record !== undefined && this.state.matchups[index].competitors[0].record[0] !== undefined ? team1Record = this.state.matchups[index].competitors[0].record[0].displayValue : team1Record = "0-0"
                    this.state.matchups[index].competitors[1].record !== undefined && this.state.matchups[index].competitors[1].record[0] !== undefined ? team2Record = this.state.matchups[index].competitors[1].record[0].displayValue : team2Record = "0-0"
                }
                if (this.state.width > 769) {
                    scheduleHeadingSize = '14pt';
                    tableData1.push(
                        <tr key={this.state.matchups[index].id + Date.now().toString()}>
                            <td id="date">{this.state.matchups[index].date.substr(0,10)}
                        <br/><a href={this.openToVenue(this.state.matchups[index])} target="_blank" rel="noopener noreferrer" id="scheduleVenue">{this.retrieveVenue(this.state.matchups[index])}</a>
                            </td>
                            <td id="logo-schedule"><img id="thumb" alt="logo" src={awayTeam.team.logos !== undefined ? awayTeam.team.logos[0].href : "https://cdn2.sportngin.com/attachments/photo/7726/1525/No_Logo_Available.png"}/></td>
                            <td className="schedule">
                                <Link to={awayTeam.team.id}>
                                    {awayTeam.team.location} ({team2Record})
                                </Link>
                            </td>
                            <td id="scores">{this.getScores(awayTeam)}</td>
                            <td id="logo-schedule"><img id="thumb" alt="logo.png" src={homeTeam.team.logos !== undefined ? homeTeam.team.logos[0].href : "https://cdn2.sportngin.com/attachments/photo/7726/1525/No_Logo_Available.png"}/></td>
                            <td className="schedule">
                                <Link to={homeTeam.team.id}>
                                    {homeTeam.team.location} ({team1Record})
                                </Link>
                            </td>
                            <td id="scores">{this.getScores(homeTeam)}</td>
                            {this.checkForWinner(homeTeam, awayTeam, index)}
                            <td>{this.state.matchups[index].status.type.detail}</td>
                        </tr>
                    );
                }
                else {
                    let recordSize = this.props.league === 'nhl' ? '4pt' : '5pt';
                    tableData1.push(
                        <tr key={this.state.matchups[index].id + Date.now().toString()}>
                            <td id="logo-schedule"><img id="thumb" alt="logo" src={awayTeam.team.logos !== undefined ? awayTeam.team.logos[0].href : "https://cdn2.sportngin.com/attachments/photo/7726/1525/No_Logo_Available.png"}/></td>
                            <td className="schedule-mobile">
                                <Link to={awayTeam.team.id}>
                                    {awayTeam.team.abbreviation} <span style={{fontSize: `${recordSize}`}}>({team2Record})</span>
                                </Link>
                            </td>
                            <td id="scores-mobile">{this.getScores(awayTeam)}</td>
                            <td id="logo-schedule"><img id="thumb" alt="logo.png" src={homeTeam.team.logos !== undefined ? homeTeam.team.logos[0].href : "https://cdn2.sportngin.com/attachments/photo/7726/1525/No_Logo_Available.png"}/></td>
                            <td className="schedule-mobile">
                                <Link to={homeTeam.team.id}>
                                    {homeTeam.team.abbreviation} <span style={{fontSize: `${recordSize}`}}>({team1Record})</span>
                                </Link>
                            </td>
                            <td id="scores-mobile">{this.getScores(homeTeam)}</td>
                            {this.checkForWinner(homeTeam, awayTeam, index)}
                            <td style={{fontSize: '5pt'}}>{this.state.matchups[index].status.type.shortDetail}</td>
                        </tr>
                    )
                }
            }
            if (this.state.sport === "soccer") {
                tableData1.reverse();
            }
            return (
                <div className={this.state.width > 769 ? "flexcontainer" : "flexcontainer-mobile"}>
                    <table className={this.state.width > 769 ? "scheduleTable" : "scheduleTable-mobile"}>   
                    <thead>  
                        <tr>                    
                        <th style={{ 
                            backgroundColor: `#${this.state.color}`,
                            border: `1px solid #${this.state.color}`,
                            fontSize: `${scheduleHeadingSize}`, 
                        }} colSpan="10">
                            {this.state.league === "college-football" || this.state.league === "mens-college-basketball" ?
                            <span><span id="heading">{this.state.team} Schedule {this.state.record}</span><img id="conf-logo" src={`${imgPath}/${this.state.conference}.png`} alt=""/></span>:
                            <Link style={{color: this.getContrast(this.state.color)}} to={`${"standings"}`}>
                                <span id="heading">{this.state.team} Schedule {this.state.record}</span><img id="conf-logo" src={`${imgPath}/${this.state.conference}.png`} alt=""/>
                            </Link>}
                        </th>
                        </tr>
                        </thead>
                        <tbody style={this.state.width > 769 ? {fontSize: '12pt'} : {fontSize: '6pt'}}>                   
                        {tableData1} 
                        </tbody>                        
                    </table>
                </div>
            )
        }
        else if (!window.location.pathname.includes("standings")){
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
            )
        }
        else {
            return "";
        }
    }
}