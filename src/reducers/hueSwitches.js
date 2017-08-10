export function hueLightsReachable(state = false, action) {
    switch (action.type) {
        case 'HUE_LIGHTS_REACHABLE':
            return action.status;
        default:
            return state;
    }
}

export function hueSwitchesAllStatus(state = [], action) {
    switch (action.type) {
        case 'HUE_SWITCHES_ALL_STATUS':
            return action.status;
        default:
            return state;
    }
}

export function hueSwitchesAll(state = {}, action) {
    switch (action.type) {
        case 'HUE_SWITCHES_ALL_SUCCESS':
            return action;
        default:
            return state;
    }
}
