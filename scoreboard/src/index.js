import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
 

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');
var fixed = document.getElementById('background');

fixed.addEventListener('touchmove', function(e) {

        e.preventDefault();

}, false);


ReactDOM.render(<BrowserRouter basename={baseUrl}>
                    <App />
                </BrowserRouter>, rootElement);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
