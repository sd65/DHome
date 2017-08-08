import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hueSwitchesAll, hueSwitchesAllGetStatus, hueSwitch } from '../actions/hueSwitches';

class HueSwitches extends Component {

  constructor () {
    super()
    this.state = {
      allOn: false,
      lights: []
    }
  }

  componentDidMount() {
    this.props.hueSwitchesAllGetStatus()
    setInterval(this.props.hueSwitchesAllGetStatus, 3000)
  }
  
  onChangeAll () {
    this.props.hueSwitchesAll((this.state.allOn) ? false : true)
    setTimeout(this.props.hueSwitchesAllGetStatus, 50)
  }
  
  onChangeLight (e) {
    let id = String(e.target.getAttribute("data-id"))
    let isOn = this.state.lights.map((e) => e.id === id && e.on).some(Boolean)
    this.props.hueSwitch(id, (isOn) ? false : true)
    setTimeout(this.props.hueSwitchesAllGetStatus, 50)
  }
  
  componentWillReceiveProps (nextProps) {
    let allOn = nextProps.lightStatus.map((e) => {
      if ((e.reachable && e.on) || !e.reachable) {
        return true
      }
      return false
    }).every(Boolean)
    this.setState({allOn, lights: nextProps.lightStatus})
  }

  render () {
    return (
      <div className="HueSwitches"> 
        <HueSwitch name="All" onChange={this.onChangeAll.bind(this)} on={this.state.allOn}/>
        {this.state.lights.map((e) => {
          return <HueSwitch onChange={this.onChangeLight.bind(this)} id={e.id} key={e.id} name={e.name} on={e.on} disabled={!e.reachable}/>
        })}
      </div>
    )
  }

}

function HueSwitch (props) {
  return (
    <span className="switch" onClick={(e) => props.onChange(e)}>
      <input type="checkbox" className="switch" readOnly disabled={ (props.disabled) ? "disabled" : null }checked={ (props.on) ? "checked" : null}/>
      <label data-id={props.id}>{props.name}</label>
    </span>
  )
}

const mapStateToProps = (state) => {
    return {
      lightStatus: state.hueSwitchesAllStatus
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        hueSwitchesAll: (bool) => dispatch(hueSwitchesAll(bool)),
        hueSwitch: (id, bool) => dispatch(hueSwitch(id, bool)),
        hueSwitchesAllGetStatus: () => dispatch(hueSwitchesAllGetStatus())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HueSwitches);
