import React, { Component } from 'react';
import './Scoreboard.css';

/*
COMMENTS:
Football has no record element further down in the array currently, for bball this is what has conf record
*/

export class Team extends Component {

    constructor(props) {
        super(props)
		this.state = {
			team: props.team,
			title: props.title,
            id: props.id,
            matchups: [],
            loading: true,
            teamData: null,
            sport: props.sport,
            league: props.league,
            homeScores: [],
            awayScores: [],
            selectedTeams: [
                {
                    team: 'BYU',
                    sport: 'basketball',
                    league: 'mens-college-basketball',
                    id: 's:40~l:41~t:252'
                },
                {
                    team: 'BYU',
                    sport: 'football',
                    league: 'college-football',
                    id: 's:20~l:23~t:252'
                },
                {
                    team: 'utah',
                    sport: 'basketball',
                    league: 'nba',
                    id: 's:40~l:46~t:26'
                },
                {
                    team: 'iowa',
                    sport: 'basketball',
                    league: 'mens-college-basketball',
                    id:'s:40~l:41~t:2294'
                },
                {
                    team: 'sea',
                    sport: 'football',
                    league: 'nfl',
                    id:'s:20~l:28~t:26'
                },
                {
                    team: 'hou',
                    sport: 'baseball',
                    league: 'mlb',
                    id:'s:1~l:10~t:18'
                },
                {
                    team: 'hou',
                    sport: 'baseball',
                    league: 'mlb',
                    id:'s:1~l:10~t:18'
                },
                {
                    team: 'sea',
                    sport: 'football',
                    league: 'nfl',
                    id:'s:20~l:28~t:26'
                },
            ],
            data: [],
        };
    }    

    async componentWillMount() {
        await this.populateScoreboard();
    }

    populateScoreboard = () => { 
        var dataarray =[];        
        for (let index = 0; index < this.state.selectedTeams.length; index++) {
        
        fetch(`http://site.api.espn.com/apis/site/v2/sports/${this.state.selectedTeams[index].sport}/${this.state.selectedTeams[index].league}/teams/${this.state.selectedTeams[index].team}`)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }

                throw new Error("Unable to retrieve required data from server.");
            })
            .then(data => {

                dataarray.push(data)
                this.setState({teamData: data, loading: false, data: dataarray})
            })
            .catch(function (error) {
            console.log("Error: ", error.message);
        });
        }   
    }

    splitScoreTable (array, chunk_size) {
        var tempArray = [];     
        for (var index = 0; index < array.length; index += chunk_size) {
            var myChunk = array.slice(index, index+chunk_size);
            tempArray.push(myChunk);
        }    
        return tempArray;
    }

    testForMatchupScores = (competitorIndex, index) => {
        try {
            return this.state.data[index].team.nextEvent[0].competitions[0].competitors[competitorIndex].team.abbreviation;
        }
        catch {
            return "TBD";
        }
    }

    testForNextEvent = (index) => {
        try {
            return this.state.data[index].team.nextEvent[0].shortName;
        }
        catch {
            return "TBD";
        }
    }

    testForProfessionalTeam = (league) => {
        var professionalLeagues = ["nfl","nba","mlb","nhl","wnba"];
        if (professionalLeagues.includes(league)) {
            return "Playoff Seed:";
        }
        else return "AP Ranking:"
    }

    testForRankingPlayoff = (index) => {
        try {
            return this.state.data[index].team.record.items[0].stats[0].value;
        }
        catch {
            return this.state.data[index].team.nextEvent[0].competitions[0].competitors[0].curatedRank.current;
        }
    }

    testForRecord = (index) => {
        try {
            return this.state.data[index].team.record.items[0].summary;
        }
        catch {
            return this.state.data[index].team.nextEvent[0].competitions[0].competitors[0].record[0].displayValue;
        }
    }

    render() {

        var tableData= [];

        function toTitleCase(str) {
            return str.replace(/\w\S*/g, function(txt){
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
        
        if (this.state.loading===false){
            //LOGIC NEEDED TO PRODUCE THE TABLE
            //DECLARE VARIABLES
            var homeScores
            var awayScores
            var teamData

            for (let index = 0; index < this.state.data.length; index++) { //data[index] sub this for teamData
                for (let j = 0; j < this.state.selectedTeams.length; j++) {
                    if (this.state.selectedTeams[j].id===this.state.data[index].team.uid){
                        teamData = this.state.selectedTeams[j]                        
                    }
                }
                try {
                    homeScores = this.state.homeScores.concat(this.state.data[index].team.nextEvent[0].competitions[0].competitors[0].score.displayValue);
                    awayScores = this.state.awayScores.concat(this.state.data[index].team.nextEvent[0].competitions[0].competitors[1].score.displayValue);
                }
                catch {
                    homeScores = 0
                    awayScores = 0
                }
                tableData.push(
                    <span>
                    <tbody className="scoreboard">
                    <tr>
                        <td id="logo"><img id="teamthumb" alt="" src={this.state.data[index].team.logos[0].href}/></td>
                        <td id="team-sport">{this.state.data[index].team.displayName} {toTitleCase(teamData.sport)}</td>
                    </tr>
                    <tr>
                        <td>Record:</td>
                        <td id="scores">{this.testForRecord(index)}</td>
                    </tr>
                    <tr>
                        <td>{this.testForProfessionalTeam(teamData.league)}</td>
                        <td id="scores">{this.testForRankingPlayoff(index)}</td>
                    </tr>
                    <tr>
                        <td>Matchup:</td>
                        <td id="scores">{this.testForNextEvent(index)}</td>
                    </tr>
                    <tr>
                        <td>Most Recent Score:</td>
                        <td id="scores"><td>{this.testForMatchupScores(1, index)} {awayScores}</td><td>{this.testForMatchupScores(0, index)} {homeScores}</td></td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>{this.state.data[index].team.standingSummary !== undefined ? this.state.data[index].team.standingSummary : "Off Season"}</strong></td>
                    </tr>
                    </tbody>
                    <br/>
                    <br/>
                    </span>
                )   
                }
                //var splitData = this.splitScoreTable(tableData, tableData.length % 2 === 1 ? tableData.length/2 + 1 : tableData.length/2);
                var newData = []
                for (let index = 0; index < tableData.length; index=index+3) {
                    newData.push(                                
                        <div class="flexcontainer">
                            <table className="card-table-team">
                                {tableData[index]}
                            </table>
                            <table className="card-table-team">
                                {tableData[index+1]}
                            </table>
                            <table className="card-table-team">
                                {tableData[index+2]}
                            </table>
                        </div>
                    )
                }

                return (
                    <div className=''> 
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