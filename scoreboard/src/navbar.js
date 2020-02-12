import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//import logo from '../logo.png';
import './NavBar.css';

export class NavBar extends Component {
    static displayName = NavBar.name;

    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true,
            teams: {},
            teamsLoading: true,
            month: 0,
            day: 0,
        };

    }

    // componentDidMount() {
    //     this.populateList();
    // }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    // Determines the current date
    getDate = () => {
        var d = new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        this.setState({ month: month, day: day });
    }

    // populateList = () => {
    //     fetch('api/Dashboard/GetTeamsDict')
	// 		.then(response => response.json())
	// 		.then(teamList =>
	// 			this.setState({ teams: teamList })
    //         );
    // }

    // Dynamically generates routes based on teams in database
    static renderTeamLinks(teamList, currentPage, month, day) {
        // Creates array to store the nav links
        let teamLinks = [];

        // Loops through data and pushes it to table        
        for (var key in teamList) {
            let teamName = teamList[key];
            teamLinks.push(
                <Link 
                    className={currentPage === teamName ? "nav-item nav-link active" : "nav-item nav-link"} 
                    to={"/" + teamName}>{teamName}&emsp;
                </Link>
            );
        }

        return (
            <span>
                {teamLinks}
            </span> 
        );
    }

    render() {
        const collapsed = this.state.collapsed;
        const classOne = collapsed ? 'collapse navbar-collapse' : 'collapse navbar-collapse show';
        const classTwo = collapsed ? 'navbar-toggler collapsed mr-auto' : 'navbar-toggler mr-auto';
        let teamLinks = (this.state.teamsLoading)
			&& NavBar.renderTeamLinks(
                this.state.teams,
                this.props.currentPage,
                this.state.month,
                this.state.day,
            );

        return (
            <header>
                <nav class="navbar navbar-expand-md navbar-light bg-light navbar-toggleable-md border-bottom box-shadow mb-3">
                    <button onClick={this.toggleNavbar} className={`${classTwo}`} type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div className={`${classOne}`} id="navbarNavAltMarkup">
                        <div class="navbar-nav">
                            <Link className="nav-item nav-link active" to="/"> Live Scoreboard</Link>
                            {teamLinks}
                            <Link className={this.props.currentPage === "NBA" ? "nav-item nav-link active" : "nav-item nav-link"} to="/NBA">NBA</Link>
                            <Link className={this.props.currentPage === "UtahJazz" ? "nav-item nav-link active" : "nav-item nav-link"} to="/UtahJazz">Utah Jazz</Link>
                            <Link className={this.props.currentPage === "BYU" ? "nav-item nav-link active" : "nav-item nav-link"} to="/BYU">BYU</Link>
                        </div>
                    </div>
                </nav>
            </header>
        );
    }
}
