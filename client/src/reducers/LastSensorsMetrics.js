let defState = {T: "-", H: "-", B: 0}

export function lastSensorsMetrics(state = defState, action) {
    switch (action.type) {
        case 'LAST_SENSORS_METRICS':
            return (action.metrics) ? action.metrics : defState;
        default:
            return state;
    }
}
