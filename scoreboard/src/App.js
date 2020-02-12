import React from 'react';
//import logo from './logo.svg';
import { Route } from 'react-router';
import { Layout } from './layout';
import './App.css';

function App() {
  return (
    < Layout >
      <Route 
          exact path='/'
          />

      <Route 
          path='/NBA'
/>
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
