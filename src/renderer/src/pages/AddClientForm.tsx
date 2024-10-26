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
import { toast } from 'sonner'
import { DialogClose } from '@radix-ui/react-dialog'

// Define form schema
const formSchema = z.object({
  owner_name: z.string().min(2, { message: 'Username must be at least 2 characters.' }),
  company_name: z.string().min(2, { message: 'Company name must be at least 2 characters.' }),
  owner_email: z.string().email({ message: 'Please enter a valid email address.' }),
  city: z.string().min(2, { message: 'City must be at least 2 characters.' }),
  phone: z.string().regex(/^[0-9]{10}$/, { message: 'Mobile number must be a 10-digit number.' }),
})

export function ClientAddForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      owner_name: '',
      company_name: '',
      owner_email: '',
      city: '',
      phone: '',
    },
  })

  const onSubmit = async (data) => {
    try {
      console.log(data)
      const result = await window.electron.ipcRenderer.invoke('client:add', data)
      if (result) {
        form.reset() // Reset the form after successful
        setTimeout(() => {
          window.location.reload() // Refresh the window after a short delay
        }, 1000)
        toast.success('Client added successfully')
        // navigate('/dashboard/clientaddform')
      } else {
        toast.error('Client not added')
      }
    } catch (error) {}
    console.log('Form data:', data)
  }

  return (
    <div className='flex justify-center items-center '>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 w-full max-w-xl p-5 shadow-md rounded '
        >
          <h1 className='text-center text-xl'>Client Account Here 🙍</h1>

          <FormField
            control={form.control}
            name='owner_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter client name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='company_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter company name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='owner_email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Email</FormLabel>
                <FormControl>
                  <Input placeholder='Enter email address' {...field} />
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
            name='phone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Input placeholder='Enter mobile number' {...field} />
                </FormControl>
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
