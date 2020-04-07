import React, { Component, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UpdateScore } from './UpdateScore';
import './Scoreboard.css';
import { useEffect, useState } from 'react';
import {useFetchAppData, getScoreboardHTML } from './Hooks';


function Scoreboardtable(){


    //CONSTRUCTOR
    const [matchups, setMatchups]=useState([])
    const {matchups} = useFetchAppData(props.league, props.sport)
    //const [homeScores, setHomeScores] =useState([])
    //const [awayScores, setAwayScores] =useState([])

    //COMPONENT DID MOUNT
    //imported from Hooks.js
    //need to figure out is league and sport can be passed as props, I think they can

    //MARK: Fetch statement, this calls the API and stores the information in this.State

    //MARK: Render logic using the helper functions and outputing the correct html
    
    
    return (
        <getScoreboardHTML matchups={matchups}/>
    );
}