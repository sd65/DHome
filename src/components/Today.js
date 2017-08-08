import React from 'react';

function Today(props) {
  return (
    <div className="Today">
      <div>Today</div> 
      <CurrentTime/>
      <CurrentDate/>
    </div>
  );
}
class CurrentTime extends React.Component {

  constructor(props) {
    super(props);
    this.state = {date: new Date()}
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div className="CurrentTime"> 
        { this.state.date.toLocaleTimeString("fr-FR") }
      </div>
    )
  }
}

class CurrentDate extends React.Component {

  constructor(props) {
    super(props);
    this.state = {date: new Date()}
  }

  componentDidMount() {
    this.scheduleNextUpdate()
  }
  
  scheduleNextUpdate () {
    let s = this.secondsToMidnight()
    this.timerID = setInterval(
      () => this.update(),
      s * 1000
    );
  }

  secondsToMidnight() {
    var now = new Date();
    var then = new Date(now);
    then.setHours(24, 0, 0, 0);
    return (then - now) / 1000;
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  update() {
    this.setState({
      date: new Date()
    })
    this.scheduleNextUpdate()
  }

  render() {
    return (
      <div className="CurrentDate"> 
        { this.state.date.toLocaleDateString("fr-FR") }
      </div>
    )
  }
}

export default Today
