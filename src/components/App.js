import React, { Component } from 'react';

import CurrentMetrics from './CurrentMetrics';
import Today from './Today';
import HueSwitches from './hueSwitches';

import 'shoelace-css/dist/shoelace.css';
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
      </div>
    );
  }

}

export default App
