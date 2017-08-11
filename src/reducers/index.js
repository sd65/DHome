import { combineReducers } from 'redux';
import { lastSensorsMetrics } from './currentMetrics';
import { sensorsHistory, sensorsHistoryAvailable } from './graphMetrics';
import { hueLightsReachable, hueSwitchesAll, hueSwitchesAllStatus } from './hueSwitches';
import { lastForecast, forecastAvailable } from './Forecasts';
import { RATPTraffic, RATPTrafficAvailable, RATPSchedules, RATPSchedulesAvailable } from './RATP';

export default combineReducers({
    sensorsHistory,
    sensorsHistoryAvailable,
    lastSensorsMetrics,
    hueSwitchesAll,
    hueLightsReachable,
    hueSwitchesAllStatus,
    lastForecast,
    forecastAvailable,
    RATPSchedules,
    RATPSchedulesAvailable,
    RATPTrafficAvailable,
    RATPTraffic
});
