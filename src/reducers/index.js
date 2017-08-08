import { combineReducers } from 'redux';
import { currentMetrics, currentMetricsHasErrored } from './currentMetrics';
import { graphMetrics } from './graphMetrics';
import { hueSwitchesAll, hueSwitchesAllStatus } from './hueSwitches';
import { getForecasts } from './Forecasts';
import { getRATPTraffic, getRATPRERASchedules, getRATPBUS118Schedules } from './RATP';

export default combineReducers({
    graphMetrics,
    currentMetrics,
    currentMetricsHasErrored,
    hueSwitchesAll,
    hueSwitchesAllStatus,
    getForecasts,
    getRATPRERASchedules,
    getRATPBUS118Schedules,
    getRATPTraffic
});
