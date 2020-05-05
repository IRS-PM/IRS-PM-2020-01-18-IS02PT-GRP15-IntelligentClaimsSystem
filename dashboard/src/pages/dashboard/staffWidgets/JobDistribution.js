import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core'
import { DashboardWidget } from '../DashboardWidget'
import { useDateRangeActions } from '../../../store/dateRange/dateRangeActionHooks'
import { BarChart, Bar, Legend, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useToastMessageActions } from '../../../store/toast/toastHooks'

const useStyles = makeStyles(()=>({
  barChartContainer: {
    width: '100%',
    height: '400px',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center'
  }
}))

export const JobDistribution = () => {

  const { addErrorMessage } = useToastMessageActions()
  const cssClasses = useStyles({})
  const [isLoading, setIsLoading] = React.useState(false)
  const [data, setData] = React.useState([])
  const { dateRangeFrom, dateRangeTo } = useDateRangeActions()

  useEffect(() => {
    reloadData()
  }, [dateRangeFrom, dateRangeTo])

  const reloadData = async () => {
    try {
      setIsLoading(true)
      
      const resp = await new Promise((resolve, reject) => {

        return resolve({
          data: Array(10).fill(1).map((num, index) => ({
            Name: `Staff ${index + 1}`,
            Pool1: Math.round(Math.random() * 20),
            Pool2: Math.round(Math.random() * 20)
          }))
        })

      })

      setData(resp.data)

    } catch (e) {
      addErrorMessage("Error loading job distribution data")
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardWidget title="Staff Load" isLoading={isLoading}>
      <div className={cssClasses.barChartContainer}>
        <ResponsiveContainer width="100%" height='100%'>
          <BarChart
            data={data} 
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="Name" type="category" />
            <Legend />
            <Tooltip />
            <Bar dataKey="Pool1" nameKey="Name" isAnimationActive={false} stackId="a" fill="#4caf50" />
            <Bar dataKey="Pool2" nameKey="Name" isAnimationActive={false} stackId="a" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardWidget>
  )
}