import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { UploadIcon, DownloadIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { FraudDetectionInput, sampleScenarios } from '../utils/util';

export function AccidentFraudDetection() {
  const [inputData, setInputData] = useState<FraudDetectionInput>({
    vehicles: [
      {
        speeds: Array(10).fill(0),
        speed_violations: Array(10).fill(0),
        red_light_violations: Array(10).fill(0),
        lane_violations: Array(10).fill(0),
      },
    ],
    area_type: 'urban',
    speed_limit: 50,
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [fraudResult, setFraudResult] = useState<any>(null);
  const [inputErrors, setInputErrors] = useState<{ [key: string]: string }>({});
  const [vehicleInputStrings, setVehicleInputStrings] = useState<string[][]>(
  inputData.vehicles.map(vehicle => [
    vehicle.speeds.join(','),
    vehicle.speed_violations.join(','),
    vehicle.red_light_violations.join(','),
    vehicle.lane_violations.join(','),
  ])
);

  const handleAddVehicle = () => {
    if (inputData.vehicles.length < 4) {
      setInputData({
        ...inputData,
        vehicles: [
          ...inputData.vehicles,
          {
            speeds: Array(10).fill(0),
            speed_violations: Array(10).fill(0),
            red_light_violations: Array(10).fill(0),
            lane_violations: Array(10).fill(0),
          },
        ],
      });
    }
  };

  const handleRemoveVehicle = (index: number) => {
    if (inputData.vehicles.length > 1) {
      setInputData({
        ...inputData,
        vehicles: inputData.vehicles.filter((_, i) => i !== index),
      });
    }
  };

  const handleVehicleInputChange = (
    vehicleIndex: number,
    field: keyof FraudDetectionInput['vehicles'][0],
    value: string
  ) => {
    // Update the raw string input
    setVehicleInputStrings(prev => {
      const updated = [...prev];
      const fieldIdx = ['speeds', 'speed_violations', 'red_light_violations', 'lane_violations'].indexOf(field);
      if (fieldIdx !== -1) {
        updated[vehicleIndex] = [...updated[vehicleIndex]];
        updated[vehicleIndex][fieldIdx] = value;
      }
      return updated;
    });

    const values = value
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v !== '');

    // Validate input length
    if (values.length !== 10) {
      setInputErrors({
        ...inputErrors,
        [`${vehicleIndex}_${field}`]: 'Exactly 10 values required',
      });
      return;
    }

    let parsedValues: number[];
    if (field === 'speeds') {
      parsedValues = values.map((v) => parseFloat(v));
      if (parsedValues.some((v) => isNaN(v) || v < 0)) {
        setInputErrors({
          ...inputErrors,
          [`${vehicleIndex}_${field}`]: 'Speeds must be non-negative numbers',
        });
        return;
      }
    } else {
      parsedValues = values.map((v) => parseInt(v));
      if (parsedValues.some((v) => v !== 0 && v !== 1)) {
        setInputErrors({
          ...inputErrors,
          [`${vehicleIndex}_${field}`]: 'Violations must be 0 or 1',
        });
        return;
      }
    }

  // Clear error for this field
  setInputErrors((prev) => {
    const newErrors = { ...prev };
    delete newErrors[`${vehicleIndex}_${field}`];
    return newErrors;
  });

  const newVehicles = [...inputData.vehicles];
  newVehicles[vehicleIndex] = {
    ...newVehicles[vehicleIndex],
    [field]: parsedValues,
  };
  setInputData({ ...inputData, vehicles: newVehicles });
};

  const handleScenarioSelect = (scenarioKey: string) => {
  const scenario = sampleScenarios[scenarioKey];
  setInputData(scenario);
  setFraudResult(null);
  setAnalysisComplete(false);
  setInputErrors({});
  setVehicleInputStrings(
    scenario.vehicles.map(vehicle => [
      vehicle.speeds.join(','),
      vehicle.speed_violations.join(','),
      vehicle.red_light_violations.join(','),
      vehicle.lane_violations.join(','),
    ])
  );
};

  const handleInputChange = (field: 'area_type' | 'speed_limit', value: string) => {
    setInputData({
      ...inputData,
      [field]: field === 'speed_limit' ? parseFloat(value) || 0 : value,
    });
  };

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);

    try {
      const res = await fetch('http://127.0.0.1:8000/fraud/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setFraudResult(data);
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }
  };

  const isFormValid = () => {
    return (
      inputData.vehicles.length > 0 &&
      inputData.vehicles.every(
        (vehicle) =>
          vehicle.speeds.length === 10 &&
          vehicle.speeds.every((v) => v >= 0) &&
          vehicle.speed_violations.length === 10 &&
          vehicle.speed_violations.every((v) => v === 0 || v === 1) &&
          vehicle.red_light_violations.length === 10 &&
          vehicle.red_light_violations.every((v) => v === 0 || v === 1) &&
          vehicle.lane_violations.length === 10 &&
          vehicle.lane_violations.every((v) => v === 0 || v === 1)
      ) &&
      ['urban', 'highway', 'residential', 'expressway'].includes(inputData.area_type) &&
      inputData.speed_limit > 0 &&
      Object.keys(inputErrors).length === 0
    );
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Accident Fraud Detection
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

      {/* Input Section */}
      <Card title="Enter Accident Details" className="mb-6">
        <div className="space-y-4">
          {/* Scenario Selection */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Load Sample Scenario
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleScenarioSelect('two_vehicle_fraudulent')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-3 py-1 rounded-lg text-sm"
              >
                Two Vehicles (One Fraudulent)
              </button>
              <button
                onClick={() => handleScenarioSelect('three_vehicle_mixed')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-3 py-1 rounded-lg text-sm"
              >
                Three Vehicles (Mixed)
              </button>
              <button
                onClick={() => handleScenarioSelect('highway_accident')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-3 py-1 rounded-lg text-sm"
              >
                Highway Accident
              </button>
            </div>
          </div>

          {/* Area Type and Speed Limit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Area Type
              </label>
              <select
                value={inputData.area_type}
                onChange={(e) => handleInputChange('area_type', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              >
                <option value="urban">Urban</option>
                <option value="highway">Highway</option>
                <option value="residential">Residential</option>
                <option value="expressway">Expressway</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Speed Limit (km/h)
              </label>
              <input
                type="number"
                value={inputData.speed_limit}
                onChange={(e) => handleInputChange('speed_limit', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                min="0"
              />
            </div>
          </div>

          {/* Vehicle Inputs */}
          {inputData.vehicles.map((vehicle, vehicleIndex) => (
            <div key={vehicleIndex} className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Vehicle {vehicleIndex + 1}
                </h4>
                {inputData.vehicles.length > 1 && (
                  <button
                    onClick={() => handleRemoveVehicle(vehicleIndex)}
                    className="text-red-600 hover:text-red-800 flex items-center"
                  >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Speeds (10 values, km/h)
                  </label>
                  <input
                    type="text"
                    value={vehicleInputStrings[vehicleIndex]?.[0] ?? vehicle.speeds.join(',')}
                    onChange={(e) =>
                      handleVehicleInputChange(vehicleIndex, 'speeds', e.target.value)
                    }
                    placeholder="e.g., 45,65,70,55,75,60,80,45,85,50"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                  {inputErrors[`${vehicleIndex}_speeds`] && (
                    <p className="text-red-600 text-xs mt-1">{inputErrors[`${vehicleIndex}_speeds`]}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Speed Violations (10 values, 0 or 1)
                  </label>
                  <input
                    type="text"
                    value={vehicleInputStrings[vehicleIndex]?.[1] ?? vehicle.speed_violations.join(',')}
                    onChange={(e) =>
                      handleVehicleInputChange(vehicleIndex, 'speed_violations', e.target.value)
                    }
                    placeholder="e.g., 0,1,1,1,1,1,1,0,1,0"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                  {inputErrors[`${vehicleIndex}_speed_violations`] && (
                    <p className="text-red-600 text-xs mt-1">{inputErrors[`${vehicleIndex}_speed_violations`]}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Red Light Violations (10 values, 0 or 1)
                  </label>
                  <input
                    type="text"
                    value={vehicleInputStrings[vehicleIndex]?.[2] ?? vehicle.red_light_violations.join(',')}
                    onChange={(e) =>
                      handleVehicleInputChange(vehicleIndex, 'red_light_violations', e.target.value)
                    }
                    placeholder="e.g., 0,0,1,0,0,1,0,0,0,0"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                  {inputErrors[`${vehicleIndex}_red_light_violations`] && (
                    <p className="text-red-600 text-xs mt-1">{inputErrors[`${vehicleIndex}_red_light_violations`]}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Lane Violations (10 values, 0 or 1)
                  </label>
                  <input
                    type="text"
                    value={vehicleInputStrings[vehicleIndex]?.[3] ?? vehicle.lane_violations.join(',')}
                    onChange={(e) =>
                      handleVehicleInputChange(vehicleIndex, 'lane_violations', e.target.value)
                    }
                    placeholder="e.g., 0,1,0,1,0,1,1,0,1,0"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                  {inputErrors[`${vehicleIndex}_lane_violations`] && (
                    <p className="text-red-600 text-xs mt-1">{inputErrors[`${vehicleIndex}_lane_violations`]}</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add Vehicle Button */}
          {inputData.vehicles.length < 4 && (
            <button
              onClick={handleAddVehicle}
              className="flex items-center px-4 py-2 mt-4 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Vehicle
            </button>
          )}

          {/* Analyze Button */}
          <div className="flex justify-end">
            <button
              onClick={startAnalysis}
              disabled={!isFormValid() || isAnalyzing}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                !isFormValid() || isAnalyzing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <UploadIcon className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Data'}
            </button>
          </div>
        </div>
      </Card>

      {/* Analysis Section */}
      {(isAnalyzing || analysisComplete) && (
        <div className="space-y-6">
          {isAnalyzing && (
            <Card>
              <div className="flex flex-col items-center justify-center py-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-700 dark:text-gray-300">
                  Analyzing data for fraud patterns...
                </p>
              </div>
            </Card>
          )}

          {analysisComplete && fraudResult && (
            <Card title="Analysis Results">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Fraud Detection Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Vehicle Analysis
                      </h4>
                      <div className="space-y-2">
                        {fraudResult.vehicle_predictions.map((vehicle: any) => (
                          <div key={vehicle.vehicle_id} className="border-b pb-2">
                            <div className="flex justify-between">
                              <span className="text-gray-700 dark:text-gray-300">
                                Vehicle {vehicle.vehicle_id} Fraud Probability:
                              </span>
                              <span
                                className={`font-medium ${
                                  vehicle.is_fraudulent
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-green-600 dark:text-green-400'
                                }`}
                              >
                                {(vehicle.fraud_probability * 100).toFixed(2)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-700 dark:text-gray-300">
                                Confidence:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {(vehicle.confidence * 100).toFixed(2)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-700 dark:text-gray-300">
                                Average Speed:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {vehicle.avg_speed.toFixed(1)} km/h
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-700 dark:text-gray-300">
                                Total Violations:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {vehicle.total_violations}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                        Most Suspicious Vehicle
                      </h4>
                      <p className="text-yellow-700 dark:text-yellow-300">
                        {fraudResult.most_fraudulent_vehicle || 'None'}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Accident Details
                      </h4>
                      <div className="flex justify-between">
                        <span className="text-gray-700 dark:text-gray-300">
                          Area Type:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {fraudResult.area_type}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 dark:text-gray-300">
                          Speed Limit:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {fraudResult.speed_limit} km/h
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 dark:text-gray-300">
                          Number of Vehicles:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {fraudResult.num_vehicles}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}