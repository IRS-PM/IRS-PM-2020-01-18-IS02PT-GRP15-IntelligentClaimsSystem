import React from 'react'
import { get } from 'lodash'
import poolIDs from '../config/poolIDs'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
  root: {
    display: 'inline-block',
    color: ({color}) => color
  }
})

export const PoolID = ({poolID}) => {
  const color = get(poolIDs, `${poolID}.color`, '#000')
  const cssClasses = useStyles({color: color})
  
  return (
    <span className={cssClasses.root}>{poolID}</span>
  )
}