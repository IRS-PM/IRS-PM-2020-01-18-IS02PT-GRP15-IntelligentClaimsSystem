import React, { useState } from 'react'
import { PageContainer } from '../../components'
import { Button, FormControl, InputLabel, Input } from '@material-ui/core'

export const UtilityPage = () => {

  const [claimCount, setClaimCount] = useState(100)

  const updateClaimCount = (evt) => {
    let count = parseInt(!!evt.target.value? evt.target.value : 1)
    count = Math.max(Math.min(count, 500), 1)
    setClaimCount(count)
  }

  const handleCreateClaims = () => {

  }

  return (
    <PageContainer title="Utility Functions">
      Simulate bulk claim submissions by using the form below.
      <br /><br />
      <FormControl>
        <InputLabel>No of Claims</InputLabel>
        <Input 
          type="text"
          value={claimCount}
          onChange={updateClaimCount}
        />
      </FormControl>
      <br /><br />
      <Button color="primary" variant="contained" onClick={handleCreateClaims}>Create {claimCount} Claims</Button>
    </PageContainer>
  )
}