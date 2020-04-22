import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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

    render() {
        const collapsed = this.state.collapsed;
        const classOne = collapsed ? 'collapse navbar-collapse' : 'collapse navbar-collapse show';
        const classTwo = collapsed ? 'navbar-toggler collapsed mr-auto' : 'navbar-toggler mr-auto';

        return (
            <header>
                <nav className="navbar navbar-expand-md navbar-light bg-light navbar-toggleable-md border-bottom box-shadow mb-3">
                    <button onClick={this.toggleNavbar} className={`${classTwo}`} type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`${classOne}`} id="navbarNavAltMarkup">
                        <div className="navbar-nav">
                            <Link className="nav-item nav-link" to="/">Personal Scoreboard</Link>                 
                            <Link className="nav-item nav-link" to="/NBA">NBA</Link>
                            <Link className="nav-item nav-link" to="/CollegeFootball">NCAAF</Link>
                            <Link className="nav-item nav-link" to="/CollegeBasketball">NCAAM</Link>
                            <Link className="nav-item nav-link" to="/NFL">NFL</Link>
                            <Link className="nav-item nav-link" to="/NHL">NHL</Link>                            
                            <Link className="nav-item nav-link" to="/MLB">MLB</Link>
                            <Link className="nav-item nav-link" to="/MLS">MLS</Link>
                            <Link className="nav-item nav-link" to="/ChampionsLeague">UEFA</Link>
                            <Link className="nav-item nav-link" to="/Rankings">Rankings</Link>
                            <Link className="nav-item nav-link" to="/NFLDraft">NFL Draft</Link>
                        </div>
                    </div>
                </nav>
            </header>
        );
    }
}
