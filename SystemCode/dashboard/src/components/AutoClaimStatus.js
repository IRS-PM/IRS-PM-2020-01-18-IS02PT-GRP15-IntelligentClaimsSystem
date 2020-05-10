import React from 'react'
import autoClaimLabels from '../config/autoClaimLabels'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
  root: {
    display: 'inline-block',
    color: ({color}) => color
  }
})

export const AutoClaimStatus = ({autoClaimStatus}) => {
  const { label='Unknown', color='#000' } = autoClaimLabels[String(autoClaimStatus)]
  const cssClasses = useStyles({color: color})
  
  return (
    <span className={cssClasses.root}>{label}</span>
  )
}