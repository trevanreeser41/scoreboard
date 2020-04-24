import React, { Component } from 'react';
import './NFLDraft.css';

export class NFLDraft extends Component {

    constructor(props) {
        super(props)
		this.state = {
            sports: [
                ["basketball","mens-college-basketball"],
                ["football", "college-football"]
            ],
            draftInfo: {},
            loading: true,
        };
    }

    componentDidMount() {
        this.populateRankings();
        this.interval = setInterval(() => {
            this.populateRankings();
        }, 300000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    populateRankings = () => { 
        for (let index = 0; index < this.state.sports.length; index++) {
            fetch(`http://site.api.espn.com/apis/site/v2/sports/football/nfl/draft`)
                .then(function (response) {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error("Unable to retrieve required data from server.");
                })
                .then(data => {
                    this.setState({loading: false, draftInfo: data})
                })
                .catch(function (error) {
                console.log("Error: ", error.message);
            });
            }   
    }    

    displayAthlete(pick) {
        try {
            return pick.athlete.displayName;
        }
        catch {
            return ""
        }
    }

    getSchool(pick) {
        try {
            return pick.athlete.team.location
        }
        catch {
            return ""
        }
    }

    getHeadshot(pick) {
        try {
            return pick.athlete.headshot.href
        }
        catch {
            return ""
        }
    }

    render() {
        if (this.state.loading===false){
            var newData = []
            var teams = this.state.draftInfo.teams
            teams = teams.sort()
            var picks = this.state.draftInfo.picks
            var current = this.state.draftInfo.current
            var currentTeam= teams.filter(team=>team.id===picks[current.pickId-1].teamId)[0]
            console.log(currentTeam)

            for (let index = 0; index < picks.length; index++) {
                var team=teams[picks[index].teamId]
                team = teams.filter(team=>team.id===picks[index].teamId)
                newData.push(
                    <tr>
                        <td>
                            {picks[index].overall}
                        </td>
                        <td>
                            {picks[index].pick}
                        </td>
                        <td>
                            {picks[index].round}
                        </td>
                        <td>
                            <img id="logo" src={team[0].logo} alt="logo"/>
                        </td>                        
                        <td>
                            {this.displayAthlete(picks[index])}
                        </td>
                        <td>
                            <img id="headshot" src={this.getHeadshot(picks[index])} alt="headshot"/>
                        </td>
                        <td>
                            {this.getSchool(picks[index])}
                        </td>  
                        <td>
                            {picks[index].tradeNote}
                        </td>                      
                    </tr>
                )
                
            }

            return(
                <span>
                    <h2>
                        Current Draft Pick
                    </h2>
                    <div className="card">
                        {currentTeam.displayName}
                        <br/>
                        <img alt="logo" src={currentTeam.logo}/>
                        <br/>
                        {currentTeam.record.summary}
                        <br/>
                        <br/>
                        {currentTeam.record.standing}
                    </div>
                    <br/>
                    <br/>
                    <div className="row">
                        <div class="card column">
                            <h2>
                                Best Fit
                            </h2>
                            <img alt="headshot" src={current.bestFit.headshot.href} ></img>
                                <div class="container">
                                    <h4><b>{current.bestFit.displayName}</b></h4>
                                    <p>
                                        {current.bestFit.attributes[0].abbreviation} {current.bestFit.attributes[0].displayValue}
                                    </p>
                                    <p>
                                        {current.bestFit.attributes[1].abbreviation} {current.bestFit.attributes[1].displayValue}
                                    </p>
                                    <p>
                                        {current.bestFit.attributes[2].abbreviation} {current.bestFit.attributes[2].displayValue}
                                    </p>
                                </div>
                        </div>
                        <div class="card column">
                            <h2>
                                Best Available
                            </h2>
                            <img alt="headshot" src={current.bestAvailable.headshot.href}></img>
                            <div class="container">
                                <h4><b>{current.bestAvailable.displayName}</b></h4>
                                <p>
                                    {current.bestAvailable.attributes[0].abbreviation} {current.bestAvailable.attributes[0].displayValue}
                                </p>
                                <p>
                                    {current.bestAvailable.attributes[1].abbreviation} {current.bestAvailable.attributes[1].displayValue}
                                </p>
                                <p>
                                    {current.bestAvailable.attributes[2].abbreviation} {current.bestAvailable.attributes[2].displayValue}
                                </p>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <br/>
                    <table>
                        <thead>
                            <th>
                                Overall
                            </th>
                            <th>
                                Pick
                            </th>
                            <th>
                                Round
                            </th>
                            <th>
                                Team
                            </th>                            
                            <th colSpan="2">
                                Athlete
                            </th>
                            <th>
                            School
                            </th>
                            <th>
                                Trade Note
                            </th>
                        </thead>
                        <tbody>
                        {newData}
                        </tbody>
                    </table>
                </span>
            )
        }
    else{
        return(
            <h1>Loading...</h1>
        )}
    }
}