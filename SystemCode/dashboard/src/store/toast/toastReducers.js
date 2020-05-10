import ACTION_TYPES from './toastActionTypes'
import initialState from '../initialState'

export default (state = initialState, action) => {
  switch(action.type) {
    case ACTION_TYPES.ADD_TOAST_MESSAGE:
      return {
        ...state,
        toastMessages: [
          ...state.toastMessages,
          {
            message: action.message,
            messageType: action.messageType
          }
        ]
      }

    case ACTION_TYPES.CLEAR_TOAST_MESSAGES:
      return {
        ...state,
        toastMessages: []
      }
    default:
      return state
  }
}