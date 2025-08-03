import React, { useState } from 'react'
import { DownloadIcon, PrinterIcon, AlertCircleIcon } from 'lucide-react'
import { Card } from '../components/ui/card'
import { FileUpload } from '../components/ui/fileUpload'

export function LanePathEval() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [response, setResponse] = useState<any | null>(null)
  const [filename, setFilename] = useState<string | null>(null)

  const handleFileAccepted = async (file: File) => {
    setVideoFile(file)
    setFilename(file.name)
    setIsAnalyzing(true)
    setAnalysisComplete(false)
    setResponse(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('http://127.0.0.1:8000/lanepatheval/run', {
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
          Lane Path Evaluation
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
                    <video
                      src={response.annotated_video_url}
                      controls
                      autoPlay
                      muted
                      width={640}
                    />
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
                              {response.summary.total_detected_lane_changes} lane change{response.summary.total_detected_lane_changes !== 1 ? 's' : ''} detected.
                            </p>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              Lane count detected: {response.summary.lane_count}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              Processed at: {new Date(response.summary.processed_at).toLocaleString()}
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
                    {Array.isArray(response.lane_change_events) && response.lane_change_events.length > 0 ? (
                      <ul className="list-disc pl-4 text-sm text-blue-700 dark:text-blue-400">
                        {response.lane_change_events.map((event: { frame_idx: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; track_id: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; lane_idx: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; direction: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; timestamp: number }, idx: React.Key | null | undefined) => (
                          <li key={idx}>
                            At frame {event.frame_idx}, vehicle {event.track_id} crossed lane {event.lane_idx} ({event.direction})
                            {event.timestamp && (
                              <>
                                {" "}at{" "}
                                {typeof event.timestamp === 'number'
                                  ? new Date(event.timestamp * 1000).toLocaleTimeString()
                                  : event.timestamp}
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div>No lane changes detected.</div>
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
