import React from 'react'
import { Switch, Route } from "react-router-dom"
import { StaffList } from './list/StaffList'
import { StaffDetails } from './details/StaffDetails'


export const StaffPage = () => {
  return (
    <Switch>
      <Route path="/staff/details/:staffId" component={StaffDetails} />
      <Route component={StaffList} />
    </Switch>
  )
}