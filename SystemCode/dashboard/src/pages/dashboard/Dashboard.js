import React from 'react'
import { makeStyles, Box, Typography, Divider, Grid, IconButton, Tooltip } from '@material-ui/core'
import { ClaimStatusDistribution } from './claimWidgets/ClaimStatusDistribution'
import { AutoClaimDistribution } from './claimWidgets/AutoClaimDistribution'
import { RecentClaims } from './claimWidgets/RecentClaims'
import { JobDistribution } from './staffWidgets/JobDistribution'
import { SectionHeader, ClaimsDateRangeSelector } from '../../components'
import { Refresh } from '@material-ui/icons'
import { useDateRangeActions } from '../../store/dateRange/dateRangeActionHooks'
import moment from '../../../../claimRepository/node_modules/moment/moment'

const useStyles = makeStyles((theme) => ({
  widgets: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    height: '100%',
    width: '100%'
  },

  column: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '50%'
  }
}))


export const Dashboard = () => {

  const { setDateRange, dateRangeFrom, dateRangeTo } = useDateRangeActions()
  const cssClasses = useStyles({})

  const handleReload = () => {
    setDateRange(moment(dateRangeFrom).toDate(), moment(dateRangeTo).toDate())
  }

  return (
    <Box>
      {/* CLAIMS */}
      <SectionHeader 
        title="Claims"
        actions={
          <>
            <Tooltip title="Refresh data"><IconButton onClick={handleReload}><Refresh /></IconButton></Tooltip>
            <ClaimsDateRangeSelector />
          </>
        }
      />
      <Grid container>
        <Grid item sm={12} md={6} lg={3}>
          <AutoClaimDistribution />
        </Grid>
        <Grid item sm={12} md={6} lg={3}>
          <ClaimStatusDistribution />
        </Grid>
        <Grid item sm={12} md={12} lg={6}>
          <RecentClaims />
        </Grid>
      </Grid>

      <br /><br />

      {/* STAFF */}
      <SectionHeader 
        title="Staff"
      />
      <Grid container>
        <Grid item md={12}>
          <JobDistribution />
        </Grid>
      </Grid>
    </Box>
  )
}