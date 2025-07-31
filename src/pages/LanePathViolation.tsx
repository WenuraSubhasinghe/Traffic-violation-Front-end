import React, { useState } from 'react'
import { DownloadIcon, PrinterIcon, AlertCircleIcon } from 'lucide-react'
import { Card } from '../components/ui/card'
import { FileUpload } from '../components/ui/fileUpload'
import { VideoPlayer } from '../components/ui/VideoPlayer'

export function LanePathViolation() {
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
      const res = await fetch('http://127.0.0.1:8000/lanechange/run', {
        method: 'POST',
        body: formData,
      })
      const json = await res.json()
      setResponse(json)
    } catch (err) {
      console.error('Upload error:', err)
      setResponse({ detail: 'Upload or processing failed.' })
    } finally {
      setIsAnalyzing(false)
      setAnalysisComplete(true)
    }
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Lane Change Detection
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
                  Analyzing video for lane changes...
                </p>
              </div>
            </Card>
          )}
          {analysisComplete && response && (
            <Card title="Analysis Results">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  {response.annotated_video_url && (
                    <VideoPlayer src={response.annotated_video_url.replace(
                      'http://127.0.0.1:8000/static/',
                      '/static/'
                    )} />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Lane Change Detection Results
                  </h3>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 mb-6">
                    <div className="flex">
                      <AlertCircleIcon className="h-5 w-5 text-blue-400" />
                      <div className="ml-3">
                        {response?.summary ? (
                          <>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              {response.summary.total_detected_lane_changes} lane change{response.summary.total_detected_lane_changes !== 1 ? 's' : ''} detected from {response.summary.total_tracked_vehicles} vehicles tracked.
                            </p>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              {response.summary.vehicles_with_lane_changes} vehicle{response.summary.vehicles_with_lane_changes !== 1 ? 's' : ''} made a lane change.
                            </p>
                          </>
                        ) : response?.detail ? (
                          <span className="text-red-600">{response.detail}</span>
                        ) : (
                          <span>No summary available.</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="overflow-y-auto max-h-[400px] space-y-4">
                    {Array.isArray(response?.vehicles) && response.vehicles.length > 0 ? (
                      response.vehicles.map((vehicle: any, vIdx: number) => (
                        <div
                          key={vIdx}
                          className="mb-3 p-3 border rounded-md dark:border-gray-700"
                        >
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Vehicle {vehicle.vehicle_id}
                          </p>
                          {vehicle.plates && vehicle.plates.length > 0 && (
                            <p className="text-xs text-gray-700 dark:text-gray-200 mb-1">
                              Plates: {vehicle.plates.filter(p => p).join(', ') || 'N/A'}
                            </p>
                          )}
                          <p className="text-xs text-gray-700 dark:text-gray-200">
                            Lane Changes: {vehicle.total_lane_changes}
                          </p>
                          {Array.isArray(vehicle.lane_changes) && vehicle.lane_changes.length > 0 && (
                            <ul className="mt-2 pl-4 text-xs text-blue-700 dark:text-blue-400 list-disc">
                              {vehicle.lane_changes.map((event: any, eidx: number) => (
                                <li key={eidx}>
                                  Changed from lane {event.from_lane} to lane {event.to_lane}
                                  {event.timestamp && (
                                    <> at {typeof event.timestamp === 'number'
                                      ? new Date(event.timestamp * 1000).toLocaleTimeString()
                                      : event.timestamp}</>
                                  )}
                                  {event.plate_number && (
                                    <> (Plate: {event.plate_number || 'N/A'})</>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))
                    ) : response?.detail ? (
                      <div className="text-red-600">{response.detail}</div>
                    ) : (
                      <div>No vehicles with lane changes detected.</div>
                    )}
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
