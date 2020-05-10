import React from 'react';
import { CssBaseline, makeStyles, Container } from '@material-ui/core'
import { AppHeader, Nav } from './components'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { ClaimsPage } from './pages/claims'
import { PoliciesPage } from './pages/policies'
import { Dashboard } from './pages/dashboard/Dashboard'
import { StaffPage } from './pages/staff'
import { UtilityPage } from './pages/utility'
import { ToastMessages } from './components/ToastMessages'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  pageContainer: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    padding: `100px ${theme.spacing(4)}px ${theme.spacing(4)}px ${theme.spacing(4)}px`
  }
}))

function App() {

  const cssClasses = useStyles({})

  return (
    <Router>
      <div className={cssClasses.root}>
        <CssBaseline />
        <ToastMessages />
        <AppHeader />
        <Nav />
        <Container maxWidth={false} className={cssClasses.pageContainer}>
          <Switch>
            <Route path="/claims" component={ClaimsPage} />
            <Route path="/policies" component={PoliciesPage} />
            <Route path="/staff" component={StaffPage} />
            <Route path="/utility" component={UtilityPage} />
            <Route component={Dashboard} />
          </Switch>
        </Container>
      </div>
    </Router>
  );
}

export default App;
