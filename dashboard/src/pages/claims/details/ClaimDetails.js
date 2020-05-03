import React, { useState, useEffect } from 'react'
import { Button, Grid, Typography, Divider } from '@material-ui/core'
import { PageContainer, LabelValuePair } from '../../../components'
import { useToastMessageActions } from '../../../store/toast/toastHooks'
import { withRouter, useParams } from 'react-router-dom'
import { ClaimStatus } from '../../../components/ClaimStatus'
import { formatDate, formatMoney } from '../../../utils/formatting'
import { getClaim } from '../../../httpActions/claimsApi'
import MUIDataTable from 'mui-datatables'

export const ClaimDetails = withRouter(({ history }) => {

  const { addErrorMessage } = useToastMessageActions()
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState(null)
  const { claimNo } = useParams()  

  useEffect(() => {
    reloadData()
  }, [claimNo])

  const reloadData = async () => {
    try {
      setIsLoading(true)
      const resp = await getClaim(claimNo)
      setData(resp.data)
    } catch (e) {
      addErrorMessage('Error loading claim')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageContainer 
      title={`Claim No: ${claimNo}`}
      isLoading={isLoading}
    >
      {!!data &&
        <>
        <Grid container>
          <LabelValuePair label="Policy No" value={
            <Button onClick={()=>history.push(`/policies/details/${data.PolicyNo}`)}>{data.PolicyNo}</Button>
          } />
          <LabelValuePair label="Date Occ" value={formatDate(data.DateOcc)} />
          <LabelValuePair label="Status" value={<ClaimStatus status={data.Status} />} />
          <LabelValuePair label="Claim Type" value={data.ClaimType} />
          <LabelValuePair label="Rider" value={data.Rider} />
          <LabelValuePair label="Refund Amount" value={formatMoney(data.RefundAmount)} />
          <LabelValuePair label="Auto Claim" value={data.AutoClaim? 'Y' : 'N'} />
          <LabelValuePair label="CoPay" value={formatMoney(data.CopayAmount)} />
        </Grid>
        <br /><br />
        <Typography variant="h6">Claim Items</Typography>
        <Divider style={{marginTop: 10, marginBottom: 30}} />
        <MUIDataTable
            data={data.ClaimItems}
            columns={[{
              name: 'ID',
              label: 'ID'
            }, {
              name: 'ItemDesc',
              label: 'Description'
            }, {
              name: 'BenefitCode',
              label: 'Benefit Code'
            }, {
              name: 'Qty',
              label: 'Qty'
            }, {
              name: 'Amount',
              label: 'Amount',
              options: {
                customBodyRender: (value) => formatMoney(value)
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
        </>
      }
    </PageContainer>
  )
})