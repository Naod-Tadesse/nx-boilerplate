import DeleteApplication from '../actions/delete-application'
import { useApplicationContext } from './application-context'

export function ApplicationDialogs() {
  const { open, setOpen, setCurrentRow, currentRow } = useApplicationContext()

  if (!currentRow) return null

  return (
    <DeleteApplication
      open={open === 'delete'}
      onOpenChange={(state) => {
        if (!state) {
          setOpen(null)
          setCurrentRow(null)
        }
      }}
      application={currentRow}
    />
  )
}
