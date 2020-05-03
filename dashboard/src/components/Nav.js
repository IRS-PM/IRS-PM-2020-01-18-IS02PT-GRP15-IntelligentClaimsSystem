import React from 'react'
import { NAV_WIDTH } from '../config/theme'
import { chatbotUrl } from '../config/chatbot'
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, makeStyles, Divider, Tooltip } from '@material-ui/core'
import { PieChart as DashboardIcon, People as StaffIcon, LocalAtm as ClaimsIcon, ChevronLeft as ChevronLeftIcon, Build as UtilityIcon, Sms as ChatbotIcon } from '@material-ui/icons'
import { useNavActions } from '../store/nav/navHooks'
import { withRouter } from "react-router-dom"

const useStyles = makeStyles((theme) => ({
  closeIconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    height: 63
  },
  paper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: NAV_WIDTH,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden'
  },
  paperClosed: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  }
}))

export const Nav = withRouter(({ history }) => {

  const cssClasses = useStyles()
  const { navIsOpen, setNavIsOpen } = useNavActions()

  return (
    <Drawer
      variant="permanent"
      open={navIsOpen}
      classes={{
        paper: `${cssClasses.paper} ${!navIsOpen? cssClasses.paperClosed : ''}`
      }}
    >
      <div className={cssClasses.closeIconContainer}>
        <IconButton onClick={() => setNavIsOpen(false)}>
          <ChevronLeftIcon />
        </IconButton>
      </div>

      <Divider />

      <List>
        <Tooltip title="Dashboard">
          <ListItem button onClick={()=>history.push('/')}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText>Dashboard</ListItemText>
          </ListItem>
        </Tooltip>

        <Tooltip title="Claims">
          <ListItem button onClick={()=>history.push('/claims')}>
            <ListItemIcon><ClaimsIcon /></ListItemIcon>
            <ListItemText>Claims</ListItemText>
          </ListItem>
        </Tooltip>

        <Tooltip title="Staff">
          <ListItem button onClick={()=>history.push('/staff')}>
            <ListItemIcon><StaffIcon /></ListItemIcon>
            <ListItemText>Staff</ListItemText>
          </ListItem>
        </Tooltip>

        <Tooltip title="Utility">
          <ListItem button onClick={()=>history.push('/utility')}>
            <ListItemIcon><UtilityIcon /></ListItemIcon>
            <ListItemText>Utility</ListItemText>
          </ListItem>
        </Tooltip>

      </List>
      
      <Divider />

      <List>
        <Tooltip title="Chatbot">
          <ListItem button onClick={()=>window.open(chatbotUrl)}>
            <ListItemIcon><ChatbotIcon /></ListItemIcon>
            <ListItemText>Chatbot</ListItemText>
          </ListItem>
        </Tooltip>
      </List>
    </Drawer>
  )
})