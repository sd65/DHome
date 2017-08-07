export function currentMetricsHasErrored(state = false, action) {
    switch (action.type) {
        case 'CURRENT_METRICS_HAS_ERRORED':
            return action.hasErrored;

        default:
            return state;
    }
}

export function currentMetrics(state = {}, action) {
    switch (action.type) {
        case 'CURRENT_METRICS_FETCH_DATA_SUCCESS':
            return action.currentMetrics;
        default:
            return state;
    }
}
