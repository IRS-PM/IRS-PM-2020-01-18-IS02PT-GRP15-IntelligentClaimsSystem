import React from 'react'
import { Switch, Route } from "react-router-dom"
import { ClaimsList } from './list/ClaimsList'
import { ClaimDetails } from './details/ClaimDetails'

export const ClaimsPage = () => {
  return (
    <Switch>
      <Route path="/claims/details/:claimNo" component={ClaimDetails} />
      <Route component={ClaimsList} />
    </Switch>
  )
}