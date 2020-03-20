import React from 'react';
import { Route } from 'react-router';
import { Layout } from './layout';
import './App.css';
import { Scoreboard } from './Scoreboard';
import { Team } from './Team';

function App() {

    return (
      < Layout >
        <Route 
            exact path='/'
            />
        <Route path='/NBA'>
            <Scoreboard sport="basketball" league="nba"/>
        </Route>
        {/* <Route path='/CollegeBasketball'>
          <Scoreboard sport="basketball" league="mens-college-basketball" team="Mobile" title="Welcome to the R365 Version Dashboard!" id="Red" dotcom={true} isCanary={false} />
        </Route> */}
        <Route path='/NCAAF'>
          <Scoreboard sport="football" league="college-football"/>
        </Route>
        <Route path='/Favorites'>
          <Team />
        </Route>
        <br/>
      </Layout >
    );
  }

  export default App;