export function getRATPTrafficSuccess (traffic) {
    return {
        type: 'GET_RATP_SUCCESS',
        traffic
    };
}

export function getRATPRERASchedulesSuccess(schedules) {
    return {
        type: 'GET_RATP_RERA_SCHEDULES_SUCCESS',
        schedules
    };
}

export function getRATPBUS118SchedulesSuccess(schedules) {
    return {
        type: 'GET_RATP_BUS118_SCHEDULES_SUCCESS',
        schedules
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
    fetch("https://api-ratp.pierre-grimaud.fr/v3/traffic")
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    })
    .then((response) => response.json())
    .then(formatJsonTraffic)
    .then((t) => dispatch(getRATPTrafficSuccess(t)))
    .catch((e) => { console.error(e); dispatch(getRATPTrafficSuccess)});
  }
}

export function getRATPBUS118Schedules(url) {
  return (dispatch) => {
    fetch("https://api-ratp.pierre-grimaud.fr/v3/schedules/bus/118/general-de-gaulle/A")
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    })
    .then((response) => response.json())
    .then(formatJsonSchedules)
    .then((s) => dispatch(getRATPBUS118SchedulesSuccess(s)))
    .catch((e) => { console.error(e); dispatch(getRATPBUS118SchedulesSuccess)});
  }
}

export function getRATPRERASchedules(url) {
  return (dispatch) => {
    fetch("https://api-ratp.pierre-grimaud.fr/v3/schedules/rers/a/vincennes/R")
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    })
    .then((response) => response.json())
    .then(formatJsonSchedules)
    .then((s) => dispatch(getRATPRERASchedulesSuccess(s)))
    .catch((e) => { console.error(e); dispatch(getRATPRERASchedulesSuccess)});
  }
}
