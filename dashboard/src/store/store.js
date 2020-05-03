// store.js
import React, {createContext, useReducer} from 'react';
import initialState from './initialState'
import navReducers from './nav/navReducers'
import dateRangeReducers from './dateRange/dateRangeReducers'
import toastReducers from './toast/toastReducers'

export const store = createContext(initialState);
const { Provider } = store;

export const StateProvider = ( { children } ) => {
  const [state, dispatch] = useReducer((state, action) => {
    let transformedState = state
    transformedState = navReducers(transformedState, action)
    transformedState = dateRangeReducers(transformedState, action)
    transformedState = toastReducers(transformedState, action)
    
    return transformedState
  }, initialState)

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};