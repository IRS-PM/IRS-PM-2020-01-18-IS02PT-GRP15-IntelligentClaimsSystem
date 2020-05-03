import { useContext } from 'react'
import { get } from 'lodash'
import ACTION_TYPES from './dateRangeActionTypes'
import { store } from '../store'

export const useDateRangeActions = () => {
  const {state, dispatch} = useContext(store)

  const dateRangeFrom = get(state, 'dateRange.from')
  const dateRangeTo = get(state, 'dateRange.to')

  const setDateRange = (from, to) => {
    dispatch({
      type: ACTION_TYPES.SET_DATE_RANGE,
      from: from,
      to: to
    })
  }

  return {
    dateRangeFrom,
    dateRangeTo,
    setDateRange
  }
}