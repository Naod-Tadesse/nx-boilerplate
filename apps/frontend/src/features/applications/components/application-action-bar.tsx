import { useTranslation } from 'react-i18next'
import { MoreHorizontal } from 'lucide-react'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@org/ui'
import type { ActionConfig } from '../data/actions'

interface Props {
  actions: ActionConfig[]
  onAction: (actionKey: string) => void
}

export default function ApplicationActionBar({ actions, onAction }: Props) {
  const { t } = useTranslation()

  if (actions.length === 0) return null

  // If 2 or fewer actions, show all as buttons
  if (actions.length <= 2) {
    return (
      <div className="flex items-center gap-2">
        {actions.map((action) => (
          <Button
            key={action.key}
            variant={action.variant}
            size="sm"
            onClick={() => onAction(action.key)}
          >
            {t(action.labelKey)}
          </Button>
        ))}
      </div>
    )
  }

  // 3+ actions: primary button + dropdown for the rest
  const [primary, ...rest] = actions

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={primary.variant}
        size="sm"
        onClick={() => onAction(primary.key)}
      >
        {t(primary.labelKey)}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="mr-1 h-4 w-4" />
            {t('moreActions')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {rest.map((action) => (
            <DropdownMenuItem
              key={action.key}
              variant={action.variant === 'destructive' ? 'destructive' : 'default'}
              onClick={() => onAction(action.key)}
            >
              {t(action.labelKey)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
