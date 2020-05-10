import ACTION_TYPES from './dateRangeActionTypes'
import initialState from '../initialState'

export default (state = initialState, action) => {
  switch(action.type) {
    case ACTION_TYPES.SET_DATE_RANGE:
      return {
        ...state,
        dateRange: {
          ...state.dateRange,
          from: action.from,
          to: action.to
        }
      }
    default:
      return state
  }
}