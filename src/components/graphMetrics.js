import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphMetrics } from '../actions/graphMetrics';

import {Line} from 'react-chartjs-2';

class GraphMetrics extends Component {
  
  componentDidMount() {
    this.fetchMetrics()
    setInterval(() => this.fetchMetrics(), 60 * 1000)
  }
  
  fetchMetrics() {
    this.props.getMetrics()
  }

  render () {
    let metrics = {
      columns: this.props.metrics.columns,
      values: this.props.metrics.values.map((e, i) => { return (i % 20 === 0) ? e : false }).filter(Boolean).reverse()
    } 
    return (
      <GraphMetrics2 metrics={metrics}/>
    )
  }

}

function GraphMetrics2 (props) {
  const colors = { red: "rgb(255, 99, 132)", orange: "rgb(255, 159, 64)", yellow: "rgb(255, 205, 86)", green: "rgb(75, 192, 192)", blue: "rgb(54, 162, 235)", purple: "rgb(153, 102, 255)", grey: "rgb(201, 203, 207)" }
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const data = {
   labels: props.metrics.values.map((e) => {
      let date = new Date(e[0])
      return days[date.getDay()].slice(0, 3) + " " + (date.getHours() + 1) + "h"
    }),
   datasets: [
      { label: "Temperature", data: props.metrics.values.map((e) => e[props.metrics.columns.indexOf("T")]), yAxisID: "y1", fill: false, pointRadius: 7, borderColor: colors.red, backgroundColor: colors.red },
      { label: "Humidity", data: props.metrics.values.map((e) => e[props.metrics.columns.indexOf("H")]), yAxisID: "y3", fill: false, pointStyle: "triangle", pointRadius: 7, borderColor: colors.blue, backgroundColor: colors.blue },
      { label: "Pressure", data: props.metrics.values.map((e) => e[props.metrics.columns.indexOf("P")]),yAxisID: "y2", fill: false, pointStyle: "rectRot", pointRadius: 7, borderColor: colors.orange, backgroundColor: colors.orange },
      { label: "Lux", data: props.metrics.values.map((e) => e[props.metrics.columns.indexOf("L")]), yAxisID: "y4", pointStyle: "dash", pointRadius: 1, borderColor: colors.yellow, backgroundColor: colors.yellow },
    ]
  }
  const labelToUnit = {
    "Temperature": "°C",
    "Humidity": "%",
    "Pressure": " hPa",
    "Lux": "lux"
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
          id: "y4"
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
    <div className="sensors-history-graph">
      <Line data={data} options={options}/>
    </div>
  )
}


const mapStateToProps = (state) => {
    return {
        metrics: state.graphMetrics
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getMetrics: () => dispatch(graphMetrics())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GraphMetrics);
