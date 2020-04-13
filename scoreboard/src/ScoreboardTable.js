import React /*,{ useState }*/ from 'react';
// import './Scoreboard.css';
import useFetchAppDataScoreboard from './Hooks';
//import ScoreboardHTML from './Hooks';
import {Link} from 'react-router-dom';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Card, CardMedia } from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import TeamCard from './TeamCard'

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
      '&:nth-of-type(3)': {
        backgroundColor: theme.palette.error //theme.palette.background.paper,
      },
    },
  }))(TableCell);
  
  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default,
      },
    },
  }))(TableRow);

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        alignContent: 'space-between',
        alignItems: 'center',
        direction: 'row',
        justify: 'space-evenly',
    },
    paper: {
        height: 50,
        width: 100,
        margin: 'auto',
    },
}));




export default function ScoreboardTable(props){
    const classes = useStyles();
    const [spacing, setSpacing] = React.useState(2);
    //CONSTRUCTORS
    const matchups = useFetchAppDataScoreboard(props.league, props.sport)
    
    let status = '';
    let team1Record = '';
    let team2Record = '';
    var AwayRanking;
    var HomeRanking;

    const handleChange = (event) => {
        setSpacing(Number(event.target.value));
      };

    var tableData = matchups.map(matchup => {
        var array = []
        array.push(
                <Grid item xs={4}>
                    <TeamCard matchup={matchup} league={props.league} sport={props.sport}/>
                </Grid>
        )   
        return array
    })

    return (
        <Grid className={classes.root} container spacing={6}>
            {tableData}
        </Grid>
    )
}

//HELPER FUNCTIONS TO BUILD HTML
