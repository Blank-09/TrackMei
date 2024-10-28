import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { ProjectUpdateForm } from '@/pages/ProjectUpdateForm'
import { SquarePenIcon } from 'lucide-react'

export function UpdateProjectDialog({ project_id }) {
  console.log('Project Id: ', project_id)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' className=' text-white '>
          Update Project
          <SquarePenIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-[625px]'>
        <ProjectUpdateForm project_id={project_id} />
      </DialogContent>
    </Dialog>
  )
}
