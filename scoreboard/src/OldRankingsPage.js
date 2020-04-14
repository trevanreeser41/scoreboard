import React, { Component } from 'react';
// import { UpdateScore } from './UpdateScore';
import './Rankings.css';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      fontSize: 24,
    },
    body: {
      fontSize: 18,
      size: 'medium',
    },
  }))(TableCell);
  
const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default,

        },
    },
}))(TableRow);

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});

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
                        <TableRow  key={"Rankings " + this.state.sports[index][0] + " " + this.state.data[index].rankings[0].ranks[index1].current}>{/*example key="Rankings basketball 14"*/}
                            <StyledTableCell id="logo"><img id="thumb" alt="logo" src={this.state.data[index].rankings[0].ranks[index1].team.logo}/></StyledTableCell>
                            <StyledTableCell className="rank">{this.state.data[index].rankings[0].ranks[index1].current}</StyledTableCell>
                            <StyledTableCell> {this.state.data[index].rankings[0].ranks[index1].team.location} {this.state.data[index].rankings[0].ranks[index1].team.name}</StyledTableCell>
                        </TableRow>
                    )   
                }
                newData.push(
                    <div key={"Rankings " + this.state.sports[index][1]} className="grid-item rankings">{/*example key="Rankings mens-college-basketball"*/}
                        <TableContainer component={Paper} className="rankingsTable">
                            <Table aria-label="customized table">
                            <TableHead>
                                    <StyledTableRow>
                                        <StyledTableCell colSpan="3">
                                            {this.state.data[index].leagues[0].name} {this.state.data[index].rankings[0].name}
                                        </StyledTableCell>
                                    </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {tableData}
                            </TableBody>
                            </Table>
                        </TableContainer>
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