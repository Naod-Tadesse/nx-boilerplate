import { Moon, Sun } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@org/ui"
import { useSidebar } from "@org/ui"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@org/ui"

export function ModeToggle() {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const { state } = useSidebar()

  const isLight = theme === "light" || (theme === "system" && !window.matchMedia("(prefers-color-scheme: dark)").matches)
  const isCollapsed = state === "collapsed"

  if (isCollapsed) {
    return (
      <div className="flex items-center justify-center gap-0.5">
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={cn(
            "flex items-center justify-center rounded-full p-2 transition-colors",
            isLight
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Sun className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={cn(
            "flex items-center justify-center rounded-full p-2 transition-colors",
            !isLight
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Moon className="size-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex w-full gap-1 rounded-lg p-1">
      <Button
        variant="ghost"
        onClick={() => setTheme("light")}
        className={cn(
          "flex-1 gap-2 rounded-md bg-muted py-6",
          isLight
            ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Sun className="size-4" />
        {t('light')}
      </Button>
      <Button
        variant="ghost"
        onClick={() => setTheme("dark")}
        className={cn(
          "flex-1 gap-2 rounded-md bg-muted py-6",
          !isLight
            ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Moon className="size-4" />
        {t('dark')}
      </Button>
    </div>
  )
}
