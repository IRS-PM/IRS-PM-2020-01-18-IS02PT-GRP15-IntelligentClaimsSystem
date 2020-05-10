import React from 'react'
import { Button, Popover } from '@material-ui/core'
import { useDateRangeActions } from '../store/dateRange/dateRangeActionHooks'
import moment from 'moment'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { Calendar } from 'react-date-range'

export const DatePicker = ({date, onChange}) => {

  const buttonRef = React.useRef(null)
  const [isOpen, setIsOpen] = React.useState(false)

  const handleDateChange = (date) => {
    onChange(date)
    setIsOpen(false)
  }

  return (
    <>
      <Button variant="contained" color="info" ref={buttonRef} onClick={()=>setIsOpen(!isOpen)}>
        {moment(date).format('LL')}
      </Button>
      <Popover 
        open={isOpen} 
        anchorEl={buttonRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={()=>setIsOpen(false)}
      >
        <Calendar
          date={date}
          onChange={handleDateChange}
        />
      </Popover>
    </>
  )
}