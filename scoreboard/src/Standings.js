import React from 'react';
import { useLayoutEffect, useState } from "react";
import './Standings.css';
import useFetchAppDataScoreboard from './Hooks';

const Standings = (props) => {

    //Constructor
    const divisions = useFetchAppDataScoreboard(props.league, props.sport, props.page, "");
    const [width] = useMediaQuery();

    var tableData = divisions.map(division => {
        var array = [];

        array.push(
            <span key={division.id} id="division">
                <table className="card-table">
                <thead>
                    <tr style={{border: "solid 2.5px grey", fontSize: "3vh"}}>
                    <th id={width > 769 ? "scores" : "scores-mobile"} style={{backgroundColor: "#428bca"}} colSpan="3">{division.name}</th>
                    <th id={width > 769 ? "scores" : "scores-mobile"} style={{backgroundColor: "#428bca"}}>W</th>
                    <th id={width > 769 ? "scores" : "scores-mobile"} style={{backgroundColor: "#428bca"}}>L</th>
                    <th id={width > 769 ? "scores" : "scores-mobile"} style={{backgroundColor: "#428bca"}}>D</th>
                    </tr>
                </thead>
                <tbody className="scoreboard">
                    {teamBox(division, width)}
                </tbody>
                </table>
                <br/>
            </span>  
        )   
        return array
    })

    var newData = []
    if (width > 769) {
        for (let index = 0; index < tableData.length; index=index+3) {
            newData.push(
                <div key={props.league + index.toString()} className="flexcontainer">                        
                    {tableData[index]}
                    {tableData[index+1]}
                    {tableData[index+2]}
                </div>
            )
        }
    }
    else {
        for (let index = 0; index < tableData.length; index++) {
            newData.push(
                <div key={props.league + index.toString()} className="flexcontainer-mobile">
                    {tableData[index]}
                </div>
            )
        }
    }
    return (
        <span> 
            {newData}
        </span>
    )
};

//HELPER FUNCTIONS TO BUILD HTML

function teamBox(division, width){
    let entries = [];
    for (var e = 0; e < division.standings.entries.length; e++) {
      entries.push(division.standings.entries[e]);
    }
    entries.sort((a, b) => (Number(a.stats[8].displayValue) > Number(b.stats[8].displayValue)) ? 1 : -1)
    var teams = [];
    for (var t = 0; t < entries.length; t++){
        teams.push(<tr>
        <td id="scores" style={{backgroundColor: "#A9A9A9"}}><b>{entries[t].stats[8].displayValue}</b></td>
        <td id="logo"><img id="thumb" alt="" src={entries[t].team.logos[0].href}/></td>
        <td id="teams">
            <b>{width > 769 ? entries[t].team.displayName : entries[t].team.abbreviation}</b>
        </td>
        <td id="scores">{entries[t].stats[0].displayValue}</td>
        <td id="scores">{entries[t].stats[1].displayValue}</td>
        <td id="scores">{entries[t].stats[2].displayValue}</td>
        </tr>)
    }
    return teams;
}

function useMediaQuery() {
    const [screenSize, setScreenSize] = useState([0, 0]);
    
    useLayoutEffect(() => {
      function updateScreenSize() {
        setScreenSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener("resize", updateScreenSize);
      updateScreenSize();
      return () => window.removeEventListener("resize", updateScreenSize);
    }, []);
    
    return screenSize;
  }  

export default Standings;
