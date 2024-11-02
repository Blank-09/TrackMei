import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useEffect, useState } from 'react'
import { Badge } from '../ui/badge'

type Transaction = {
  clientname: string
  payment: string
  paidamount: number
}

const avatarUrl = 'https://avatar.iran.liara.run/public/28'

export function TransactionRecent() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await window.electron.ipcRenderer.invoke('transaction:getAll')
        const transactionData = response.map((transaction: any) => ({
          clientname: transaction.clientname,
          payment: transaction.payment,
          paidamount: transaction.paidamount,
        }))
        setTransactions(transactionData)
        console.log('Transactions:', transactionData)
      } catch (error) {
        console.log('Error fetching transactions:', error)
      }
    }
    fetchTransactions()
  }, [])

  // Get the last 5 transactions
  const topTransactions = transactions.slice(-5).reverse()

  return (
    <div className='space-y-8'>
      {topTransactions.map((transaction, index) => (
        <div key={index} className='flex items-center'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src={avatarUrl} alt='Avatar' />
            <AvatarFallback>
              {transaction.clientname
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className='ml-4 space-y-1'>
            <p className='text-sm font-medium leading-none'>{transaction.clientname}</p>
            <p className='text-sm text-muted-foreground'>₹{transaction.paidamount}</p>
          </div>
          <div className='ml-auto font-medium'>
            <Badge variant='outline'>{transaction.payment}</Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
