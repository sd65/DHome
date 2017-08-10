import { combineReducers } from 'redux';
import { lastSensorsMetrics } from './currentMetrics';
import { graphMetrics } from './graphMetrics';
import { hueLightsReachable, hueSwitchesAll, hueSwitchesAllStatus } from './hueSwitches';
import { lastForecast, forecastAvailable } from './Forecasts';
import { RATPTraffic, RATPTrafficAvailable, RATPSchedules, RATPSchedulesAvailable } from './RATP';

export default combineReducers({
    graphMetrics,
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
