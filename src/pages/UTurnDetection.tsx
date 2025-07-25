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
} from 'recharts'
import { DownloadIcon, PrinterIcon, AlertCircleIcon } from 'lucide-react'
import { Card } from '../components/ui/card'
import { FileUpload } from '../components/ui/fileUpload'
import { VideoPlayer } from '../components/ui/VideoPlayer'
import { uTurnDetectionData } from '../utils/mockData'
export function UTurnDetection() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const handleFileAccepted = (file: File) => {
    setVideoFile(file)
    // Simulate analysis process
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setAnalysisComplete(true)
    }, 3000)
  }
  const COLORS = ['#3B82F6', '#93C5FD', '#60A5FA', '#2563EB']
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          U-Turn Detection
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
      <Card title="Upload Traffic Video" className="mb-6">
        <FileUpload onFileAccepted={handleFileAccepted} />
      </Card>
      {/* Analysis Section */}
      {(isAnalyzing || analysisComplete) && (
        <div className="space-y-6">
          {isAnalyzing && (
            <Card>
              <div className="flex flex-col items-center justify-center py-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-700 dark:text-gray-300">
                  Analyzing video for u-turn detections...
                </p>
              </div>
            </Card>
          )}
          {analysisComplete && (
  <>
    <Card title="Analysis Results">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <VideoPlayer src={uTurnDetectionData.sampleVideo} />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Detection Summary
          </h3>
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <AlertCircleIcon className="h-5 w-5 text-blue-400" />
              <div className="ml-3">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {uTurnDetectionData.summary.total_u_turns} U-turn detected from {uTurnDetectionData.summary.total_vehicles} vehicles tracked.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                U-Turn Details
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {uTurnDetectionData.uturns.map((uturn, idx) => (
                  <li key={idx} className="flex flex-col">
                    <span>
                      <strong>Vehicle ID:</strong> {uturn.vehicle_id}
                    </span>
                    <span>
                      <strong>Plate number:</strong> {uturn.plate_number}
                    </span>
                    <span>
                      <strong>Angle:</strong> {uturn.angle}&deg; U-turn
                    </span>
                    <span>
                      <strong>Time:</strong> {uturn.timestamp}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </>
)}
        </div>
      )}
    </div>
  )
}
