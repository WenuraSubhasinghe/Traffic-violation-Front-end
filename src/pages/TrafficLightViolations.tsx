import React, { useState } from 'react'
import { DownloadIcon, PrinterIcon, AlertCircleIcon } from 'lucide-react'
import { Card } from '../components/ui/card'
import { FileUpload } from '../components/ui/fileUpload'
import { VideoPlayer } from '../components/ui/VideoPlayer'
import axiosClient from '../api/axiosClient'

type Violation = {
  vehicle_id: string;
  frame_number: number;
  confidence: number;
  detection_method: string;
  timestamp: string;
};

type DetectionSummary = {
  output_path: string;
  summary: {
    total_frames: number;
    total_violations: number;
    unique_violators: number;
    violations: Violation[];
  };
};

export function TrafficLightViolations() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [detectionSummary, setDetectionSummary] = useState<DetectionSummary | null>(null);

  const handleFileAccepted = async (acceptedFile: File) => {
    setVideoFile(acceptedFile);
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setDetectionSummary(null);
    
    try {
      const formData = new FormData();
      formData.append('file', acceptedFile);

      const response = await axiosClient.post('/light-violation/run', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setDetectionSummary(response.data);
    } catch (error) {
      console.error('Error analyzing file:', error);
    } finally {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }
  }

  // Helper function to format timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  }

  // Helper function to calculate average confidence
  const calculateAverageConfidence = (violations: Violation[]) => {
    if (!violations || violations.length === 0) return 0;
    const total = violations.reduce((sum, violation) => sum + violation.confidence, 0);
    return (total / violations.length).toFixed(1);
  }

  const COLORS = ['#10B981', '#34D399', '#6EE7B7']

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Traffic Light Violations
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
      <Card title="Upload Intersection Video" className="mb-6">
        <FileUpload onFileAccepted={handleFileAccepted} />
      </Card>

      {/* Analysis Section */}
      {(isAnalyzing || analysisComplete) && (
        <div className="space-y-6">
          {isAnalyzing && (
            <Card>
              <div className="flex flex-col items-center justify-center py-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
                <p className="text-gray-700 dark:text-gray-300">
                  Analyzing video for traffic light violations...
                </p>
              </div>
            </Card>
          )}

          {analysisComplete && detectionSummary && (
            <>
              <Card title="Analysis Results">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <VideoPlayer
                      src={detectionSummary.output_path}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Detection Summary
                    </h3>
                    <div className={`${detectionSummary.summary.total_violations > 0 
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-400' 
                      : 'bg-green-50 dark:bg-green-900/20 border-green-400'
                    } border-l-4 p-4 mb-6`}>
                      <div className="flex">
                        <AlertCircleIcon className={`h-5 w-5 ${detectionSummary.summary.total_violations > 0 
                          ? 'text-red-400' 
                          : 'text-green-400'
                        }`} />
                        <div className="ml-3">
                          <p className={`text-sm ${detectionSummary.summary.total_violations > 0 
                            ? 'text-red-700 dark:text-red-300' 
                            : 'text-green-700 dark:text-green-300'
                          }`}>
                            {detectionSummary.summary.total_violations > 0 
                              ? `${detectionSummary.summary.total_violations} traffic light violation${detectionSummary.summary.total_violations > 1 ? 's' : ''} detected with average confidence of ${calculateAverageConfidence(detectionSummary.summary.violations)}%.`
                              : 'No traffic light violations detected.'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Analysis Overview
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Total Frames
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {detectionSummary.summary.total_frames}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Total Violations
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {detectionSummary.summary.total_violations}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Unique Violators
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {detectionSummary.summary.unique_violators}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Average Confidence
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {calculateAverageConfidence(detectionSummary.summary.violations)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Detailed Violations */}
              {detectionSummary.summary.violations && detectionSummary.summary.violations.length > 0 && (
                <Card title="Violation Details">
                  <div className="space-y-4">
                    {detectionSummary.summary.violations.map((violation: Violation, index: number) => (
                      <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Violation #{index + 1}
                          </h4>
                          <span className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 text-xs font-medium px-2.5 py-0.5 rounded">
                            Red Light Running
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Vehicle ID
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {violation.vehicle_id}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Frame
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {violation.frame_number}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Confidence
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {violation.confidence}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Detection Method
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                              {violation.detection_method.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Timestamp
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {formatTimestamp(violation.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}