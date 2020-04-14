import React, { Component } from 'react';
// import { UpdateScore } from './UpdateScore';
// import './Rankings.css';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useFetchAppDataRankings } from './Hooks.js';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import NavTabs from './NavTabs'

const useStyles = makeStyles({
    root: {
      width: 100,
      background: "transparent",
      color: 'white',
      padding: 0
    },
    media: {
      height: 15,
      width: 300,
      margin: 0,
    },
    table:{
      margin:0,
      textAlign: "left"
    },
    RankingsTable:{
        marginBottom: 100
    }
  });
  
  const FirstCell = withStyles({
    root:{
      alignContent: 'center',
      padding: 4,
      width: 5,
      margin: 0,
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
      width: 25,
      padding: 5,
      fontWeight: 'bold',
    },
  })(TableCell);
  
  const ThirdCell = withStyles({
    root:{
      background: 'lightgray',
      width: 10,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 12,
    },
  })(TableCell);

export default function RankingsTable(props){
    const sports = [
            ["basketball","mens-college-basketball"],["football", "college-football"]
        ]
    const rankingsOutput = useFetchAppDataRankings(sports)
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    console.log(rankingsOutput)
    var classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
      };

    var newData = []
    for (let index = 0; index < rankingsOutput.length; index++) {
        var tableData = []
        for (let index1 = 0; index1 < rankingsOutput[index].rankings[0].ranks.length; index1++) {
        
            tableData.push(
                <TableRow  key={"Rankings " + sports[index][0] + " " + rankingsOutput[index].rankings[0].ranks[index1].current}>{/*example key="Rankings basketball 14"*/}
                    <FirstCell id="logo"><img className={classes.media} id="thumb" alt="logo" src={rankingsOutput[index].rankings[0].ranks[index1].team.logo}/></FirstCell>
                    <SecondCell className="rank">{rankingsOutput[index].rankings[0].ranks[index1].current}</SecondCell>
                    <ThirdCell> {rankingsOutput[index].rankings[0].ranks[index1].team.location} {rankingsOutput[index].rankings[0].ranks[index1].team.name}</ThirdCell>
                </TableRow>
            )   
        }
        newData.push(
            <TableContainer component={Paper} className="rankingsTable">
                <Table aria-label="customized table" className={classes.table}>
                <TableRow colSpan="3">
                    {rankingsOutput[index].leagues[0].name} {rankingsOutput[index].rankings[0].name}
                </TableRow>
                <TableBody>
                    {tableData}
                </TableBody>
                </Table>
            </TableContainer>
        )

    }

    

    return(
        <NavTabs rankings={newData}/>

    )
}
