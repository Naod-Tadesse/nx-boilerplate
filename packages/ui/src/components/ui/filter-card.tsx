import { Card, CardContent } from './card'
import { cn } from '../../lib/utils'

interface FilterCardProps {
  children: React.ReactNode
  className?: string
}

export function FilterCard({ children, className }: FilterCardProps) {
  return (
    <Card className={cn(className)}>
      <CardContent className="pt-4 pb-4">
        {children}
      </CardContent>
    </Card>
  )
}
