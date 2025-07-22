import React from 'react'
import {
  GaugeIcon,
  StopCircleIcon,
  AlertTriangleIcon,
  TrendingUpIcon,
  ActivityIcon,
} from 'lucide-react'
import { StatisticsCard } from '../components/ui/StatisticsCard'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { recentActivity, systemPerformance, violationStats } from '../utils/mockData'
import { Card } from '../components/ui/card'
export function Dashboard() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric',
    }).format(date)
  }
  // Data for pie chart
  const pieData = [
    {
      name: 'Speed',
      value: violationStats.byType.speed,
      color: '#EF4444',
    },
    {
      name: 'Lane',
      value: violationStats.byType.lane,
      color: '#3B82F6',
    },
    {
      name: 'Traffic Light',
      value: violationStats.byType.trafficLight,
      color: '#10B981',
    },
    {
      name: 'Road Sign',
      value: violationStats.byType.roadSign,
      color: '#8B5CF6',
    },
    {
      name: 'Accident',
      value: violationStats.byType.accident,
      color: '#F59E0B',
    },
  ]
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <div className="mt-4 md:mt-0">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
            Generate Report
          </button>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatisticsCard
          title="Speed Violations"
          value={violationStats.byType.speed}
          change={{
            value: 12,
            isIncrease: true,
          }}
          icon={<GaugeIcon className="h-6 w-6" />}
          color="red"
        />
        <StatisticsCard
          title="Lane Violations"
          value={violationStats.byType.lane}
          change={{
            value: 5,
            isIncrease: false,
          }}
          icon={<div className="h-6 w-6" />}
          color="blue"
        />
        <StatisticsCard
          title="Traffic Light Violations"
          value={violationStats.byType.trafficLight}
          change={{
            value: 8,
            isIncrease: true,
          }}
          icon={<StopCircleIcon className="h-6 w-6" />}
          color="green"
        />
        <StatisticsCard
          title="Accidents"
          value={violationStats.byType.accident}
          change={{
            value: 15,
            isIncrease: false,
          }}
          icon={<div className="h-6 w-6" />}
          color="yellow"
        />
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Violations by Month" className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={violationStats.byMonth}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Violations" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Violation Distribution" className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                }
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      {/* System Performance */}
      <div className="mb-6">
        <Card title="System Performance">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                  <ActivityIcon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Uptime
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {systemPerformance.uptime}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                  <TrendingUpIcon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Response Time
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {systemPerformance.responseTime}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">
                  <ActivityIcon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Processing Rate
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {systemPerformance.processingRate}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                  <TrendingUpIcon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Accuracy Rate
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {systemPerformance.accuracyRate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      {/* Recent Activity */}
      <div>
        <Card title="Recent Activity">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Location
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Confidence
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {recentActivity.map((activity) => (
                  <tr key={activity.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(activity.timestamp)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {(activity.confidence * 100).toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
