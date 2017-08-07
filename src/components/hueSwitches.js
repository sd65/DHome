import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hueSwitchesAll, hueSwitchesAllGetStatus } from '../actions/hueSwitches';

class HueSwitches extends Component {
  
  componentDidMount() {
    this.props.hueSwitchesAllGetStatus()
  }
  
  handleClick() {
    this.props.hueSwitchesAll((this.props.allOn) ? false : true)
    this.props.hueSwitchesAllGetStatus()
  }

  render () {
    return (
      <div className="hueSwitches"> 
        <span className="switch">
          <input type="checkbox" onChange={(e) => this.handleClick(e)} className="switch" id="switchAll" checked={ (this.props.allOn) ? "checked" : null}/>
          <label htmlFor="switchAll">All</label>
        </span>
      </div>
    )
  }

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
