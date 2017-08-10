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
        <section className="today">
          <h2>Now</h2>
          <div className="content">
            <CurrentMetrics/>
            <Today/>
            <HueSwitches/>
          </div>
        </section>
        <section className="forecast">
          <h2>Forecast</h2>
          <div className="content">
            <Forecasts/>
          </div>
        </section>
        <section className="ratp">
          <h2>Transport</h2>
          <div className="content">
            <RATP/>
          </div>
        </section>
        <section className="sensors-history">
          <h2>Sensors history</h2>
          <div className="content">
            <GraphMetrics/>
          </div>
        </section>
        <div className="footer">
          Made with ❤ by Sylvain DOIGNON
        </div>
      </div>
    );
  }

}

export default App
