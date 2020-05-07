import React, { useState, useEffect } from 'react'
import { get } from 'lodash'
import { Button, Grid, Typography, Divider, Box } from '@material-ui/core'
import { PageContainer, LabelValuePair, SectionHeader } from '../../../components'
import { useToastMessageActions } from '../../../store/toast/toastHooks'
import { withRouter, useParams } from 'react-router-dom'
import { ClaimStatus } from '../../../components/ClaimStatus'
import { formatDate, formatMoney } from '../../../utils/formatting'
import { getClaim } from '../../../httpActions/claimsApi'
import MUIDataTable from 'mui-datatables'
import { PoolID } from '../../../components/PoolID'
import { AutoClaimStatus } from '../../../components/AutoClaimStatus'

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
            <Box onClick={()=>history.push(`/policies/details/${data.PolicyNo}`)}>{data.PolicyNo}</Box>
          } />
          <LabelValuePair label="Date Occ" value={formatDate(data.DateOcc)} />
          <LabelValuePair label="Status" value={<ClaimStatus status={data.Status} />} />
          <LabelValuePair label="Bill Document" value={!!data.AttachUrl? <Box onClick={()=>window.open(data.AttachUrl)}>View Document</Box> : '-'} />
          <LabelValuePair label="Rider" value={data.Rider} />
          <LabelValuePair label="Refund Amount" value={formatMoney(data.RefundAmount)} />
          <LabelValuePair label="Auto Claim" value={<AutoClaimStatus autoClaimStatus={data.AutoClaim} />} />
          <LabelValuePair label="Classification Reason" value={data.ClassificationReason} />
          <LabelValuePair label="Remark" value={data.ClaimRemark} />
          <LabelValuePair label="CoPay" value={formatMoney(data.CopayAmount)} />
          <LabelValuePair label="Pool ID" value={(!!data.PoolID)? <PoolID poolID={data.PoolID} /> : '-'} />
          
        </Grid>
        <br /><br />
        <SectionHeader 
          title="Medical Panel"
          subsection
        />
        <Grid container>
          <LabelValuePair label="Medical Panel Reg No" value={get(data, 'MedicalPanel.RegistrationNo', '-')} />
          <LabelValuePair label="Medical Panel Name" value={get(data, 'MedicalPanel.SpecialistName', '-')} />
          <LabelValuePair label="Medical Panel Specialty" value={get(data, 'MedicalPanel.Specialty', '-')} />
          <LabelValuePair label="Medical Panel Blacklisted?" value={!!get(data, 'MedicalPanel.BlacklistReasonID', null)? 'Y' : 'N'} />
        </Grid>
        <br /><br />
        <SectionHeader 
          title="Claim Items"
          subsection
        />
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