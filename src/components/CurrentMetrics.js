import React, { Component } from 'react';
import { connect } from 'react-redux';
import { currentMetricsFetchData } from '../actions/currentMetrics';

class CurrentMetrics extends Component {
  
  componentDidMount() {
    this.fetchLastMetrics()
//    setInterval(this.fetchLastMetrics, 2500)
  }
  
  fetchLastMetrics() {
    this.props.fetchData("https://192.168.1.15:8000/api/sensortag")
  }

  render () {
    return (
      <div className="CurrentMetrics"> 
        <CurrentTemperature value={this.props.T}/>
        <CurrentHumidity value={this.props.H}/>
        <CurrentBarometricTendency tendency={this.props.P}/>
      </div>
    )
  }

}

function CurrentTemperature(props) {
  return (
    <div className="CurrentTemperature"> 
      { (props.value || "-") + "°C" }
    </div>
  )
}

function CurrentHumidity(props) {
  return (
    <div className="CurrentHumidity"> 
      { (props.value || "-") + "%" }
    </div>
  )
}

function CurrentBarometricTendency(props) {
  let s = (props.tendency === 1) ? "↗" : (props.tendency === -1) ? "↘" : "→"
  s += "hPa"
  return (
    <div className="CurrentBarometricTendency"> 
      { s }
    </div>
  )
}

const getMetric = (cm, m) => {
  if (cm && cm.values && cm.columns) {
    return cm.values[0][cm.columns.indexOf(m)]
  }
  return
}

const average = (arr) => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;

const getPressureTendency = (cm) => {
  if (cm && cm.values && cm.columns) {
    let index = cm.columns.indexOf("P")
    let values = cm.values.map((e) => e[index])
    let last20 = values.slice(-20)
    let rest = values.slice(0, values.length - 20)
    if (average(last20) > average(rest)) {
      return 1
    } else {
      return -1
    }
  }
  return
}

const mapStateToProps = (state) => {
    return {
        T: getMetric(state.currentMetrics, "T"),
        H: getMetric(state.currentMetrics, "H"),
        P: getPressureTendency(state.currentMetrics),
        hasErrored: state.currentMetricsHasErrored,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: (url) => dispatch(currentMetricsFetchData(url))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CurrentMetrics);
