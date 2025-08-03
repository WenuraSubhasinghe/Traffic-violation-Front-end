  import React, { useState } from 'react'
  import { VideoPlayer } from '../components/ui/VideoPlayer'
  import { Card } from '../components/ui/card'
  import { FileUpload } from '../components/ui/fileUpload'
  import { AlertCircleIcon } from 'lucide-react'

  export function LegacyPlate() {
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisComplete, setAnalysisComplete] = useState(false)
    const [response, setResponse] = useState<any | null>(null)
    const [filename, setFilename] = useState<string | null>(null);

    const handleFileAccepted = async (file: File) => {
      setVideoFile(file)
      setFilename(file.name)
      setIsAnalyzing(true)
      setAnalysisComplete(false)
      setResponse(null)

      const formData = new FormData()
      formData.append('file', file)

      try {
        const res = await fetch('http://127.0.0.1:8000/plate/run', {
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
          U-Turn Detection
        </h1>

        <Card title="Upload Traffic Video" className="mb-6">
          <FileUpload onFileAccepted={handleFileAccepted} />
        </Card>

        {isAnalyzing && (
          <Card>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-700 dark:text-gray-300">
                Analyzing video for U-turn detections...
              </p>
            </div>
          </Card>
        )}

        {analysisComplete && response && (
          <>
            <Card title="Detection Results" className="mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {response.annotated_video_url &&
                   <video
                    src={`http://127.0.0.1:8000/static/uturn_${filename}`}
                    controls
                    autoPlay
                    muted
                    width={640}
                    />
                }

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Detection Summary
                  </h3>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 mb-6">
                    <div className="flex">
                      <AlertCircleIcon className="h-5 w-5 text-blue-400" />
                      <div>
                        {response?.summary ? (
                          <>
                            <p>
                              {response.summary.total_detected_uturns} U-turn detected from {response.summary.total_tracked_vehicles} vehicles tracked.
                            </p>
                            <p>
                              {response.summary.vehicles_with_uturns} vehicles made a U-turn.
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

                  <div className="overflow-y-auto max-h-[400px]">
                    {Array.isArray(response?.vehicles) && response.vehicles.length > 0 ? (
                      response.vehicles.map((vehicle: { vehicle_id: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; plates: any[]; total_uturns: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; uturn_events: any[] }, idx: React.Key | null | undefined) => (
                        <div key={idx} className="mb-3 p-3 border rounded-md dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Vehicle {vehicle.vehicle_id} {vehicle.plates && vehicle.plates.length > 0 ? `(Plate: ${vehicle.plates.join(', ')})` : ''}
                          </p>
                          <p className="text-xs text-gray-700 dark:text-gray-200">
                            U-Turns: {vehicle.total_uturns}
                          </p>
                          {Array.isArray(vehicle.uturn_events) && vehicle.uturn_events.length > 0 && (
                            <ul className="mt-2 pl-4 text-xs text-blue-700 dark:text-blue-400 list-disc">
                              {vehicle.uturn_events.map((event, eidx) => (
                                <li key={eidx}>
                                  U-turn
                                  {event.angle && ` — ${event.angle}°`}
                                  {event.timestamp && (
                                    <> at {typeof event.timestamp === 'number'
                                      ? (new Date(event.timestamp * 1000).toLocaleTimeString())
                                      : event.timestamp}</>
                                  )}
                                  {event.plate && ` (Plate: ${event.plate})`}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))
                    ) : response?.detail ? (
                      <div className="text-red-600">{response.detail}</div>
                    ) : (
                      <div>No vehicles with U-turns detected.</div>
                    )}
                  </div>

                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    )
  }
