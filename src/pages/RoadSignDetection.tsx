import React, { useState } from 'react'
import { VideoPlayer } from '../components/ui/VideoPlayer'
import { DownloadIcon, PrinterIcon, AlertCircleIcon } from 'lucide-react'
import { Card } from '../components/ui/card'
import { FileUpload } from '../components/ui/fileUpload'

export function RoadSignDetection() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [response, setResponse] = useState<any | null>(null)

  const handleFileAccepted = async (file: File) => {
    setVideoFile(file)
    setIsAnalyzing(true)
    setAnalysisComplete(false)
    setResponse(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('http://127.0.0.1:8000/roadsign/run', {
        method: 'POST',
        body: formData,
      })
      const json = await res.json()
      setResponse(json)
    } catch (err) {
      console.error('Upload error:', err)
      setResponse({ detail: 'Failed to analyze video. Please try again.' })
    } finally {
      setIsAnalyzing(false)
      setAnalysisComplete(true)
    }
  }

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
      {analysisComplete && response && (
        <>
          <Card title="Analysis Results" className="mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {response.annotated_video_url && (
                <VideoPlayer
                  src={response.annotated_video_url.replace('http://127.0.0.1:8000/static/', '/static/')}
                />
              )}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Sign Detection Summary
                </h3>
                <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-400 p-4 mb-6">
                  <div className="flex">
                    <AlertCircleIcon className="h-5 w-5 text-purple-400" />
                    <div className="ml-3">
                      {response?.summary ? (
                        <>
                          <p>
                            {response.summary.total_signs} road signs detected with average confidence of {response.summary.avg_confidence}%.
                          </p>
                        </>
                      ) : response?.detail ? (
                        <span className="text-red-600">{response.detail}</span>
                      ) : (
                        <span>No summary available.</span>
                      )}
                    </div>
                  </div>
                  <ul className="mt-3 pl-4 text-sm text-gray-700 dark:text-gray-200 list-disc">
                    {Array.isArray(response?.detections) && response.detections.length > 0 ? (
                      response.detections.map((detection: { sign_type: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; time: number; confidence: number }, idx: React.Key | null | undefined) => (
                        <li key={idx}>
                          {detection.sign_type} sign detected at {Math.floor(detection.time / 60)}:{(detection.time % 60).toString().padStart(2, '0')} (confidence: {(detection.confidence * 100).toFixed(1)}%)
                        </li>
                      ))
                    ) : response?.detail ? (
                      <span className="text-red-600">{response.detail}</span>
                    ) : (
                      <span>No sign detections found.</span>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
