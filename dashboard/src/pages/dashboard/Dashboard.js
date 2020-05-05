import React from 'react'
import { makeStyles, Box, Typography, Divider, Grid } from '@material-ui/core'
import { ClaimStatusDistribution } from './claimWidgets/ClaimStatusDistribution'
import { RecentClaims } from './claimWidgets/RecentClaims'
import { JobDistribution } from './staffWidgets/JobDistribution'
import { SectionHeader, ClaimsDateRangeSelector } from '../../components'

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

  const cssClasses = useStyles({})

  return (
    <Box>
      {/* CLAIMS */}
      <SectionHeader 
        title="Claims"
        actions={<ClaimsDateRangeSelector />}
      />
      <Grid container>
        <Grid item sm={12} md={5} lg={3}>
          <ClaimStatusDistribution />
        </Grid>
        <Grid item sm={12} md={7} lg={9}>
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