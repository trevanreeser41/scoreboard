import React, { Component } from 'react';
import './Rankings.css';
import {Link} from 'react-router-dom';

export class Rankings extends Component {

    constructor(props) {
        super(props)
		this.state = {
            sports: [
                ["basketball","mens-college-basketball"],
                ["football", "college-football"]
            ],
            data: [],
            loading: true,
            width: 0,
            height: 0,
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.populateRankings();
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    populateRankings = async () => { 
        var dataarray = []
        for (let index = 0; index < this.state.sports.length; index++) {
            await fetch(`http://site.api.espn.com/apis/site/v2/sports/${this.state.sports[index][0]}/${this.state.sports[index][1]}/rankings`)
                .then(function (response) {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error("Unable to retrieve required data from server.");
                })
                .then(data => {
                    dataarray.push(data)
                    this.setState({loading: false, data: dataarray})
                })
                .catch(function (error) {
                console.log("Error: ", error.message);
            });
        }   
    }

    getTeamIdentifier(team) {
        let teamName = team.location.replace("'", "").replace("&", "").replace("\"", "").replace(/ /g, "").replace("State","St");
        return teamName;
    }

    render() {
        if (this.state.loading===false){
            var newData = []
            for (let index = 0; index < this.state.data.length; index++) {
                var tableData = []
                for (let index1 = 0; index1 < this.state.data[index].rankings[0].ranks.length; index1++) {                
                    tableData.push(
                        <tr key={"Rankings " + this.state.sports[index][0] + " " + this.state.data[index].rankings[0].ranks[index1].current}>{/*example key="Rankings basketball 14"*/}
                            <td id="logo"><img id="thumb" alt="logo" src={this.state.data[index].rankings[0].ranks[index1].team.logo}/></td><td className="rank">{this.state.data[index].rankings[0].ranks[index1].current}</td>
                            <td> 
                            <Link to={`${this.state.sports[index][0]}/${this.state.sports[index][1]}/${this.getTeamIdentifier(this.state.data[index].rankings[0].ranks[index1].team)}`}>
                                {this.state.data[index].rankings[0].ranks[index1].team.location} {this.state.data[index].rankings[0].ranks[index1].team.name}
                            </Link>
                            </td>
                        </tr>                        
                    )   
                }
                if (this.state.width > 769) {
                    newData.push(
                        <div key={"Rankings " + this.state.sports[index][1]} className="grid-item rankings">{/*example key="Rankings mens-college-basketball"*/}
                            <table className="rankingsTable">
                                <thead><tr><th colSpan="3">{this.state.data[index].leagues[0].name} {this.state.data[index].rankings[0].name}</th></tr></thead>
                                <tbody>{tableData}</tbody>
                            </table>
                        </div>
                    )
                }
                else  {
                    newData.push(
                        <div key={"Rankings " + this.state.sports[index][1]} className="grid-item rankings-mobile">{/*example key="Rankings mens-college-basketball"*/}
                            <table className="rankingsTable">
                                <thead><tr><th colSpan="3" style={{fontSize: '6pt'}}>{this.state.data[index].leagues[0].name} {this.state.data[index].rankings[0].name}</th></tr></thead>
                                <tbody>{tableData}</tbody>
                            </table>
                        </div>
                    )
                }
            }
            if (newData.length === 2) {
                return(
                    <div className="flexcontainer">
                        {newData}
                    </div>
            )}
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