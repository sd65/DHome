import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hueSwitchesAll, hueSwitchesAllGetStatus } from '../actions/hueSwitches';

class HueSwitches extends Component {

  componentDidMount() {
    this.props.hueSwitchesAllGetStatus()
  }
  
  onChange () {
    this.props.hueSwitchesAll((this.props.allOn) ? false : true)
    this.props.hueSwitchesAllGetStatus()
  }

  render () {
    return (
      <div className="HueSwitches"> 
        <HueSwitch name="All" onChange={this.onChange.bind(this)} on={this.props.allOn}/>
        <HueSwitch name="Roof" on={true}/>
        <HueSwitch name="Bowl" on={true}/>
        <HueSwitch name="Spot" on={true}/>
      </div>
    )
  }

}

function HueSwitch (props) {
  return (
    <span className="switch" onClick={(e) => props.onChange(e)}>
      <input type="checkbox" className="switch" readOnly checked={ (props.on) ? "checked" : null}/>
      <label htmlFor="switchAll">{props.name}</label>
    </span>
  )
}

const mapStateToProps = (state) => {
    return {
      allOn: state.hueSwitchesAllStatus
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        hueSwitchesAll: (bool) => dispatch(hueSwitchesAll(bool)),
        hueSwitchesAllGetStatus: () => dispatch(hueSwitchesAllGetStatus())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HueSwitches);
