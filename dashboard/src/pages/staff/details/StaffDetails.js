import React, { useState, useEffect } from 'react'
import { Grid, Typography, Divider, IconButton, Tooltip } from '@material-ui/core'
import { PageContainer, LabelValuePair, SectionHeader } from '../../../components'
import { useToastMessageActions } from '../../../store/toast/toastHooks'
import { withRouter, useParams } from 'react-router-dom'
import { formatDate } from '../../../utils/formatting'
import { getStaffDetails, deleteLeave } from '../../../httpActions/staffApi'
import MUIDataTable from 'mui-datatables'
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons'
import { LeaveFormDialog } from './LeaveFormDialog'
import { PoolID } from '../../../components/PoolID'

export const StaffDetails = withRouter(({ history }) => {

  const { addErrorMessage } = useToastMessageActions()
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState(null)
  const [leaveDialogIsOpen, setLeaveDialogIsOpen] = useState(false)
  const [currentEditingLeaveSchedule, setCurrentEditingLeaveSchedule] = useState(null)
  const { staffId } = useParams()

  useEffect(() => {
    reloadData()
  }, [staffId])

  const reloadData = async () => {
    try {
      setIsLoading(true)
      const resp = await getStaffDetails(staffId)
      setData(resp.data)
    } catch (e) {
      addErrorMessage('Error loading staff details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelLeave = () => {
    setLeaveDialogIsOpen(false)
    setCurrentEditingLeaveSchedule(null)
  }

  const handleLeaveSubmitComplete = () => {
    setLeaveDialogIsOpen(false)
    setCurrentEditingLeaveSchedule(null)
    reloadData()
  }

  const handleEditLeave = (leaveSchedule) => {
    setLeaveDialogIsOpen(true)
    setCurrentEditingLeaveSchedule(leaveSchedule)
  }

  const handleNewLeave = (leaveSchedule) => {
    setLeaveDialogIsOpen(true)
    setCurrentEditingLeaveSchedule(null)
  }

  const handleDeleteLeave = async (leaveId) => {

    if (!window.confirm('Are you sure you wish to delete the leave?')) return

    try {
      await deleteLeave(data.ID, leaveId)
      reloadData()
    } catch (e) {
      addErrorMessage("Error deleting leave. Please try again.")
    }
  }

  return (
    <PageContainer 
      title={(!!data)? `${data.Name}`: 'Staff Details'}
      isLoading={isLoading}
    >
      {!!data &&
        <>
          <Grid container>
            <LabelValuePair label="ID" value={data.ID} />
            <LabelValuePair label="Name" value={data.Name} />
            <LabelValuePair label="Pool1" value={<PoolID poolID={data.Pool1}/>} />
            <LabelValuePair label="Pool2" value={<PoolID poolID={data.Pool2}/>} />
          </Grid>
          <br /><br />
          <SectionHeader 
            title={
              <>
                Leave Schedule 
                <Tooltip title="Add Leave">
                  <IconButton color="primary" variant="contained" onClick={handleNewLeave}><AddIcon /></IconButton>
                </Tooltip>
              </>
            }
            subsection
          />
          <MUIDataTable
            data={data.LeaveSchedules}
            columns={[{
              name: 'ID',
              label: 'ID'
            },{
              name: 'StartDateTime',
              label: 'Start Date',
              options: {
                customBodyRender: (value) => formatDate(value)
              }
            }, {
              name: 'EndDateTime',
              label: 'End Date',
              options: {
                customBodyRender: (value) => formatDate(value)
              }
            }, {
              name: 'ID',
              label: 'Actions',
              options: {
                customBodyRender: (value, tableMeta) => (
                  <>
                    <Tooltip title="Delete leave"><IconButton color="secondary" onClick={() => handleDeleteLeave(value)}><DeleteIcon /></IconButton></Tooltip>
                  </>
                )
              }
            }]}
            options={{
              selectableRows: 'none',
              filter: false,
              search: false,
              print: false,
              download: false,
              viewColumns: false,
              pagination: false,
              responsive: 'scrollMaxHeight'
            }}
          />
          <LeaveFormDialog 
            isOpen={leaveDialogIsOpen}
            staffId={data.ID}
            handleCancel={handleCancelLeave}
            handleSubmitComplete={handleLeaveSubmitComplete}
            leaveSchedule={currentEditingLeaveSchedule}
          />
        </>
      }
    </PageContainer>
  )
})