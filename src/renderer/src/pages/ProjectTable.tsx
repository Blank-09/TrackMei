'use client'

import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AddProjectDialog } from '@/components/AddProjectDialog'
import { UpdateProjectDialog } from '@/components/UpdateprojectDialog'
import { DeleAlertDialog } from '@/components/ProjectDeleteDialog'
import { toast } from 'sonner'

export type Payment = {
  project_id: number
  project_title: string
  clientname: string
  categories: 'Web development' | 'mobile development' | 'design' | 'Project Management'
  project_description: string
  project_start_date: Date
  project_due_date: Date
  project_price: number
  payment_options: 'monthly' | 'yearly'
  project_status: 'completed' | 'in progress' | 'not started'
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}

const handleDelete = async (
  project_id: number,
  setData: React.Dispatch<React.SetStateAction<Payment[]>>,
) => {
  try {
    await window.electron.ipcRenderer.invoke('projectdetails:delete', project_id)
    setData((prevData) => prevData.filter((project) => project.project_id !== project_id))
  } catch (error) {
    toast.error('Failed to Delete Project')
    console.log('Failed to Delete Project: ', error)
  }
}

export function ProjectTable() {
  const [data, setData] = React.useState<Payment[]>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await window.electron.ipcRenderer.invoke('projectdetails:getAll')
        setData(response)
        console.log('project Data:', response)
      } catch (error) {
        toast.error('Error fetching Project Data')
        console.log('Error Fetching Project Data', error)
      }
    }
    fetchData()
  }, [])

  const columns: ColumnDef<Payment>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'project_title',
      header: 'Project Title',
      cell: ({ row }) => <div className='capitalize'>{row.getValue('project_title')}</div>,
    },
    {
      accessorKey: 'clientname',
      header: 'Client Name',
      cell: ({ row }) => <div className='capitalize'>{row.getValue('clientname')}</div>,
    },
    {
      accessorKey: 'categories',
      header: 'Categories',
      cell: ({ row }) => <div className='capitalize'>{row.getValue('categories')}</div>,
    },
    {
      accessorKey: 'project_description',
      header: 'Project Description',
      cell: ({ row }) => <div className='capitalize'>{row.getValue('project_description')}</div>,
    },
    {
      accessorKey: 'project_start_date',
      header: 'Start Date',
      cell: ({ row }) => {
        const date = new Date(row.getValue('project_start_date'))
        return <div className='capitalize'>{date.toLocaleDateString()}</div>
      },
    },
    {
      accessorKey: 'project_due_date',
      header: 'Due Date',
      cell: ({ row }) => {
        const date = new Date(row.getValue('project_due_date'))
        return <div className='capitalize'>{date.toLocaleDateString()}</div>
      },
    },
    {
      accessorKey: 'project_price',
      header: () => <div className=''>Project Price</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('project_price'))

        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'INR',
        }).format(amount)

        return <div className=' font-medium'>{formatted}</div>
      },
    },
    {
      accessorKey: 'payment_options',
      header: 'Payment Options',
      cell: ({ row }) => <div className='capitalize'>{row.getValue('payment_options')}</div>,
    },
    {
      accessorKey: 'project_status',
      header: 'Project Status',
      cell: ({ row }) => <div className='capitalize'>{row.getValue('project_status')}</div>,
    },

    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.project_id.toString())}
              >
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <UpdateProjectDialog project_id={row.original.project_id} />
              <DeleAlertDialog
                project_id={row.original.project_id}
                onDelete={() => handleDelete(row.original.project_id, setData)}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className='w-full px-6 p-8'>
      <h1 className='py-2 text-xl font-semibold ml-2 text-center'>
        Hi Users🙋‍♂️ Project Details Here...!
      </h1>

      <div className='flex items-center py-4'>
        <Input
          placeholder='Filter Project Status...'
          value={(table.getColumn('project_status')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('project_status')?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns <ChevronDown className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <div className='ml-6'>
            <AddProjectDialog />
          </div>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
