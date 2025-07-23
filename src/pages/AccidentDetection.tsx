import React, { useState } from 'react';
import { DownloadIcon } from 'lucide-react';
import { Card } from '../components/ui/card';
import { FileUpload } from '../components/ui/fileUpload';
import { VideoPlayer } from '../components/ui/VideoPlayer';
import axiosClient from '../api/axiosClient';
import { AccidentDetails } from '../components/ui/AccidentDetails';

export function AccidentDetection() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [annotatedImage, setAnnotatedImage] = useState<string | null>(null);
  const [detectionSummary, setDetectionSummary] = useState<any>(null);

  const handleFileAccepted = async (acceptedFile: File) => {
    setFile(acceptedFile);
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setAnnotatedImage(null);
    setDetectionSummary(null);

    try {
      const formData = new FormData();
      formData.append('file', acceptedFile);

      // If the file is an image, call the test-image endpoint
      if (acceptedFile.type.startsWith('image/')) {
        const response = await axiosClient.post('/accidents/test-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setDetectionSummary(response.data);
        setAnnotatedImage(response.data.annotated_image_url);
      } else {
        // Video upload flow (for now, just set complete)
        // You can later integrate /accidents/run endpoint
        setDetectionSummary({ message: 'Video analysis not implemented yet' });
      }
    } catch (error) {
      console.error('Error analyzing file:', error);
    } finally {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Accident Detection
        </h1>
        <div className="mt-4 md:mt-0 flex space-x-2">
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
      <Card title="Upload Image or Video" className="mb-6">
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
                  Analyzing file for accidents...
                </p>
              </div>
            </Card>
          )}

          {analysisComplete && detectionSummary && (
            <Card title="Analysis Results">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex justify-center">
                  {file?.type.startsWith('video/') && (
                    <VideoPlayer src={URL.createObjectURL(file)} />
                  )}
                  {file?.type.startsWith('image/') && annotatedImage && (
                    <img
                      src={annotatedImage}
                      alt="Annotated Accident"
                      className="rounded-lg border border-gray-300"
                    />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Detection Summary
                  </h3>
                  <AccidentDetails
                    detections={detectionSummary.detections}
                    collisions={detectionSummary.collisions}
                    accidents={detectionSummary.accidents}
                  />
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
