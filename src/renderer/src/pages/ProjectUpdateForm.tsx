import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { DialogClose } from '@/components/ui/dialog'

// Define form schema
const formSchema = z.object({
  project_title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  categories: z.enum(['Web development', 'mobile development', 'design', 'Project Management']),
  project_description: z.string().min(5, { message: 'Description must be at least 5 characters.' }),
  project_start_date: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: 'Start date must be a valid date.',
  }),
  project_due_date: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: 'Due date must be a valid date.',
  }),
  // client_id: z
  //   .string()
  //   .transform((val) => Number(val)) // Convert string input to number
  //   .refine((val) => !isNaN(val) && val > 0, { message: 'Client Id Must be Provide' }),
  project_price: z.number().min(1, { message: 'Price must be a positive number.' }),
  payment_options: z.enum(['monthly', 'yearly']),
  project_status: z.enum(['completed', 'in progress', 'not started']),
})

export function ProjectUpdateForm({ project_id }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_title: '',
      // client_id: '',
      categories: '',
      project_description: '',
      project_start_date: '',
      project_due_date: '',
      project_price: '',
      payment_options: '',
      project_status: '',
    },
  })

  useEffect(() => {
    const fetchProjectData = async () => {
      console.log('Fetching project data for ID:', project_id)
      try {
        const project = await window.electron.ipcRenderer.invoke(
          'projectdetails:getById',
          project_id,
        )
        console.log('Project data received:', project)
        if (project) {
          form.reset({
            project_title: project.project_title,
            // client_id: project.client_id,
            categories: project.categories,
            project_description: project.project_description,
            project_start_date: new Date(project.project_start_date).toISOString().split('T')[0],
            project_due_date: new Date(project.project_due_date).toISOString().split('T')[0],
            project_price: project.project_price,
            payment_options: project.payment_options,
            project_status: project.project_status,
          })
        } else {
          console.error('No project found for the given ID')
        }
      } catch (e) {
        console.error('Error Fetching Project Update details:', e)
      }
    }

    if (project_id) {
      fetchProjectData()
    } else {
      console.warn('No ProjectId Provided')
    }
  }, [project_id, form])

  const onSubmit = async (data) => {
    console.log('Form data:', data)
    try {
      const response = await window.electron.ipcRenderer.invoke('projectdetails:update', {
        ...data,
        project_id,
      })
      if (response) {
        form.reset()
        setTimeout(() => {
          window.location.reload()
        }, 1000)
        toast.success('Project Updated Successfully')
      } else {
        toast.error('Project Update Failed')
      }
    } catch (error) {
      console.error('Update project failed: ', error)
      toast.error('Error updating project')
    }
  }

  return (
    <div className='flex justify-center items-center'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-2 w-full p-2 shadow-md rounded'
        >
          <h1 className='text-center text-xl'>Project Details</h1>

          <FormField
            control={form.control}
            name='project_title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Title</FormLabel>
                <FormControl>
                  <Input placeholder='Enter project title' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name='client_id'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Id</FormLabel>
                <FormControl>
                  <Input placeholder='Enter Client Id' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <FormField
            control={form.control}
            name='categories'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Web development'>Web development</SelectItem>
                    <SelectItem value='mobile development'>Mobile development</SelectItem>
                    <SelectItem value='design'>Design</SelectItem>
                    <SelectItem value='Project Management'>Project Management</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='project_description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Description</FormLabel>
                <FormControl>
                  <Input placeholder='Enter project description' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='project_start_date'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Start Date</FormLabel>
                <FormControl>
                  <Input type='date' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='project_due_date'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Due Date</FormLabel>
                <FormControl>
                  <Input type='date' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='project_price'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Price</FormLabel>
                <FormControl>
                  <Input type='number' placeholder='Enter project price' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='payment_options'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Options</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select payment option' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='monthly'>Monthly</SelectItem>
                    <SelectItem value='yearly'>Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='project_status'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select project status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='completed'>Completed</SelectItem>
                    <SelectItem value='in progress'>In Progress</SelectItem>
                    <SelectItem value='not started'>Not Started</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogClose>
            <Button type='submit' className='w-full'>
              Update
            </Button>
          </DialogClose>
        </form>
      </Form>
    </div>
  )
}
