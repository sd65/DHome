export function RATPTraffic(state = {}, action) {
    switch (action.type) {
        case 'RATP_TRAFFIC':
            return action.traffic;
        default:
            return state;
    }
}

export function RATPTrafficAvailable(state = false, action) {
    switch (action.type) {
        case 'RATP_TRAFFIC_AVAILABLE':
            return action.status;
        default:
            return state;
    }
}

export function RATPSchedulesAvailable(state = false, action) {
    switch (action.type) {
        case 'RATP_SCHEDULES_AVAILABLE':
            return action.status;
        default:
            return state;
    }
}

export function RATPSchedules (state = {RER: [], BUS: []}, action) {
    switch (action.type) {
        case 'RATP_SCHEDULES':
            return action.schedules
        default:
            return state;
    }
}
