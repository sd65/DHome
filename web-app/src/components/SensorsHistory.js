import React, { Component } from "react"
import { connect } from "react-redux"
import { getSensorsHistory } from "../actions/SensorsHistory"
import { runNowAndEvery } from "../misc.js"

import {Line} from "react-chartjs-2"

class SensorsHistory extends Component {
  
  constructor () {
    super()
    this.state = {
      since: "24h",
      groupBy: "20m"
    }
  }
  
  componentDidMount() {
    runNowAndEvery(this.getSensorsHistory.bind(this), 60 * 1000)
  }

  getSensorsHistory() {
    this.props.getSensorsHistory(this.state.since, this.state.groupBy)
  }
  
  handleTimeRangeClick (e) {
    let text = e.target.innerText
    this.setState({
      since: (text.match(/Week/)) ? "7d" : "24h",
      groupBy: (text.match(/Week/)) ? "1h" : "20m"
    }, () => this.getSensorsHistory())
  }
  
  render () {
    if (!this.props.sensorsHistoryAvailable) {
      return <p>No data</p>
    }
    return (
      <div>
        <SensorsHistoryGraph metrics={this.props.sensorsHistory}/>
        <div className="sensors-history-graph-time-range">
          <button onClick={(e) => this.handleTimeRangeClick(e)} type="button" className="button-big button-block" disabled={(this.state.since === "7d")}>Last Week</button>
          <button onClick={(e) => this.handleTimeRangeClick(e)} type="button" className="button-big button-block" disabled={(this.state.since === "24h")}>Last 24H</button>
        </div>
      </div>
    )
  }

}

function SensorsHistoryGraph (props) {
  const colors = { red: "rgb(255, 99, 132)", orange: "rgb(255, 159, 64)", yellow: "rgb(255, 205, 86)", blue: "rgb(54, 162, 235)" }
  const data = {
    labels: props.metrics.time,
    datasets: [
      { label: "Temperature", data: props.metrics.mean_T, yAxisID: "main", fill: false, pointRadius: 7, borderColor: colors.red, backgroundColor: colors.red },
      { label: "Humidity", data: props.metrics.mean_H, yAxisID: "hecto", fill: false, pointStyle: "triangle", pointRadius: 7, borderColor: colors.blue, backgroundColor: colors.blue },
      { label: "Pressure", data: props.metrics.mean_P,yAxisID: "hidden2", fill: false, pointStyle: "rectRot", pointRadius: 7, borderColor: colors.orange, backgroundColor: colors.orange },
      { label: "Lux", data: props.metrics.mean_L, yAxisID: "hidden", pointStyle: "rect", pointRadius: 1, borderColor: colors.yellow, backgroundColor: colors.yellow },
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
          return label +": " + tooltipItems.yLabel + labelToUnit[label]
        }
      }
    },
    scales: {
      xAxes: [{
        type: "time",
        time: {
          tooltipFormat: "dddd D MMMM [at] H[h]mm",
          unit: "hour",
          displayFormats: {
            hour: "ddd HH[h]"
          }
        },
        ticks: {
          autoSkip: true,
        }
      }],
      yAxes: [{
        type: "linear",
        scaleLabel: {
          display: true,
          fontSize: 14,
          labelString: "°C"
        },
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
        scaleLabel: {
          display: true,
          fontSize: 14,
          labelString: "%"
        },
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
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getSensorsHistory: (n, g) => dispatch(getSensorsHistory(n, g))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SensorsHistory)
