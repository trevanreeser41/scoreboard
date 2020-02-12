import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
//import logo from '../logo.png';
import './Scoreboard.css';

export class Scoreboard extends Component {

    populateScoreboard = () => { 
        fetch('http://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard')
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }

                throw new Error("Unable to retrieve required data from server.");
            })
            .then(function (data) {
                console.log(data);

            })
            .catch(function (error) {
            console.log("Error: ", error.message);
        });
    }
    render() {
        return (
        <Table striped size="lg">
            <thead>
                <tbody>
                <tr>
                    <td className="center">Team One Name</td>
                    <td className="center">Score</td>
                </tr>
                <tr>
                    <td className="center">Team Two Name</td>
                    <td className="center">Score</td>
                </tr>
                </tbody>
            </thead>
        </Table>
        )
    }
}