import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { TranscationUpdateForm } from '@/pages/TranscationUpdateForm'
import { SquarePenIcon } from 'lucide-react'

export function UpdateTranscationDialog({ transid }) {
  console.log('transid ID:', transid)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' className=' text-white '>
          Update Transcation
          <SquarePenIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-[625px]'>
        <TranscationUpdateForm transid={transid} />
      </DialogContent>
    </Dialog>
  )
}
