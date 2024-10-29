import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { ProjectAddForm } from '@/pages/ProjectAddForm'
import { NetworkIcon } from 'lucide-react'

export function AddProjectDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='bg-white text-black'>
          Add Project
          <NetworkIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-[625px]'>
        <ProjectAddForm />
      </DialogContent>
    </Dialog>
  )
}
