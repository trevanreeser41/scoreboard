import React, { Component } from 'react';
import { NavBar } from './navbar.js';
import { Container } from 'reactstrap';
//import LiveScores from './LiveScores.js';

export class Layout extends Component {
	displayName = Layout.name

	getCurrentPage() {
		// Splits URL into array and saves the last element
		let url = window.location.href;
		let urlArr = url.split("/");
		return urlArr[urlArr.length - 1];
	}

	render() {
		return (
			<div className="body">
				<NavBar id="navContent" currentPage={this.getCurrentPage()}/><br/><br/><br/>
				<Container id="bodyContent">
					{this.props.children}
				</Container>
				{/* <LiveScores /> */}
			</div>
		);
	}
}
