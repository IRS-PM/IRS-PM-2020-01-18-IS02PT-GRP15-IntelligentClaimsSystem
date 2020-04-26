import React from 'react'
import { Snackbar, SnackbarContent } from '@material-ui/core'
import { store } from '../store/store'
import { ACTION_TYPES } from '../store/actionTypes'

export function ToastMessages() {

    const { state, dispatch } = React.useContext(store)
    const [isOpen, setIsOpen] = React.useState(false)

    const { toastMessages } = state

    React.useEffect(() => {
        setIsOpen(true)
    }, [toastMessages.join(',')])

    const handleClose = () => {
        setIsOpen(false)
        dispatch({
            type: ACTION_TYPES.CLEAR_TOAST_MESSAGES
        })
    }

    return (
        <>
            {toastMessages.map((message, index) => (
                <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose} key={index}>
                    <SnackbarContent message={message} />
                </Snackbar>
            ))}
        </>
    )
}