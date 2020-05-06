import React from 'react';

const GameStatus = (props) => {
    var OT;
    var data;
    if (props.league === "college-football"){
        OT=5
    }
    else if (props.league=== "nba"){
        OT=5
    }
    else if (props.league=== "mens-college-basketball"){
        OT=3
    }
    else if (props.league=== "nfl"){
        OT=5
    }
    else if (props.league=== "mlb"){
        OT=10
    }
    else if (props.league=== "nhl"){
        OT=4
    }
    if (props.completed === true) {
        if (props.period === OT) {
            data = <b>FINAL/OT</b>
        }
        else if (props.matchup.status.period > OT){
            if (props.league === 'mlb'){
                data = <b>FINAL/{props.period} innings</b>
            }
            else{
                let overtime_period = props.period - (OT-1)
                data = <b>FINAL/{overtime_period}OT</b>
            }
        }
        else {
            data = <b>FINAL</b>
        }
    }
    else if (props.period < OT && props.period > 0) {
        if(props.league !== 'mlb'){
            data = <span>Q{props.period} - {props.matchup.status.displayClock}</span>
        }
        else {
            data = props.matchup.status.displayClock //once games are live, figure out where innings are displayed in the response
        }
    } 
    else if (props.period === 0) {
        data = props.matchup.status.type.detail
    } else {
        data = props.matchup.status.type.detail
    }
    return <span>{data}</span>;
}

export default GameStatus;