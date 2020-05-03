import React from 'react'
import { Button, Popover } from '@material-ui/core'
import { useDateRangeActions } from '../store/dateRange/dateRangeActionHooks'
import moment from 'moment'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { DateRangePicker } from 'react-date-range'

export const ClaimsDateRangeSelector = () => {

  const { dateRangeFrom, dateRangeTo, setDateRange } = useDateRangeActions()
  const dateRangeButtonRef = React.useRef(null)
  const [dateRangeIsOpen, setDateRangeIsOpen] = React.useState(false)

  const handleDateRangeChange = ({ selection }) => {
    setDateRange(selection.startDate, selection.endDate)
  }

  return (
    <>
      <Button variant="contained" color="info" ref={dateRangeButtonRef} onClick={()=>setDateRangeIsOpen(!dateRangeIsOpen)}>
        {moment(dateRangeFrom).format('LL')} - {moment(dateRangeTo).format('LL')}
      </Button>
      <Popover 
        open={dateRangeIsOpen} 
        anchorEl={dateRangeButtonRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={()=>setDateRangeIsOpen(false)}
      >
        <DateRangePicker
          onChange={handleDateRangeChange}
          showSelectionPreview={true}
          moveRangeOnFirstSelection={false}
          direction="horizontal"
          months={2}
          ranges={[{
            startDate: dateRangeFrom,
            endDate: dateRangeTo,
            key: 'selection'
          }]}
        />
      </Popover>
    </>
  )
}