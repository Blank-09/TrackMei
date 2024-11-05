import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { cn } from '@/lib/utils'

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
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'

// Define form schema
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }),
  city: z.string().min(2, { message: 'City must be at least 2 characters.' }),
  project_id: z
    .string()
    .transform((val) => Number(val)) // Convert string input to number
    .refine((val) => !isNaN(val) && val > 0, { message: 'Project ID must be a positive number.' }),
  date_of_joining: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: 'Date of joining must be a valid date.',
  }),
  date_of_leaving: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: 'Date of leaving must be a valid date.',
  }),
  status: z.enum(['active', 'inactive', 'completed']),
})

export function InternUpdateForm({ intern_id }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [projects, setProjects] = useState<{ project_id: number; project_title: string }[]>([])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      city: '',
      project_id: '',
      date_of_joining: '',
      date_of_leaving: '',
      status: '',
    },
  })

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await window.electron.ipcRenderer.invoke('projectdetails:getAll')
        console.log(response)
        setProjects(response)
      } catch (error) {
        console.error('Error fetching projects:', error)
        toast.error('Error fetching projects')
      }
    }

    const fetchInternDetails = async () => {
      try {
        const response = await window.electron.ipcRenderer.invoke(
          'interndetails:getById',
          intern_id,
        )
        if (response) {
          // Format dates for input fields
          response.project_id = response.project_id.toString() // Ensure project_id is a string
          form.reset({
            name: response.name,
            email: response.email,
            phone: response.phone,
            city: response.city,
            project_id: response.project_id,
            date_of_joining: new Date(response.date_of_joining).toISOString().split('T')[0],
            date_of_leaving: new Date(response.date_of_leaving).toISOString().split('T')[0],
            status: response.status,
          })
          if (response.project_id) {
            setValue(response.project_id)
          }
          console.log(response)
        } else {
          toast.error('Intern details not found')
        }
      } catch (error) {
        console.error('Error fetching intern details:', error)
        toast.error('Error fetching intern details')
      }
    }

    fetchProjects()
    fetchInternDetails()
  }, [intern_id, form])

  const onSubmit = async (data) => {
    try {
      const internResult = await window.electron.ipcRenderer.invoke('interndetails:update', {
        ...data,
        intern_id,
      })
      console.log(internResult) // Log the result for debugging
      if (internResult && internResult.success) {
        form.reset()
        setTimeout(() => {
          window.location.reload()
        }, 1000)
        toast.success('Intern Updated Successfully')
      } else {
        toast.error(internResult?.message || 'Intern not Updated')
      }
    } catch (error) {
      console.error('Error updating intern:', error)
      toast.error('Error updating intern')
    }
  }

  return (
    <div className='flex justify-center items-center'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-1 w-full p-2 shadow-md rounded'
        >
          <h1 className='text-center text-xl'>Update Intern Details</h1>

          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Enter email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder='Enter phone number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='city'
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder='Enter city' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='project_id'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      role='combobox'
                      aria-expanded={open}
                      className='justify-between w-full'
                    >
                      {value
                        ? projects.find((project) => project.project_id.toString() === value)
                            ?.project_title
                        : 'Select Project...'}
                      <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-[200px] p-0'>
                    <Command>
                      <CommandInput placeholder='Search Project...' />
                      <CommandList>
                        <CommandEmpty>No Project found.</CommandEmpty>
                        <CommandGroup>
                          {projects.map(
                            (project) =>
                              project && (
                                <CommandItem
                                  key={project.project_id}
                                  value={project.project_id.toString()}
                                  onSelect={(currentValue) => {
                                    setValue(currentValue === value ? '' : currentValue)
                                    field.onChange(currentValue === value ? '' : currentValue)
                                    setOpen(false)
                                  }}
                                >
                                  <CheckIcon
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      value === project.project_id.toString()
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                  {project.project_title}
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
            name='date_of_joining'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Joining</FormLabel>
                <FormControl>
                  <Input type='date' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='date_of_leaving'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Leaving</FormLabel>
                <FormControl>
                  <Input type='date' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='active'>Active</SelectItem>
                    <SelectItem value='inactive'>Inactive</SelectItem>
                    <SelectItem value='completed'>Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='w-full'>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  )
}
