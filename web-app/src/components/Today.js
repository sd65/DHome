import React from "react"

function Today() {
  return (
    <div className="today">
      <CurrentTime/>
      <CurrentDate/>
    </div>
  )
}
class CurrentTime extends React.Component {

  constructor(props) {
    super(props)
    this.state = {date: new Date()}
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    )
  }

  componentWillUnmount() {
    clearInterval(this.timerID)
  }

  tick() {
    this.setState({
      date: new Date()
    })
  }

  render() {
    return (
      <h2>
        <span className="CurrentTime"> 
          { this.state.date.toLocaleTimeString("fr-FR") }
        </span>
      </h2>
    )
  }
}

class CurrentDate extends React.Component {

  constructor(props) {
    super(props)
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
    )
  }

  secondsToMidnight() {
    var now = new Date()
    var then = new Date(now)
    then.setHours(24, 0, 0, 0)
    return (then - now) / 1000
  }

  componentWillUnmount() {
    clearInterval(this.timerID)
  }

  update() {
    this.setState({
      date: new Date()
    })
    this.scheduleNextUpdate()
  }

  render() {
    return (
      <h2>
        <span className="CurrentDate"> 
          { this.state.date.toLocaleDateString("fr-FR") }
        </span>
      </h2>
    )
  }
}

export default Today
