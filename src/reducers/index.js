import { combineReducers } from 'redux';
import { lastSensorsMetrics } from './currentMetrics';
import { graphMetrics } from './graphMetrics';
import { hueLightsReachable, hueSwitchesAll, hueSwitchesAllStatus } from './hueSwitches';
import { lastForecast, forecastAvailable } from './Forecasts';
import { getRATPTraffic, getRATPRERASchedules, getRATPBUS118Schedules } from './RATP';

export default combineReducers({
    graphMetrics,
    lastSensorsMetrics,
    hueSwitchesAll,
    hueLightsReachable,
    hueSwitchesAllStatus,
    lastForecast,
    forecastAvailable,
    getRATPRERASchedules,
    getRATPBUS118Schedules,
    getRATPTraffic
});
