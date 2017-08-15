import React, { Component } from 'react';

import LastSensorsMetrics from './LastSensorsMetrics';
import SensorsHistory from './SensorsHistory';
import Today from './Today';
import HueSwitches from './HueSwitches';
import Forecast from './Forecast';
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
            <LastSensorsMetrics/>
            <Today/>
            <HueSwitches/>
          </div>
          <p contentEditable="true" style={{"text-align": "center"}}>
            Todo is here !
          </p>
        </section>
        <section className="forecast">
          <h2>Forecast</h2>
          <div className="content">
            <Forecast/>
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
            <SensorsHistory/>
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
