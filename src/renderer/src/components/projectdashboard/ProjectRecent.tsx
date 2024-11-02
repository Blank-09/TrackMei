import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'

type Project = {
  project_title: string
  clientname: string
  categories: string
}

const avatarUrl = 'https://avatar.iran.liara.run/public/28'

export function ProjectRecent() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await window.electron.ipcRenderer.invoke('projectdetails:getAll')
        const projectData = response.map((project: any) => ({
          project_title: project.project_title,
          clientname: project.clientname,
          categories: project.categories,
        }))
        setProjects(projectData)
        console.log('Projects:', projectData)
      } catch (error) {
        console.log('Error fetching projects:', error)
      }
    }
    fetchProjects()
  }, [])

  // Get the last 5 projects
  const topProjects = projects.slice(-5).reverse()

  return (
    <div className='space-y-8'>
      {topProjects.map((project, index) => (
        <div key={index} className='flex items-center'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src={avatarUrl} alt='Avatar' />
            <AvatarFallback>
              {project.clientname
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className='ml-4 space-y-1'>
            <p className='text-sm font-medium leading-none'>
              Project Title : {project.project_title}
            </p>
            <p className='text-sm text-muted-foreground'>Client Name : {project.clientname}</p>
          </div>
          <div className='ml-auto font-medium'>
            <Badge variant='outline'>{project.categories}</Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
