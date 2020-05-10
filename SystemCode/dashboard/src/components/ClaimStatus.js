import React from 'react'
import claimStatuses from '../config/claimStatuses'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
  root: {
    display: 'inline-block',
    color: ({color}) => color
  }
})

export const ClaimStatus = ({status}) => {
  const { label='Unknown', color='#000' } = claimStatuses[status]
  const cssClasses = useStyles({color: color})
  
  return (
    <span className={cssClasses.root}>{label}</span>
  )
}