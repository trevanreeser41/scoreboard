import React from 'react';
import { Route } from 'react-router';
import { Layout } from './layout';
import './App.css';
import { Scoreboard } from './Scoreboard';
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
          <Scoreboard sport="basketball" league="mens-college-basketball" />
        </Route>
        <Route path='/CollegeFootball'>
          <Scoreboard sport="football" league="college-football"/>
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