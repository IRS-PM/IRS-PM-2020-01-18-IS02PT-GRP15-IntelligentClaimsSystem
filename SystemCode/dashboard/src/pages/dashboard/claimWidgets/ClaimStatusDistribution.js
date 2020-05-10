import React, { useEffect, useState } from 'react'
import { get } from 'lodash'
import { makeStyles } from '@material-ui/core'
import { DashboardWidget } from '../DashboardWidget'
import { useDateRangeActions } from '../../../store/dateRange/dateRangeActionHooks'
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useToastMessageActions } from '../../../store/toast/toastHooks'
import { getClaimStatusDistribution } from '../../../httpActions/claimsApi'
import claimStatuses from '../../../config/claimStatuses'
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

export const ClaimStatusDistribution = () => {

  const cssClasses = useStyles({})
  const [statusData, setStatusData] = useState([])
  const [autoClaimData, setAutoClaimData] = useState([])
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

      const statuses = resp.data.reduce((acc, entry) => {

        if (!acc[entry.Status]) {
          const status = claimStatuses[entry.Status]
          acc[entry.Status] = {
            label: !!status? status.label : 'Unknown',
            color: !!status? status.color : '#000',
            classificationTotals : {
              'false': 0,
              'true': 0,
              'null': 0
            },
            total: 0
          }
        }

        const count = entry.Count
        acc[entry.Status].classificationTotals[String(entry.AutoClaim)] = count
        acc[entry.Status].total += count
        return acc

      }, {})
      setStatusData(Object.values(statuses))
      const _autoClaimData = Object.values(statuses).reduce((acc, entry) => {
        
        ['false', 'true', 'null'].forEach(autoClaimStatusKey => {
          const total = entry.classificationTotals[autoClaimStatusKey]
          if (total > 0) {
            acc.push({
              statusLabel: entry.label,
              label: `${entry.label} (${get(autoClaimLabels, `${autoClaimStatusKey}.label`, 'unknown')})`,
              color: get(autoClaimLabels, `${autoClaimStatusKey}.color`, '#000'),
              total: total
            })
          }
        })

        return acc
      }, [])

      setAutoClaimData(_autoClaimData)


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
        {statusData.length > 0
          ? (
            <ResponsiveContainer aspect={1} height='100%'>
              <PieChart>
                <Pie data={statusData} nameKey="label" dataKey="total" isAnimationActive={false} outerRadius="65%" strokeWidth={0}>
                  {statusData.map((entry, index) => <Cell key={index} fill={entry.color}/>)}
                </Pie>
                <Pie data={autoClaimData} nameKey="label" dataKey="total" isAnimationActive={false} innerRadius="70%" outerRadius="80%">
                  {autoClaimData.map((entry, index) => <Cell key={`claimStatus-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend 
                  payload={statusData.map(entry => ({
                    type: 'square',
                    value: entry.label,
                    color: entry.color
                  }))}
                />
              </PieChart>
            </ResponsiveContainer>
          )
          : <NoDataFound />
        }
        
      </div>
    </DashboardWidget>
  )
}