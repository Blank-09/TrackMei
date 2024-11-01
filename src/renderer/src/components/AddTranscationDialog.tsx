import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { TranscationAddForm } from '@/pages/TranscationAddForm'
import { Settings2 } from 'lucide-react'

export function AddTranscationDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='bg-white text-black'>
          Add Transcation
          <Settings2 />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-[625px]'>
        <TranscationAddForm />
      </DialogContent>
    </Dialog>
  )
}
