import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getLastForecast } from '../actions/Forecasts';
import { runNowAndEvery } from "../misc.js"

import {Bar} from 'react-chartjs-2'

class Forecasts extends Component {
  
  componentDidMount() {
    runNowAndEvery(this.props.getLastForecast, 20 * 60 * 1000)
  }
  
  render () {
    if (!this.props.forecastAvailable) {
      return <p>No forecast</p>
    }
    return (
      <div>
        <div className="forecast-cards">
          {Array.from(this.props.forecastForCards.entries()).map((r) => {
            return <ForecastCard key={r[0]} dayName={r[0]} forecast={r[1]}/>
          })}
        </div>
        <div className="forecast-graph">
          <ForecastsGraph rawData={this.props.forecastForGraph}/>
        </div>
      </div>
    )
  }

}

function ForecastsGraph (props) {
  const colors = { red: "rgb(255, 99, 132)", orange: "rgb(255, 159, 64)", yellow: "rgb(255, 205, 86)", blue: "rgb(54, 162, 235)", purple: "rgb(153, 102, 255)", grey: "rgb(201, 203, 207)" }
  const data = {
   labels: props.rawData.map((e) => e.dt),
   datasets: [
      { label: "Temperature", data: props.rawData.map((e) => e.t), yAxisID: "main", fill: false, pointRadius: 7, borderColor: colors.red, backgroundColor: colors.red, type: "line" },
      { label: "Humidity", data: props.rawData.map((e) => e.h), yAxisID: "hecto", fill: false, pointStyle: "triangle", pointRadius: 7, borderColor: colors.blue, backgroundColor: colors.blue, type: "line" },
      { label: "Pressure", data: props.rawData.map((e) => e.p), yAxisID: "hidden", fill: false, pointStyle: "rectRot", pointRadius: 7, borderColor: colors.orange, backgroundColor: colors.orange, type: "line" },
      { label: "Wind", data: props.rawData.map((e) => e.w), yAxisID: "main", fill: false, pointStyle: "rectRounded", pointRadius: 7, borderColor: colors.yellow, backgroundColor: colors.yellow, type: "line" },
      { label: "Rain", data: props.rawData.map((e) => e.r), yAxisID: "main", pointRadius: 1, pointStyle: "rect", borderColor: colors.purple, backgroundColor: colors.purple, type: "line" },
      { label: "Cloudiness", data: props.rawData.map((e) => e.c), yAxisID: "hecto", pointStyle: "rect", pointRadius: 0, borderColor: colors.grey, backgroundColor: colors.grey, type: "line" },
      { label: "", data: props.rawData.map((e) => (e.dt.getHours() === 23) ? 1 : 0), yAxisID: "day", backgroundColor: "#606060", type: "bar" },
    ]
  }
  const labelToUnit = {
    "Temperature": "°C",
    "Humidity": "%",
    "Pressure": " hPa",
    "Wind": " m/s",
    "Rain": " mm",
    "Cloudiness": "%"
  }
  const options = {
    legend: {
      labels: {
        usePointStyle: true,
        fontSize: 15,
        filter: (e) => (e.text)
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
          autoSkip: false,
        }
      }],
      yAxes: [{
          type: "linear",
          display: true,
          position: "left",
          id: "main",
          labelString: "Celcius"
      }, 
      {
          display: false,
          position: "right",
          id: "hidden"
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
      },
      {
          display: false,
          id: "day",
          ticks: {
            min: 0,
            max: 1
          }
      }
    ],
    }
  }
  return (
    <Bar data={data} options={options}/>
  )
}

function ForecastCard (props) {
  return (
    <div className="forecast-card">
      <h3>{props.dayName}</h3>
      <i className={ "owf owf-5x owf-" + props.forecast.icon}></i>
      <div>{ props.forecast.minTemp + "°C"}</div>
      <div>{ props.forecast.maxTemp + "°C"}</div>
      <div className="hasRain" style={ {opacity: (props.forecast.hasRain) ? 1 : 0}}>•</div> 
    </div>
  )
}

const mapStateToProps = (state) => {
    return {
      forecastAvailable: state.forecastAvailable,
      forecastForCards: state.lastForecast.forecastForCards,
      forecastForGraph: state.lastForecast.forecastForGraph
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getLastForecast: () => dispatch(getLastForecast())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Forecasts);
