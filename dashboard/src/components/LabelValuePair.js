import React from 'react'
import { makeStyles, Typography, Grid } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1)
  },
  label: {
  },
  value: {
    fontWeight: 'bold'
  }
}))

export const LabelValuePair = ({ label, value }) => {

  const cssClasses = useStyles({})
  return (
    <Grid item md={3} className={cssClasses.root}>
      <Typography variant="caption" className={cssClasses.label}>{label}</Typography>
      <Typography className={cssClasses.value}>{value}</Typography>
    </Grid>
  )
}