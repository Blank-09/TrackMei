import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { InternAddForm } from '@/pages/InternAddForm'
import { NetworkIcon } from 'lucide-react'

export function InternAddDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='bg-white text-black'>
          Add Intern
          <NetworkIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-[625px]'>
        <InternAddForm />
      </DialogContent>
    </Dialog>
  )
}
