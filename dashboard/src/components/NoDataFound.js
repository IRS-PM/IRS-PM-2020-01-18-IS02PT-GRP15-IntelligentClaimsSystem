import React from 'react'
import { Box } from '@material-ui/core'

export const NoDataFound = () => {
  return (
    <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center">
      <Box marginTop={10} marginBottom={10}>No data found. Try adjusting the search parameters.</Box>
    </Box>
  )
}