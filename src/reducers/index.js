import { combineReducers } from 'redux';
import { currentMetrics, currentMetricsHasErrored } from './currentMetrics';

export default combineReducers({
    currentMetrics,
    currentMetricsHasErrored,
});
