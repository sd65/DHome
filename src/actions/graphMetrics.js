export function graphMetricsFetchDataSuccess(metrics) {
    return {
        type: 'GRAPH_METRICS_FETCH_DATA_SUCCESS',
        metrics
    };
}
  
  
export function graphMetrics() {
  return (dispatch) => {
    fetch("https://192.168.1.15:8000/api/sensortag2000")
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    })
    .then((response) => response.json())
    .then((cm) => dispatch(graphMetricsFetchDataSuccess(cm)))
    .catch((e) => console.log(e));
  }
}
