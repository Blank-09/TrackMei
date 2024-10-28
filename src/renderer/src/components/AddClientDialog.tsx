import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { ClientAddForm } from '@/pages/AddClientForm'
import { UserRoundPlusIcon } from 'lucide-react'

export function AddClientDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='bg-white text-black'>
          Add Client
          <UserRoundPlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-[625px]'>
        <ClientAddForm />
      </DialogContent>
    </Dialog>
  )
}
