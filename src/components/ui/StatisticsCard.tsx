import React from 'react'
import { Card } from './card'
type StatisticsCardProps = {
  title: string
  value: string | number
  change?: {
    value: number
    isIncrease: boolean
  }
  icon: React.ReactNode
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'gray'
}
export function StatisticsCard({
  title,
  value,
  change,
  icon,
  color = 'blue',
}: StatisticsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green:
      'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    yellow:
      'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
    gray: 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400',
  }
  return (
    <Card className="h-full">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>{icon}</div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </h3>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {value}
            </p>
            {change && (
              <p
                className={`ml-2 text-sm font-medium ${change.isIncrease ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
              >
                {change.isIncrease ? '+' : '-'}
                {Math.abs(change.value)}%
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
