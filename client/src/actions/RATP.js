import axios from "axios"

let a = axios.create()
a.defaults.timeout = 1000

export function RATPTraffic (traffic) {
    return {
        type: 'RATP_TRAFFIC',
        traffic
    };
}

export function RATPTrafficAvailable (status) {
    return {
        type: 'RATP_TRAFFIC_AVAILABLE',
        status
    };
}

export function RATPSchedules (schedules) {
    return {
        type: 'RATP_SCHEDULES',
        schedules
    };
}

export function RATPSchedulesAvailable (status) {
    return {
        type: 'RATP_SCHEDULES_AVAILABLE',
        status
    };
}

const formatJsonTraffic = (json) => {
  let r = {
    metros: {},
    rers: {},
    tramways: {}
  }
  for (let type of ["metros", "rers", "tramways"]) {
    for (let v of json.result[type]) {
      r[type][v.line.toLowerCase()] = {
        state: v.slug,
        message: v.message
      }
    }
  }
  return r
}

const formatJsonSchedules = (json) => {
  return json.result.schedules.map((e) => e.message )
}

export function getRATPTraffic() {
  return (dispatch) => {
    a.get("https://api-ratp.pierre-grimaud.fr/v3/traffic")
    .then((j) => formatJsonTraffic(j.data))
    .then((t) => {
      dispatch(RATPTrafficAvailable(true))
      dispatch(RATPTraffic(t))
    })
    .catch((e) => dispatch(RATPTrafficAvailable(false)))
  }
}

export function getRATPSchedules () {
  return async (dispatch) => {
    try {
      let [RER, BUS] = await Promise.all([
        getRATPSchedulesByUrl("https://api-ratp.pierre-grimaud.fr/v3/schedules/rers/a/vincennes/R"),
        getRATPSchedulesByUrl("https://api-ratp.pierre-grimaud.fr/v3/schedules/bus/118/general-de-gaulle/A")
      ])
      dispatch(RATPSchedulesAvailable(true))
      dispatch(RATPSchedules({RER, BUS}))
    } catch (e) {
      dispatch(RATPSchedulesAvailable(false))
    }
  }
}

export function getRATPSchedulesByUrl (url) {
  return new Promise ((resolve, reject) => {
    a.get(url)
    .then((j) => formatJsonSchedules(j.data))
    .then(resolve)
    .catch(reject)
  })
}
