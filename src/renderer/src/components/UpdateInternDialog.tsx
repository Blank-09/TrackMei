import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { InternUpdateForm } from '@/pages/InternUpdateForm'
import { SquarePenIcon } from 'lucide-react'

export function UpdateInternDialog({ intern_id }) {
  console.log('Intern Id: ', intern_id)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' className=' text-white '>
          Update Intern
          <SquarePenIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-[625px]'>
        <InternUpdateForm intern_id={intern_id} />
      </DialogContent>
    </Dialog>
  )
}
