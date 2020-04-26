import React from 'react';
import { DialogFlow } from './components/DialogFlow'
import { UploadFileDialog } from './components/UploadFileDialog'
import { ToastMessages } from './components/ToastMessages'
import { store } from './store/store'
import { ACTION_TYPES } from './store/actionTypes'

function App() {

  const { state, dispatch } = React.useContext(store)

  const [fileUploadType, setFileUploadType] = React.useState()

  const handleUploadTriggered = (type) => {
    setFileUploadType(type)
  }

  const closeFileUploadDialog = () => {
    setFileUploadType('')
  }

  const handleUploadComplete = (resp) => {
    setFileUploadType('')
    dispatch({
      type: ACTION_TYPES.ADD_TO_DIALOG_FLOW_MESSAGE_QUEUE,
      payload: [resp.fulfillmentMessages]
    })
  }

  return (
    <div className="App">
      <ToastMessages />
      <DialogFlow 
        handleUploadTriggered={handleUploadTriggered}
      />
      <UploadFileDialog  
        open={!!fileUploadType}
        uploadFileType={fileUploadType}
        handleClose={closeFileUploadDialog}
        handleUploadComplete={handleUploadComplete}
      />
    </div>
  );
}

export default App;
