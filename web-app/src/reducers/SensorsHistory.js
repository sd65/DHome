export function sensorsHistory(state = { columns: [], values: []}, action) {
  switch (action.type) {
  case "SENSORS_HISTORY":
    return action.sensorsHistory
  default:
    return state
  }
}

export function sensorsHistoryAvailable (state = false, action) {
  switch (action.type) {
  case "SENSORS_HISTORY_AVAILABLE":
    return action.status
  default:
    return state
  }
}
