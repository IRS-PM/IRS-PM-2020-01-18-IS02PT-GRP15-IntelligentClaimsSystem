import React, { useState, useEffect } from 'react'
import Pagination from '@material-ui/lab/Pagination';
import { Button, makeStyles, Box } from '@material-ui/core'
import { PageContainer } from '../../../components/PageContainer'
import MUIDataTable from "mui-datatables"
import { getStaffList } from '../../../httpActions/staffApi'
import { useToastMessageActions } from '../../../store/toast/toastHooks'
import { withRouter } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    height: '100%'
  },
  tableContainer: {
    flexGrow: 1,
    maxHeight: 'calc(100vh - 300px)',
    overflow: 'auto'
  },
  paginationContainer: {
    flexGrow: 0,
    flexShrink: 1,
    marginTop: theme.spacing(2)
  }
}))

export const StaffList = withRouter(({ history }) => {

  const rowsPerPage = 10
  const cssClasses = useStyles({})
  const { addErrorMessage } = useToastMessageActions()
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  const [dataTotalCount, setDataTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    reloadData(1)
  }, [])

  const reloadData = async (pageNumber=1) => {
    const offset = (pageNumber-1) * rowsPerPage

    try {
      setIsLoading(true)
      const resp = await getStaffList(rowsPerPage, offset)
      setCurrentPage(pageNumber)
      setDataTotalCount(resp.data.total)
      setData(resp.data.data)
    } catch (e) {
      addErrorMessage('Error loading staff list')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaginationChange = (evt, pageNumber) => {
    reloadData(pageNumber)
  }

  return (
    <PageContainer 
      title="Staff" 
      isLoading={isLoading}
    >
      <Box className={cssClasses.root}>
        {/* TABLE */}
        <Box className={cssClasses.tableContainer}>
          <MUIDataTable
            data={data}
            columns={[{
              name: 'ID',
              label: 'ID'
            }, {
              name: 'Name',
              label: 'Name',
              options: {
              customBodyRender: (value, tableMeta) => (<Button color="primary" onClick={()=>history.push(`/staff/details/${data[tableMeta.rowIndex].ID}`)}>{value}</Button>)
              }
            }, {
              name: 'ID',
              label: 'Actions',
              options: {
              customBodyRender: (value) => (<Button color="primary" variant="contained" onClick={()=>history.push(`/staff/details/${value}`)}>View Details</Button>)
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
              responsive: 'scrollFullHeight'
            }}
          />
        </Box>
        {/* END TABLE */}
        <Box className={cssClasses.paginationContainer}>
          <Pagination 
            count={Math.ceil(dataTotalCount / rowsPerPage)}
            page={currentPage}
            color="primary"
            onChange={handlePaginationChange}
          />
        </Box>
      </Box>
    </PageContainer>
  )
})