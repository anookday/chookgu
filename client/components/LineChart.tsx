import 'chartjs-adapter-date-fns'
import { useState, useEffect } from 'react'
import { parseISO, differenceInMonths } from 'date-fns'
import { Chart, ChartData, ChartOptions, Plugin } from 'chart.js'
import { Line } from 'react-chartjs-2'
import RadioInput from '@components/RadioInput'
import styles from '@styles/components/LineChart.module.scss'
import colors from '@styles/global/colors.module.scss'
import { PlayerValue } from '@util/Player'
import { formatValue } from '@util/numbers'

export interface ChartValue {
  date: string
  value: number
}

const chartTypes = ['default', 'pos-neg'] as const
export type ChartType = typeof chartTypes[number]

const chartRanges = ['all', '1y', '6m', '3m', '1m'] as const
export type ChartRange = typeof chartRanges[number]
export const isChartRange = (obj: any): obj is ChartRange => {
  return chartRanges.includes(obj)
}

/**
 * Returns chart data configurations.
 */
export const getChartData = (
  values: ChartValue[],
  type?: ChartType,
  threshold?: number
): ChartData => {
  let result: ChartData<'line'> = {
    labels: values.map((value) => value.date),
    datasets: [
      {
        label: 'Value',
        fill: true,
        pointHoverBorderWidth: 5,
        pointHitRadius: 20,
        data: values.map((value) => Math.floor(value.value)),
      },
    ],
  }

  switch (type) {
    case 'pos-neg':
      break
    default:
      result.datasets[0] = {
        ...result.datasets[0],
        borderColor: colors.accent,
        pointBackgroundColor: colors.accent,
        backgroundColor: `${colors.accent}66`,
        pointHoverBackgroundColor: colors.accent,
      }
  }

  if (threshold) {
    result.datasets.unshift({
      label: 'Threshold',
      fill: false,
      pointRadius: 0,
      borderColor: colors.complement,
      borderDash: [10, 5],
      data: values.map(() => threshold),
    })
  }

  return result
}

/**
 * Returns chart option configurations.
 */
export const getChartOptions = (): ChartOptions<'line'> => {
  return {
    scales: {
      x: {
        type: 'time',
        time: {
          tooltipFormat: 'MMMM d, yyyy',
        },
        ticks: {
          source: 'data',
          color: colors.primaryLight,
        },
      },
      y: {
        ticks: {
          color: colors.primaryLight,
          callback: (value, _, __) => {
            if (typeof value === 'number') {
              return formatValue(value, true)
            }
            return value
          },
        },
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: colors.primaryLight,
        titleColor: colors.secondary,
        bodyColor: colors.secondary,
        callbacks: {
          label: (tooltipItem) => `€${tooltipItem.formattedValue}`,
        },
      },
      legend: {
        display: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  }
}

/**
 * Returns an array of chart plugins.
 */
export const getChartPlugins = (type?: ChartType): Plugin<'line'>[] => {
  switch (type) {
    // line chart plugin that colors positive and negative values differently
    case 'pos-neg':
      return [
        {
          id: 'negativeLineChart',
          beforeRender: (chart: Chart<'line'>) => {
            const dataset = chart.data.datasets[0]
            const yPos = chart.scales.y.getPixelForValue(0)
            const gradient = chart.ctx.createLinearGradient(
              0,
              0,
              0,
              chart.height
            )
            const translucentGradient = chart.ctx.createLinearGradient(
              0,
              0,
              0,
              chart.height
            )

            const translucentAccent = `${colors.accent}66`
            const translucentComplement = `${colors.complement}66`

            gradient.addColorStop(0, colors.accent)
            gradient.addColorStop(yPos / chart.height, colors.accent)
            gradient.addColorStop(yPos / chart.height, colors.complement)
            gradient.addColorStop(1, colors.complement)

            translucentGradient.addColorStop(0, translucentAccent)
            translucentGradient.addColorStop(
              yPos / chart.height,
              translucentAccent
            )
            translucentGradient.addColorStop(
              yPos / chart.height,
              translucentComplement
            )
            translucentGradient.addColorStop(1, translucentComplement)

            dataset.borderColor = gradient
            dataset.pointBackgroundColor = gradient
            dataset.pointHoverBackgroundColor = gradient
            dataset.backgroundColor = translucentGradient
          },
        },
      ]
    default:
      return []
  }
}

export const getFilteredData = (data: ChartValue[], range: ChartRange) => {
  // base case: data is empty array
  if (data.length === 0) return data

  const latestDate = parseISO(data[data.length - 1].date)

  switch (range) {
    case '1y':
      return data.filter(
        (v) => differenceInMonths(latestDate, parseISO(v.date)) < 12
      )
    case '6m':
      return data.filter(
        (v) => differenceInMonths(latestDate, parseISO(v.date)) < 6
      )
    case '3m':
      return data.filter(
        (v) => differenceInMonths(latestDate, parseISO(v.date)) < 3
      )
    case '1m':
      return data.filter(
        (v) => differenceInMonths(latestDate, parseISO(v.date)) < 1
      )
    default:
      return data
  }
}

export const toChartValues = (playerValues: PlayerValue[]): ChartValue[] => {
  return playerValues.map((v) => {
    return { date: v.date, value: v.amount }
  })
}

interface ChartProps {
  data: ChartValue[]
  type?: ChartType
  threshold?: number
}

/**
 * Line chart component with range selector
 */
const LineChart = ({ type, data, threshold }: ChartProps) => {
  const [range, setRange] = useState<ChartRange>('all')

  return (
    <div className={styles.container}>
      <RadioInput
        className={styles.range}
        values={[
          { name: 'All', value: 'all' },
          { name: '1 Year', value: '1y' },
          { name: '6 Months', value: '6m' },
          { name: '3 Months', value: '3m' },
          { name: '1 Month', value: '1m' },
        ]}
        selected={range}
        onChange={(value) => isChartRange(value) && setRange(value)}
      />
      <div className={styles.wrapper}>
        <Line
          className={styles.chart}
          data={getChartData(getFilteredData(data, range), type, threshold)}
          options={getChartOptions()}
          plugins={getChartPlugins(type)}
        />
      </div>
    </div>
  )
}

export default LineChart
