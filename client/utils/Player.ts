import { parseISO, differenceInYears } from 'date-fns'
import { ChartData, ChartOptions } from 'chart.js'
import 'chartjs-adapter-date-fns'
import { getValueString } from '@utils/numbers'
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
  currentValue: number
  value: PlayerValue[]
  margin?: number
  marginRatio?: number
}

export interface PlayerAsset {
  player: Player
  amount: number
  averageValue: number
}

export function isPlayerAsset(object: any): object is PlayerAsset {
  return 'player' in object && 'amount' in object && 'averageValue' in object
}

export function getPlayerAge(dateOfBirth: string): number {
  return differenceInYears(new Date(), parseISO(dateOfBirth))
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
              return getValueString(value, true)
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
