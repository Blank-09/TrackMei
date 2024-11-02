// import { Metadata } from "next"
// import Image from "next/image"

import { ProjectMainNav } from '@/components/projectdashboard/ProjectMainNav'
import { ProjectOverview } from '@/components/projectdashboard/ProjectOverview'
import { ProjectRecent } from '@/components/projectdashboard/ProjectRecent'
import { ProjectSearch } from '@/components/projectdashboard/ProjectSearch'
import ProjectTeamSwitcher from '@/components/projectdashboard/ProjectTeamSwitch'
import { ProjectUserNav } from '@/components/projectdashboard/ProjectUserNav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { useEffect, useState } from 'react'
import CountUp from 'react-countup'
// import { CalendarDateRangePicker } from "@/app/(app)/examples/dashboard/components/date-range-picker"

// export const metadata: Metadata = {
//   title: "Dashboard",
//   description: "Example dashboard app built using the components.",
// }

type Project = {
  project_status: string
}

export default function ProjectDashboard() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await window.electron.ipcRenderer.invoke('projectdetails:getAll')
        console.log('Projects:', response)
        setProjects(response)
      } catch (error) {
        console.log('Error Fetching in TotalProjectsLength:', error)
      }
    }
    fetchProjects()
  }, [])
  const inProgressCount = projects.filter(
    (project) => project.project_status === 'in progress',
  ).length
  const inCompletedCount = projects.filter(
    (project) => project.project_status === 'completed',
  ).length
  const inNotstartedCount = projects.filter(
    (project) => project.project_status === 'not started',
  ).length
  return (
    <>
      <div className='md:hidden '>
        {/* <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        /> */}
      </div>
      <div className='hidden flex-col md:flex'>
        <div className='border-b'>
          <div className='flex h-16 items-center px-4'>
            <ProjectTeamSwitcher />
            <ProjectMainNav className='mx-6' />
            <div className='ml-auto flex items-center space-x-4'>
              <ProjectSearch />
              <ProjectUserNav />
            </div>
          </div>
        </div>
        <div className='flex-1 space-y-8 p-8 pt-6'>
          <div className='flex items-center justify-between space-y-6'>
            <h2 className='text-3xl font-bold tracking-tight'>Project Dashboard</h2>
            {/* <div className='flex items-center space-x-2'> */}
            {/* <CalendarDateRangePicker /> */}
            {/* <Button>Download</Button> */}
            {/* </div> */}
          </div>
          <Tabs defaultValue='overview' className='space-y-4'>
            {/* <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='Clients' disabled>
                Clients
              </TabsTrigger>
              <TabsTrigger value='Projects' disabled>
                Projects
              </TabsTrigger>
              <TabsTrigger value='Transactions' disabled>
                Transactions
              </TabsTrigger>
            </TabsList> */}
            <TabsContent value='overview' className='space-y-4'>
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Total Projects's</CardTitle>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='yellow'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      className='lucide lucide-monitor-cog'
                    >
                      <path d='M12 17v4' />
                      <path d='m15.2 4.9-.9-.4' />
                      <path d='m15.2 7.1-.9.4' />
                      <path d='m16.9 3.2-.4-.9' />
                      <path d='m16.9 8.8-.4.9' />
                      <path d='m19.5 2.3-.4.9' />
                      <path d='m19.5 9.7-.4-.9' />
                      <path d='m21.7 4.5-.9.4' />
                      <path d='m21.7 7.5-.9-.4' />
                      <path d='M22 13v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7' />
                      <path d='M8 21h8' />
                      <circle cx='18' cy='6' r='3' />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      <CountUp end={projects.length} duration={2} />+
                    </div>
                    <p className='text-xs text-muted-foreground'>+20.1% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>In Progress </CardTitle>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='blue'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      className='lucide lucide-loader'
                    >
                      <path d='M12 2v4' />
                      <path d='m16.2 7.8 2.9-2.9' />
                      <path d='M18 12h4' />
                      <path d='m16.2 16.2 2.9 2.9' />
                      <path d='M12 18v4' />
                      <path d='m4.9 19.1 2.9-2.9' />
                      <path d='M2 12h4' />
                      <path d='m4.9 4.9 2.9 2.9' />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      <CountUp end={inProgressCount} duration={2} />+
                    </div>
                    <p className='text-xs text-muted-foreground'>+180.1% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Completed</CardTitle>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='green'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      className='lucide lucide-circle-check-big'
                    >
                      <path d='M21.801 10A10 10 0 1 1 17 3.335' />
                      <path d='m9 11 3 3L22 4' />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      <CountUp end={inCompletedCount} duration={2} />+
                    </div>
                    <p className='text-xs text-muted-foreground'>+19% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Not Started</CardTitle>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='red'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      className='lucide lucide-circle-pause'
                    >
                      <circle cx='12' cy='12' r='10' />
                      <line x1='10' x2='10' y1='15' y2='9' />
                      <line x1='14' x2='14' y1='15' y2='9' />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      <CountUp end={inNotstartedCount} duration={2} />+
                    </div>
                    <p className='text-xs text-muted-foreground'>+201 since last hour</p>
                  </CardContent>
                </Card>
              </div>
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
                <Card className='col-span-4'>
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className='pl-2'>
                    <ProjectOverview />
                  </CardContent>
                </Card>
                <Card className='col-span-3'>
                  <CardHeader>
                    <CardTitle>Recent Projects</CardTitle>
                    <CardDescription>You Approved 65 projects's this week.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProjectRecent />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
