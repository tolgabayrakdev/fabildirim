import { Home, LogOut, Search, Settings, User } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router"
import { useAuthStore } from "@/store/auth-store"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, loading } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    navigate("/sign-in")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url || 
                  (item.url === "/" && location.pathname === "/")
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={cn(
                        "relative transition-all",
                        isActive && "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-1 before:bg-primary"
                      )}
                    >
                      <Link to={item.url} className="flex items-center gap-3 w-full">
                        <item.icon className={cn("h-5 w-5 transition-colors", isActive && "text-primary")} />
                        <span className={cn("text-[15px]", isActive && "font-semibold")}>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-2 pb-2">
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex items-center justify-center w-full py-2">
                  <ModeToggle />
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                {loading ? (
                  <SidebarMenuButton className="w-full justify-start h-auto py-2 px-2" disabled>
                    <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                    <div className="flex flex-col items-start flex-1 min-w-0 ml-2 gap-1.5">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </SidebarMenuButton>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton className="w-full justify-start h-auto py-2 px-2 hover:bg-sidebar-accent">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-sm">
                          {user?.name ? getInitials(user.name) : <User className="h-4 w-4" />}
                        </div>
                        <div className="flex flex-col items-start flex-1 min-w-0 ml-2">
                          <span className="text-sm font-medium truncate w-full text-sidebar-foreground">
                            {user?.name || "Kullanıcı"}
                          </span>
                          <span className="text-xs text-muted-foreground truncate w-full">
                            {user?.email || ""}
                          </span>
                        </div>
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56" side="top">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user?.name || "Kullanıcı"}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email || ""}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/settings" className="flex items-center cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Ayarlar</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Çıkış Yap</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}