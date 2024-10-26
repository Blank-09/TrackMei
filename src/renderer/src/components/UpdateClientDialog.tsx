import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { UpdateClientForm } from '@/pages/UpdateClientForm'
import { SquarePenIcon } from 'lucide-react'

export function UpdateClientDialog({ clientId }) {
  console.log('Client ID:', clientId)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' className=' text-white '>
          Update Client
          <SquarePenIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-[625px]'>
        <UpdateClientForm clientId={clientId} />
      </DialogContent>
    </Dialog>
  )
}
