import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LandingPage from './components/Landing.jsx';

import MainPage from './components/Main.jsx';
import './index.css';


export default function Index() {
	return <div>
		<header className="App-header">
		<link rel="icon" href="favicon" type="image/x-icon" />
			<Router>
				<Switch>
					<Route path="/main">
						<MainPage/>
					</Route>
					<Route path="/*">
						<LandingPage/>
					</Route>
				</Switch>
			</Router>
		</header>
	</div>;
}
