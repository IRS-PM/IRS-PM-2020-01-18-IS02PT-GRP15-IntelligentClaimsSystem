import React from 'react';
import { DialogFlow } from './components/DialogFlow'
import { UploadFileDialog } from './components/UploadFileDialog'
import { SampleData } from './components/SampleData'
import { ToastMessages } from './components/ToastMessages'
import { store } from './store/store'
import { ACTION_TYPES } from './store/actionTypes'
import { Typography } from '@material-ui/core';
import './App.css'

function App() {

  const { state, dispatch } = React.useContext(store)
  const [isOffline, setIsOffline] = React.useState(false)
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
  
  const handleLoadFailed = () => {
    setIsOffline(true)
  }

  return (
    <div className="App">
      <ToastMessages />
       
      <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <Typography variant="h5" style={{color: '#505050', fontWeight: 100}}>
        { isOffline 
            ? 'Dialogflow failed to load. If you are currently offline, please use the dashboard to submit claims instead.'
            : (
              <>
                To start, please talk to the chatbot at the bottom right of the screen.
                <br />Here are some sample data to help you along.
                <SampleData />
              </>
            )
        }
        </Typography>
      </div>
      <DialogFlow 
        handleUploadTriggered={handleUploadTriggered}
        handleLoadFailed={handleLoadFailed}
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
