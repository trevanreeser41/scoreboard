import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './layout';
import './App.css';
import { Scoreboard } from './Scoreboard';

function App() {

    return (
      < Layout >
        <Route 
            exact path='/'
            />
        <Route path='/NBA'>
            <Scoreboard team="Mobile" title="Welcome to the R365 Version Dashboard!" id="Red" dotcom={true} isCanary={false} />}
        </Route>
        <Route 
            path='/UtahJazz'
    />
        <Route 
            path='/BYU'
    />
        <br/><br/><br/><br/><br/><br/><br/><br/>
      </Layout >
    );
  }

  export default App;