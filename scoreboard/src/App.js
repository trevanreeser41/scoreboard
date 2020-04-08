import React from 'react';
import { Route } from 'react-router';
import { Layout } from './layout';
import './App.css';
import { Scoreboard } from './Scoreboard';
import ScoreboardTable from './ScoreboardTable.js';
import { Team } from './Team';
import {Rankings} from './Rankings'
import { ScheduleTable } from './ScheduleTable';

function App() {

    return (
      < Layout >
        <Route exact path='/'>
          <Team />
        </Route>
        <Route path='/NBA'>
            <Scoreboard sport="basketball" league="nba"/>
        </Route>
        <Route path='/CollegeBasketball'>
          <ScoreboardTable sport="basketball" league="mens-college-basketball" />
        </Route>
        <Route path='/CollegeFootball'>
          <ScoreboardTable sport="football" league="college-football"/>
        </Route>
        <Route path='/NFL'>
          <Scoreboard sport="football" league="nfl"/>
        </Route>
        <Route path='/MLB'>
          <Scoreboard sport="baseball" league="mlb"/>
        </Route>  
        <Route path='/NHL'>
          <Scoreboard sport="hockey" league="nhl"/>
        </Route>   
        <Route path='/MLS'>
          <Scoreboard sport="soccer" league="usa.1"/>
        </Route>
        <Route path='/ChampionsLeague'>
          <Scoreboard sport="soccer" league="uefa.champions"/>
        </Route>              
        <Route path='/Rankings'>
          <Rankings  />
        </Route>
        <Route path='/sports/'>
          <ScheduleTable />
        </Route>
        <br/>
      </Layout >
    );
  }

  export default App;