export function graphMetrics(state = { columns: [], values: []}, action) {
    switch (action.type) {
        case 'GRAPH_METRICS_FETCH_DATA_SUCCESS':
            return action.metrics;
        default:
            return state;
    }
}
