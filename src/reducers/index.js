import { combineReducers } from 'redux';
import { currentMetrics, currentMetricsHasErrored } from './currentMetrics';
import { hueSwitchesAll, hueSwitchesAllStatus } from './hueSwitches';
import { getForecasts } from './Forecasts';
import { getRATPTraffic } from './RATP';

export default combineReducers({
    currentMetrics,
    currentMetricsHasErrored,
    hueSwitchesAll,
    hueSwitchesAllStatus,
    getForecasts,
    getRATPTraffic
});
