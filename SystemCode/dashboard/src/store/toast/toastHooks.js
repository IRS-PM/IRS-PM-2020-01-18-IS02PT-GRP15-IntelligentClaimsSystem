import { useContext } from 'react'
import ACTION_TYPES from './toastActionTypes'
import { store } from '../store'

export const useToastMessageActions = () => {
  const {state, dispatch} = useContext(store)
  const toastMessages = state.toastMessages

  const addToastMessage = (message, messageType) => {
    dispatch({
      type: ACTION_TYPES.ADD_TOAST_MESSAGE,
      message: message,
      messageType: messageType
    })
  }

  const addSuccessMessage = (message) => {
    addToastMessage(message, 'success')
  }

  const addErrorMessage = (message) => {
    addToastMessage(message, 'error')
  }

  const addInfoMessage = (message) => {
    addToastMessage(message, 'info')
  }

  const clearToastMessages = () => {
    dispatch({
      type: ACTION_TYPES.CLEAR_TOAST_MESSAGES
    })
  }

  return {
    toastMessages,
    addToastMessage,
    addSuccessMessage,
    addErrorMessage,
    addInfoMessage,
    clearToastMessages
  }
}