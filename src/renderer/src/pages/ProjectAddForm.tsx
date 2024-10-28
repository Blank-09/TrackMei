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
import { toast } from 'sonner'
import { DialogClose } from '@/components/ui/dialog'

// Define form schema
const formSchema = z.object({
  project_title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  project_price: z
    .string()
    .transform((val) => Number(val)) // Convert string input to number
    .refine((val) => !isNaN(val) && val > 0, { message: 'Price must be a positive number.' }),

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
  payment_options: z.enum(['monthly', 'yearly']),
  project_status: z.enum(['completed', 'in progress', 'not started']),
})

export function ProjectAddForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_title: '',
      // client_id: '',
      categories: 'Web development',
      project_description: '',
      project_start_date: '',
      project_due_date: '',
      project_price: '',
      payment_options: 'monthly',
      project_status: 'not started',
    },
  })

  const onSubmit = async (data) => {
    try {
      // console.log(data)
      const projectresult = await window.electron.ipcRenderer.invoke('projectdetails:add', data)
      if (projectresult) {
        form.reset()
        setTimeout(() => {
          window.location.reload()
        }, 1000)
        toast.success('Project Added Successfully')
      } else {
        toast.error('Project not added')
      }
    } catch (error) {
      console.error('Error adding project:', error)
      toast.error('Error adding project')
    }
  }

  return (
    <div className='flex justify-center items-center'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full p-2 shadow-md rounded'>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Input type='text' placeholder='Enter project price' {...field} />
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            <Button onSubmit={onSubmit} type='submit' className='w-full'>
              Submit
            </Button>
          </DialogClose>
        </form>
      </Form>
    </div>
  )
}
