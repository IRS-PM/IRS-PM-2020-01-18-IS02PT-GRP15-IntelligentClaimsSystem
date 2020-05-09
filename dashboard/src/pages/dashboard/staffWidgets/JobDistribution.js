import React, { useEffect } from 'react'
import { get } from 'lodash'
import { makeStyles, Box, Tooltip, Button } from '@material-ui/core'
import { DashboardWidget } from '../DashboardWidget'
import { useToastMessageActions } from '../../../store/toast/toastHooks'
import { getStaffAvailability, distributeClaims } from '../../../httpActions/staffApi'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import { withRouter } from 'react-router-dom'
import poolIDs from '../../../config/poolIDs'
import { DatePicker } from '../../../components/DatePicker'
const moment = extendMoment(Moment)

const WORKING_HOUR_FROM = 9
const WORKING_HOUR_TO = 18
const HOUR_TICKS_HEIGHT = 20
const NAME_ROW_HEIGHT = 30
const LUNCH_HOUR = 12

const useStyles = makeStyles((theme)=>({
  timelineContainer: {
    marginTop: theme.spacing(2),
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'stretch',
    alignContent: 'flex-start'
  },
  namesContainer: {
    paddingTop: HOUR_TICKS_HEIGHT,
    paddingRight: theme.spacing(3),
    flexGrow: 0,
    borderRight: `1px solid ${theme.palette.grey[500]}`
  },
  name: {
    lineHeight: `${NAME_ROW_HEIGHT}px`,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1),
    cursor: 'pointer'
  },
  scheduleContainer: {
    paddingLeft: theme.spacing(3),
    flexGrow: 1
  },
  hourTicks: {
    height: HOUR_TICKS_HEIGHT,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'stretch',
    alignContent: 'flex-end',
    alignItems: 'flex-end'
  },
  hourTick: {
    textAlign: 'left',
    width: `${Math.round(100 / (WORKING_HOUR_TO - WORKING_HOUR_FROM))}%`,
    flexGrow: 0,
    fontSize: 12,
    '&::after': {
      content: '""',
      width: 1,
      height: 10,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display:'block',
    }
  },
  scheduleBars: {
    width: '100%',
    height: NAME_ROW_HEIGHT,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'stretch',
    alignItems: 'flex-stretch',
    flexWrap: 'nowrap',
    marginBottom: theme.spacing(1)
  },
  scheduleBar: {
    width: `${Math.round(100 / (WORKING_HOUR_TO - WORKING_HOUR_FROM))}%`,
    height: '100%',
    flexGrow: 0,
    backgroundColor: '#CCC',
    border: '1px solid white',
    padding: theme.spacing(0.5),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 0,
    fontSize: 12,
    '& > div': {
      width: `100%`,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'noWrap',
      textAlign: 'center'
    },

    '&.leave': {
      backgroundColor: theme.palette.grey[300]
    },
    '&.job': {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      cursor: 'pointer'
    },
    '&.empty': {
      backgroundColor: theme.palette.grey[50]
    }
  }
}))

