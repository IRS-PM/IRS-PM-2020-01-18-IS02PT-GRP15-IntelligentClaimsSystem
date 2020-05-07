import React, { useState, useEffect } from 'react'
import { Button, makeStyles, Box } from '@material-ui/core'
import MUIDataTable from "mui-datatables"
import { withRouter } from 'react-router-dom'
import { ClaimStatus } from './ClaimStatus'
import { formatDate, formatMoney } from '../utils/formatting'
import { AutoClaimStatus } from './AutoClaimStatus';

export const ClaimsTable = withRouter(({ data, history }) => {

  return (
    <MUIDataTable
        data={data}
        columns={[{
            name: 'ClaimNo',
            label: 'Claim No',
            options: {
            customBodyRender: (value) => <Button color="primary" onClick={() => history.push(`/claims/details/${value}`)}>{value}</Button>,
            sort: false
            }
        }, {
            name: 'PolicyNo',
            label: 'Policy No',
            options: {
            customBodyRender: (value) => <Button color="primary" onClick={() => history.push(`/policies/details/${value}`)}>{value}</Button>,
            sort: false
            }
        }, {
            name: 'Status',
            label: 'Status',
            options: {
            customBodyRender: (value) => <ClaimStatus status={value} />,
            sort: false
            }
        }, {
            name: 'AutoClaim',
            label: 'Auto Claim',
            options: {
            customBodyRender: (value) => <AutoClaimStatus autoClaimStatus={value} />
            }
        }, {
            name: 'CreatdDate',
            label: 'Submission Date',
            options: {
            customBodyRender: (value) => formatDate(value),
            sort: false
            }
        }, {
            name: 'RefundAmount',
            label: 'Refund Amt',
            options: {
            customBodyRender: (value) => formatMoney(value),
            sort: false
            }
        }, {
            name: 'ClaimNo',
            label: 'Actions',
            options: {
            customBodyRender: (value) => (<Button color="primary" variant="contained" onClick={()=>history.push(`/claims/details/${value}`)}>View Details</Button>)
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
  )
})