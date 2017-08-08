import React, { Component } from 'react';

import CurrentMetrics from './CurrentMetrics';
import GraphMetrics from './graphMetrics';
import Today from './Today';
import HueSwitches from './hueSwitches';
import Forecasts from './Forecasts';
import RATP from './RATP';

import 'shoelace-css/dist/shoelace.css';
import 'open-weather-icons/dist/css/open-weather-icons.css';
import '../css/metrodna.css';
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
        <RATP/>
        <GraphMetrics/>
        <div className="footer">
          Made with love by Sylvain DOIGNON
        </div>
      </div>
    );
  }

}

export default App
