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
// import { UpdateInternDialog } from '@/components/UpdateInternDialog'
// import { DeleteAlertDialog } from '@/components/InternDeleteDialog'
import { toast } from 'sonner'
import { InternAddDialog } from '@/components/AddInternDialog'
import { UpdateInternDialog } from '@/components/UpdateInternDialog'
import { InternDeleteDialog } from '@/components/InternDeleteDialog'

export type Intern = {
  intern_id: number
  name: string
  email: string
  phone: string
  city: string
  project_id: number
  date_of_joining: Date
  date_of_leaving: Date
  status: 'active' | 'inactive' | 'completed'
}

const handleDelete = async (
  intern_id: number,
  setData: React.Dispatch<React.SetStateAction<Intern[]>>,
) => {
  try {
    await window.electron.ipcRenderer.invoke('interndetails:delete', intern_id)
    setData((prevData) => prevData.filter((intern) => intern.intern_id !== intern_id))
  } catch (error) {
    toast.error('Failed to Delete Intern')
    console.log('Failed to Delete Intern: ', error)
  }
}

export function InternTable() {
  const [data, setData] = React.useState<Intern[]>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await window.electron.ipcRenderer.invoke('interndetails:getAll')
        setData(response)
        console.log('Intern Data:', response)
      } catch (error) {
        toast.error('Error fetching Intern Data')
        console.log('Error Fetching Intern Data', error)
      }
    }
    fetchData()
  }, [])

  const columns: ColumnDef<Intern>[] = [
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
      accessorKey: 'name',
      header: 'Intern Name',
      cell: ({ row }) => <div className='capitalize'>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <div className='capitalize'>{row.getValue('email')}</div>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <div className='capitalize'>{row.getValue('phone')}</div>,
    },
    {
      accessorKey: 'city',
      header: 'City',
      cell: ({ row }) => <div className='capitalize'>{row.getValue('city')}</div>,
    },
    {
      accessorKey: 'project_id',
      header: 'Project Title',
      cell: ({ row }) => <div className='capitalize'>{row.getValue('project_id')}</div>,
    },
    {
      accessorKey: 'date_of_joining',
      header: 'Date of Joining',
      cell: ({ row }) => {
        const date = new Date(row.getValue('date_of_joining'))
        return <div className='capitalize'>{date.toLocaleDateString()}</div>
      },
    },
    {
      accessorKey: 'date_of_leaving',
      header: 'Date of Leaving',
      cell: ({ row }) => {
        const date = new Date(row.getValue('date_of_leaving'))
        return <div className='capitalize'>{date.toLocaleDateString()}</div>
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <div className='capitalize'>{row.getValue('status')}</div>,
    },
    {
      header: 'Actions',
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const intern = row.original

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
                onClick={() => navigator.clipboard.writeText(intern.intern_id.toString())}
              >
                Copy intern ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <UpdateInternDialog intern_id={row.original.intern_id} />
              <InternDeleteDialog
                intern_id={row.original.intern_id}
                onDelete={() => handleDelete(row.original.intern_id, setData)}
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
        Hi Users🙋‍♂️ Intern Details Here...!
      </h1>

      <div className='flex items-center py-4'>
        <Input
          placeholder='Filter Status...'
          value={(table.getColumn('status')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('status')?.setFilterValue(event.target.value)}
          className='max-w-sm'
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns <ChevronDown className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <div className='ml-6'>
            <InternAddDialog />
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
