import React from 'react';
import { Route } from 'react-router';
import { Layout } from './layout';
import './App.css';
import ScoreboardTable from './ScoreboardTable.js';
import { Team } from './Team';
import {Rankings} from './Rankings'
import { ScheduleTable } from './ScheduleTable';
<<<<<<< HEAD
import Standings from './Standings';
=======
import { NFLDraft } from './NFLDraft';
>>>>>>> jason

function App() {

    return (
      < Layout >
        <Route exact path='/'>
          <Team />
        </Route>
        <Route path='/NBA'>
            <ScoreboardTable sport="basketball" league="nba" initialRender={true}/>
        </Route>
        <Route path='/CollegeBasketball'>
          <ScoreboardTable sport="basketball" league="mens-college-basketball" initialRender={true}/>
        </Route>
        <Route path='/CollegeFootball'>
          <ScoreboardTable sport="football" league="college-football" initialRender={true}/>
        </Route>
        <Route path='/NFL'>
          <ScoreboardTable sport="football" league="nfl" initialRender={true}/>
        </Route>
        <Route path='/MLB'>
          <ScoreboardTable sport="baseball" league="mlb" initialRender={true}/>
        </Route>  
        <Route path='/NHL'>
          <ScoreboardTable sport="hockey" league="nhl" initialRender={true}/>
        </Route>   
        <Route path='/MLS'>
          <ScoreboardTable sport="soccer" league="usa.1" initialRender={true}/>
        </Route>
<<<<<<< HEAD
        <Route path='/UEFA'>
          <ScoreboardTable sport="soccer" league="uefa.champions" initialRender={true}/>
        </Route>              
=======
        <Route path='/ChampionsLeague'>
          <ScoreboardTable sport="soccer" league="uefa.champions"/>
        </Route >              
>>>>>>> jason
        <Route path='/Rankings'>
          <Rankings  />
        </Route>
        <Route exact path='/:sport/:league/standings' render={() => (<Standings sport={window.location.pathname.split("/")[1]} league={window.location.pathname.split("/")[2]} page="standings"/>)}/>
        <Route exact path='/:sport/:league/:team' render={() => (<ScheduleTable league={window.location.pathname.split("/")[2]} team={window.location.pathname.split("/")[3]}/>)}/>
<<<<<<< HEAD
=======
        <Route path='/NFLDraft'>
          <NFLDraft />
        </Route>
>>>>>>> jason
        <br/>
      </Layout >
    );
  }

  export default App;