import React, { useState, useRef } from 'react'
import {
  PlayIcon,
  PauseIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from 'lucide-react'
type VideoPlayerProps = {
  src: string
  annotations?: {
    time: number
    type: string
    description: string
    boundingBox?: {
      x: number
      y: number
      width: number
      height: number
    }
  }[]
}
export function VideoPlayer({ src, annotations = [] }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Get current annotations based on video time
  const currentAnnotations = annotations.filter(
    (annotation) => Math.abs(annotation.time - currentTime) < 0.5,
  )
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
      drawAnnotations()
    }
  }
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }
  const seekVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    setCurrentTime(time)
    if (videoRef.current) {
      videoRef.current.currentTime = time
    }
  }
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }
  const skip = (amount: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += amount
    }
  }
  const drawAnnotations = () => {
    if (!canvasRef.current || !videoRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // Draw bounding boxes for current annotations
    currentAnnotations.forEach((annotation) => {
      if (annotation.boundingBox) {
        const { x, y, width, height } = annotation.boundingBox
        const canvasX = x * canvas.width
        const canvasY = y * canvas.height
        const canvasWidth = width * canvas.width
        const canvasHeight = height * canvas.height
        ctx.strokeStyle = getViolationColor(annotation.type)
        ctx.lineWidth = 3
        ctx.strokeRect(canvasX, canvasY, canvasWidth, canvasHeight)
        // Add label
        ctx.fillStyle = getViolationColor(annotation.type)
        ctx.fillRect(canvasX, canvasY - 20, 100, 20)
        ctx.fillStyle = '#ffffff'
        ctx.font = '12px Arial'
        ctx.fillText(annotation.type, canvasX + 5, canvasY - 5)
      }
    })
  }
  const getViolationColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'speed':
        return '#EF4444'
      // red
      case 'accident':
        return '#F59E0B'
      // amber
      case 'lane':
        return '#3B82F6'
      // blue
      case 'traffic light':
        return '#10B981'
      // green
      case 'road sign':
        return '#8B5CF6'
      // purple
      default:
        return '#6B7280'
      // gray
    }
  }
  return (
    <div className="relative">
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={togglePlay}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          width={640}
          height={360}
        />
        {/* Video controls overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center justify-between text-white mb-2">
            <div className="flex items-center space-x-2">
              <button
                className="p-1 rounded-full hover:bg-white/20"
                onClick={() => skip(-10)}
              >
                <SkipBackIcon className="w-5 h-5" />
              </button>
              <button
                className="p-2 rounded-full hover:bg-white/20"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <PauseIcon className="w-6 h-6" />
                ) : (
                  <PlayIcon className="w-6 h-6" />
                )}
              </button>
              <button
                className="p-1 rounded-full hover:bg-white/20"
                onClick={() => skip(10)}
              >
                <SkipForwardIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={seekVideo}
            className="w-full h-1 bg-gray-300 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(currentTime / (duration || 1)) * 100}%, #9CA3AF ${(currentTime / (duration || 1)) * 100}%, #9CA3AF 100%)`,
            }}
          />
        </div>
      </div>
      {/* Annotation display */}
      {currentAnnotations.length > 0 && (
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Detection Results
          </h4>
          <div className="space-y-2">
            {currentAnnotations.map((annotation, index) => (
              <div
                key={index}
                className="flex items-center p-2 bg-white dark:bg-gray-800 rounded border-l-4"
                style={{
                  borderLeftColor: getViolationColor(annotation.type),
                }}
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {annotation.type}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {annotation.description} at {formatTime(annotation.time)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
