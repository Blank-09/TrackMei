import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React, { useEffect } from 'react'
import { Badge } from '../ui/badge'

type Client = {
  name: string
  email: string
  companyname: string
}

const avatarUrl = 'https://avatar.iran.liara.run/public/28'

export function ClientRecent() {
  const [clients, setClients] = React.useState<Client[]>([])
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await window.electron.ipcRenderer.invoke('client:getAll')
        const clientData = response.map((client: any) => ({
          name: client.owner_name,
          email: client.owner_email,
          companyname: client.company_name,
        }))
        setClients(clientData)
        console.log('Clients:', clientData)
      } catch (error) {
        console.log('Error fetching clients:', error)
      }
    }
    fetchClients()
  }, [])
  const topClients = clients.slice(-5).reverse()
  return (
    <div className='space-y-8'>
      {topClients.map((client, index) => (
        <div key={index} className='flex items-center'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src={avatarUrl} alt='Avatar' />
            <AvatarFallback>
              {client.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className='ml-4 space-y-1'>
            <p className='text-sm font-medium leading-none'>{client.name}</p>
            <p className='text-sm text-muted-foreground'>{client.email}</p>
          </div>
          <div className='ml-auto font-medium'>
            <Badge variant='outline'>{client.companyname}</Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
