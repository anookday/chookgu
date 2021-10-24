import { ChartData, ChartOptions, Plugin } from 'chart.js'
import { Line } from 'react-chartjs-2'
import styles from '@styles/components/Chart.module.scss'

interface ChartProps {
  data: ChartData
  options: ChartOptions
  plugins?: Plugin[]
}

const Chart = ({ data, options, plugins }: ChartProps) => {
  return (
    <div className={styles.wrapper}>
      <Line data={data} options={options} plugins={plugins} />
    </div>
  )
}

export default Chart
