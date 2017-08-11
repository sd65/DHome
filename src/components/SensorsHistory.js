import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSensorsHistory } from '../actions/SensorsHistory';
import { runNowAndEvery } from "../misc.js"

import {Line} from 'react-chartjs-2';

class SensorsHistory extends Component {
  
  componentDidMount() {
    runNowAndEvery(this.props.getSensorsHistory, 60 * 1000)
  }
  
  render () {
    if (!this.props.sensorsHistoryAvailable) {
      return <p>No data</p>
    }
    let metrics = {
      columns: this.props.sensorsHistory.columns,
      values: this.props.sensorsHistory.values.map((e, i) => { return (i % 20 === 0) ? e : false }).filter(Boolean).reverse()
    } 
    return (
      <SensorsHistoryGraph metrics={metrics}/>
    )
  }

}

function SensorsHistoryGraph (props) {
  const colors = { red: "rgb(255, 99, 132)", orange: "rgb(255, 159, 64)", yellow: "rgb(255, 205, 86)", blue: "rgb(54, 162, 235)" }
  const data = {
   labels: props.metrics.values.map((e) => new Date(e[0])),
   datasets: [
      { label: "Temperature", data: props.metrics.values.map((e) => e[props.metrics.columns.indexOf("T")]), yAxisID: "main", fill: false, pointRadius: 7, borderColor: colors.red, backgroundColor: colors.red },
      { label: "Humidity", data: props.metrics.values.map((e) => e[props.metrics.columns.indexOf("H")]), yAxisID: "hecto", fill: false, pointStyle: "triangle", pointRadius: 7, borderColor: colors.blue, backgroundColor: colors.blue },
      { label: "Pressure", data: props.metrics.values.map((e) => e[props.metrics.columns.indexOf("P")]),yAxisID: "hidden2", fill: false, pointStyle: "rectRot", pointRadius: 7, borderColor: colors.orange, backgroundColor: colors.orange },
      { label: "Lux", data: props.metrics.values.map((e) => e[props.metrics.columns.indexOf("L")]), yAxisID: "hidden", pointStyle: "rect", pointRadius: 1, borderColor: colors.yellow, backgroundColor: colors.yellow },
    ]
  }
  const labelToUnit = {
    "Temperature": "°C",
    "Humidity": "%",
    "Pressure": " hPa",
    "Lux": "lux"
  }
  const options = {
    legend: {
      labels: {
        usePointStyle: true,
        fontSize: 15
      }
    },
    tooltips: {
      callbacks: {
        label: (tooltipItems, data) => {
          let label = data.datasets[tooltipItems.datasetIndex].label
          return label +': ' + tooltipItems.yLabel + labelToUnit[label];
        }
      }
    },
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          tooltipFormat: "dddd D MMMM [at] H[h]",
          unit: 'hour',
          displayFormats: {
            hour: 'ddd HH[h]'
          }
        },
        ticks: {
          autoSkip: true,
        }
      }],
      yAxes: [{
          type: "linear",
          display: true,
          position: "left",
          id: "main",
      }, 
      {
          display: false,
          position: "right",
          id: "hidden"
      }, 
      {
          display: false,
          position: "right",
          id: "hidden2"
      },
      {
          type: "linear",
          display: true,
          position: "right",
          id: "hecto",
          ticks: {
            min: 0,
            max: 100
          }
      }
    ],
    }
  }
  return (
    <div className="sensors-history-graph">
      <Line data={data} options={options}/>
    </div>
  )
}


const mapStateToProps = (state) => {
    return {
        sensorsHistory: state.sensorsHistory,
        sensorsHistoryAvailable: state.sensorsHistoryAvailable
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getSensorsHistory: () => dispatch(getSensorsHistory())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SensorsHistory);
