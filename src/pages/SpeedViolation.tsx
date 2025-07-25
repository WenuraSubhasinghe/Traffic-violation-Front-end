import React, { useState } from 'react'
import { VideoPlayer } from '../components/ui/VideoPlayer'
import { Card } from '../components/ui/card'
import { FileUpload } from '../components/ui/fileUpload'
import { AlertCircleIcon } from 'lucide-react'

export function SpeedViolation() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [response, setResponse] = useState<any | null>(null)

  const handleFileAccepted = async (file: File) => {
    setVideoFile(file)
    setIsAnalyzing(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('http://127.0.0.1:8000/speed/run', {
        method: 'POST',
        body: formData,
      })
      const json = await res.json()
      setResponse(json)
    } catch (err) {
      console.error('Upload error:', err)
    } finally {
      setIsAnalyzing(false)
      setAnalysisComplete(true)
    }
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Speed Violation Detection
      </h1>

      <Card title="Upload Traffic Video" className="mb-6">
        <FileUpload onFileAccepted={handleFileAccepted} />
      </Card>

      {isAnalyzing && (
        <Card>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
            <p className="text-gray-700 dark:text-gray-300">
              Analyzing video for speed violations...
            </p>
          </div>
        </Card>
      )}

      {analysisComplete && response && (
        <>
          <Card title="Detection Results" className="mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <VideoPlayer src="src/inputs/speed_output.mp4" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Violation Summary
                </h3>
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 mb-6">
                  <div className="flex">
                    <AlertCircleIcon className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {response.summary.total_violations} violations detected
                        from {response.summary.total_vehicles} vehicles.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-y-auto max-h-[400px]">
                  {response.vehicles.map((v: any, index: number) => (
                    <div
                      key={index}
                      className="mb-3 p-3 border rounded-md dark:border-gray-700"
                    >
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Vehicle {v.vehicle_id} ({v.vehicle_type})
                      </p>
                      <p className="text-xs text-gray-700 dark:text-gray-200">Max Speed: {v.max_speed} km/h</p>
                      <p className="text-xs text-gray-700 dark:text-gray-200">Avg Speed: {v.avg_speed} km/h</p>
                      <p className="text-xs text-gray-700 dark:text-gray-200">
                        Total Violations: {v.total_violations}
                      </p>
                      {v.violations.length > 0 && (
                        <ul className="mt-2 pl-4 text-xs text-red-600 dark:text-red-400 list-disc">
                          {v.violations.map((violation: any, idx: number) => (
                            <li key={idx}>
                              {violation.vehicle_type} #{violation.vehicle_id} - {violation.speed} km/h
                              (limit: {violation.speed_limit} km/h), excess: {violation.excess_speed} km/h
                              at {new Date(violation.timestamp).toLocaleTimeString()}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
