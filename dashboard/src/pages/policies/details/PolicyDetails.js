import React, { useState, useEffect } from 'react'
import { Grid, Typography, Divider, Box } from '@material-ui/core'
import { PageContainer, LabelValuePair, SectionHeader, ClaimsTable } from '../../../components'
import { useToastMessageActions } from '../../../store/toast/toastHooks'
import { withRouter, useParams } from 'react-router-dom'
import { formatDate, formatMoney } from '../../../utils/formatting'
import { getPolicy } from '../../../httpActions/policiesApi'
import MUIDataTable from 'mui-datatables'

export const PolicyDetails = withRouter(({ history }) => {

  const { addErrorMessage } = useToastMessageActions()
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState(null)
  const { policyNo } = useParams()  

  useEffect(() => {
    reloadData()
  }, [policyNo])

  const reloadData = async () => {
    try {
      setIsLoading(true)
      const resp = await getPolicy(policyNo)
      setData(resp.data)
    } catch (e) {
      addErrorMessage('Error loading policy details')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageContainer 
      title={`Policy No: ${policyNo}`}
      isLoading={isLoading}
    >
      {!!data &&
        <>
          <Grid container>
            <LabelValuePair label="Insured Name" value={data.InsuredName} />
            <LabelValuePair label="Insured Name" value={data.InsuredID} />
            <LabelValuePair label="Commencement Date" value={formatDate(data.CommencementDate)} />
            <LabelValuePair label="Effective Date" value={formatDate(data.EffectiveDate)} />
            <LabelValuePair label="Expiry Date" value={formatDate(data.ExpiryDate)} />
            <LabelValuePair label="Premium Amount" value={formatMoney(data.PremiumAmount)} />
            <LabelValuePair label="Outstanding Premium" value={formatMoney(data.OutstandingPremium)} />
            <LabelValuePair label="Rider Premium Amount" value={formatMoney(data.RiderPremiumAmount)} />
            <LabelValuePair label="Outstanding Rider Premium" value={formatMoney(data.RiderOutstandingPremium)} />
            <LabelValuePair label="Product Code" value={data.ProductPlan.ProductCode} />
            <LabelValuePair label="Description" value={data.ProductPlan.Description} />
          </Grid>

          <br /><br />
          <SectionHeader 
            title="Claim History"
          />

          <ClaimsTable data={data.MedicalClaims} />
          <br /><br />
          
          <SectionHeader 
            title="Product Benefits"
          />

          <Box>
            <MUIDataTable
              data={data.ProductPlan.PolicyBenefits}
              columns={[{
                name: 'BenefitCode',
                label: 'Benefit Code'
              }, {
                name: 'Description',
                label: 'Description'
              }, {
                name: 'BenefitLimit',
                label: 'Benefit Limit',
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
          </Box>
        </>
      }
    </PageContainer>
  )
})