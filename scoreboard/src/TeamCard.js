import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardHeader from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import { TableRow, TableCell, TableHead, TableContainer, withStyles, TableFooter } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles({
  root: {
    width: 300,
    background: "transparent",
    color: 'white',
    padding: 0
  },
  media: {
    height: 30,
    width: 30,
    margin: 0,
  },
  table:{
    margin:0,
    textAlign: "left"
  }
});

const FirstCell = withStyles({
  root:{
    alignContent: 'center',
    padding: 4,
  },
  media:{
    height: 2,
    width: 2,
    margin: 0,
  }
})(TableCell);

const SecondCell = withStyles({
  root:{
    margin: 0,
    fontSize: 10,
    alignContent: 'left',
    verticalAlign: 'center',
    padding: 0,
    background: 'white',
    width: 600,
    padding: 5,
  },
})(TableCell);

const ThirdCell = withStyles({
  root:{
    background: 'lightgray',
    width: '4vw',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
  },
})(TableCell);

export default function TeamCard(props) {
  const classes = useStyles();
  console.log('INSIDE CARD:')
  console.log(props.matchup)
  var awayTeam=getAwayTeam(props.matchup)
  var homeTeam=getHomeTeam(props.matchup)
  console.log(homeTeam)
  console.log(props.league)
  var status = intoOT(props.matchup.status.type.completed, props.matchup.status.period, props.league, props.matchup)
  let location = openToVenue(props.matchup)
  var homeTeamRecord;
  var awayTeamRecord;
  homeTeam.records !== undefined ? homeTeamRecord = homeTeam.records[0].summary : homeTeamRecord = "0-0"
  awayTeam.records !== undefined ? awayTeamRecord = awayTeam.records[0].summary : awayTeamRecord = "0-0"
  

  return (
    <Card className={classes.root}>
      <CardHeader
      title={status}/>
      <CardContent>
        <TableContainer>
          <Table>
              {status}
          </Table>
        </TableContainer>
        <TableContainer component={Paper}>
          <Table className={classes.table}>
            <TableRow>
              <FirstCell>
              <CardMedia
                  component="img"
                className={classes.media}
                image={awayTeam.logo}
                title="Logo"/>
              </FirstCell>
              <SecondCell align="left">
                  {awayTeam.displayName} ({awayTeamRecord})
              </SecondCell>
              <ThirdCell>
                  {props.matchup.competitors[0].score}
              </ThirdCell>
            </TableRow>
          </Table>
          </TableContainer>
          <TableContainer component={Paper}>
          <Table>
          {/* <caption> {props.matchup.venue.fullName.includes("(" || ")") ? <a href={location} target="_blank" rel="noopener noreferrer" id="venue">{props.matchup.venue.fullName}</a> : <a href={location} target="_blank" rel="noopener noreferrer" id="venue">{props.matchup.venue.fullName} ({props.matchup.venue.address.city}, {props.matchup.venue.address.state})</a>}</caption> */}
            <TableRow>
              <FirstCell>
              <CardMedia
                component="img"
                className={classes.media}
                image={homeTeam.logo}
                title="Logo"/>
              </FirstCell>
              <SecondCell align="left">
                  {homeTeam.displayName} ({homeTeamRecord})
              </SecondCell>
              <ThirdCell>
                  {props.matchup.competitors[1].score}
              </ThirdCell>
              
            </TableRow>
          </Table>
          <TableFooter >
              &nbsp; &nbsp;{props.matchup.venue.fullName.includes("(" || ")") ? <a href={location} target="_blank" rel="noopener noreferrer" id="venue">{props.matchup.venue.fullName}</a> : <a href={location} target="_blank" rel="noopener noreferrer" id="venue">{props.matchup.venue.fullName} ({props.matchup.venue.address.city}, {props.matchup.venue.address.state})</a>}
            </TableFooter>
          </TableContainer>
        </CardContent>        
    </Card>
  );
}


function includeRankings(league, matchup){
  if (league.includes('college')){
                  
      var AwayRanking = matchup.competitors[1].curatedRank.current
      var  HomeRanking = matchup.competitors[0].curatedRank.current
      if (HomeRanking > 25 || HomeRanking===0){
          HomeRanking=''
      }
      if (AwayRanking > 25 || AwayRanking===0){
          AwayRanking=''
      }
  }
  return [HomeRanking, AwayRanking]
}

function intoOT(completed, period, league, matchup){
  var OT;
  if (league === "college-football"){
      OT=5
  }
  else if (league=== "nba"){
      OT=5
  }
  else if (league=== "mens-college-basketball"){
      OT=3
  }
  else if (league=== "nfl"){
      OT=5
  }
  else if (league=== "mlb"){
      OT=10
  }
  else if (league=== "nhl"){
      OT=4
  }
  if (completed === true) {
      if (period === OT) {
          return <b>FINAL/OT</b>
      }
      else if (matchup.status.period > OT){
          if (league === 'mlb'){
              return <b>FINAL/{period} innings</b>
          }
          else{
              let overtime_period = period - (OT-1)
              return <b>FINAL/{overtime_period}OT</b>
          }
      }
      else {
          return <b>FINAL</b>
      }
  }
  else if (period < OT && period > 0) {
      if(league !== 'mlb'){
          return <span>Q{period} - {matchup.status.displayClock}</span>
      }
      else {
          return matchup.status.type.detail //once games are live, figure out where innings are displayed in the response
      }
  } 
  else if (period === 0) {
      return matchup.status.type.detail
  } else {
      
  }
}

function getHomeTeam(matchup){
  return matchup.competitors[0].team
}

function getAwayTeam(matchup){
  return matchup.competitors[1].team
}

function getTeamIdentifier(league, team) {
  if (league === 'college-football' && team.location.indexOf(' ') <= 0) {
      return team.location;
  }
  else {
      return team.abbreviation;
  }
}

function openToVenue(matchup){
  return "https://www.google.com/maps/search/?api=1&query=" + matchup.venue.fullName + " " + matchup.venue.address.city + " " + matchup.venue.address.state
}