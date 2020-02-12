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
          path='/AzureCanary1'
/>
      <Route 
          path='/AzureCanary2'
 />
      <Route 
          path='/SoftlayerCanaries'
  />
      <br/><br/><br/><br/><br/><br/><br/><br/>
    </Layout >
  );
}

export default App;
