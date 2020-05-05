import React from 'react'
import { Paper, Typography, makeStyles, CircularProgress } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    flexGrow: 1,
    margin: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'stretch'
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'stretch',
    paddingBottom: theme.spacing(2),
  },
  title: {
    color: theme.palette.grey[600],
    fontWeight: 'normal',
    fontSize: '1rem',
    flexGrow: 1
  },
  actions: {
    
  },
  contentsContainer: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}))

export const DashboardWidget = ({ children, isLoading=false, className='', title, action=null, ...otherProps }) => {

  const cssClasses = useStyles({})

  return (
    <Paper 
      {...otherProps}
      className={`${className} ${cssClasses.root}`}
    >
      <div className={cssClasses.header}>
        <Typography variant="h6" className={cssClasses.title}>{title}</Typography>
        {!!action && 
          <div className={cssClasses.action}>
            {action}
          </div>
        }
      </div>
      
      <div className={cssClasses.contentsContainer}>
        {isLoading?
          <CircularProgress />
          : children
        }
      </div>
    </Paper>
  )
}