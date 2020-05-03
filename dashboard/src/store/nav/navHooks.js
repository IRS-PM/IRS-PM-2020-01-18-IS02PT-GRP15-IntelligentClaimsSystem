import { useContext } from 'react'
import { get } from 'lodash'
import ACTION_TYPES from './navActionTypes'
import { store } from '../store'

export const useNavActions = () => {
  const {state, dispatch} = useContext(store)

  const navIsOpen = get(state, 'nav.isOpen', false)

  const setNavIsOpen = (isOpen) => {
    dispatch({
      type: ACTION_TYPES.SET_NAV_IS_OPEN,
      isOpen: isOpen
    })
  }

  const toggleNavOpen = () => {
    dispatch({
      type: ACTION_TYPES.SET_NAV_IS_OPEN,
      isOpen: !state.nav.isOpen
    })
  }

  return {
    navIsOpen,
    setNavIsOpen,
    toggleNavOpen
  }
}