import React, { useState, useEffect } from 'react'
import { get } from 'lodash'
import { Dialog, DialogTitle, DialogActions, DialogContent, CircularProgress, Typography, Button, FormControl, FormControlLabel, Checkbox, makeStyles, Box, Grid, Divider, Select, MenuItem, InputLabel } from '@material-ui/core'
import { updateLeave, createLeave } from '../../../httpActions/staffApi'
import { useToastMessageActions } from '../../../store/toast/toastHooks'
import { DateRangePicker } from 'react-date-range'
import moment from 'moment'

const useStyles = makeStyles ((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'stretch',
    alignItems: 'stretch'
  },
  dateRangePickerContainer: {
    paddingRight: theme.spacing(2),

    '& .rdrDefinedRangesWrapper' : {
      display: 'none'
    }
  },
  otherControlsContainer: {
    flexGrow: 1,
    paddingLeft: theme.spacing(2)
  }
}))

const initialState = {
  ID: null,
  StaffID: null,
  StartDateTime: moment().hours(9).minutes(0).seconds(0).toDate(),
  EndDateTime: moment().hours(18).minutes(0).seconds(0).toDate(),
  IsAbsent: false
}

export const LeaveFormDialog = ({ 
  staffId, 
  leaveSchedule=null, 
  isOpen=false,
  handleCancel,
  handleSubmitComplete
}) => {
  
  const cssClasses = useStyles({})
  const { addSuccessMessage, addErrorMessage } = useToastMessageActions()
  const [workingCopy, setWorkingCopy] = useState({
    ...initialState,
    StaffID: staffId,
    ...(leaveSchedule || {})
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setWorkingCopy({
        ...initialState,
        StaffID: staffId,
        ...(leaveSchedule || {})
      })
    }
  }, [isOpen, leaveSchedule, staffId])

  const updatePartialWorkingCopy = (data) => {
    setWorkingCopy({
      ...workingCopy,
      ...data
    })
  }

  const handleDateRangeChange = ({ selection }) => {

    const { startDate, endDate } = selection
    const currentStartDate = moment(workingCopy.StartDateTime)
    const currentEndDate = moment(workingCopy.EndDateTime)

    updatePartialWorkingCopy({
      StartDateTime: moment(startDate).hours(currentStartDate.hours()).minutes(0).seconds(0).toDate(),
      EndDateTime: moment(endDate).hours(currentEndDate.hours()).minutes(0).seconds(0).toDate()
    })
  }

  const handleStartTimeChange = (evt) => {
    updatePartialWorkingCopy({
      StartDateTime: moment(workingCopy.StartDateTime).hours(parseInt(evt.target.value)).minutes(0).seconds(0).toDate()
    })
  }

  const handleEndTimeChange = (evt) => {
    updatePartialWorkingCopy({
      EndDateTime: moment(workingCopy.EndDateTime).hours(parseInt(evt.target.value)).minutes(0).seconds(0).toDate()
    })
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      if (workingCopy.ID) {
        await updateLeave(staffId, workingCopy.ID, workingCopy.StartDateTime, workingCopy.EndDateTime)
      } else {
        await createLeave(staffId, workingCopy.StartDateTime, workingCopy.EndDateTime)
      }
      addSuccessMessage('Leave created')
      handleSubmitComplete()
    } catch (e) {
      console.error(e)
      addErrorMessage(get(e, 'response.data', 'Error saving leave. Please try again.'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} fullWidth={true} maxWidth="md">
      <DialogTitle>{!!workingCopy.ID? 'Update Leave' : 'New Leave'}</DialogTitle>
      <DialogContent>
        <Box className={cssClasses.form}>
          {/* DATES */}
          <Box className={cssClasses.dateRangePickerContainer}>
            <DateRangePicker
              minDate={new Date()}
              staticRanges={[]}
              inputRanges={[]}
              direction="horizontal"
              onChange={handleDateRangeChange}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={2}
              ranges={[{
                startDate: moment(workingCopy.StartDateTime).toDate(),
                endDate: moment(workingCopy.EndDateTime).toDate(),
                key: 'selection'
              }]}
            />    
          </Box>
          {/* END DATES */}

          <Divider orientation="vertical" flexItem />

          <Box className={cssClasses.otherControlsContainer}>
            {/* FULL DAY LEAVE */}
            <FormControl>
              <FormControlLabel
                label="Full day leave"
                control={(
                  <Checkbox 
                    checked={workingCopy.IsAbsent}
                    name="IsAbsent"
                    color="primary"
                    onChange={(evt, checked) => {
                      updatePartialWorkingCopy({
                        IsAbsent: checked
                      })
                    }}
                  />
                )}
              />
            </FormControl>
            {/* END FULL DAY LEAVE */}

            <br /><br />

            {/* START TIME */}
            <FormControl fullWidth>
              <InputLabel>Start Time</InputLabel>
              <Select
                name="fromTime"
                onChange={handleStartTimeChange}
                value={moment(workingCopy.StartDateTime).hours()}
                disabled={workingCopy.IsAbsent}
              >
                {[9,10,11,12,13,14,15,16,17,18].map((hour) => (
                  <MenuItem value={hour}>{moment().hours(hour).minutes(0).format('h:mma')}</MenuItem>
                ))}
                
              </Select>
            </FormControl>
            {/* END START TIME */}

            <br /><br />

            {/* END TIME */}
            <FormControl fullWidth>
              <InputLabel>End Time</InputLabel>
              <Select
                name="toTime"
                onChange={handleEndTimeChange}
                value={moment(workingCopy.EndDateTime).hours()}
                disabled={workingCopy.IsAbsent}
              >
                {[9,10,11,12,13,14,15,16,17,18].map((hour) => (
                  <MenuItem value={hour}>{moment().hours(hour).minutes(0).format('h:mma')}</MenuItem>
                ))}
                
              </Select>
            </FormControl>
            {/* END END TIME */}
          </Box>
        </Box>
        
      </DialogContent>
      <DialogActions>
        <Button color="info" onClick={handleCancel}>Cancel</Button>
        <Button color="primary" disabled={isLoading} onClick={handleSubmit} variant="contained">
          Submit 
          {isLoading && <CircularProgress size={10} />}
        </Button>
      </DialogActions>
    </Dialog>
  )
}