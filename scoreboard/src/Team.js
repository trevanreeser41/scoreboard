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
            confrecord: "",
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
                // {
                //     team: 'bos',
                //     sport: 'hockey',
                //     league: 'nhl',
                //     id:'s:70~l:90~t:1'
                // },

            ],
            data: [],
        };
    }

    

    async componentWillMount() {
        await this.populateScoreboard();
    }


    populateScoreboard = () => { 
        var dataarray =[]
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
                this.setState({teamData: data, loading: false,data: dataarray})
                //console.log(this.state.data)
            })
            .catch(function (error) {
            console.log("Error: ", error.message);
        });
        }   
        console.log(this.state.data)
    }

    splitScoreTable (array, chunk_size) {
        var tempArray = [];     
        for (var index = 0; index < array.length; index += chunk_size) {
            var myChunk = array.slice(index, index+chunk_size);
            tempArray.push(myChunk);
        }    
        return tempArray;
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

                
                let location = "https://www.google.com/maps/search/?api=1&query=" + this.state.data[index].team.nextEvent[0].competitions[0].venue.fullName
                var confrecord=""
                if (teamData.sport==="mens-college-basketball") {
                    for (let i = 0; i < this.state.data[index].team.nextEvent[0].competitions[0].competitors.length; i++) {
                        if (this.state.data[index].team.nextEvent[0].competitions[0].competitors[i].id===this.state.data[index].team.id) {
                            confrecord = this.state.data[index].team.nextEvent[0].competitions[0].competitors[i].record[3].displayValue
                        }
                    }
                }
                if (this.state.data[index].team.nextEvent[0].competitions[0].boxscoreAvailable === true){
                    homeScores = this.state.homeScores.concat(this.state.data[index].team.nextEvent[0].competitions[0].competitors[0].score.displayValue);
                    awayScores = this.state.awayScores.concat(this.state.data[index].team.nextEvent[0].competitions[0].competitors[1].score.displayValue);
                }
                else{
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
                        <td id="scores">{this.state.data[index].team.record.items[0].summary}</td>
                    </tr>
                    <tr>
                        <td>Conf. Record:</td>
                        <td id="scores">{confrecord}</td>
                    </tr>
                    <tr>
                        <td>Matchup:</td>
                        <td id="scores">{this.state.data[index].team.nextEvent[0].shortName}</td>
                        {/* <td id="scores">{this.state.data[index].team.nextEvent[0].competitions[0].status.type.detail}</td> */}
                    </tr>
                    <tr>
                        <td>Score:</td>
                        <td id="scores"><td>{this.state.data[index].team.nextEvent[0].competitions[0].competitors[1].team.abbreviation} {awayScores}</td><td>{this.state.data[index].team.nextEvent[0].competitions[0].competitors[0].team.abbreviation} {homeScores}</td></td>
                    </tr>
                    <tr>
                        <td colSpan="2">{this.state.data[index].team.standingSummary !== undefined ? this.state.data[index].team.standingSummary : "Information Not Available"}</td>
                    </tr>
                    </tbody>
                    <tfoot>
                        <td colSpan="2">
                        {this.state.data[index].team.nextEvent[0].competitions[0].venue.fullName.includes("(" || ")") ? <a href={location} target="_blank" rel="noopener noreferrer" id="venue">{this.state.data[index].team.nextEvent[0].competitions[0].venue.fullName}</a> : <a href={location} target="_blank" rel="noopener noreferrer" id="venue">{this.state.data[index].team.nextEvent[0].competitions[0].venue.fullName} ({this.state.data[index].team.nextEvent[0].competitions[0].venue.address.city}, {this.state.data[index].team.nextEvent[0].competitions[0].venue.address.state})</a>}
                        </td>
                    </tfoot>
                    <br/>
                    <br/>
                    </span>
                )   
                }
                //var splitData = this.splitScoreTable(tableData, tableData.length % 2 === 1 ? tableData.length/2 + 1 : tableData.length/2);
                var newData = []
                for (let index = 0; index < tableData.length; index++) {
                    newData.push(
                            <span>
                                <td>
                                    <table class="card-table">
                                        {tableData[index]}
                                    </table>
                                </td>
                                <td id="separator"></td>
                                <td >
                                    <table class="card-table">
                                        {tableData[index+1]}
                                    </table>
                                </td>
                                <td id="separator"></td>
                                <td >
                                    <table class="card-table">
                                        {tableData[index+2]}
                                    </table>
                                </td>
                            </span>
                    )
                    index+=index+2
                }

                return (
                    <table> 
                        {newData}
                    </table>
                )
           
        }
        else{
        return(
            <h1>Loading...</h1>
        )}
        
    }
}