import React, { useState } from 'react'
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
  LineChart,
  Line,
} from 'recharts'
import {
  DownloadIcon,
  PrinterIcon,
  AlertCircleIcon,
  UploadIcon,
} from 'lucide-react'
import { accidentFraudData, trafficLightData } from '../utils/mockData'
import { Card } from '../components/ui/card'
import { FileUpload } from '../components/ui/fileUpload'
import { VideoPlayer } from '../components/ui/VideoPlayer'
export function AccidentFraudDetection() {
  const [files, setFiles] = useState<File[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(
    accidentFraudData.vehicles[0],
  )
  const handleFileAccepted = (file: File) => {
    setFiles((prev) => [...prev, file])
  }
  const startAnalysis = () => {
    if (files.length > 0) {
      setIsAnalyzing(true)
      setTimeout(() => {
        setIsAnalyzing(false)
        setAnalysisComplete(true)
      }, 3000)
    }
  }
  const COLORS = ['#FF6B6B', '#4ECDC4', '#FFD166', '#118AB2', '#073B4C']
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Accident Fraud Detection
        </h1>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center"
            disabled={!analysisComplete}
          >
            <PrinterIcon className="w-4 h-4 mr-2" />
            Print
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
            disabled={!analysisComplete}
          >
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* File Upload Section */}
      {!analysisComplete && (
        <Card title="Upload Accident Evidence Sequence" className="mb-6">
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload multiple evidence files related to the accident (videos,
              sensor data, witness statements, etc.)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FileUpload onFileAccepted={handleFileAccepted} />
              </div>
              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Uploaded Evidence ({files.length})
                </h3>
                {files.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No files uploaded yet
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {files.map((file, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 dark:text-gray-400 flex items-center"
                      >
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {file.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={startAnalysis}
                disabled={files.length === 0}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${files.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                <UploadIcon className="w-4 h-4 mr-2" />
                Analyze Evidence
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Analysis Section */}
      {(isAnalyzing || analysisComplete) && (
        <div className="space-y-6">
          {isAnalyzing && (
            <Card>
              <div className="flex flex-col items-center justify-center py-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-700 dark:text-gray-300">
                  Analyzing evidence for accident fraud indicators...
                </p>
              </div>
            </Card>
          )}

          {analysisComplete && (
            <>
              <Card title="Fraud Analysis Results">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Vehicle Fraud Risk Assessment
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {accidentFraudData.vehicles.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        onClick={() => setSelectedVehicle(vehicle)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${selectedVehicle.id === vehicle.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'}`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {vehicle.make} {vehicle.model}
                          </h4>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${vehicle.fraudScore > 0.7 ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' : vehicle.fraudScore > 0.4 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'}`}
                          >
                            {vehicle.fraudScore > 0.7
                              ? 'High Risk'
                              : vehicle.fraudScore > 0.4
                                ? 'Medium Risk'
                                : 'Low Risk'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${vehicle.fraudScore > 0.7 ? 'bg-red-600' : vehicle.fraudScore > 0.4 ? 'bg-yellow-500' : 'bg-green-500'}`}
                              style={{
                                width: `${vehicle.fraudScore * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            {Math.round(vehicle.fraudScore * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <VideoPlayer
                        src={trafficLightData.sampleVideo}
                      />
                    </div>
                    <div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Vehicle Details
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Vehicle ID
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {selectedVehicle.id}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Make/Model
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {selectedVehicle.make} {selectedVehicle.model} (
                              {selectedVehicle.year})
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Fraud Score
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {Math.round(selectedVehicle.fraudScore * 100)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              History Flags
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {selectedVehicle.historyFlags}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Detected Anomalies
                        </h4>
                        {selectedVehicle.anomalies.length === 0 ? (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            No anomalies detected
                          </p>
                        ) : (
                          <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            {selectedVehicle.anomalies.map((anomaly, index) => (
                              <li key={index} className="flex items-center">
                                <span
                                  className={`w-2 h-2 rounded-full mr-2 ${anomaly.toLowerCase().includes('no anomalies') ? 'bg-green-500' : 'bg-red-500'}`}
                                ></span>
                                {anomaly}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Fraud Assessment Factors">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={accidentFraudData.fraudFactors}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="weight"
                          label={({ name, percent }) =>
                            `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                          }
                        >
                          {accidentFraudData.fraudFactors.map(
                            (entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ),
                          )}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card title="Fraud Detection Trends">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={accidentFraudData.fraudTrends}
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
                        <Line
                          type="monotone"
                          dataKey="count"
                          name="Fraud Cases"
                          stroke="#FF6B6B"
                          activeDot={{
                            r: 8,
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
