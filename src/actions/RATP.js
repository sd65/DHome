export function getRATPTrafficSuccess (traffic) {
    return {
        type: 'GET_RATP_SUCCESS',
        traffic
    };
}

const formatJson = (json) => {
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
    .then(formatJson)
    .then((t) => dispatch(getRATPTrafficSuccess(t)))
    .catch((e) => { console.error(e); dispatch(getRATPTrafficSuccess)});
  }
}
