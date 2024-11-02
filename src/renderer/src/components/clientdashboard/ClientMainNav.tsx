import { Link } from 'react-router-dom'

import { cn } from '@/lib/utils'

export function ClientMainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
      <Link
        to='/dashboard/maindashboard'
        className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
      >
        Overview
      </Link>
      <Link
        to='/dashboard/clientdashboard'
        className='text-sm font-medium  transition-colors hover:text-primary'
      >
        Clients
      </Link>
      <Link
        to='/dashboard/projectdashboard'
        className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
      >
        Projects
      </Link>
      <Link
        to='/dashboard/transactiondashboard'
        className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
      >
        Transactions
      </Link>
    </nav>
  )
}
