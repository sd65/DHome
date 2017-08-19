import React, { Component } from "react"
import { connect } from "react-redux"
import { getRATPTraffic, getRATPSchedules} from "../actions/RATP"
import { runNowAndEvery } from "../misc.js"

class RATP extends Component {

  constructor () {
    super()
    this.state = {
      trafficDetail: {},
      showTrafficDetail: false
    }
  }

  componentDidMount() {
    runNowAndEvery(() => {
      this.props.getRATPTraffic()
      this.props.getRATPSchedules()
    }, 16 * 1000)
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
        message: this.props.RATPTraffic[t][k].message
      }
    })
  }

  render () {
    let RATPScheduleForRER = this.props.RATPSchedules.RER
    let RATPScheduleForBUS = this.props.RATPSchedules.BUS
    if (!this.props.RATPSchedulesAvailable) {
      RATPScheduleForRER = RATPScheduleForBUS = [ "No data" ]
    }
    return (
      <div>
        <div className="ratp-lines-overview">
          {(this.props.RATPTrafficAvailable) && Object.keys(this.props.RATPTraffic).map((e) => {
            return <Recap handleClick={this.handleClick.bind(this)} key={e} type={e} data={this.props.RATPTraffic[e]}/>
          })}
          { (this.state.showTrafficDetail) &&
            <div className="message tabs-pane active">
              <h3>{this.state.trafficDetail.line}</h3>
              <p>{this.state.trafficDetail.message}</p>
            </div>
          }
        </div>
        <div className="Next">
          <Timetable schedules={RATPScheduleForRER} name="RER A"/>
          <Timetable schedules={RATPScheduleForBUS} name="BUS 118"/>
        </div>
      </div>
    )
  }

}

function Timetable (props) {
  return (
    <div className="timetable">
      <h3>{props.name}</h3>
      {props.schedules.map((e, i) => {
        return <div key={i}>{e}</div>
      })}
    </div>
  )
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
    <div className={"ratp-overview-" + props.type}>
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
    RATPTraffic: state.RATPTraffic,
    RATPTrafficAvailable: state.RATPTrafficAvailable,
    RATPSchedules: state.RATPSchedules,
    RATPSchedulesAvailable: state.RATPSchedulesAvailable
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getRATPTraffic: () => dispatch(getRATPTraffic()),
    getRATPSchedules: () => dispatch(getRATPSchedules())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RATP)
