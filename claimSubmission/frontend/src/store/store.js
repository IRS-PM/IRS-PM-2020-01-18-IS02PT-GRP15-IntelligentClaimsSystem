// store.js
import React, {createContext, useReducer} from 'react';
import { ACTION_TYPES } from './actionTypes'
import axios from 'axios'

export const initialState = {
    dialogFlowSessionId: '',
    dialogFlowMessageQueue: [],
    toastMessages: []
};
export const store = createContext(initialState);
const { Provider } = store;

export const StateProvider = ( { children } ) => {
    const [state, dispatch] = useReducer((state, action) => {
    switch(action.type) {
        case ACTION_TYPES.CLEAR_TOAST_MESSAGES:
            return {
                ...state,
                toastMessages: []
            }

        case ACTION_TYPES.ADD_TOAST_MESSAGE:
            return {
                ...state,
                toastMessages: [...state.toastMessages, action.payload]
            }

        case ACTION_TYPES.ADD_TO_DIALOG_FLOW_MESSAGE_QUEUE:
            return {
                ...state,
                dialogFlowMessageQueue: [...state.dialogFlowMessageQueue, ...action.payload]
            }

        case ACTION_TYPES.SET_DIALOG_FLOW_SESSION_ID:

            if (state.dialogFlowSessionId !== action.payload) {
                axios.interceptors.request.use(function (config) {
                    config.headers = {
                        ...config.headers,
                        Dfsessionid: action.payload
                    }
                    return config
                }, function (error) {
                    return Promise.reject(error)
                });

                return {
                    ...state,
                    dialogFlowSessionId: action.payload
                }
            }
            break

        default:
            return state
    };
    }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};