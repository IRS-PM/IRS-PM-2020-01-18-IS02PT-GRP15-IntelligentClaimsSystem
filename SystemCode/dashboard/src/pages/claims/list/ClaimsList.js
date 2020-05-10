import React, { useState, useEffect } from 'react'
import Pagination from '@material-ui/lab/Pagination';
import { Button, makeStyles, Box } from '@material-ui/core'
import { PageContainer } from '../../../components/PageContainer'
import MUIDataTable from "mui-datatables"
import { getClaims } from '../../../httpActions/claimsApi'
import { useDateRangeActions } from '../../../store/dateRange/dateRangeActionHooks'
import { useToastMessageActions } from '../../../store/toast/toastHooks'
import { withRouter } from 'react-router-dom'
import { ClaimStatus } from '../../../components/ClaimStatus'
import { formatDate, formatMoney } from '../../../utils/formatting'
import { ClaimsDateRangeSelector, ClaimsTable } from '../../../components';
import { AutoClaimStatus } from '../../../components/AutoClaimStatus';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'stretch'
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

export const ClaimsList = withRouter(({ history }) => {

  const rowsPerPage = 10
  const cssClasses = useStyles({})
  const { addErrorMessage } = useToastMessageActions()
  const { dateRangeFrom, dateRangeTo } = useDateRangeActions()
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  const [dataTotalCount, setDataTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    reloadData(1)
  }, [dateRangeFrom, dateRangeTo])

  const reloadData = async (pageNumber=1) => {
    const offset = (pageNumber-1) * rowsPerPage

    try {
      setIsLoading(true)
      const resp = await getClaims(dateRangeFrom, dateRangeTo, rowsPerPage, offset)
      setCurrentPage(pageNumber)
      setDataTotalCount(resp.data.total)
      setData(resp.data.data)
    } catch (e) {
      addErrorMessage('Error loading claims')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaginationChange = (evt, pageNumber) => {
    reloadData(pageNumber)
  }

  return (
    <PageContainer 
      title="Claims" 
      isLoading={isLoading}
      actions={<ClaimsDateRangeSelector />}
    >
      <Box className={cssClasses.root}>
        {/* TABLE */}
        <Box className={cssClasses.tableContainer}>
          <ClaimsTable data={data} />
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