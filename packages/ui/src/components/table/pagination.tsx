import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import {
  Select, Button ,
cn,
getPageNumbers,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../index'

type DataTablePaginationProps<
  TTableState extends { page: number; limit: number },
> = {
  paginationInfo: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  setTableState: React.Dispatch<React.SetStateAction<TTableState>>
  className?: string
}

export function DataTablePagination<
  TTableState extends { page: number; limit: number },
>({
  paginationInfo,
  setTableState,
  className,
}: DataTablePaginationProps<TTableState>) {
  const { page: currentPage, totalPages, hasNext, hasPrev, limit, total } = paginationInfo
  const pageNumbers = getPageNumbers(currentPage, totalPages)

  const rangeStart = total === 0 ? 0 : (currentPage - 1) * limit + 1
  const rangeEnd = Math.min(currentPage * limit, total)

  const goToPage = (targetPage: number) => {
    setTableState((prev) => ({ ...prev, page: targetPage }))
  }

  const setPageSize = (size: number) => {
    setTableState((prev) => ({ ...prev, limit: size, page: 1 }))
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      {/* Left: range info + rows per page */}
      <div className='flex items-center gap-3'>
        <span className='text-muted-foreground whitespace-nowrap text-sm'>
          {rangeStart}-{rangeEnd} of {total}
        </span>
        <div className='flex items-center gap-2'>
          <span className='hidden text-sm sm:inline'>Rows per page</span>
          <Select
            value={`${limit}`}
            onValueChange={(value) => {
              setPageSize(Number(value))
            }}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={limit} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Right: page navigation */}
      <div className='flex items-center gap-1'>
        <span className='text-muted-foreground mr-2 hidden whitespace-nowrap text-sm sm:inline'>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant='outline'
          className='hidden size-8 p-0 sm:flex'
          onClick={() => goToPage(1)}
          disabled={!hasPrev}
        >
          <span className='sr-only'>Go to first page</span>
          <DoubleArrowLeftIcon className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          className='size-8 p-0'
          onClick={() => goToPage(currentPage - 1)}
          disabled={!hasPrev}
        >
          <span className='sr-only'>Go to previous page</span>
          <ChevronLeftIcon className='h-4 w-4' />
        </Button>

        {/* Page number buttons — hidden on small screens */}
        <div className='hidden items-center gap-1 sm:flex'>
          {pageNumbers.map((pageNumber, index) => (
            <div key={`${pageNumber}-${index}`} className='flex items-center'>
              {pageNumber === '...' ? (
                <span className='px-1 text-sm text-muted-foreground'>...</span>
              ) : (
                <Button
                  variant={currentPage === pageNumber ? 'default' : 'outline'}
                  className='h-8 min-w-8 px-2'
                  onClick={() => goToPage(pageNumber as number)}
                >
                  <span className='sr-only'>Go to page {pageNumber}</span>
                  {pageNumber}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Mobile: simple page indicator */}
        <span className='text-muted-foreground px-2 text-sm sm:hidden'>
          {currentPage} / {totalPages}
        </span>

        <Button
          variant='outline'
          className='size-8 p-0'
          onClick={() => goToPage(currentPage + 1)}
          disabled={!hasNext}
        >
          <span className='sr-only'>Go to next page</span>
          <ChevronRightIcon className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          className='hidden size-8 p-0 sm:flex'
          onClick={() => goToPage(totalPages)}
          disabled={!hasNext}
        >
          <span className='sr-only'>Go to last page</span>
          <DoubleArrowRightIcon className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}
