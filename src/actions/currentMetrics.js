export function currentMetricsHasErrored(bool) {
    return {
        type: 'CURRENT_METRICS_HAS_ERRORED',
        hasErrored: bool
    };
}

export function currentMetricsFetchDataSuccess(currentMetrics) {
    return {
        type: 'CURRENT_METRICS_FETCH_DATA_SUCCESS',
        currentMetrics
    };
}
  
  
export function currentMetricsFetchData(url) {
  return (dispatch) => {
    fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    })
    .then((response) => response.json())
    .then((cm) => dispatch(currentMetricsFetchDataSuccess(cm)))
    .catch(() => dispatch(currentMetricsHasErrored(true)));
  }
}
