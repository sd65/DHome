import { combineReducers } from 'redux';
import { lastSensorsMetrics } from './LastSensorsMetrics';
import { sensorsHistory, sensorsHistoryAvailable } from './SensorsHistory';
import { hueLightsReachable, hueSwitchesAll, hueSwitchesAllStatus } from './HueSwitches';
import { lastForecast, forecastAvailable } from './Forecast';
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
