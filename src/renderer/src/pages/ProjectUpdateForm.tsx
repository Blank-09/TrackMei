'use client'

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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { DialogClose } from '@/components/ui/dialog'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  clientname: z.string().min(1, { message: 'Client name must be at least 2 characters.' }),
  project_price: z.number().min(1, { message: 'Price must be a positive number.' }),
  payment_options: z.enum(['monthly', 'yearly']),
  project_status: z.enum(['completed', 'in progress', 'not started']),
})

export function ProjectUpdateForm({ project_id }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [clients, setClients] = useState<{ client_id: number; owner_name: string }[]>([])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_title: '',
      clientname: '',
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
    const fetchClients = async () => {
      try {
        const response = await window.electron.ipcRenderer.invoke('client:getAll')
        console.log(response)
        setClients(response)
      } catch (error) {
        console.error('Error fetching clients:', error)
        toast.error('Error fetching clients')
      }
    }

    fetchClients()
  }, [])

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
            clientname: project.clientname,
            categories: project.categories,
            project_description: project.project_description,
            project_start_date: new Date(project.project_start_date).toISOString().split('T')[0],
            project_due_date: new Date(project.project_due_date).toISOString().split('T')[0],
            project_price: project.project_price,
            payment_options: project.payment_options,
            project_status: project.project_status,
          })
          setValue(project.clientname) // Set the value to the clientname
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

          <FormField
            control={form.control}
            name='clientname'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      role='combobox'
                      aria-expanded={open}
                      className='justify-between w-full'
                    >
                      {value || 'Select Client Name...'}
                      <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-[200px] p-0'>
                    <Command>
                      <CommandInput placeholder='Search Client Name...' />
                      <CommandList>
                        <CommandEmpty>No Client Name found.</CommandEmpty>
                        <CommandGroup>
                          {clients.map(
                            (client) =>
                              client && (
                                <CommandItem
                                  key={client.client_id}
                                  value={client.owner_name}
                                  onSelect={(currentValue) => {
                                    setValue(currentValue === value ? '' : currentValue)
                                    field.onChange(currentValue === value ? '' : currentValue)
                                    setOpen(false)
                                  }}
                                >
                                  <CheckIcon
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      value === client.owner_name ? 'opacity-100' : 'opacity-0',
                                    )}
                                  />
                                  {client.owner_name}
                                </CommandItem>
                              ),
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

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
