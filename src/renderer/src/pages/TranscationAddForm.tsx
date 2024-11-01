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
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'

// Define form schema
const formSchema = z.object({
  clientname: z.string().min(1, { message: 'Client name must be at least 2 characters.' }),
  project_title: z.string().min(1, { message: 'Project title must be at least 2 characters.' }),
  fromMobilenumber: z
    .string()
    .regex(/^[0-9]{10}$/, { message: 'Mobile number must be a 10-digit number.' }),
  toMobilenumber: z
    .string()
    .regex(/^[0-9]{10}$/, { message: 'Mobile number must be a 10-digit number.' }),
  payment: z.enum(['upi', 'credit card', 'debit card', 'netbanking', 'cash']),
  acnumber: z
    .string()
    .regex(/^[0-9]{10,}$/, { message: 'Account number must be at least 10 digits.' })
    .optional(),
  paidamount: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, { message: 'Paid amount must be a positive number.' }),

  bankname: z.string().min(2, { message: 'Bank name must be at least 2 characters.' }),
  date: z
    .string()
    .refine((date) => !isNaN(new Date(date).getTime()), { message: 'Date must be a valid date.' }),
  description: z.string().min(5, { message: 'Description must be at least 5 characters.' }),
})

export function TranscationAddForm() {
  const [openClient, setOpenClient] = useState(false)
  const [openProject, setOpenProject] = useState(false)
  const [clients, setClients] = useState<{ client_id: number; owner_name: string }[]>([])
  const [projects, setProjects] = useState<{ project_id: number; project_title: string }[]>([])
  const [selectedClient, setSelectedClient] = useState('')
  const [selectedProject, setSelectedProject] = useState('')

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientname: '',
      project_title: '',
      fromMobilenumber: '',
      toMobilenumber: '',
      payment: '',
      acnumber: '',
      paidamount: '',
      bankname: '',
      date: '',
      description: '',
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
    fetchProjects()
  }, [])

  const onSubmit = async (data) => {
    try {
      // Convert acnumber to number if provided
      data.acnumber = data.acnumber ? Number(data.acnumber) : null
      // Convert fromMobilenumber to number if provided
      data.fromMobilenumber = data.fromMobilenumber ? Number(data.fromMobilenumber) : null
      // Convert toMobilenumber to number if provided
      data.toMobilenumber = data.toMobilenumber ? Number(data.toMobilenumber) : null
      console.log(data)
      const result = await window.electron.ipcRenderer.invoke('transaction:add', data)
      if (result) {
        form.reset()
        setTimeout(() => {
          window.location.reload()
        }, 1000)
        toast.success('Transaction added successfully')
      } else {
        toast.error('Transaction not added')
      }
    } catch (error) {
      console.error('Error adding transaction:', error)
      toast.error('Error adding transaction')
    }
  }

  return (
    <div className='flex justify-center items-center'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-1 w-full max-w-xl p-2 shadow-md rounded '
        >
          <h1 className='text-center text-xl'>Add Transaction</h1>

          <FormField
            control={form.control}
            name='clientname'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <Popover open={openClient} onOpenChange={setOpenClient}>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      role='combobox'
                      aria-expanded={openClient}
                      className='justify-between w-full'
                    >
                      {selectedClient
                        ? clients.find((client) => client.client_id.toString() === selectedClient)
                            ?.owner_name
                        : 'Select Client Name...'}
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
                                  value={client.client_id.toString()}
                                  onSelect={(currentValue) => {
                                    setSelectedClient(
                                      currentValue === selectedClient ? '' : currentValue,
                                    )
                                    field.onChange(
                                      currentValue === selectedClient ? '' : currentValue,
                                    )
                                    setOpenClient(false)
                                  }}
                                >
                                  <CheckIcon
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      selectedClient === client.client_id.toString()
                                        ? 'opacity-100'
                                        : 'opacity-0',
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
            name='project_title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Title</FormLabel>
                <Popover open={openProject} onOpenChange={setOpenProject}>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      role='combobox'
                      aria-expanded={openProject}
                      className='justify-between w-full'
                    >
                      {selectedProject
                        ? projects.find(
                            (project) => project.project_id.toString() === selectedProject,
                          )?.project_title
                        : 'Select Project Title...'}
                      <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-[200px] p-0'>
                    <Command>
                      <CommandInput placeholder='Search Project Title...' />
                      <CommandList>
                        <CommandEmpty>No Project Title found.</CommandEmpty>
                        <CommandGroup>
                          {projects.map(
                            (project) =>
                              project && (
                                <CommandItem
                                  key={project.project_id}
                                  value={project.project_id.toString()}
                                  onSelect={(currentValue) => {
                                    setSelectedProject(
                                      currentValue === selectedProject ? '' : currentValue,
                                    )
                                    field.onChange(
                                      currentValue === selectedProject ? '' : currentValue,
                                    )
                                    setOpenProject(false)
                                  }}
                                >
                                  <CheckIcon
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      selectedProject === project.project_id.toString()
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
            name='fromMobilenumber'
            render={({ field }) => (
              <FormItem>
                <FormLabel>From Mobile Number</FormLabel>
                <FormControl>
                  <Input placeholder='Enter from mobile number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='toMobilenumber'
            render={({ field }) => (
              <FormItem>
                <FormLabel>To Mobile Number</FormLabel>
                <FormControl>
                  <Input placeholder='Enter to mobile number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='payment'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select payment method' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='upi'>UPI</SelectItem>
                    <SelectItem value='credit card'>Credit Card</SelectItem>
                    <SelectItem value='debit card'>Debit Card</SelectItem>
                    <SelectItem value='netbanking'>Netbanking</SelectItem>
                    <SelectItem value='cash'>Cash</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='acnumber'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <Input placeholder='Enter account number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='paidamount'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paid Amount</FormLabel>
                <FormControl>
                  <Input type='number' placeholder='Enter paid amount' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='bankname'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter bank name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='date'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type='date' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder='Enter description' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <DialogClose> */}
          <Button onSubmit={onSubmit} type='submit' className='w-full'>
            Submit
          </Button>
          {/* </DialogClose> */}
        </form>
      </Form>
    </div>
  )
}
