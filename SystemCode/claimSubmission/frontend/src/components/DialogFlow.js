import React from 'react'
import { dialogFlowSettings } from '../config/config'
import { store } from '../store/store'
import { ACTION_TYPES } from '../store/actionTypes'
import Axios from 'axios'

export function DialogFlow ({
    handleUploadTriggered = () => {},
    handleLoadFailed = () => {}
}) {

    const {state, dispatch} = React.useContext(store)
    const scriptTagElement = React.useRef(null)
    const dfMessenger = React.useRef(null)
    const { dialogFlowMessageQueue: messageQueue } = state

    // on mount
    React.useEffect(() => {

        if (!dfMessenger.current) {
            const dfEl = document.createElement('df-messenger')
            dfEl.setAttribute('intent', dialogFlowSettings.defaultIntent)
            dfEl.setAttribute('chat-title', dialogFlowSettings.title)
            dfEl.setAttribute('agent-id', dialogFlowSettings.agentId)
            dfEl.setAttribute('language-code', 'en')
            dfMessenger.current = dfEl
        }

        if (!scriptTagElement.current) {
            const scriptEl = document.createElement('script')
            scriptEl.onerror = handleLoadFailed
            scriptEl.setAttribute('src', 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1')
            scriptTagElement.current = scriptEl
        }

        document.body.appendChild(dfMessenger.current)
        document.head.appendChild(scriptTagElement.current)
        
        dfMessenger.current.addEventListener('df-response-received', (evt) => {
            const messages = evt.detail.response.queryResult.fulfillmentMessages
            messages.forEach((message) => {
                handleFulfillmentMessage(message)
            })
        })

    }, [])

    // When session id is updated, update store
    React.useEffect(() => {
        if (dfMessenger.current && dfMessenger.current.sessionId) {
            dispatch({
                type: ACTION_TYPES.SET_DIALOG_FLOW_SESSION_ID,
                payload: dfMessenger.current.sessionId
            })
        }
    }, [dfMessenger.current? dfMessenger.current.sessionId : null])

    React.useEffect(() => {
        messageQueue.forEach((message) => {
            dfMessenger.current.renderCustomText(message)
        })
    }, [messageQueue.join(',')])


    // Handle custom payload
    const handleFulfillmentMessage = ({payload=null}) => {
        if (!payload) return

        switch(payload.action) {
            case 'fileUpload':
                handleUploadTriggered(payload.parameters.type)
                break
        }
    }


    return null
}