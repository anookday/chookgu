import 'chartjs-adapter-date-fns'
import { Chart, ChartData, ChartOptions, Plugin } from 'chart.js'
import colors from '@styles/global/colors.module.scss'
import { PlayerValue } from '@util/Player'
import { formatValue } from '@util/numbers'

export interface ChartValue {
  date: string
  value: number
}

export function getPlayerValueChartData(
  values: PlayerValue[],
  threshold?: number
): ChartData {
  let result: ChartData = {
    labels: values.map((value) => value.date),
    datasets: [
      {
        label: 'Value',
        fill: true,
        borderColor: colors.accent,
        pointBackgroundColor: colors.accent,
        backgroundColor: `${colors.accent}66`,
        pointHoverBackgroundColor: colors.accent,
        pointHoverBorderWidth: 5,
        pointHitRadius: 20,
        data: values.map((value) => Math.floor(value.amount)),
      },
    ],
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

export function getChartData(values: ChartValue[]): ChartData {
  return {
    labels: values.map((value) => value.date),
    datasets: [
      {
        label: 'Value',
        fill: true,
        pointHoverBorderWidth: 5,
        pointHitRadius: 20,
        data: values.map((value) => value.value),
      },
    ],
  }
}

export function getStyledChartData(values: ChartValue[]): ChartData {
  return {
    labels: values.map((value) => value.date),
    datasets: [
      {
        label: 'Value',
        fill: true,
        borderColor: colors.accent,
        pointBackgroundColor: colors.accent,
        backgroundColor: `${colors.accent}66`,
        pointHoverBackgroundColor: colors.accent,
        pointHoverBorderWidth: 5,
        pointHitRadius: 20,
        data: values.map((value) => value.value),
      },
    ],
  }
}

export function getValueLineChartOptions(): ChartOptions<'line'> {
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

// line chart plugin that colors negative values differently
export function getNegativeLineChartPlugin(): Plugin<'line'> {
  return {
    id: 'negativeLineChart',
    beforeRender: (chart: Chart<'line'>) => {
      const dataset = chart.data.datasets[0]
      const yPos = chart.scales.y.getPixelForValue(0)
      const gradient = chart.ctx.createLinearGradient(0, 0, 0, chart.height)
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
      translucentGradient.addColorStop(yPos / chart.height, translucentAccent)
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
  }
}
