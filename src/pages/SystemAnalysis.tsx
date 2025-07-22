import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Card } from '../components/ui/card'
import { systemAnalysisData } from '../utils/mockData'
export function SystemAnalysis() {
  const COLORS = [
    '#3B82F6',
    '#10B981',
    '#EF4444',
    '#F59E0B',
    '#8B5CF6',
    '#EC4899',
  ]
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Overall System Analysis
        </h1>
      </div>
      <div className="space-y-6">
        <Card title="System Overview">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Traffic Violation Detection System
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  This comprehensive system uses advanced computer vision and AI
                  to detect and analyze various traffic violations from video
                  footage. The system processes video input through specialized
                  detection modules to identify specific violation types.
                </p>
                <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Key Features:
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                  <li>Real-time violation detection with high accuracy</li>
                  <li>Multiple specialized detection modules</li>
                  <li>Automated reporting and evidence collection</li>
                  <li>Fraud detection capabilities</li>
                  <li>Statistical analysis and trend identification</li>
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
                  System Modules:
                </h4>
                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h5 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                      Accident Detection
                    </h5>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Identifies vehicle collisions and accidents in traffic
                      footage
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h5 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                      Accident Fraud Detection
                    </h5>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Analyzes accident evidence to identify potential
                      fraudulent claims
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h5 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                      Lane Path Violation
                    </h5>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Detects illegal lane changes, crossings, and improper
                      driving behavior
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h5 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                      Traffic Light Violation
                    </h5>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Identifies vehicles running red lights or disobeying
                      traffic signals
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h5 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                      Speed Violation
                    </h5>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Detects vehicles exceeding speed limits in monitored areas
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h5 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                      Road Sign Violation
                    </h5>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Identifies vehicles ignoring or disobeying road signs and
                      markings
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Module Performance Comparison">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={systemAnalysisData.modulePerformance}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="module" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="accuracy" name="Accuracy (%)" fill="#3B82F6" />
                  <Bar
                    dataKey="processingTime"
                    name="Processing Time (s)"
                    fill="#10B981"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card title="System Processing Workflow">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={systemAnalysisData.processingSteps}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="timePercent"
                    label={({ name, percent }) =>
                      `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {systemAnalysisData.processingSteps.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        <Card title="Weekly System Uptime">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={systemAnalysisData.systemUptime}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[99, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="uptime"
                  name="Uptime (%)"
                  stroke="#3B82F6"
                  activeDot={{
                    r: 8,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="System Process Flow">
          <div className="p-6">
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-3xl">
                <div className="absolute top-0 bottom-0 left-[50%] border-l-2 border-dashed border-gray-300 dark:border-gray-600"></div>
                <div className="space-y-12">
                  <div className="relative">
                    <div className="ml-[50%] pl-8">
                      <div className="absolute left-[50%] -translate-x-[50%] w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">1</span>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h4 className="text-md font-medium text-blue-800 dark:text-blue-300 mb-2">
                          Video Input
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Traffic footage is uploaded to the system from
                          cameras, drones, or other recording devices.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="mr-[50%] pr-8">
                      <div className="absolute left-[50%] -translate-x-[50%] w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <h4 className="text-md font-medium text-green-800 dark:text-green-300 mb-2">
                          Pre-processing
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Video is enhanced, stabilized, and prepared for
                          analysis with noise reduction and frame optimization.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="ml-[50%] pl-8">
                      <div className="absolute left-[50%] -translate-x-[50%] w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                        <h4 className="text-md font-medium text-purple-800 dark:text-purple-300 mb-2">
                          Object Detection
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          AI models identify and track vehicles, pedestrians,
                          traffic signals, and road signs in the footage.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="mr-[50%] pr-8">
                      <div className="absolute left-[50%] -translate-x-[50%] w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">4</span>
                      </div>
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <h4 className="text-md font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                          Violation Analysis
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Specialized modules analyze object behavior to detect
                          specific traffic violations based on predefined rules.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="ml-[50%] pl-8">
                      <div className="absolute left-[50%] -translate-x-[50%] w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">5</span>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                        <h4 className="text-md font-medium text-red-800 dark:text-red-300 mb-2">
                          Report Generation
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          System generates comprehensive reports with violation
                          details, evidence, and recommended actions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