export const JobDistribution = withRouter(({history}) => {

  const { addErrorMessage, addSuccessMessage } = useToastMessageActions()
  const cssClasses = useStyles({})
  const [isLoading, setIsLoading] = React.useState(false)
  const [date, setDate] = React.useState(new Date())
  const [data, setData] = React.useState([])

  useEffect(() => {
    reloadData()
  }, [date])

  const reloadData = async () => {
    const workHoursRange = moment.range(moment(date).hours(WORKING_HOUR_FROM).minutes(0).seconds(0), moment(date).hours(WORKING_HOUR_TO).minutes(0).seconds(0))
    try {
      setIsLoading(true)
      const resp = await getStaffAvailability(date)
      setData(resp.data.data.map(staff => {

        // populate leave
        const activities = {}
        activities[LUNCH_HOUR.toString()] = {
          type: 'lunch',
          label: 'Lunch Break'
        }

        staff.TargettedDate.Leave.forEach(leave => {
          // find intersection of work day with
          const leaveRange = moment.range(leave.StartDateTime, leave.EndDateTime)
          const intersection = workHoursRange.intersect(leaveRange)
          if (!!intersection) {
            const leaveStartHour = intersection.start.hours()
            const leaveEndHour = intersection.end.hours()
            for (let i = leaveStartHour; i < leaveEndHour; i++) {
              activities[i.toString()] = {
                type: 'leave',
                label: 'Leave',
                url: `/staff/details/${staff.ID}`
              }
            } 
          }
        })

        // populate jobs
        staff.TargettedDate.Claims.forEach(claim => {
          let isFilled = false
          for (let i = WORKING_HOUR_FROM; i < WORKING_HOUR_TO && !isFilled; i++) {
            if (!activities[i.toString()]) {
              activities[i.toString()] = {
                type: 'job',
                poolId: claim.MedicalClaim.PoolID,
                label: `Pool: ${claim.MedicalClaim.PoolID}, Claim No: ${claim.ClaimNo}`,
                url: `/claims/details/${claim.ClaimNo}`,
                fill: get(poolIDs, `${claim.MedicalClaim.PoolID}.color`, '#000')
              }
              isFilled = true
            }
          }
        })

        return {
          Name: staff.Name,
          ID: staff.ID,
          activities: activities
        }

      }))

    } catch (e) {
      addErrorMessage("Error loading job distribution data")
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const renderActivityBar = (staff, hour) => {
    const activity = get(staff, `activities['${hour}']`, {})
    const { type = '', label = '', poolId = '', url='/', fill } = activity

    switch (type) {
      case 'lunch':
        // deliberate fall through
      case 'leave':
        return (
          <Tooltip title={label}>
            <Box className={`${cssClasses.scheduleBar} leave`}>
              <div>{label}</div>
            </Box>
          </Tooltip>
        )
      case 'job':
        return (
          <Tooltip title={label}>
            <Box className={`${cssClasses.scheduleBar} ${poolId} job`} onClick={() => history.push(url)} style={{backgroundColor: fill}}>
              <div>{label}</div>
            </Box>
          </Tooltip>
        )
      default:
        return (
          <Box className={`${cssClasses.scheduleBar} empty`}></Box>
        )
    }
  }

  const handleDistributeClaimsClick = async () => {
    try {
      setIsLoading(true)
      await distributeClaims()
      await reloadData()
      addSuccessMessage("Claims distributed")
    } catch (e) {
      addErrorMessage("Error occurred while distributing claims. Please try again later.")
    } finally {
      setIsLoading(false)
    }
    
  }

  return (
    <DashboardWidget 
      title="Staff Load" 
      isLoading={isLoading} 
      action={(
        <Box display="flex" flexDirection="row">
          <Box marginRight="8px"><Button variant="contained" onClick={handleDistributeClaimsClick}>Distribute New Claims</Button></Box>
          <DatePicker 
            date={date}
            onChange={(date) => setDate(date)}
          />
        </Box>
      )}
    >
      <div className={cssClasses.timelineContainer}>
        {/* NAMES */}
        <Box className={cssClasses.namesContainer}>
          {data.map((entry, index) => (
            <Box className={cssClasses.name} key={index} onClick={() => history.push(`/staff/details/${entry.ID}`)}>
              {entry.Name}
            </Box>
          ))}
          
        </Box>
        {/* END NAMES */}

        {/* SCHEDULES */}
        <Box className={cssClasses.scheduleContainer}>
          {/* HOUR TICKS */}
          <Box className={cssClasses.hourTicks}>
            {Array(WORKING_HOUR_TO - WORKING_HOUR_FROM).fill(0).map((val, index) => {
              const hour = WORKING_HOUR_FROM + index
              return <Box className={cssClasses.hourTick} key={index}>{moment().hours(hour).format('ha')}</Box>
            })}
          </Box>
          {/* END HOUR TICKS */}

          {/* SCHEDULE BARS */}
            {data.map((staff, index) => (
              <Box className={cssClasses.scheduleBars} key={index}>
                {Array(WORKING_HOUR_TO - WORKING_HOUR_FROM).fill(0).map((val, index) => renderActivityBar(staff, WORKING_HOUR_FROM + index))}
              </Box>
            ))}
          {/* END SCHEDULE BARS */}
        </Box>
        {/* END SCHEDULES */}
      </div>
    </DashboardWidget>
  )
})