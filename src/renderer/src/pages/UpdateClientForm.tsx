'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect, useState } from 'react'
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

export function UpdateClientForm({ clientId }) {
  // const { clientId } = useParams() // Get clientId from URL params
  const [loading, setLoading] = useState(true)

  // Initialize the form with default values
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

  useEffect(() => {
    const fetchClientData = async () => {
      console.log('Fetching client data for ID:', clientId) // Debug log
      try {
        const client = await window.electron.ipcRenderer.invoke('client:getById', clientId)
        // console.log('Client data received:', client) // Debug log
        if (client) {
          form.reset({
            owner_name: client.owner_name,
            company_name: client.company_name,
            owner_email: client.owner_email,
            city: client.city,
            phone: client.phone,
          })
        } else {
          console.error('No client found for the given ID') // Handle case where client is not found
        }
      } catch (error) {
        console.error('Error fetching client:', error)
      } finally {
        setLoading(false)
      }
    }

    if (clientId) {
      fetchClientData()
    } else {
      console.warn('No clientId provided') // Warn if clientId is missing
      setLoading(false)
    }
  }, [clientId, form])

  const onSubmit = async (data) => {
    console.log('Form data:', data)
    try {
      const response = await window.electron.ipcRenderer.invoke('client:update', clientId, data)

      if (response && response.success) {
        form.reset()
        setTimeout(() => {
          window.location.reload()
        }, 1000)
        toast.success('Client updated successfully!')
      } else {
        console.error('Update failed:', response?.message || 'No response message')
        toast.error(`Update failed: ${response?.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating client:', error)
      alert('Error updating client. Please try again later.')
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex justify-center items-center'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 w-full max-w-xl p-6 shadow-md rounded'
        >
          <h1 className='text-center text-xl'>Client Update Here 🙍</h1>

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
            <Button type='submit' className='w-full'>
              Update
            </Button>
          </DialogClose>
        </form>
      </Form>
    </div>
  )
}
