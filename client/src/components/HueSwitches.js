import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getHueLightsStatus, setHueLightStatus, setHueLightsStatus } from '../actions/HueSwitches';
import { runNowAndEvery } from "../misc.js"

class HueSwitches extends Component {

  constructor () {
    super()
    this.state = {
      allLightsOn: false,
      hueLightsStatus: []
    }
  }

  componentDidMount() {
    runNowAndEvery(this.props.getHueLightsStatus, 2500)
  }
  
  switchAllLightsStatus () {
    this.props.setHueLightsStatus(!this.state.allLightsOn)
    setTimeout(this.props.hueSwitchesAllGetStatus, 50)
  }
  
  switchLightStatus (e) {
    let id = String(e.target.getAttribute("data-id"))
    let isOn = this.state.hueLightsStatus.map((e) => e.id === id && e.on).some(Boolean)
    this.props.setHueLightsStatus(id, !isOn)
    setTimeout(this.props.hueSwitchesAllGetStatus, 50)
  }
  
  componentWillReceiveProps (nextProps) {
    this.setState({
//      allLightsOn: nextProps.hueLightsStatus.map((e) => (e.reachable && e.on) || !e.reachable).every(Boolean),
      hueLightsStatus: nextProps.hueLightsStatus
    })
  }

  render () {
    return (
      <div className="hue-switches"> 
        { (!this.props.hueLightsReachable) ? (
            <HueSwitch name="No reachable Hue lights" onChange={() => {}} on={false} disabled={true}/>
          ) : (
            <div>
              <HueSwitch name="All" onChange={this.switchAllLightsStatus.bind(this)} on={this.state.allLightsOn}/>
              {this.state.hueLightsStatus.map((e) => {
                return <HueSwitch onChange={this.switchLightStatus.bind(this)} id={e.id} key={e.id} name={e.name} on={e.on} disabled={!e.reachable}/>
              })}
            </div>
          )
        }
      </div>
    )
  }

}

function HueSwitch (props) {
  return (
    <span className="switch" onClick={(e) => props.onChange(e)}>
      <input type="checkbox" className="switch" readOnly disabled={props.disabled} checked={props.on}/>
      <label data-id={props.id}>{props.name}</label>
    </span>
  )
}

const mapStateToProps = (state) => {
    return {
      hueLightsReachable: state.hueLightsReachable,
      hueLightsStatus: state.hueSwitchesAllStatus
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setHueLightsStatus: (bool) => dispatch(setHueLightStatus(bool)),
        setHueLightStatus: (id, bool) => dispatch(setHueLightsStatus(id, bool)),
        getHueLightsStatus: () => dispatch(getHueLightsStatus())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HueSwitches)
