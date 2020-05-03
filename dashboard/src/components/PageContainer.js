import React from 'react'
import { Box, CircularProgress, Typography, Divider, makeStyles } from '@material-ui/core'
import { SectionHeader } from './SectionHeader'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    alignItems: 'stretch',
    justifyContent: 'stretch'
  },
  loadingContainer: {
    width: '100%',
    height: '100%',
    display: "flex", 
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  pageContents: {
    flexGrow: 1
  }
}))

export const PageContainer = ({title, isLoading=false, actions=null, children}) => {
  const cssClasses = useStyles({})

  return (
    <Box className={cssClasses.root}>
      <SectionHeader 
        title={title}
        actions={actions}
      />
      <Box className={cssClasses.pageContents}>
        {isLoading
          ? <Box className={cssClasses.loadingContainer}><CircularProgress /></Box>
          : children
        }
      </Box>
    </Box>
  )

}