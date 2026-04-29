import type { ColumnDef } from '@tanstack/react-table'
import {
  Badge,
  Checkbox,
  cn,
  DataTableColumnHeader,
  LongText,
} from '@org/ui'
import { format } from 'date-fns'
import type { Application, ApplicationStatus } from '../data/types'
import { DataTableRowActions } from './data-table-row-actions'

const statusVariant: Record<ApplicationStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  DRAFT: 'outline',
  NEW: 'outline',
  AGENT_REVIEW: 'secondary',
  AGENT_ACCEPTED: 'secondary',
  AGENT_REJECTED: 'destructive',
  QUOTATION_GENERATED: 'secondary',
  QUOTATION_REJECTED: 'destructive',
  QUOTATION_APPROVED: 'default',
  CUSTOMER_ACCEPTED: 'default',
  DEPOSIT_PAID: 'default',
  DISBURSED: 'default',
}

const statusLabel: Record<ApplicationStatus, string> = {
  DRAFT: 'Draft',
  NEW: 'New',
  AGENT_REVIEW: 'Agent Review',
  AGENT_ACCEPTED: 'Agent Accepted',
  AGENT_REJECTED: 'Agent Rejected',
  QUOTATION_GENERATED: 'Quotation Generated',
  QUOTATION_REJECTED: 'Quotation Rejected',
  QUOTATION_APPROVED: 'Quotation Approved',
  CUSTOMER_ACCEPTED: 'Customer Accepted',
  DEPOSIT_PAID: 'Deposit Paid',
  DISBURSED: 'Disbursed',
}

export const applicationColumns: ColumnDef<Application>[] = [
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
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: { className: cn('w-10') },
  },
  {
    id: 'index',
    header: '#',
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination
      const visualIndex = table.getRowModel().rows.findIndex((r) => r.id === row.id)
      return (
        <span className='text-muted-foreground'>
          {pageIndex * pageSize + visualIndex + 1}
        </span>
      )
    },
    enableSorting: false,
    enableHiding: false,
    meta: { className: 'w-10' },
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-20'>{row.original.id.slice(0, 8)}...</LongText>
    ),
    enableHiding: false,
  },
  {
    id: 'customerName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>
        {row.original.customerName ?? row.original.customer?.fullName ?? '—'}
      </LongText>
    ),
    enableSorting: false,
  },
  {
    id: 'insurerOrgName',
    header: 'Insurer',
    cell: ({ row }) => (
      <div className='text-nowrap'>
        {row.original.insurerOrgName ?? row.original.insurerOrg?.name ?? '—'}
      </div>
    ),
    enableSorting: false,
  },
  {
    id: 'bankOrgName',
    header: 'Bank',
    cell: ({ row }) => (
      <div className='text-nowrap'>
        {row.original.bankOrgName ?? row.original.bankOrg?.name ?? '—'}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'productType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Product' />
    ),
    cell: ({ row }) => (
      <Badge variant='outline'>{row.getValue('productType')}</Badge>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge variant={statusVariant[status]}>
          {statusLabel[status]}
        </Badge>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'appliedFrom',
    header: 'Source',
    cell: ({ row }) => (
      <Badge variant='secondary'>{row.original.appliedFrom}</Badge>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'submittedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Submitted' />
    ),
    cell: ({ row }) => {
      try {
        return row.original.submittedAt ? (
          <div className='text-nowrap'>
            {format(new Date(row.original.submittedAt), 'dd MMM yyyy')}
          </div>
        ) : (
          <span>—</span>
        )
      } catch {
        return <span>{row.original.submittedAt}</span>
      }
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
]
