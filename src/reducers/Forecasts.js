export function getForecasts(state = { forecast: new Map(), forecastGraph: []}, action) {
    switch (action.type) {
        case 'GET_FORECASTS_SUCCESS':
            return { forecast: action.forecast, forecastGraph: action.forecastGraph };
        default:
            return state;
    }
}
