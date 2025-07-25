// Mock data for the Traffic Violation Detection System
export const violationStats = {
  total: 1248,
  byType: {
    speed: 487,
    lane: 312,
    trafficLight: 256,
    roadSign: 123,
    accident: 70,
  },
  byMonth: [
    { month: 'Jan', count: 78 },
    { month: 'Feb', count: 92 },
    { month: 'Mar', count: 105 },
    { month: 'Apr', count: 121 },
    { month: 'May', count: 132 },
    { month: 'Jun', count: 145 },
    { month: 'Jul', count: 132 },
    { month: 'Aug', count: 118 },
    { month: 'Sep', count: 98 },
    { month: 'Oct', count: 87 },
    { month: 'Nov', count: 72 },
    { month: 'Dec', count: 68 },
  ],
}
export const systemPerformance = {
  uptime: '99.8%',
  responseTime: '1.2s',
  processingRate: '24 videos/hour',
  accuracyRate: '94.7%',
}
export const recentActivity = [
  {
    id: 1,
    type: 'Speed Violation',
    location: 'Highway 101, Mile 24',
    timestamp: '2023-09-15T10:23:45',
    status: 'detected',
    confidence: 0.96,
  },
  {
    id: 2,
    type: 'Traffic Light Violation',
    location: 'Main St & 5th Ave',
    timestamp: '2023-09-15T09:45:12',
    status: 'detected',
    confidence: 0.89,
  },
  {
    id: 3,
    type: 'Accident',
    location: 'Interstate 5, Exit 207',
    timestamp: '2023-09-15T08:17:33',
    status: 'detected',
    confidence: 0.97,
  },
  {
    id: 4,
    type: 'Lane Violation',
    location: 'Broadway & 42nd St',
    timestamp: '2023-09-15T07:56:21',
    status: 'detected',
    confidence: 0.92,
  },
  {
    id: 5,
    type: 'Road Sign Violation',
    location: 'Oak Road, School Zone',
    timestamp: '2023-09-15T07:34:09',
    status: 'detected',
    confidence: 0.88,
  },
]
export const accidentData = {
  sampleVideo:
    'https://assets.mixkit.co/videos/preview/mixkit-cars-driving-on-a-highway-under-a-blue-sky-41166-large.mp4',
  detections: [
    {
      time: 2.5,
      type: 'Accident',
      description: 'Vehicle collision detected',
      confidence: 0.95,
      boundingBox: { x: 0.3, y: 0.4, width: 0.4, height: 0.3 },
    },
    {
      time: 5.2,
      type: 'Speed',
      description: 'Vehicle exceeding speed limit',
      confidence: 0.87,
      boundingBox: { x: 0.1, y: 0.5, width: 0.2, height: 0.2 },
    },
    {
      time: 8.7,
      type: 'Lane',
      description: 'Improper lane change',
      confidence: 0.91,
      boundingBox: { x: 0.6, y: 0.5, width: 0.25, height: 0.25 },
    },
  ],
  severityDistribution: [
    { name: 'Minor', value: 65 },
    { name: 'Moderate', value: 23 },
    { name: 'Major', value: 10 },
    { name: 'Fatal', value: 2 },
  ],
  monthlyTrends: [
    { month: 'Jan', count: 12 },
    { month: 'Feb', count: 15 },
    { month: 'Mar', count: 18 },
    { month: 'Apr', count: 22 },
    { month: 'May', count: 19 },
    { month: 'Jun', count: 24 },
    { month: 'Jul', count: 28 },
    { month: 'Aug', count: 25 },
    { month: 'Sep', count: 20 },
    { month: 'Oct', count: 17 },
    { month: 'Nov', count: 14 },
    { month: 'Dec', count: 11 },
  ],
}
// Lane Path Violation Data
export const laneViolationData = {
  sampleVideo: 'src/inputs/lane_change.mp4',
  summary: {
    total_vehicles: 24,
    total_lane_changes: 1,
  },
  lane_changes: [
    {
      vehicle_id: 2,
      plate_number: '', // Add plate number if available
      timestamp: '0:07',
    },
  ],
}
// Traffic Light Violation Data
export const trafficLightData = {
  sampleVideo:
    'src/inputs/highway.mp4',
  detections: [
    {
      time: 2.1,
      type: 'Traffic Light',
      description: 'Red light violation',
      confidence: 0.96,
      boundingBox: { x: 0.5, y: 0.4, width: 0.2, height: 0.15 },
    },
    {
      time: 5.4,
      type: 'Traffic Light',
      description: 'Stopping beyond stop line',
      confidence: 0.88,
      boundingBox: { x: 0.3, y: 0.5, width: 0.2, height: 0.15 },
    },
    {
      time: 8.9,
      type: 'Traffic Light',
      description: 'Not stopping at amber light',
      confidence: 0.85,
      boundingBox: { x: 0.7, y: 0.4, width: 0.2, height: 0.15 },
    },
  ],
  violationTypes: [
    { name: 'Red Light', value: 145 },
    { name: 'Stop Line', value: 78 },
    { name: 'Amber Light', value: 33 },
  ],
  intersectionHotspots: [
    { intersection: 'Main & 1st', count: 45 },
    { intersection: 'Broadway & 7th', count: 38 },
    { intersection: 'Park & Central', count: 32 },
    { intersection: 'Oak & River', count: 28 },
    { intersection: 'Market & 9th', count: 24 },
  ],
}
// Speed Violation Data
export const speedViolationData = {
  sampleVideo:
    'src/inputs/highway.mp4',
  detections: [
    {
      time: 1.5,
      type: 'Speed',
      description: 'Vehicle exceeding speed limit by 15mph',
      confidence: 0.94,
      boundingBox: { x: 0.6, y: 0.5, width: 0.25, height: 0.2 },
    },
    {
      time: 4.7,
      type: 'Speed',
      description: 'Vehicle exceeding speed limit by 8mph',
      confidence: 0.91,
      boundingBox: { x: 0.2, y: 0.5, width: 0.25, height: 0.2 },
    },
    {
      time: 7.2,
      type: 'Speed',
      description: 'Vehicle exceeding speed limit by 22mph',
      confidence: 0.97,
      boundingBox: { x: 0.4, y: 0.5, width: 0.25, height: 0.2 },
    },
  ],
  speedRanges: [
    { range: '1-5 mph over', count: 124 },
    { range: '6-10 mph over', count: 186 },
    { range: '11-15 mph over', count: 97 },
    { range: '16-20 mph over', count: 54 },
    { range: '20+ mph over', count: 26 },
  ],
  timeDistribution: [
    { time: 'Morning', count: 78 },
    { time: 'Afternoon', count: 112 },
    { time: 'Evening', count: 187 },
    { time: 'Night', count: 110 },
  ],
}
// Road Sign Violation Data
export const roadSignData = {
  sampleVideo:
    'src/inputs/highway.mp4',
  detections: [
    {
      time: 2.3,
      type: 'Road Sign',
      description: 'Stop sign violation',
      confidence: 0.92,
      boundingBox: { x: 0.5, y: 0.4, width: 0.2, height: 0.15 },
    },
    {
      time: 5.1,
      type: 'Road Sign',
      description: 'No entry violation',
      confidence: 0.89,
      boundingBox: { x: 0.3, y: 0.5, width: 0.2, height: 0.15 },
    },
    {
      time: 8.6,
      type: 'Road Sign',
      description: 'No U-turn violation',
      confidence: 0.94,
      boundingBox: { x: 0.6, y: 0.5, width: 0.2, height: 0.15 },
    },
  ],
  signTypeViolations: [
    { name: 'Stop', value: 48 },
    { name: 'Yield', value: 27 },
    { name: 'No Entry', value: 19 },
    { name: 'No U-Turn', value: 15 },
    { name: 'No Parking', value: 14 },
  ],
  locationDistribution: [
    { location: 'Urban', count: 67 },
    { location: 'Suburban', count: 34 },
    { location: 'Rural', count: 22 },
  ],
}
// Accident Fraud Data
export const accidentFraudData = {
  vehicles: [
    {
      id: 'VEH001',
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
      fraudScore: 0.87,
      anomalies: [
        'Inconsistent damage pattern',
        'Multiple prior claims',
        'Acceleration data anomaly',
      ],
      historyFlags: 3,
      videoEvidence:
        'https://assets.mixkit.co/videos/preview/mixkit-car-driving-on-the-road-on-a-sunny-day-43123-large.mp4',
    },
    {
      id: 'VEH002',
      make: 'Honda',
      model: 'Accord',
      year: 2020,
      fraudScore: 0.23,
      anomalies: ['No anomalies detected'],
      historyFlags: 0,
      videoEvidence:
        'https://assets.mixkit.co/videos/preview/mixkit-driving-through-a-city-at-night-1740-large.mp4',
    },
    {
      id: 'VEH003',
      make: 'Ford',
      model: 'F-150',
      year: 2018,
      fraudScore: 0.65,
      anomalies: ['Unusual braking pattern', 'Inconsistent witness statements'],
      historyFlags: 1,
      videoEvidence:
        'https://assets.mixkit.co/videos/preview/mixkit-pov-of-a-basket-of-easter-eggs-in-a-car-43125-large.mp4',
    },
  ],
  fraudFactors: [
    { factor: 'Damage Inconsistency', weight: 35 },
    { factor: 'Prior Claims History', weight: 25 },
    { factor: 'Witness Statements', weight: 15 },
    { factor: 'Vehicle Data', weight: 15 },
    { factor: 'Video Analysis', weight: 10 },
  ],
  fraudTrends: [
    { month: 'Jan', count: 8 },
    { month: 'Feb', count: 6 },
    { month: 'Mar', count: 9 },
    { month: 'Apr', count: 12 },
    { month: 'May', count: 10 },
    { month: 'Jun', count: 14 },
    { month: 'Jul', count: 18 },
    { month: 'Aug', count: 15 },
    { month: 'Sep', count: 11 },
    { month: 'Oct', count: 9 },
    { month: 'Nov', count: 7 },
    { month: 'Dec', count: 5 },
  ],
}
// System Analysis Data
export const systemAnalysisData = {
  modulePerformance: [
    { module: 'Accident Detection', accuracy: 94.7, processingTime: 1.2 },
    { module: 'Accident Fraud', accuracy: 89.3, processingTime: 2.8 },
    { module: 'Lane Violation', accuracy: 92.5, processingTime: 0.9 },
    { module: 'Traffic Light', accuracy: 95.1, processingTime: 1.1 },
    { module: 'Speed Violation', accuracy: 97.2, processingTime: 0.7 },
    { module: 'Road Sign', accuracy: 91.8, processingTime: 1.0 },
  ],
  processingSteps: [
    { step: 'Video Intake', timePercent: 5 },
    { step: 'Pre-processing', timePercent: 15 },
    { step: 'Object Detection', timePercent: 30 },
    { step: 'Violation Analysis', timePercent: 35 },
    { step: 'Report Generation', timePercent: 15 },
  ],
  systemUptime: [
    { day: 'Monday', uptime: 99.8 },
    { day: 'Tuesday', uptime: 99.9 },
    { day: 'Wednesday', uptime: 100 },
    { day: 'Thursday', uptime: 99.7 },
    { day: 'Friday', uptime: 99.8 },
    { day: 'Saturday', uptime: 99.9 },
    { day: 'Sunday', uptime: 100 },
  ],
}

// U-Turn Detection Data
export const uTurnDetectionData = {
  sampleVideo: 'src/inputs/uturn_output.mp4',
  summary: {
    total_vehicles: 20,
    total_u_turns: 1,
  },
  uturns: [
    {
      vehicle_id: 4,
      plate_number: '301 - 8846',
      angle: 180.0,
      timestamp: '0:09',
    },
  ],
}
