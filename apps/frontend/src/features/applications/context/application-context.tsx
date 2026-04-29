import React, { useState } from 'react'
import type { Application } from '../data/types'

type ApplicationDialogType = 'delete'

interface ApplicationContextType {
  open: ApplicationDialogType | null
  setOpen: (type: ApplicationDialogType | null) => void
  currentRow: Application | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Application | null>>
  showFilters: boolean
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>
}

const ApplicationContext = React.createContext<ApplicationContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function ApplicationProvider({ children }: Props) {
  const [open, setOpen] = useState<ApplicationDialogType | null>(null)
  const [currentRow, setCurrentRow] = useState<Application | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  return (
    <ApplicationContext value={{ open, setOpen, currentRow, setCurrentRow, showFilters, setShowFilters }}>
      {children}
    </ApplicationContext>
  )
}

export const useApplicationContext = () => {
  const ctx = React.useContext(ApplicationContext)
  if (!ctx) {
    throw new Error('useApplicationContext must be used within <ApplicationProvider>')
  }
  return ctx
}
