import React from 'react';
import { Route } from 'react-router';
import { Layout } from './layout';
import './App.css';
import ScoreboardTable from './ScoreboardTable.js';
import { Team } from './Team';
import {Rankings} from './Rankings'
import { ScheduleTable } from './ScheduleTable';
import Standings from './Standings';
//import { NFLDraft } from './NFLDraft';

function App() {

    return (
      < Layout >
        <Route exact path='/'>
          <Team />
        </Route>
        <Route path='/NBA'>
            <ScoreboardTable sport="basketball" league="nba"/>
        </Route>
        <Route path='/CollegeBasketball'>
          <ScoreboardTable sport="basketball" league="mens-college-basketball" />
        </Route>
        <Route path='/CollegeFootball'>
          <ScoreboardTable sport="football" league="college-football"/>
        </Route>
        <Route path='/NFL'>
          <ScoreboardTable sport="football" league="nfl"/>
        </Route>
        <Route path='/MLB'>
          <ScoreboardTable sport="baseball" league="mlb"/>
        </Route>  
        <Route path='/NHL'>
          <ScoreboardTable sport="hockey" league="nhl"/>
        </Route>   
        <Route path='/MLS'>
          <ScoreboardTable sport="soccer" league="usa.1"/>
        </Route>
        <Route path='/ChampionsLeague'>
          <ScoreboardTable sport="soccer" league="uefa.champions"/>
        </Route>              
        <Route path='/Rankings'>
          <Rankings  />
        </Route>
        <Route exact path='/:sport/:league/standings' render={() => (<Standings sport={window.location.pathname.split("/")[1]} league={window.location.pathname.split("/")[2]} page="standings"/>)}/>
        <Route exact path='/:sport/:league/:team' render={() => (<ScheduleTable league={window.location.pathname.split("/")[2]} team={window.location.pathname.split("/")[3]}/>)}/>
        <br/>
      </Layout >
    );
  }

  export default App;