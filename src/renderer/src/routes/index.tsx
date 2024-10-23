import { createBrowserRouter } from 'react-router-dom'

// Layouts
import DashboardLayout from '@/layouts/DashboardLayout'
import RootLayout from '@/layouts/RootLayout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
  },
])

export default router
