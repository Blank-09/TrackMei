// router.tsx
import { createBrowserRouter } from 'react-router-dom'

// Layouts
import DashboardLayout from '@/layouts/DashboardLayout'
import RootLayout from '@/layouts/RootLayout'
import { ClientTable } from '@/pages/ClientTable'
import { ClientAddForm } from '@/pages/AddClientForm'
import { UpdateClientForm } from '@/pages/UpdateClientForm'
import { ProjectTable } from '@/pages/ProjectTable'
import { ProjectAddForm } from '@/pages/ProjectAddForm'
import { ProjectUpdateForm } from '@/pages/ProjectUpdateForm'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        path: 'clientlist',
        element: <ClientTable />, // ClientTable will be rendered inside DashboardLayout
      },
      {
        path: 'clientaddform',
        element: <ClientAddForm />, // ClientTable will be rendered inside DashboardLayout
      },
      {
        path: 'clientupdateform/:clientId',
        element: <UpdateClientForm clientId={':clientId'} />, // UpdateClientForm will be rendered inside DashboardLayout
      },
      {
        path: 'projectlist',
        element: <ProjectTable />,
      },
      {
        path: 'projectaddform',
        element: <ProjectAddForm />,
      },
      {
        path: 'projectupdateform',
        element: <ProjectUpdateForm project_id={':project_id'} />,
      },
    ],
  },
])

export default router
