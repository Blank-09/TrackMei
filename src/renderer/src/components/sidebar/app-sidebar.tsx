import * as React from 'react'
import {
  AudioWaveform,
  BookOpen,
  Command,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  Map,
  NetworkIcon,
  PieChart,
  Settings2,
  UsersRound,
} from 'lucide-react'

import { NavMain } from '@/components/sidebar/nav-main'
import { NavProjects } from '@/components/sidebar/nav-projects'
import { NavUser } from '@/components/sidebar/nav-user'
import { TeamSwitcher } from '@/components/sidebar/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavLink } from 'react-router-dom'

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Clients',
      url: '#',
      icon: UsersRound,
      isActive: false,
      items: [
        {
          title: 'Client Dashboard',
          url: '/dashboard/clientaddform',
        },
        {
          title: 'Client List',
          url: '/dashboard/clientlist',
        },
        {
          title: 'Settings',
          url: '/dashboard/maindashboard',
        },
      ],
    },
    {
      title: 'Projects',
      url: '#',
      icon: NetworkIcon,
      items: [
        {
          title: 'Project Dashboard',
          url: '#',
        },
        {
          title: 'Project List',
          url: '/dashboard/projectlist',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },
    {
      title: 'Interns',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Interns Dashboard',
          url: '#',
        },
        {
          title: 'Interns List',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
      ],
    },
    {
      title: 'Transcation',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'Transcation Dashboard',
          url: '#',
        },
        {
          title: 'Transcation List',
          url: '/dashboard/transactionlist',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
}

export const AppSidebar: React.FC<React.ComponentProps<typeof Sidebar>> = ({ ...props }) => {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <div className='flex ml-5 mt-2'>
          <LayoutDashboard className='size-4 mt-1' />
          <NavLink to='/dashboard/maindashboard' className='nav-link ml-2'>
            Dashboard
          </NavLink>
        </div>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
