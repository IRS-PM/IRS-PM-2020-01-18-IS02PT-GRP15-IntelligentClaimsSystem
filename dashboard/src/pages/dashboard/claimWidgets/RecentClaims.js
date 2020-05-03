import React, { useEffect, useState } from 'react'
import { DashboardWidget } from '../DashboardWidget'
import { useDateRangeActions } from '../../../store/dateRange/dateRangeActionHooks'
import { useToastMessageActions } from '../../../store/toast/toastHooks'
import { NoDataFound } from '../../../components/NoDataFound'
import { ClaimStatus } from '../../../components/ClaimStatus'
import { formatDate, formatMoney } from '../../../utils/formatting'
import MUIDataTable from "mui-datatables"
import { Button } from "@material-ui/core"
import { withRouter } from "react-router-dom"
import { getClaims } from '../../../httpActions/claimsApi'

export const RecentClaims = withRouter(({history}) => {

  const { addErrorMessage } = useToastMessageActions()
  const { dateRangeFrom, dateRangeTo } = useDateRangeActions()
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    reloadData()
  }, [dateRangeFrom, dateRangeTo])

  const reloadData = async () => {
    try {
      setIsLoading(true)
      const resp = await getClaims(dateRangeFrom, dateRangeTo, 5, 0)
      setData(resp.data.data)
    } catch (e) {
      addErrorMessage('Error loading recent claims')
    } finally {
      setIsLoading(false)
    }
  }
    
  return (
    <DashboardWidget title="Recent Claims" isLoading={isLoading}>
      <div style={{width: '100%'}}>
        {(data.length > 0)
          ? (
            <MUIDataTable
              data={data}
              columns={[{
                name: 'ClaimNo',
                label: 'Claim No',
                options: {
                  customBodyRender: (value) => <Button color="primary" onClick={() => history.push(`/claims/details/${value}`)}>{value}</Button>
                }
              }, {
                name: 'PolicyNo',
                label: 'Policy No',
                options: {
                  customBodyRender: (value) => <Button color="primary" onClick={() => history.push(`/policies/details/${value}`)}>{value}</Button>
                }
              }, {
                name: 'Status',
                label: 'Status',
                options: {
                  customBodyRender: (value) => <ClaimStatus status={value} />
                }
              }, {
                name: 'DateOcc',
                label: 'Submission Date',
                options: {
                  customBodyRender: (value) => formatDate(value)
                }
              }, {
                name: 'RefundAmount',
                label: 'Refund Amt',
                options: {
                  customBodyRender: (value) => formatMoney(value)
                }
              }]}
              options={{
                elevation: 0,
                selectableRows: 'none',
                filter: false,
                search: false,
                print: false,
                download: false,
                viewColumns: false,
                pagination: false
              }}
            />
          )
          : <NoDataFound />
        }
      </div>
    </DashboardWidget>
  )
})