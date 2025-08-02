import React, { useState } from 'react'
import { DownloadIcon, PrinterIcon, AlertCircleIcon } from 'lucide-react'
import { Card } from '../components/ui/card'
import { FileUpload } from '../components/ui/fileUpload'
import { VideoPlayer } from '../components/ui/VideoPlayer'
// import { stopSignViolationData } from '../utils/mockData' // If needed for mock

export function StopSignViolation() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [result, setResult] = useState<{
    violationDetected: boolean
    violatingVehicleIds: string[]
    sampleVideo: string
  } | null>(null)

  const handleFileAccepted = (file: File) => {
    setVideoFile(file)
    // Simulate analysis process
    setIsAnalyzing(true)
    setAnalysisComplete(false)
    setResult(null)
    setTimeout(() => {
      // --- SIMULATED OUTPUT: toggle these for demo ---
      // To test "violation" found, use this:
      setResult({
        violationDetected: true,
        violatingVehicleIds: ['23', '45', '87'],
        sampleVideo: '/videos/stop_sign_violation_sample.mp4' // Replace with real link if available
      })
      // To test "no violation", use this instead:
      // setResult({
      //   violationDetected: false,
      //   violatingVehicleIds: [],
      //   sampleVideo: '/videos/stop_sign_violation_sample.mp4'
      // })
      setIsAnalyzing(false)
      setAnalysisComplete(true)
    }, 3000)
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Stop Sign/Line Violation Detection
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mb-4"></div>
                <p className="text-gray-700 dark:text-gray-300">
                  Analyzing video for stop sign/line violations...
                </p>
              </div>
            </Card>
          )}
          {analysisComplete && result && (
            <Card title="Analysis Results">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  {/* Display video if sample available */}
                  {result.sampleVideo && <VideoPlayer src={result.sampleVideo} />}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Violation Detection Summary
                  </h3>
                  <div className={`p-4 mb-6 border-l-4 ${result.violationDetected ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-400' : 'bg-green-50 dark:bg-green-900/20 border-green-400'}`}>
                    <div className="flex">
                      <AlertCircleIcon className={`h-5 w-5 ${result.violationDetected ? 'text-rose-400' : 'text-green-400'}`} />
                      <div className="ml-3">
                        {result.violationDetected ? (
                          <>
                            <p className="text-sm text-rose-700 dark:text-rose-300 font-semibold">
                              Violation detected!
                            </p>
                            <p className="text-sm text-rose-700 dark:text-rose-300">
                              Violating vehicle IDs:
                              <ul className="list-disc pl-5 mt-2">
                                {result.violatingVehicleIds.map((id) => (
                                  <li key={id}>{id}</li>
                                ))}
                              </ul>
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                            No violations detected.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
