export interface VehicleData {
  speeds: number[];
  speed_violations: number[];
  red_light_violations: number[];
  lane_violations: number[];
}

export interface FraudDetectionInput {
  vehicles: VehicleData[];
  area_type: string;
  speed_limit: number;
}

export const sampleScenarios: { [key: string]: FraudDetectionInput } = {
  two_vehicle_fraudulent: {
    vehicles: [
      {
        speeds: [45, 65, 70, 55, 75, 60, 80, 45, 85, 50],
        speed_violations: [0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
        red_light_violations: [0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
        lane_violations: [0, 1, 0, 1, 0, 1, 1, 0, 1, 0],
      },
      {
        speeds: [48, 52, 50, 47, 53, 49, 51, 48, 50, 52],
        speed_violations: [0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
        red_light_violations: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        lane_violations: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
    area_type: 'urban',
    speed_limit: 50,
  },
  three_vehicle_mixed: {
    vehicles: [
      {
        speeds: [40, 75, 80, 35, 90, 85, 45, 95, 40, 88],
        speed_violations: [0, 1, 1, 0, 1, 1, 0, 1, 0, 1],
        red_light_violations: [0, 1, 0, 0, 1, 0, 0, 1, 0, 0],
        lane_violations: [0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
      },
      {
        speeds: [55, 58, 62, 54, 59, 61, 56, 60, 57, 58],
        speed_violations: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        red_light_violations: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        lane_violations: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        speeds: [48, 52, 50, 47, 53, 49, 51, 48, 50, 52],
        speed_violations: [0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
        red_light_violations: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        lane_violations: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
    area_type: 'urban',
    speed_limit: 50,
  },
  highway_accident: {
    vehicles: [
      {
        speeds: [95, 98, 102, 96, 101, 99, 97, 103, 98, 100],
        speed_violations: [0, 0, 1, 0, 1, 0, 0, 1, 0, 0],
        red_light_violations: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        lane_violations: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        speeds: [100, 125, 130, 85, 140, 120, 110, 135, 90, 128],
        speed_violations: [0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        red_light_violations: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        lane_violations: [0, 1, 1, 1, 0, 1, 0, 1, 1, 0],
      },
    ],
    area_type: 'highway',
    speed_limit: 100,
  },
};