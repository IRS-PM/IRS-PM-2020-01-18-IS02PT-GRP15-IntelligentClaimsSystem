import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { DashboardWidget } from '../DashboardWidget'
import { useDateRangeActions } from '../../../store/dateRange/dateRangeActionHooks'
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useToastMessageActions } from '../../../store/toast/toastHooks'
import { getAutoClaimDistribution } from '../../../httpActions/claimsApi'
import autoClaimLabels from '../../../config/autoClaimLabels'
import { NoDataFound } from '../../../components/NoDataFound'

const useStyles = makeStyles(()=>({
  pieContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center'
  }
}))

export const AutoClaimDistribution = () => {

  const cssClasses = useStyles({})
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { addErrorMessage } = useToastMessageActions()
  const { dateRangeFrom, dateRangeTo } = useDateRangeActions()

  useEffect(() => {
    reloadData()
  }, [dateRangeFrom, dateRangeTo])

  const reloadData = async () => {
    try {
      setIsLoading(true)
      const resp = await getAutoClaimDistribution(dateRangeFrom, dateRangeTo, 5, 0)
      setData(resp.data.map(entry => {
        const autoClaimLabel = autoClaimLabels[String(entry.AutoClaim)]
        return {
          label: !!autoClaimLabel? autoClaimLabel.label : 'Unknown',
          color: !!autoClaimLabel? autoClaimLabel.color : '#000',
          total: entry.Count
        }
      }))
    } catch (e) {
      console.error(e)
      addErrorMessage('Error loading recent claims')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardWidget title="Machine vs Human Classification" isLoading={isLoading}>
      <div className={cssClasses.pieContainer}>
        {data.length > 0
          ? (
            <ResponsiveContainer aspect={1} height='100%'>
              <PieChart>
                <Pie data={data} nameKey="label" dataKey="total" isAnimationActive={false} strokeWidth={0}>
                  {data.map((entry, index) => <Cell key={index} fill={entry.color}/>)}
                </Pie>
                
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )
          : <NoDataFound />
        }
        
      </div>
    </DashboardWidget>
  )
}