import { Input } from '@/components/ui/input'

export function TransactionSearch() {
  return (
    <div>
      <Input type='search' placeholder='Search...' className='md:w-[100px] lg:w-[300px]' />
    </div>
  )
}
