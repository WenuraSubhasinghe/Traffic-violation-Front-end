import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadIcon, XIcon, FileIcon, CheckIcon } from 'lucide-react';

type FileUploadProps = {
  onFileAccepted: (file: File) => void;
  maxSizeMB?: number;
  acceptedFormats?: string[];
};

export function FileUpload({
  onFileAccepted,
  maxSizeMB = 100,
  acceptedFormats = ['video/mp4', 'video/avi', 'video/quicktime', 'image/jpeg', 'image/png'],
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];
      if (!selectedFile) return;

      if (selectedFile.size > maxSizeBytes) {
        setError(`File size exceeds the ${maxSizeMB}MB limit`);
        return;
      }

      setFile(selectedFile);
      setError(null);
      setIsUploading(true);

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          onFileAccepted(selectedFile);
        }
      }, 100);
    },
    [maxSizeBytes, maxSizeMB, onFileAccepted],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov'],
      'image/*': ['.jpg', '.jpeg', '.png'],
    },
    maxFiles: 1,
  });

  const removeFile = () => {
    setFile(null);
    setProgress(0);
    setError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full">
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400'
          }`}
        >
          <input {...getInputProps()} />
          <UploadIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            {isDragActive
              ? 'Drop the file here...'
              : 'Drag and drop an image or video file here, or click to select'}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Accepted formats: MP4, AVI, MOV, JPG, PNG (Max: {maxSizeMB}MB)
          </p>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <FileIcon className="h-6 w-6 text-blue-500 mr-2" />
              <div className="text-sm">
                <p className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-xs">
                  {file.name}
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          {isUploading ? (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-700 dark:text-gray-300">
                  Uploading...
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${progress}%`,
                  }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="mt-2 flex items-center text-sm text-green-600 dark:text-green-400">
              <CheckIcon className="h-4 w-4 mr-1" />
              <span>Upload complete</span>
            </div>
          )}
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}