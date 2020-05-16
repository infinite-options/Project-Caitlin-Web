import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LandingPage from './components/Landing.jsx';

import MainPage from './components/Main.jsx';
import './index.css';


export default function Index() {
	return <div>
		<header className="App-header">
			<Router>
				<Switch>
					<Route exact path="/">
						<LandingPage/>
					</Route>
					<Route path="/main">
						<MainPage/>
					</Route>
				</Switch>
			</Router>
		</header>
	</div>;
}
