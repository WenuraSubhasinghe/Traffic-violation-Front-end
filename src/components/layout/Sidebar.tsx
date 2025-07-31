import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  LineChartIcon,
  ShieldAlertIcon,
  StopCircleIcon,
  GaugeIcon,
  AlertTriangleIcon,
  XIcon,
  BoxIcon,
  RotateCcwIcon,
} from 'lucide-react'
type SidebarProps = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}
export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const location = useLocation()
  const navigation = [
    {
      name: 'Dashboard',
      path: '/',
      icon: HomeIcon,
    },
    {
      name: 'System Analysis',
      path: '/system-analysis',
      icon: LineChartIcon,
    },
    {
      name: 'Accident Detection',
      path: '/accident-detection',
      icon: BoxIcon,
    },
    {
      name: 'Accident Fraud',
      path: '/accident-fraud',
      icon: ShieldAlertIcon,
    },
    {
      name: 'Lane Change Detection',
      path: '/lane-violation',
      icon: BoxIcon,
    },
    {
      name: 'Lane Line Detection',
      path: '/lane-line-detection',
      icon: LineChartIcon,
    },
    {
      name: 'Traffic Light',
      path: '/traffic-light',
      icon: StopCircleIcon,
    },
    {
      name: 'Speed Violation',
      path: '/speed-violation',
      icon: GaugeIcon,
    },
    {
      name: 'Road Sign',
      path: '/road-sign',
      icon: AlertTriangleIcon,
    },
    {
      name: 'U-Turn Detection',
      path: '/u-turn-detection',
      icon: RotateCcwIcon,
    },
  ]
  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-gray-600 bg-opacity-50 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      ></div>
      {/* Sidebar */}
      <aside
        className={`z-50 w-64 h-screen fixed inset-y-0 left-0 overflow-y-auto bg-white dark:bg-gray-800 transition-all duration-300 transform md:translate-x-0 md:relative md:shadow-md ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="py-4 text-gray-500 dark:text-gray-400">
          <div className="flex items-center justify-between px-6">
            <Link
              to="/"
              className="text-lg font-bold text-gray-800 dark:text-gray-200"
            >
              Traffic Violation
              <br />
              Detection System
            </Link>
            <button
              className="p-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple"
              onClick={() => setIsOpen(false)}
            >
              <XIcon className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
          <nav className="mt-6">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-6 py-3 transition-colors duration-200 ${isActive ? 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'}`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  <span className="ml-4">{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}
