import React from 'react'
import { NAV_WIDTH } from '../config/theme'
import { AppBar, Toolbar, IconButton, Typography, makeStyles, SvgIcon } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { useNavActions } from '../store/nav/navHooks'

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    })
  },
  rootNavOpen: {
    marginLeft: NAV_WIDTH,
    width: `calc(100% - ${NAV_WIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    })
  },
  title: {
    marginLeft: theme.spacing(5),
    flexGrow: 1
  }
}))

export const AppHeader = () => {

  const cssClasses = useStyles({})
  const { navIsOpen, toggleNavOpen } = useNavActions()

  return (
    <AppBar position="absolute" className={`${cssClasses.root} ${navIsOpen && cssClasses.rootNavOpen}`}>
      <Toolbar>
        <IconButton onClick={toggleNavOpen} edge="start"><SvgIcon htmlColor="#ffffff"><MenuIcon /></SvgIcon></IconButton>
        <Typography variant="h6" className={cssClasses.title}>Intelligent Claims Management System</Typography>
      </Toolbar>
    </AppBar>
  )
}