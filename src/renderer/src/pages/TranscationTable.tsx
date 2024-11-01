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
import { AddTranscationDialog } from '@/components/AddTranscationDialog'
import { toast } from 'sonner'
import { UpdateTranscationDialog } from '@/components/UpdateTranscationDialog'
import { TranscationDeleteDialog } from '@/components/TranscationDeleteDialog'

export type Payment = {
  transid: string
  clientname: string
  project_title: string
  fromMobilenumber: number
  toMobilenumber: number
  payment: 'upi' | 'credit card' | 'debit card' | 'netbanking' | 'cash'
  acnumber: number
  paidamount: number
  bankname: string
  date: Date
  description: string
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}

const handleDelete = async (
  transid: string,
  setData: React.Dispatch<React.SetStateAction<Payment[]>>,
) => {
  try {
    await window.electron.ipcRenderer.invoke('transaction:delete', transid)
    const response = await window.electron.ipcRenderer.invoke('transaction:getAll')
    setData(response)
    toast.success('Transcation deleted successfully')
  } catch (error) {
    toast.error('Error deleting transcation')
    console.error('Error deleting transcation:', error)
  }
}

export function TranscationTable() {
  const [data, setData] = React.useState<Payment[]>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await window.electron.ipcRenderer.invoke('transaction:getAll')
        setData(response)
        // console.log('trancation data:', response)
      } catch (error) {
        toast.error('Error fetching transcation details')
        console.log('Error fetching transcation details:', error)
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
    // {
    //   accessorKey: 'status',
    //   header: 'Status',
    //   cell: ({ row }) => <div className='capitalize'>{row.getValue('status')}</div>,
    // },
    {
      accessorKey: 'clientname',
      header: 'Client Name',
      cell: ({ row }) => <div className='capitalize'>{row.getValue('clientname')}</div>,
    },
    {
      accessorKey: 'project_title',
      header: 'Project Title',
      cell: ({ row }) => <div className='capitalize'>{row.getValue('project_title')}</div>,
    },
    {
      accessorKey: 'fromMobilenumber',
      header: 'From Mobile Number',
      cell: ({ row }) => <div className='capitalize'>{row.getValue('fromMobilenumber')}</div>,
    },
    {
      accessorKey: 'toMobilenumber',
      header: 'To Mobile Number',
      cell: ({ row }) => <div className='capitalize'>{row.getValue('toMobilenumber')}</div>,
    },
    {
      accessorKey: 'payment',
      header: 'Payment Type',
      cell: ({ row }) => <div className='capitalize'>{row.getValue('payment')}</div>,
    },
    {
      accessorKey: 'acnumber',
      header: 'Account Number',
      cell: ({ row }) => <div className='capitalize'>{row.getValue('acnumber')}</div>,
    },
    //   {
    //     accessorKey: 'payment',
    //     header: ({ column }) => {
    //       return (
    //         <Button
    //           variant='ghost'
    //           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    //         >
    //           Payment Type
    //           <ArrowUpDown className='ml-2 h-4 w-4' />
    //         </Button>
    //       )
    //     },
    //     cell: ({ row }) => <div className='lowercase'>{row.getValue('payment')}</div>,
    //   },
    {
      accessorKey: 'paidamount',
      header: () => <div className=''>Paid Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('paidamount'))

        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'INR',
        }).format(amount)

        return <div className=' font-medium'>{formatted}</div>
      },
    },
    {
      accessorKey: 'bankname',
      header: 'Bank Name',
      cell: ({ row }) => <div className='capitalize'>{row.getValue('bankname')}</div>,
    },
    {
      accessorKey: 'date',
      header: 'Paid Date',
      cell: ({ row }) => {
        const date = new Date(row.getValue('date'))
        return <div className='capitalize'>{date.toLocaleDateString()}</div>
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => <div className='capitalize'>{row.getValue('description')}</div>,
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.transid)}>
                Copy Transcation ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <UpdateTranscationDialog transid={row.original.transid} />
              <TranscationDeleteDialog
                transid={row.original.transid}
                onDelete={() => handleDelete(row.original.transid, setData)}
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
      <h1 className='mt-2 text-xl font-semibold text-center'>
        Hi Users🙋‍♂️ Transcation Add Here...!
      </h1>
      <div className='flex items-center py-4'>
        <Input
          placeholder='Filter Client Name...'
          value={(table.getColumn('clientname')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('clientname')?.setFilterValue(event.target.value)}
          className='max-w-sm'
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns <ChevronDown className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <div className='ml-6'>
            <AddTranscationDialog />
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
