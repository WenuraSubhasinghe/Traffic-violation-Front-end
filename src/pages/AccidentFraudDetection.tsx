import React, { useState } from 'react'
import { FileUpload } from '../components/ui/fileUpload'
import { Card } from '../components/ui/card'
import { UploadIcon } from 'lucide-react'

export function AccidentFraudDetection() {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [fraudResult, setFraudResult] = useState<any>(null)

  const handleFileAccepted = (selectedFile: File) => {
    setFile(selectedFile)
    setFraudResult(null)
  }

  const startAnalysis = async () => {
    if (!file) return

    setIsAnalyzing(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('http://127.0.0.1:8000/fraud/run', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      setFraudResult(data)
    } catch (err) {
      console.error('Analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Accident Fraud Detection
      </h1>

      <Card title="Upload Accident Evidence Video">
        <div className="space-y-4">
          <FileUpload onFileAccepted={handleFileAccepted} />
          <div className="flex justify-end">
            <button
              onClick={startAnalysis}
              disabled={!file || isAnalyzing}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                !file || isAnalyzing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <UploadIcon className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Evidence'}
            </button>
          </div>
        </div>
      </Card>

      {fraudResult && (
        <Card title="Fraud Detection Result">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Vehicle 1 Fraud Probability:</strong>{' '}
                  {(fraudResult.vehicle_1_fraud_probability * 100).toFixed(2)}%
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Vehicle 2 Fraud Probability:</strong>{' '}
                  {(fraudResult.vehicle_2_fraud_probability * 100).toFixed(2)}%
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Most Fraudulent Vehicle:</strong>{' '}
                  {fraudResult.most_fraudulent_vehicle}
                </p>
              </div>
              <div>
                <img
                  src={`http://127.0.0.1:8000/static/${fraudResult.detected_accident.split('/').pop()}`}
                  alt="Detected Accident"
                  className="w-full h-auto rounded-lg border border-gray-300 dark:border-gray-700"
                />
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
