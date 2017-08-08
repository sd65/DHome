export function hueSwitchesDisconnected(bool) {
    return {
        type: 'HUE_SWITCHES_DISCONNECTED',
        disconnected: bool
    };
}

export function hueSwitchesAllSuccess() {
    return {
        type: 'HUE_SWITCHES_ALL_SUCCESS'
    };
}

export function hueSwitchSuccess() {
    return {
        type: 'HUE_SWITCH_SUCCESS'
    };
}

export function hueSwitchesAllStatus(status) {
    return {
        type: 'HUE_SWITCHES_ALL_STATUS',
        status
    };
}

export function hueSwitchesAll(bool) {
  return (dispatch) => {
    let options = {
      method: (bool) ? "POST" : "DELETE"
    }
    fetch("https://192.168.1.15:8000/api/lights", options)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    })
    .then(() => dispatch(hueSwitchesAllSuccess()))
    .catch(() => dispatch(hueSwitchesDisconnected(true)));
  }
}

export function hueSwitch(id, bool) {
  console.log(id, bool)
  return (dispatch) => {
    let options = {
      method: (bool) ? "POST" : "DELETE"
    }
    fetch("https://192.168.1.15:8000/api/lights/" + id, options)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    })
    .then(() => dispatch(hueSwitchSuccess()))
    .catch(() => dispatch(hueSwitchesDisconnected(true)));
  }
}

export function hueSwitchesAllGetStatus() {
  return (dispatch) => {
    fetch("https://192.168.1.15:8000/api/lights")
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    })
    .then((response) => response.json())
    .then((j) => dispatch(hueSwitchesAllStatus(j)))
    .catch((e) => { console.log(e); dispatch(hueSwitchesDisconnected(true))});
  }
}
