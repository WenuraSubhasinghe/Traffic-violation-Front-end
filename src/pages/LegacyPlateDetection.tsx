import React, { useState } from 'react'
import { Card } from '../components/ui/card'
import { FileUpload } from '../components/ui/fileUpload'

export function LegacyPlate() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [annotatedImageUrl, setAnnotatedImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileAccepted = async (file: File) => {
    setImageFile(file)
    setIsAnalyzing(true)
    setAnalysisComplete(false)
    setAnnotatedImageUrl(null)
    setError(null)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('http://127.0.0.1:8000/plates/run', {
        method: 'POST',
        body: formData,
      })
      const json = await res.json()
      if (json.annotated_image_url) {
        setAnnotatedImageUrl(json.annotated_image_url)
      } else {
        setError('No annotated image URL returned from backend.')
      }
    } catch (err) {
      setError('Upload or analysis error. Please try again.')
      console.error('Upload error:', err)
    } finally {
      setIsAnalyzing(false)
      setAnalysisComplete(true)
    }
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        License Plate Detection
      </h1>
      <Card title="Upload Image" className="mb-6">
        <FileUpload onFileAccepted={handleFileAccepted} />
      </Card>
      {isAnalyzing && (
        <Card>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-700 dark:text-gray-300">
              Detecting plates in image...
            </p>
          </div>
        </Card>
      )}
      {analysisComplete && (
        <Card title="Detection Result" className="mb-6">
          {annotatedImageUrl ? (
            <div className="flex flex-col items-center">
              <img
                src={annotatedImageUrl}
                alt="Annotated with detected plates"
                className="rounded shadow max-w-full h-auto mb-4 border border-blue-200"
                style={{ maxHeight: 500, maxWidth: '100%' }}
              />
              <div className="text-green-600 font-medium text-sm">
                Annotated image with detected plates.
              </div>
            </div>
          ) : (
            <div className="text-red-600 text-center py-4">
              {error || 'No result image received.'}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
