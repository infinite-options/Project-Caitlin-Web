import React, { Component } from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import MainPage from "./components/Main.jsx";
import LandingPage from "./components/Landing.jsx";

class App extends Component {
  render() {
    return (
      <div>
        <header className="App-header">
          <Switch>
            <Router exact path='/'>
              <LandingPage />
            </Router>
            <Router path='/main'>
              <MainPage />
            </Router>
          </Switch>
        </header>
      </div>
    );
  }
}

export default App;
