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

export function hueSwitchesAllStatus(bool) {
    return {
        type: 'HUE_SWITCHES_ALL_STATUS',
        status: bool
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

export function hueSwitchesAllGetStatus() {
  return (dispatch) => {
    fetch("https://192.168.1.15:8000/api/lights")
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.status;
    })
    .then((httpCode) => {
      if(httpCode === 200) {
         dispatch(hueSwitchesAllStatus(true))
      } else {
         dispatch(hueSwitchesAllStatus(false))
      }
    })
    .catch(() => dispatch(hueSwitchesDisconnected(true)));
  }
}
