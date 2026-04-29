import { ChevronDown } from "lucide-react"
import { Link, useLocation } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { cn } from "@org/ui"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@org/ui"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@org/ui"
import type { NavItem } from "@/components/layout/sidebar-data"

export function NavMain({ items }: { items: NavItem[] }) {
  const { t } = useTranslation()
  const location = useLocation()

  const filteredItems = items
    // .map((item) => {
    //   if (item.items) {
    //     const filteredSubs = item.items.filter(
    //       (sub) => !sub.requiredPermission || hasPermission(sub.requiredPermission)
    //     )
    //     if (filteredSubs.length === 0) return null
    //     return { ...item, items: filteredSubs }
    //   }
    //   if (item.requiredPermission && !hasPermission(item.requiredPermission)) {
    //     return null
    //   }
    //   return item
    // })
    // .filter(Boolean) as NavItem[]

  return (
    <SidebarGroup className="gap-1 px-3 group-data-[collapsible=icon]:px-1">
      <SidebarMenu className="gap-1 group-data-[collapsible=icon]:items-center">
        {filteredItems.map((item) => {
          const title = t(item.titleKey)
          const isItemActive = location.pathname === item.url
          const hasActiveChild = item.items?.some((sub) => location.pathname === sub.url)
          const isOpen = isItemActive || hasActiveChild

          // Simple menu item (no sub-items)
          if (!item.items || item.items.length === 0) {
            return (
              <SidebarMenuItem key={item.titleKey}>
                <SidebarMenuButton
                  asChild
                  tooltip={title}
                  className={cn(
                    "h-11 text-sm",
                    isItemActive &&
                      "bg-secondary! text-primary! font-semibold hover:bg-secondary! hover:text-primary! dark:bg-primary! dark:text-primary-foreground! dark:hover:bg-primary! dark:hover:text-primary-foreground!"
                  )}
                >
                  <Link to={item.url} className="flex items-center gap-3">
                    {item.icon && <item.icon className="size-5 shrink-0" />}
                    <span>{title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          // Collapsible menu item
          return (
            <Collapsible
              key={item.titleKey}
              asChild
              defaultOpen={isOpen}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={title} className={`h-11 text-sm ${isOpen ? "bg-sidebar-accent" : ""}`}>
                    {item.icon && <item.icon className="size-5 shrink-0" />}
                    <span>{title}</span>
                    <ChevronDown className="ml-auto size-4 text-muted-foreground transition-transform duration-200 group-data-[state=closed]/collapsible:-rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="relative ml-5.5 mt-1">
                    {/* Vertical connector line */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />
                    {item.items?.map((subItem) => {
                      const subTitle = t(subItem.titleKey)
                      const isSubActive = location.pathname === subItem.url

                      return (
                        <div key={subItem.titleKey} className="relative">
                          {/* Dot indicator */}
                          <div
                            className={cn(
                              "absolute left-[-3.5px] top-1/2 -translate-y-1/2 size-1.75 rounded-full z-10",
                              isSubActive
                                ? "bg-primary"
                                : "border border-muted-foreground bg-sidebar"
                            )}
                          />
                          <Link
                            to={subItem.url}
                            className={cn(
                              "flex items-center gap-3 h-10 pl-6 text-sm rounded-lg ml-2 transition-colors",
                              isSubActive
                                ? "bg-secondary text-primary font-semibold dark:bg-primary dark:text-primary-foreground"
                                : "text-sidebar-foreground hover:bg-sidebar-accent"
                            )}
                          >
                            {/* THIS IS COMMENTED FOR THE TIME BEING, BUT WE CAN ADD IT BACK IN LATER IF WE WANT TO SHOW ICONS FOR SUB-ITEMS */}
                            {/* {subItem.icon && <subItem.icon className="size-4 shrink-0" />} */}
                            <span>{subTitle}</span>
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
