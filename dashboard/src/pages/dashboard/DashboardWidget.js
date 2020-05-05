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
  title: {
    paddingBottom: theme.spacing(2),
    color: theme.palette.grey[600],
    fontWeight: 'normal',
    fontSize: '1rem'
  },
  contentsContainer: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}))

export const DashboardWidget = ({ children, isLoading=false, className='', title='', ...otherProps }) => {

  const cssClasses = useStyles({})

  return (
    <Paper 
      {...otherProps}
      className={`${className} ${cssClasses.root}`}
    >
      {!!title && <Typography variant="h6" className={cssClasses.title}>{title}</Typography>}
      <div className={cssClasses.contentsContainer}>
        {isLoading?
          <CircularProgress />
          : children
        }
      </div>
    </Paper>
  )
}