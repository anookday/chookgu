import { ChartData, ChartOptions } from 'chart.js'
import { Line } from 'react-chartjs-2'
import styles from '@styles/components/Chart.module.scss'

interface ChartProps {
  data: ChartData
  options: ChartOptions
}

const Chart = ({ data, options }: ChartProps) => {
  return (
    <div className={styles.wrapper}>
      <Line data={data} options={options} />
    </div>
  )
}

export default Chart
