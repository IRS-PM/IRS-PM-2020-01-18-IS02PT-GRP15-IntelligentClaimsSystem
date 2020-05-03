import React from 'react'
import { Switch, Route } from "react-router-dom"
import { PolicyDetails } from './details/PolicyDetails'

export const PoliciesPage = () => {
  return (
    <Switch>
      <Route path="/policies/details/:policyNo" component={PolicyDetails} />
    </Switch>
  )
}