import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getLastSensorsMetrics } from '../actions/LastSensorsMetrics';
import { runNowAndEvery } from "../misc.js"

class LastSensorsMetrics extends Component {
  
  componentDidMount() {
    runNowAndEvery(this.props.getLastSensorsMetrics, 60 * 1000)
  }
  
  render () {
    return (
      <div className="last-sensors-metrics"> 
        <CurrentTemperature value={this.props.T}/>
        <CurrentHumidity value={this.props.H}/>
        <CurrentBarometricTendency tendency={this.props.P}/>
      </div>
    )
  }

}

function CurrentTemperature(props) {
  return (
    <h2>
      <span className="badge CurrentTemperature"> 
      { props.value + "°C" }
      </span>
    </h2>
  )
}

function CurrentHumidity(props) {
  return (
    <h2>
      <span className="badge CurrentHumidity"> 
        { props.value + "%" }
      </span>
    </h2>
  )
}

function CurrentBarometricTendency(props) {
  let s
  if (props.tendency) {
    s = (props.tendency === 1) ? "↗" : (props.tendency === -1) ? "↘" : "→"
  } else {
    s = "-"
  }
  s += "hPa"
  return (
    <h2>
      <span className="badge CurrentBarometricTendency"> 
        { s }
      </span>
    </h2>
  )
}


const mapStateToProps = (state) => {
    return {
        T: state.lastSensorsMetrics.T,
        H: state.lastSensorsMetrics.H,
        P: state.lastSensorsMetrics.P
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getLastSensorsMetrics: () => dispatch(getLastSensorsMetrics())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LastSensorsMetrics);
