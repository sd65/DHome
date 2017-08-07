export function hueSwitchesDisconnected(state = false, action) {
    switch (action.type) {
        case 'HUE_SWITCHES_DISCONNECTED':
            return action.disconnected;
        default:
            return state;
    }
}

export function hueSwitchesAllStatus(state = false, action) {
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
