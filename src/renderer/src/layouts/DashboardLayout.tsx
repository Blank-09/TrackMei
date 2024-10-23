import * as React from 'react'
import { Outlet } from 'react-router-dom'

import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function DashboardLayout(): JSX.Element {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <React.Suspense fallback={<>Error</>}>
          <Outlet />
        </React.Suspense>
      </SidebarInset>
    </SidebarProvider>
  )
}
