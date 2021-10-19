import 'chartjs-adapter-date-fns'
import { ChartData, ChartOptions } from 'chart.js'
import colors from '@styles/global/colors.module.scss'
import { PortfolioValue } from '@util/Portfolio'
import { PlayerValue } from '@util/Player'
import { formatValue } from '@util/numbers'

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

export function getPortfolioValueChartData(
  values: PortfolioValue[]
): ChartData {
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
