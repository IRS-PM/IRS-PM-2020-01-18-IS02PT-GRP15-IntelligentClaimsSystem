import React, { useState, useEffect } from 'react'
import { Box, Typography, Grid, makeStyles, CircularProgress, List, ListItem, ListItemIcon, ListItemText, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core'
import { GetApp, Search } from '@material-ui/icons'
import { getSampleMedicalPanel, getSamplePolicyHolderIDs } from '../httpActions/sampleData'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'center'
    },
    container: {
        margin: theme.spacing(2)
    }
}))

export const SampleData = () => {

    const cssClasses = useStyles({})
    const [isLoading, setIsLoading] = useState(false)
    const [subjectToShow, setSubjectToShow] = useState(null)
    const [sampleIDs, setSampleIDs] = useState([])
    const [sampleSpecialists, setSampleSpecialists] = useState([])

    useEffect(() => {
        loadSampleData()
    }, [])

    const loadSampleData = async () => {
        try {
            setIsLoading(true)
            const [ sampleIDsResponse, sampleMedicalPanelResponse ] = await Promise.all([
                getSamplePolicyHolderIDs(), 
                getSampleMedicalPanel()
            ])

            setSampleIDs(sampleIDsResponse.data.data)
            setSampleSpecialists(sampleMedicalPanelResponse.data.data.map(medicalPanel => medicalPanel.RegistrationNo))
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return <CircularProgress />
    }

    return (
        <Box className={cssClasses.root}>
            <Box className={cssClasses.container}>
                <Button variant="contained" startIcon={<GetApp />} onClick={()=>window.open('/bill-sample.zip')}>Sample Bills</Button>
            </Box>

            <Box className={cssClasses.container}>
                <Button variant="contained" startIcon={<Search />} onClick={()=>setSubjectToShow('ids')}>Sample NRIC</Button>
            </Box>

            <Box className={cssClasses.container}>
                <Button variant="contained" startIcon={<Search />} onClick={()=>setSubjectToShow('specialists')}>Sample Specialist</Button>
            </Box>

            {/* MODAL */}
            <Dialog open={subjectToShow !== null} fullWidth={true} maxWidth="sm">
                <DialogTitle>
                    {!!subjectToShow && 
                        (
                            subjectToShow === 'ids'
                                ? 'Sample NRICs'
                                : 'Sample Specialists'
                        )
                    }
                </DialogTitle>
                <DialogContent>
                    <List>
                        {!!subjectToShow && 
                            (subjectToShow === 'ids' ? sampleIDs : sampleSpecialists).map((entry, index) => (
                                <ListItem key={index}>
                                    <ListItemText>{entry}</ListItemText>
                                </ListItem>
                            ))
                        }
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>setSubjectToShow(null)}>Close</Button>
                </DialogActions>
            </Dialog>
            {/* END MODAL */}
        </Box>
    )

}