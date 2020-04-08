import React, { Component } from 'react';
// import { UpdateScore } from './UpdateScore';
import './Rankings.css';

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
        };
    }

    async componentDidMount() {
        await this.populateRankings();
    }

    populateRankings = () => { 
        var dataarray =[]
        //console.log(this.state.sports.length)
        for (let index = 0; index < this.state.sports.length; index++) {
            //console.log(this.state.sports[index])
            fetch(`http://site.api.espn.com/apis/site/v2/sports/${this.state.sports[index][0]}/${this.state.sports[index][1]}/rankings`)
                .then(function (response) {
                    if (response.ok) {
                        return response.json();
                    }
    
                    throw new Error("Unable to retrieve required data from server.");
                })
                .then(data => {
                    //console.log(data)
                    dataarray.push(data)
                    this.setState({loading: false,data: dataarray})
                    //console.log(this.state.data)
                    //console.log(this.state.data)
                })
                .catch(function (error) {
                console.log("Error: ", error.message);
            });
            }   
            // console.log(this.state.data)
    }

    render() {
        if (this.state.loading===false){
            var newData = []
            for (let index = 0; index < this.state.data.length; index++) {
                var tableData = []
                for (let index1 = 0; index1 < this.state.data[index].rankings[0].ranks.length; index1++) {
                
                    tableData.push(
                        <tr key={"Rankings " + this.state.sports[index][0] + " " + this.state.data[index].rankings[0].ranks[index1].current}>{/*example key="Rankings basketball 14"*/}
                            <td id="logo"><img id="thumb" alt="logo" src={this.state.data[index].rankings[0].ranks[index1].team.logo}/></td><td className="rank">{this.state.data[index].rankings[0].ranks[index1].current}</td><td> {this.state.data[index].rankings[0].ranks[index1].team.location} {this.state.data[index].rankings[0].ranks[index1].team.name}</td>
                        </tr>
                    )   
                }
                newData.push(
                    <div key={"Rankings " + this.state.sports[index][1]} className="grid-item rankings">{/*example key="Rankings mens-college-basketball"*/}
                        <table className="rankingsTable">
                            <thead><tr><th colSpan="3">{this.state.data[index].leagues[0].name} {this.state.data[index].rankings[0].name}</th></tr></thead>
                            <tbody>{tableData}</tbody>
                        </table>
                    </div>
                )

            }

            return(
                <span className="flexcontainer">
                    {newData}
                </span>
            )
        }
        else{
            return(
                <h1>Loading...</h1>
            )}
    }
}