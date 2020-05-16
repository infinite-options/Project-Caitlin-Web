import React, { Component } from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import MainPage from "./components/Main.jsx";
import LandingPage from "./components/Landing.jsx";

class App extends Component {
  render() {
    return (
      <div>
        <header className="App-header">
          <Switch>
            <Router>
              <Route exact path="/">
                <LandingPage />
              </Route>
              <Route path="/main">
                <MainPage />
              </Route>
              <Route path='/*'>
                <MainPage />
              </Route>
            </Router>
          </Switch>
        </header>
      </div>
    );
  }
}

export default App;
