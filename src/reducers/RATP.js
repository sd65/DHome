export function getRATPTraffic(state = {}, action) {
    switch (action.type) {
        case 'GET_RATP_SUCCESS':
            return action.traffic;
        default:
            return state;
    }
}
