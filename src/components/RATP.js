import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getRATPTraffic } from '../actions/RATP';

class RATP extends Component {

  constructor () {
    super()
    this.state = {
      trafficDetail: {},
      showTrafficDetail: false
    }
  }

  componentDidMount() {
    this.fetchLastTraffic()
  }
  
  fetchLastTraffic() {
    this.props.getRATPTraffic()
  }

  handleClick (e) {
    let k = e.target.getAttribute("data-key")
    let t = e.target.getAttribute("data-type")
    let type = e.target.className.split(" ")[0]
    let line = type + " " + k
    if (line === this.state.trafficDetail.line) {
      return this.setState({
        showTrafficDetail: false,
        trafficDetail: {}
      })
    }
    this.setState({
      showTrafficDetail: true,
      trafficDetail: {
        line,
        message: this.props.traffic[t][k].message
      }
    })
  }

  render () {
    return (
      <div className="RATP">
        <div className="Recap">
          {Object.keys(this.props.traffic).map((e) => {
            return <Recap handleClick={this.handleClick.bind(this)} key={e} type={e} data={this.props.traffic[e]}/>
          })}
          { (this.state.showTrafficDetail) &&
            <div className="message tabs-pane active">
              <h3>{this.state.trafficDetail.line}</h3>
              <p>{this.state.trafficDetail.message}</p>
            </div>
          }
        </div>
      </div>
    )
  }

}

function Recap (props) {
  const typeToClass = {
    metros: "metro",
    rers: "rer",
    tramways: "tram"
  }
  const ligneFormat = (l) => {
    if (l.match(/^[a-z]$/)) {
      return l.toUpperCase()
    }
    return l
  }
  return (
    <div className={"Recap-" + props.type}>
      <span className={typeToClass[props.type] + " symbole"}></span>
      {Object.keys(props.data).map((k) => {
        let className = typeToClass[props.type] + " ligne" + ligneFormat(k)
        if (props.data[k].state === "normal_trav") {
          className += " travaux"
        } else if (props.data[k].state !== "normal") {
          className += " pb"
        }
        return <span className={className} onClick={props.handleClick} key={k} data-key={k} data-type={props.type}></span>
      })}
    </div>
  )
}

const mapStateToProps = (state) => {
    return {
      traffic: state.getRATPTraffic
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getRATPTraffic: () => dispatch(getRATPTraffic())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RATP);
