import React from 'react'
import { Snackbar, SnackbarContent, makeStyles } from '@material-ui/core'
import { useToastMessageActions } from '../store/toast/toastHooks'

const useStyles = makeStyles((theme) => ({
  error: {
    backgroundColor: theme.palette.error.main
  },
  info: {
    backgroundColor: theme.palette.info.main,
  },
  success: {
    backgroundColor: theme.palette.success.main
  }
}))

export function ToastMessages() {

  const cssClasses = useStyles({})
  const { toastMessages, clearToastMessages } = useToastMessageActions()
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    if (toastMessages.length > 0) {
      setIsOpen(true)
    }
  }, [toastMessages])

  const handleClose = () => {
    clearToastMessages()
  }

  return (
    <>
      {toastMessages.map(({message, messageType}, index) => (
        <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose} key={index}>
          <SnackbarContent 
            className={`${cssClasses[messageType]}`}
            message={message} 
          />
        </Snackbar>
      ))}
    </>
  )
}