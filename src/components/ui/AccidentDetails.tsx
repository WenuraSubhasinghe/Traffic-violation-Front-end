import React from 'react';

type AccidentDetailsProps = {
  detections?: any[];
  collisions?: any[];
  accidents?: any[];
};

export function AccidentDetails({
  detections = [],
  collisions = [],
  accidents = [],
}: AccidentDetailsProps) {
  return (
    <div className="space-y-4">
      {/* Detections */}
      {detections.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Vehicle Detections
          </h4>
          <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            {detections.map((d, idx) => (
              <li key={idx} className="border-b last:border-b-0 pb-1">
                <span className="font-medium text-gray-800 dark:text-gray-100">
                  BBox:
                </span>{' '}
                {JSON.stringify(d.bbox)} | Confidence:{' '}
                {(d.confidence * 100).toFixed(1)}%
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Collisions */}
      {collisions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Possible Collisions
          </h4>
          <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            {collisions.map((c, idx) => (
              <li key={idx} className="border-b last:border-b-0 pb-1">
                <span className="font-medium text-gray-800 dark:text-gray-100">
                  Track IDs:
                </span>{' '}
                {c.track_ids[0]} & {c.track_ids[1]}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Accidents */}
      {accidents.length > 0 && (
  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
      Accident Confirmations
    </h4>
    {accidents.map((a, idx) => (
      <div
        key={idx}
        className={`p-3 mb-3 rounded-lg border-l-4 ${
          a.is_accident
            ? 'border-red-500 bg-red-50 dark:bg-green-900/30'
            : 'border-green-500 bg-green-50 dark:bg-green-900/30'
        }`}
      >
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          <strong>Status:</strong>{' '}
          <span className={a.is_accident ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
            {a.is_accident ? 'Accident Detected' : 'No Accident'}
          </span>
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong>Confidence:</strong> {(a.confidence * 100).toFixed(1)}%
        </p>
        {a.bbox && (
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Bounding Box:</strong> {JSON.stringify(a.bbox)}
          </p>
        )}
      </div>
    ))}
  </div>
)}

      {detections.length === 0 && collisions.length === 0 && accidents.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">No accident-related data found.</p>
      )}
    </div>
  );
}