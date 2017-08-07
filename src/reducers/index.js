import { combineReducers } from 'redux';
import { currentMetrics, currentMetricsHasErrored } from './currentMetrics';
import { hueSwitchesAll, hueSwitchesAllStatus } from './hueSwitches';

export default combineReducers({
    currentMetrics,
    currentMetricsHasErrored,
    hueSwitchesAll,
    hueSwitchesAllStatus
});
