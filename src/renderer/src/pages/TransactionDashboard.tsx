// import { Metadata } from "next"
// import Image from "next/image"

import { TransactionMainNav } from '@/components/transactiondashboard/TransactionMainNav'
import { TransactionOverview } from '@/components/transactiondashboard/TransactionOverview'
import { TransactionSearch } from '@/components/transactiondashboard/TransactionSearch'
import TransactionTeamSwitcher from '@/components/transactiondashboard/TransactionTeamSwitch'
import { TransactionUserNav } from '@/components/transactiondashboard/TransactionUserNav'
import { TransactionRecent } from '@/components/transactiondashboard/TranscationRecent'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { useEffect, useState } from 'react'
import CountUp from 'react-countup'
// import { CalendarDateRangePicker } from "@/app/(app)/examples/dashboard/components/date-range-picker"

// export const metadata: Metadata = {
//   title: "Dashboard",
//   description: "Example dashboard app built using the components.",
// }

type Transaction = {
  paidamount: number
}

export default function TransactionDashboard() {
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [totalIncome, setTotalIncome] = useState(0)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await window.electron.ipcRenderer.invoke('transaction:getAll')
        setTotalTransactions(response.length)
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
            <TransactionTeamSwitcher />
            <TransactionMainNav className='mx-6' />
            <div className='ml-auto flex items-center space-x-4'>
              <TransactionSearch />
              <TransactionUserNav />
            </div>
          </div>
        </div>
        <div className='flex-1 space-y-8 p-8 pt-6'>
          <div className='flex items-center justify-between space-y-6'>
            <h2 className='text-3xl font-bold tracking-tight'>Transaction Dashboard</h2>
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
                    <CardTitle className='text-sm font-medium'>Total Transaction's</CardTitle>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='skyblue'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      className='lucide lucide-chevrons-left-right-ellipsis'
                    >
                      <path d='m18 8 4 4-4 4' />
                      <path d='m6 8-4 4 4 4' />
                      <path d='M8 12h.01' />
                      <path d='M12 12h.01' />
                      <path d='M16 12h.01' />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      <CountUp end={totalTransactions} duration={2} />+
                    </div>
                    <p className='text-xs text-muted-foreground'>+20.1% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Total Revenue </CardTitle>
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
                      className='lucide lucide-hand-coins'
                    >
                      <path d='M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17' />
                      <path d='m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9' />
                      <path d='m2 16 6 6' />
                      <circle cx='16' cy='9' r='2.9' />
                      <circle cx='6' cy='5' r='3' />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      ₹<CountUp end={totalIncome} duration={2} />
                    </div>
                    <p className='text-xs text-muted-foreground'>+180.1% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Income</CardTitle>
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
                      className='lucide lucide-arrow-left'
                    >
                      <path d='m12 19-7-7 7-7' />
                      <path d='M19 12H5' />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      ₹<CountUp end={7421} duration={2} />
                    </div>
                    <p className='text-xs text-muted-foreground'>+19% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Outcome</CardTitle>
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
                      className='lucide lucide-arrow-right'
                    >
                      <path d='M5 12h14' />
                      <path d='m12 5 7 7-7 7' />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      ₹<CountUp end={4600} duration={2} />
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
                    <TransactionOverview />
                  </CardContent>
                </Card>
                <Card className='col-span-3'>
                  <CardHeader>
                    <CardTitle>Recent Transaction's</CardTitle>
                    <CardDescription>You did 65 Transaction's this week.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TransactionRecent />
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
