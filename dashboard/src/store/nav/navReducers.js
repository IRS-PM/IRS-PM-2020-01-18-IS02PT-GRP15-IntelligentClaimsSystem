import ACTION_TYPES from './navActionTypes'
import initialState from '../initialState'

export default (state = initialState, action) => {
  switch(action.type) {
    case ACTION_TYPES.SET_NAV_IS_OPEN:
      return {
        ...state,
        nav: {
          ...state.nav,
          isOpen: action.isOpen
        }
      }
    default:
      return state
  }
}