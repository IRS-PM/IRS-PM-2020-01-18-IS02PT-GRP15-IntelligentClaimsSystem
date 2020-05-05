import React, { useState } from 'react'
import { PageContainer } from '../../components'
import { Button, FormControl, InputLabel, Input, CircularProgress } from '@material-ui/core'
import { bulkInsertClaims } from '../../httpActions/claimsApi'
import { useToastMessageActions } from '../../store/toast/toastHooks'

export const UtilityPage = () => {

  const { addErrorMessage, addSuccessMessage } = useToastMessageActions()
  const [isLoading, setIsLoading] = useState(false)
  const [claimCount, setClaimCount] = useState(100)

  const updateClaimCount = (evt) => {
    let count = parseInt(!!evt.target.value? evt.target.value : 1)
    count = Math.max(Math.min(count, 500), 1)
    setClaimCount(count)
  }

  const handleCreateClaims = async () => {
    try {
      setIsLoading(true)
      const resp = await bulkInsertClaims(claimCount)
      addSuccessMessage(`${resp.data.claims.length} claims inserted`)
    } catch (e) {
      addErrorMessage('Error loading staff list')
    } finally {
      setIsLoading(false)
    }
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
      <Button 
        color="primary" 
        variant="contained" 
        onClick={handleCreateClaims}
        disabled={isLoading}
      >
        Create {claimCount} Claims
        <CircularProgress size={10} />
      </Button>
    </PageContainer>
  )
}