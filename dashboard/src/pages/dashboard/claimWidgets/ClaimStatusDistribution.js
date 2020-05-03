import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { DashboardWidget } from '../DashboardWidget'
import { useDateRangeActions } from '../../../store/dateRange/dateRangeActionHooks'
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useToastMessageActions } from '../../../store/toast/toastHooks'
import { getClaimStatusDistribution } from '../../../httpActions/claimsApi'
import claimStatuses from '../../../config/claimStatuses'
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

export const ClaimStatusDistribution = () => {

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
      const resp = await getClaimStatusDistribution(dateRangeFrom, dateRangeTo, 5, 0)
      setData(resp.data.map((entry) => {
        const status = claimStatuses[entry.Status]
        return {
          name: !!status? status.label : 'Unknown',
          color: !!status? status.color : '#000',
          ...entry
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
    <DashboardWidget title="Claim Status Distribution" isLoading={isLoading}>
      <div className={cssClasses.pieContainer}>
        {data.length > 0
          ? (
            <ResponsiveContainer aspect={1} height='100%'>
              <PieChart>
                <Pie data={data} dataKey="Count" isAnimationActive={false} label>
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