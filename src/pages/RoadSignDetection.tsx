import React, { useState } from 'react'
import { VideoPlayer } from '../components/ui/VideoPlayer'
import { DownloadIcon, PrinterIcon, AlertCircleIcon } from 'lucide-react'
import { Card } from '../components/ui/card'
import { FileUpload } from '../components/ui/fileUpload'
import { roadSignData } from '../utils/mockData'
export function RoadSignDetection() {
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
  const COLORS = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE']
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Road Sign Detection
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
                <p className="text-gray-700 dark:text-gray-300">
                  Analyzing video for road sign detections...
                </p>
              </div>
            </Card>
          )}
          {analysisComplete && (
            <>
              <Card title="Analysis Results">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <VideoPlayer
                      src={roadSignData.sampleVideo}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Sign Detection Summary
                    </h3>
                    <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-400 p-4 mb-6">
                    <div className="flex">
                      <AlertCircleIcon className="h-5 w-5 text-purple-400" />
                      <div className="ml-3">
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                          {roadSignData.summary.total_signs} road signs detected with average confidence of {roadSignData.summary.avg_confidence}%.
                        </p>
                      </div>
                    </div>
                    <ul className="mt-3 pl-4 text-sm text-gray-700 dark:text-gray-200 list-disc">
                      {roadSignData.detections.map((detection, idx) => (
                        <li key={idx}>
                          {detection.sign_type} sign detected at {Math.floor(detection.time / 60)}:{(detection.time % 60).toString().padStart(2, '0')} (confidence: {(detection.confidence * 100).toFixed(1)}%)
                        </li>
                      ))}
                    </ul>
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
