import { ArrowRight, Check, UserCircle2 } from 'lucide-react'
import { Button, cn } from '@org/ui'
import { useTranslation } from 'react-i18next'

interface Step {
  key: string
  labelKey: string
}

interface StepperIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function StepperIndicator({ steps, currentStep }: StepperIndicatorProps) {
  const { t } = useTranslation()

  return (
    <div className="rounded-xl border bg-muted/25 p-2 sm:p-3">
      <div className="flex items-center gap-1 overflow-x-auto sm:gap-3">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isActive = index === currentStep
          const isLast = index === steps.length - 1

          return (
            <div key={step.key} className="flex min-w-fit flex-1 items-center gap-1 sm:gap-3">
              <Button
                type="button"
                variant="ghost"
                tabIndex={-1}
                className={cn(
                  'pointer-events-none h-10 min-w-0 flex-1 justify-start gap-2 rounded-xl px-2 text-left transition-colors sm:h-12 sm:gap-2.5 sm:px-4',
                  isActive && 'bg-secondary hover:bg-secondary text-primary dark:bg-primary dark:hover:bg-primary dark:text-secondary',
                  !isActive && 'bg-transparent hover:bg-transparent',
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold sm:h-8 sm:w-8 sm:text-sm',
                    isActive && 'bg-primary/20 text-primary dark:bg-secondary/20 dark:text-secondary',
                    isCompleted && !isActive && 'bg-secondary/50 text-secondary dark:bg-primary/20 dark:text-primary',
                    !isActive && !isCompleted && 'bg-muted text-muted-foreground',
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  ) : isActive && index === 0 ? (
                    <UserCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  ) : (
                    index + 1
                  )}
                </span>

                <span
                  className={cn(
                    'truncate text-xs font-semibold sm:text-sm',
                    isActive ? 'inline' : 'hidden sm:inline',
                    isActive && 'text-primary dark:text-secondary',
                    isCompleted && !isActive && 'text-secondary dark:text-primary',
                    !isActive && !isCompleted && 'text-muted-foreground',
                  )}
                >
                  {t(step.labelKey)}
                </span>
              </Button>

              {!isLast && (
                <div className="hidden items-center gap-2 md:flex">
                  <div
                    className={cn(
                      'h-0 w-12 border-t border-dashed lg:w-28',
                      index < currentStep ? 'border-secondary dark:border-primary' : 'border-muted-foreground/35',
                    )}
                  />
                  <ArrowRight
                    className={cn(
                      'h-4 w-4',
                      index < currentStep ? 'text-secondary dark:text-primary' : 'text-muted-foreground/45',
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
