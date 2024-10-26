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
import { AlertDialogButton } from '@/components/AlertDialogButton'
import { AddClientDialog } from '@/components/AddClientDialog'
import { toast } from 'sonner'
import { UpdateClientDialog } from '@/components/UpdateClientDialog'

export type Payment = {
  client_id: number
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  company_name: string
  owner_name: string
  owner_email: string
  city: string
  phone: string
  email: string
}

// Handle client deletion
const handleDelete = async (
  clientId: number,
  setData: React.Dispatch<React.SetStateAction<Payment[]>>,
) => {
  try {
    await window.electron.ipcRenderer.invoke('client:delete', clientId)
    setData((prevData) => prevData.filter((client) => client.client_id !== clientId))
    toast.success('Client deleted successfully')
  } catch (error) {
    toast.error('Failed to delete client: ' + error)
    console.log('Failed to delete client:', error)
  }
}

export function ClientTable() {
  const [data, setData] = React.useState<Payment[]>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // Fetch data on component mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await window.electron.ipcRenderer.invoke('client:getAll')
        setData(response)
        console.log('Client data:', response)
      } catch (error) {
        toast.error('Error fetching Client data')
        console.log('Error fetching Client data:', error)
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
      accessorKey: 'company_name',
      header: 'Company Name',
      cell: ({ row }) => <div>{row.getValue('company_name')}</div>,
    },
    {
      accessorKey: 'owner_name',
      header: 'Owner Name',
      cell: ({ row }) => <div>{row.getValue('owner_name')}</div>,
    },
    {
      accessorKey: 'owner_email',
      header: 'Owner Email',
      cell: ({ row }) => <div>{row.getValue('owner_email')}</div>,
    },
    {
      accessorKey: 'city',
      header: 'City',
      cell: ({ row }) => <div>{row.getValue('city')}</div>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <div>{row.getValue('phone')}</div>,
    },
    {
      header: 'Actions',
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
                onClick={() => navigator.clipboard.writeText(payment.client_id.toString())}
              >
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <UpdateClientDialog clientId={row.original.client_id} />
              <AlertDialogButton
                clientId={row.original.client_id}
                onDelete={() => handleDelete(row.original.client_id, setData)}
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
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <div className='w-full px-6 p-8'>
      <h1 className='mt-2 text-xl font-thin ml-2'>Hi Users 🙋‍♂️</h1>
      <div className='flex items-center py-8'>
        <Input
          placeholder='Filter emails...'
          value={(table.getColumn('owner_email')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('owner_email')?.setFilterValue(event.target.value)}
          className='max-w-sm'
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns <ChevronDown className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <div className='ml-6'>
            <AddClientDialog />
          </div>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className='capitalize'
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
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
