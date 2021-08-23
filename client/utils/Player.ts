import { format, parseISO, differenceInYears } from 'date-fns'
import { ChartData, ChartOptions } from 'chart.js'
import 'chartjs-adapter-date-fns'
import colors from '@styles/global/colors.module.scss'

export interface PlayerValue {
  date: string
  amount: number
  currency: string
}

export interface Player {
  _id: number
  name: string
  nationality: string[]
  position: string
  team: string
  image: string
  dateOfBirth: string
  value: PlayerValue[]
}

export function getPlayerAge(dateOfBirth: string): number {
  return differenceInYears(new Date(), parseISO(dateOfBirth))
}

export function getValueString(value: number): string {
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    notation: 'compact',
  }).format(value)
}

export function getPlayerCurrentValue(values: PlayerValue[]): string {
  if (values.length === 0) return ''

  return getValueString(values[values.length - 1].amount)
}

export function getPlayerValueChartData(values: PlayerValue[]): ChartData {
  const labels = values.map((value) => value.date)
  const data = values.map((value) => Math.floor(value.amount))

  return {
    labels,
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
        data,
      },
    ],
  }
}

export function getPlayerValueChartOptions(): ChartOptions<'line'> {
  return {
    scales: {
      x: {
        type: 'time',
        time: {
          tooltipFormat: 'MMMM d',
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
              return getValueString(value)
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
