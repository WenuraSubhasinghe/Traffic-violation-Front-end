import React from 'react'
type CardProps = {
  title?: string
  children: React.ReactNode
  className?: string
}
export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`}
    >
      {title && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            {title}
          </h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  )
}
