import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getForecasts } from '../actions/Forecasts';

import {Line} from 'react-chartjs-2';

class Forecasts extends Component {
  
  componentDidMount() {
    this.fetchLastForecasts()
    setInterval(() => this.fetchLastForecasts(), 20 * 60 * 1000)
  }
  
  fetchLastForecasts() {
    this.props.getForecasts()
  }

  render () {
    return (
      <div className="Forecasts">
        <div className="ForecastsDays">
          {Array.from(this.props.forecast.entries()).map((r) => {
            return <DayForecast key={r[0]} dayName={r[0]} forecast={r[1]}/>
          })}
        </div>
        <ForecastsGraph rawData={this.props.forecastGraph}/>
      </div>
    )
  }

}

function ForecastsGraph (props) {
  const colors = { red: "rgb(255, 99, 132)", orange: "rgb(255, 159, 64)", yellow: "rgb(255, 205, 86)", green: "rgb(75, 192, 192)", blue: "rgb(54, 162, 235)", purple: "rgb(153, 102, 255)", grey: "rgb(201, 203, 207)" }
  const data = {
   labels: props.rawData.map((e) => e.dt),
   datasets: [
      { label: "Temperature", data: props.rawData.map((e) => e.t), yAxisID: "y1", fill: false, pointRadius: 7, borderColor: colors.red, backgroundColor: colors.red },
      { label: "Humidity", data: props.rawData.map((e) => e.h), yAxisID: "y3", fill: false, pointStyle: "triangle", pointRadius: 7, borderColor: colors.blue, backgroundColor: colors.blue },
      { label: "Pressure", data: props.rawData.map((e) => e.p), yAxisID: "y2", fill: false, pointStyle: "rectRot", pointRadius: 7, borderColor: colors.orange, backgroundColor: colors.orange },
      { label: "Wind", data: props.rawData.map((e) => e.w), yAxisID: "y1", fill: false, pointStyle: "rectRounded", pointRadius: 7, borderColor: colors.yellow, backgroundColor: colors.yellow },
      { label: "Rain", data: props.rawData.map((e) => e.r), yAxisID: "y1", pointStyle: "star", pointRadius: 7, borderColor: colors.purple, backgroundColor: colors.purple },
      { label: "Cloudiness", data: props.rawData.map((e) => e.c), yAxisID: "y3", pointStyle: "dash", pointRadius: 7, borderColor: colors.grey, backgroundColor: colors.grey },
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
  const shortDayToDay = {
    Sun: 'Sunday', 
    Mon: 'Monday', 
    Tue: 'Tuesday', 
    Wed: 'Wednesday', 
    Thu: 'Thursday', 
    Fri: 'Friday', 
    Sat: 'Saturday'
  }
  const options = {
    title: {
      display: true,
      text: 'Weather Forecast',
      fontSize: 25,
      fontFamily: '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
      fontStyle: "",
      padding: 30
    },
    legend: {
      labels: {
        usePointStyle: true,
        fontSize: 15
      }
    },
    tooltips: {
      callbacks: {
        title: (tooltipItems) => {
          let l = tooltipItems[0].xLabel.split(" ")
          return shortDayToDay[l[0]] + " at " + l[1] + "00"
        },
        label: (tooltipItems, data) => {
          let label = data.datasets[tooltipItems.datasetIndex].label
          return label +': ' + tooltipItems.yLabel + labelToUnit[label];
        }
      }
    },
    scales: {
      yAxes: [{
          type: "linear",
          display: true,
          position: "left",
          id: "y1",
      }, 
      {
          display: false,
          position: "right",
          id: "y2"
      },
      {
          type: "linear",
          display: true,
          position: "right",
          id: "y3",
          ticks: {
            min: 0,
            max: 100
          }
      }
    ],
    }
  }
  return (
    <div className="forecastGraph">
      <Line data={data} options={options}/>
    </div>
  )
}

function DayForecast (props) {
  return (
    <div className="dayForecast">
      <h3>{props.dayName}</h3>
      <i className={ "owf owf-5x owf-" + props.forecast.icon}></i>
      <div>{ props.forecast.minTemp + "°C"}</div>
      <div>{ props.forecast.maxTemp + "°C"}</div>
      <div className="hasRain" style={ {opacity: (props.forecast.hasRain) ? "1" : "0"}}>•</div> 
    </div>
  )
}

const mapStateToProps = (state) => {
    return {
      forecast: state.getForecasts.forecast,
      forecastGraph: state.getForecasts.forecastGraph
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getForecasts: () => dispatch(getForecasts())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Forecasts);
