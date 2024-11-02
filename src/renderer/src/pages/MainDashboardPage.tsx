// import { Metadata } from "next"
// import Image from "next/image"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent } from '@/components/ui/tabs'
// import { CalendarDateRangePicker } from "@/app/(app)/examples/dashboard/components/date-range-picker"
import { DashboardOverview } from '@/components/DashboardOverview'
import { DashboardRecent } from '@/components/DashboardRecent'
import { DashboardMainNav } from '@/components/DashboardMainNav'
import { DashboardSearch } from '@/components/DashboardSearch'
import DashboardTeamSwitcher from '@/components/DashboardTeamSwitcher'
import { DashboardUserNav } from '@/components/DashboardUserNav'
import { useEffect, useState } from 'react'
import CountUp from 'react-countup'

// export const metadata: Metadata = {
//   title: "Dashboard",
//   description: "Example dashboard app built using the components.",
// }

type Project = {
  project_status: string
}
type Transaction = {
  paidamount: number
}

export default function DashboardPage() {
  const [totalClients, setTotalClients] = useState(0)
  const [projects, setProjects] = useState<Project[]>([])
  const [totalIncome, setTotalIncome] = useState(0)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await window.electron.ipcRenderer.invoke('client:getAll')
        setTotalClients(response.length)
      } catch (error) {
        console.log('Error Fetching in TotalClientsLength:', error)
      }
    }
    fetchClients()
  }, [])
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
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await window.electron.ipcRenderer.invoke('transaction:getAll')
        const totalPaidAmount = response.reduce(
          (sum: number, transaction: Transaction) => sum + transaction.paidamount,
          0,
        )
        setTotalIncome(totalPaidAmount)
      } catch (error) {
        console.log('Error Fetching in TotalTransactionsLength:', error)
      }
    }
    fetchTransactions()
  }, [])
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
            <DashboardTeamSwitcher />
            <DashboardMainNav className='mx-6' />
            <div className='ml-auto flex items-center space-x-4'>
              <DashboardSearch />
              <DashboardUserNav />
            </div>
          </div>
        </div>
        <div className='flex-1 space-y-4 p-8 pt-6'>
          <div className='flex items-center justify-between space-y-2'>
            <h2 className='text-3xl font-bold tracking-tight'>Dashboard</h2>
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
                    <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='orange'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      className='lucide lucide-indian-rupee'
                    >
                      <path d='M6 3h12' />
                      <path d='M6 8h12' />
                      <path d='m6 13 8.5 8' />
                      <path d='M6 13h3' />
                      <path d='M9 13c6.667 0 6.667-10 0-10' />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      ₹<CountUp end={totalIncome} duration={2} />
                    </div>
                    <p className='text-xs text-muted-foreground'>+20.1% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Total Client's</CardTitle>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='lime'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      className='lucide lucide-users'
                    >
                      <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                      <circle cx='9' cy='7' r='4' />
                      <path d='M22 21v-2a4 4 0 0 0-3-3.87' />
                      <path d='M16 3.13a4 4 0 0 1 0 7.75' />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      <CountUp end={totalClients} duration={2} />+
                    </div>
                    <p className='text-xs text-muted-foreground'>+180.1% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Total Projects</CardTitle>
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
                      className='lucide lucide-network'
                    >
                      <rect x='16' y='16' width='6' height='6' rx='1' />
                      <rect x='2' y='16' width='6' height='6' rx='1' />
                      <rect x='9' y='2' width='6' height='6' rx='1' />
                      <path d='M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3' />
                      <path d='M12 12V8' />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      <CountUp end={projects.length} duration={2} />+
                    </div>
                    <p className='text-xs text-muted-foreground'>+19% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Total Intern's</CardTitle>
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
                      className='lucide lucide-user-cog'
                    >
                      <circle cx='18' cy='15' r='3' />
                      <circle cx='9' cy='7' r='4' />
                      <path d='M10 15H6a4 4 0 0 0-4 4v2' />
                      <path d='m21.7 16.4-.9-.3' />
                      <path d='m15.2 13.9-.9-.3' />
                      <path d='m16.6 18.7.3-.9' />
                      <path d='m19.1 12.2.3-.9' />
                      <path d='m19.6 18.7-.4-1' />
                      <path d='m16.8 12.3-.4-1' />
                      <path d='m14.3 16.6 1-.4' />
                      <path d='m20.7 13.8 1-.4' />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>+573</div>
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
                    <DashboardOverview />
                  </CardContent>
                </Card>
                <Card className='col-span-3'>
                  <CardHeader>
                    <CardTitle>Recent Transaction</CardTitle>
                    <CardDescription>You made 23 Transaction this week.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DashboardRecent />
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
