import React, { Component } from 'react';

import CurrentMetrics from './CurrentMetrics';
import Today from './Today';
import HueSwitches from './hueSwitches';
import Forecasts from './Forecasts';

import 'shoelace-css/dist/shoelace.css';
import 'open-weather-icons/dist/css/open-weather-icons.css';
import '../css/App.css';

class App extends Component {

  render() {
    return (
      <div className="App">
        <h1 className="text-center">DHome</h1>
        <div className="App-header">
          <CurrentMetrics/>
          <Today/>
          <HueSwitches/>
        </div>
        <div className="Weather">
          <Forecasts/>
        </div>
      </div>
    );
  }

}

export default App
