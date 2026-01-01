import { LayoutDashboard, LogOut, Settings, User, Loader2, Crown, Building2, FileText } from "lucide-react"
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
    title: "Anasayfa",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Kişi/Firmalar",
    url: "/contacts",
    icon: Building2,
  },
  {
    title: "Borç/Alacak",
    url: "/debt-transactions",
    icon: FileText,
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
          <SidebarGroupLabel className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <span>NAZPARA</span>
              <span className="text-xs font-normal text-muted-foreground">v0.3</span>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-6">
              {items.map((item) => {
                const isActive = location.pathname === item.url || 
                  (item.url === "/" && location.pathname === "/")
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={cn(
                        isActive && "!bg-primary !text-primary-foreground hover:!bg-primary/90 data-[active=true]:!bg-primary data-[active=true]:!text-primary-foreground"
                      )}
                    >
                      <Link to={item.url} className="flex items-center gap-3 w-full">
                        <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "!text-primary-foreground")} />
                        <span className={cn("text-[15px] font-medium", isActive && "!text-primary-foreground")}>{item.title}</span>
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
                      <Skeleton className="h-3 w-24" />
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
                          <div className="flex items-center gap-1.5 w-full min-w-0">
                            <span className="text-xs font-medium truncate text-sidebar-foreground">
                              {user?.name || "Kullanıcı"}
                            </span>
                            {user?.subscription?.plan?.name === "Pro" && (
                              <span className="inline-flex items-center gap-1 px-1 py-0.5 rounded text-[9px] font-semibold bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30 shrink-0">
                                <Crown className="h-2 w-2" />
                                Pro
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-muted-foreground truncate w-full">
                            {user?.email || ""}
                          </span>
                        </div>
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56" side="top">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium leading-none">
                              {user?.name || "Kullanıcı"}
                            </p>
                            {user?.subscription?.plan?.name === "Pro" && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30">
                                <Crown className="h-2.5 w-2.5" />
                                Pro
                              </span>
                            )}
                          </div>
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
                      <DropdownMenuItem 
                        onClick={handleLogout} 
                        disabled={loading}
                        className="text-destructive focus:text-destructive cursor-pointer"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <span>Çıkış yapılıyor...</span>
                          </>
                        ) : (
                          <>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Çıkış Yap</span>
                          </>
                        )}
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