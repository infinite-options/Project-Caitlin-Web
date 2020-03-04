import React, { Component } from 'react';


// import { BrowserRouter as Router } from "react-router-dom";

import MainPage from './components/Main.jsx';
// import Header from './components/Header.jsx'
import DayView from './components/DayView';
class App extends Component {
  render() {
    return (
      <div >
        
        {/* <header className="App-header"> */}
        {/* <Router> */}
        {/* <Header /> */}
          <div>
            <MainPage />
            {/* <DayView/> */}
          </div>
         
        {/* </Router> */}
        {/* </ header> */}
      </div>
    );
  }
}

export default App;
