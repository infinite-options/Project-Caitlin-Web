import React, { Component } from 'react';


import { BrowserRouter as Router } from "react-router-dom";

import MainPage from './components/Main.jsx';
import Header from './components/Header.jsx'
class App extends Component {
  render() {
    return (
      <div >
        
        <header className="App-header">
        <Router>
        <Header />
          <div>
            <MainPage />
          </div>
         
        </Router>
        </ header>
      </div>
    );
  }
}

export default App;
