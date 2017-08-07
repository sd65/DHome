import React, { Component } from 'react';

import CurrentMetrics from './CurrentMetrics';
import Today from './Today';

import '../css/App.css';

class App extends Component {

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <CurrentMetrics/>
          <Today/>
        </div>
      </div>
    );
  }

}

export default App
