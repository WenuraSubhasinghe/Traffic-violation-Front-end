import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { MenuIcon, UserIcon, BellIcon, SunIcon, MoonIcon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
type HeaderProps = {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}
export function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const { isDarkMode, toggleTheme } = useTheme()
  const location = useLocation()
  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x)
    if (pathnames.length === 0) {
      return [
        {
          name: 'Dashboard',
          path: '/',
        },
      ]
    }
    return [
      {
        name: 'Dashboard',
        path: '/',
      },
      ...pathnames.map((value, index) => {
        const path = `/${pathnames.slice(0, index + 1).join('/')}`
        return {
          name: value
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
          path,
        }
      }),
    ]
  }
  const breadcrumbs = generateBreadcrumbs()
  return (
    <header className="z-30 py-4 bg-white shadow-md dark:bg-gray-800 transition-colors duration-300">
      <div className="container flex items-center justify-between h-full px-6 mx-auto">
        {/* Mobile hamburger */}
        <button
          className="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Menu"
        >
          <MenuIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>
        {/* Breadcrumbs */}
        <div className="hidden md:flex">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              {breadcrumbs.map((breadcrumb, index) => (
                <li key={breadcrumb.path} className="inline-flex items-center">
                  {index > 0 && (
                    <span className="mx-2 text-gray-500 dark:text-gray-400">
                      /
                    </span>
                  )}
                  <Link
                    to={breadcrumb.path}
                    className={`text-sm font-medium ${index === breadcrumbs.length - 1 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'}`}
                  >
                    {breadcrumb.name}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </div>
        {/* Right side buttons */}
        <div className="flex items-center space-x-4">
          <button
            className="rounded-md focus:outline-none focus:shadow-outline-purple"
            onClick={toggleTheme}
            aria-label="Toggle color mode"
          >
            {isDarkMode ? (
              <SunIcon className="w-5 h-5 text-yellow-400" />
            ) : (
              <MoonIcon className="w-5 h-5 text-gray-700" />
            )}
          </button>
          <button
            className="relative p-2 rounded-full focus:outline-none focus:shadow-outline-purple"
            aria-label="Notifications"
          >
            <BellIcon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button
            className="p-2 rounded-full focus:outline-none focus:shadow-outline-purple"
            aria-label="Account"
          >
            <UserIcon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
        </div>
      </div>
    </header>
  )
}
