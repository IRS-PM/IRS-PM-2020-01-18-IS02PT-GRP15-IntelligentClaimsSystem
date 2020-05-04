import React from 'react'
import { makeStyles, Typography, Divider, Toolbar, Box } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  divider: {
    marginBottom: theme.spacing(3)
  },
  title: {
    flexGrow: 1
  },
  bigTitle: {
    fontSize: '1.5rem'
  }
}))

export const SectionHeader = ({title, actions=null, subsection=false}) => {
  const cssClasses = useStyles({})

  return (
    <>
      <Toolbar disableGutters={true}>
        <Typography className={`${cssClasses.title} ${!subsection && cssClasses.bigTitle}`} variant="h6">{title}</Typography>
        <Box>
          {actions}
        </Box>
      </Toolbar>
      <Divider className={cssClasses.divider} />
    </>
  )

}