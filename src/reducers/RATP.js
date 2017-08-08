export function getRATPTraffic(state = {}, action) {
    switch (action.type) {
        case 'GET_RATP_SUCCESS':
            return action.traffic;
        default:
            return state;
    }
}

export function getRATPBUS118Schedules(state = [], action) {
    switch (action.type) {
        case 'GET_RATP_BUS118_SCHEDULES_SUCCESS':
            return action.schedules;
        default:
            return state;
    }
}

export function getRATPRERASchedules(state = [], action) {
    switch (action.type) {
        case 'GET_RATP_RERA_SCHEDULES_SUCCESS':
            return action.schedules;
        default:
            return state;
    }
}
