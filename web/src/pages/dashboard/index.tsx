import { useState, useEffect } from "react"
import { AlertCircle, TrendingUp, TrendingDown, Loader2, Phone, Calendar, UserCheck, UserX, UserCog, FileText, CircleDollarSign, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiUrl } from "@/lib/api"
import type { DashboardData, DebtTransaction, ActivityLog } from "@/types"
import { toast } from "sonner"
import { Link } from "react-router"

export default function DashboardIndex() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [upcomingDays, setUpcomingDays] = useState<number>(7)
  const [upcomingTransactions, setUpcomingTransactions] = useState<DebtTransaction[]>([])
  const [loadingUpcoming, setLoadingUpcoming] = useState(false)
  const [recentActivities, setRecentActivities] = useState<ActivityLog[]>([])
  const [loadingActivities, setLoadingActivities] = useState(false)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch(apiUrl("/api/dashboard"), {
        method: "GET",
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setDashboardData(data.data)
        }
      } else {
        toast.error("Dashboard verileri yüklenirken bir hata oluştu")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const fetchUpcomingDueTransactions = async (days: number) => {
    try {
      setLoadingUpcoming(true)
      const response = await fetch(apiUrl(`/api/debt-transactions/upcoming-due?days=${days}`), {
        method: "GET",
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUpcomingTransactions(data.data || [])
        }
      } else {
        toast.error("Vadesi yaklaşan işlemler yüklenirken bir hata oluştu")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    } finally {
      setLoadingUpcoming(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    fetchUpcomingDueTransactions(upcomingDays)
  }, [])

  useEffect(() => {
    fetchUpcomingDueTransactions(upcomingDays)
  }, [upcomingDays])

  const fetchRecentActivities = async () => {
    try {
      setLoadingActivities(true)
      const response = await fetch(apiUrl("/api/activity-logs/recent?limit=5"), {
        method: "GET",
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setRecentActivities(data.data || [])
        }
      }
    } catch (error) {
      // Silent fail
    } finally {
      setLoadingActivities(false)
    }
  }

  useEffect(() => {
    fetchRecentActivities()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Borç/Alacak özetiniz
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          Borç/Alacak özetiniz
        </p>
      </div>

      {/* Özet Kartları */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Alacak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {dashboardData ? formatCurrency(dashboardData.total_receivable) : formatCurrency(0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">İçeride olan para</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Borç</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {dashboardData ? formatCurrency(dashboardData.total_debt) : formatCurrency(0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Dışarıda olan para</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Pozisyon</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                dashboardData && dashboardData.net_position >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {dashboardData ? formatCurrency(dashboardData.net_position) : formatCurrency(0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {dashboardData && dashboardData.net_position >= 0
                ? "Pozitif durum"
                : "Negatif durum"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Vadesi Yaklaşan Ödemeler */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Vadesi Yaklaşan Ödemeler</CardTitle>
              <CardDescription>
                Vadesi yaklaşan borç/alacak kayıtları
              </CardDescription>
            </div>
            <Select value={upcomingDays.toString()} onValueChange={(value) => setUpcomingDays(parseInt(value))}>
              <SelectTrigger className="w-full sm:w-[135px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 Gün</SelectItem>
                <SelectItem value="15">15 Gün</SelectItem>
                <SelectItem value="30">30 Gün</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loadingUpcoming ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : upcomingTransactions.length > 0 ? (
            <div className="space-y-4">
              {upcomingTransactions.map((transaction: DebtTransaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <div
                        className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                          transaction.type === "receivable"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {transaction.type === "receivable" ? "Alacak" : "Borç"}
                      </div>
                      <h3 className="font-semibold truncate">{transaction.contact_name}</h3>
                    </div>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                      {transaction.contact_phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{transaction.contact_phone}</span>
                        </div>
                      )}
                      <span className="whitespace-nowrap">Vade: {formatDate(transaction.due_date)}</span>
                    </div>
                    {transaction.description && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {transaction.description}
                      </p>
                    )}
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <div className="text-lg font-bold">
                      {formatCurrency(parseFloat(transaction.remaining_amount))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Toplam: {formatCurrency(parseFloat(transaction.amount))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{upcomingDays} gün içinde vadesi gelen işlem bulunmuyor</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bugün Araman Gerekenler */}
      <Card>
        <CardHeader>
          <CardTitle>Bugün Araman Gerekenler</CardTitle>
          <CardDescription>
            Bugün vadesi gelen borç/alacak kayıtları
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dashboardData && dashboardData.today_due.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.today_due.map((transaction: DebtTransaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <div
                        className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                          transaction.type === "receivable"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {transaction.type === "receivable" ? "Alacak" : "Borç"}
                      </div>
                      <h3 className="font-semibold truncate">{transaction.contact_name}</h3>
                    </div>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                      {transaction.contact_phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{transaction.contact_phone}</span>
                        </div>
                      )}
                      <span className="whitespace-nowrap">Vade: {formatDate(transaction.due_date)}</span>
                    </div>
                    {transaction.description && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {transaction.description}
                      </p>
                    )}
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <div className="text-lg font-bold">
                      {formatCurrency(parseFloat(transaction.remaining_amount))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Toplam: {formatCurrency(parseFloat(transaction.amount))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Bugün vadesi gelen işlem bulunmuyor</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Son Aktiviteler */}
      <Card>
        <CardHeader>
          <CardTitle>Son Aktiviteler</CardTitle>
          <CardDescription>
            En son yapılan işlemler
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingActivities ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : recentActivities.length > 0 ? (
            <div className="space-y-3">
              {recentActivities.map((activity) => {
                const getActivityIcon = () => {
                  if (activity.category === "contact") {
                    return activity.action === "created" ? (
                      <UserCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    ) : activity.action === "updated" ? (
                      <UserCog className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <UserX className="h-4 w-4 text-red-600 dark:text-red-400" />
                    )
                  } else if (activity.category === "debt_transaction") {
                    return <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  } else if (activity.category === "payment") {
                    return <CircleDollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  }
                  return <Clock className="h-4 w-4 text-muted-foreground" />
                }

                const getActivityColor = () => {
                  if (activity.category === "contact") {
                    return activity.action === "created"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : activity.action === "updated"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-red-600 dark:text-red-400"
                  } else if (activity.category === "debt_transaction") {
                    return "text-indigo-600 dark:text-indigo-400"
                  } else if (activity.category === "payment") {
                    return "text-emerald-600 dark:text-emerald-400"
                  }
                  return "text-muted-foreground"
                }

                const getActivityBgColor = () => {
                  if (activity.category === "contact") {
                    return activity.action === "created"
                      ? "bg-emerald-50 dark:bg-emerald-950/20"
                      : activity.action === "updated"
                      ? "bg-blue-50 dark:bg-blue-950/20"
                      : "bg-red-50 dark:bg-red-950/20"
                  } else if (activity.category === "debt_transaction") {
                    return "bg-indigo-50 dark:bg-indigo-950/20"
                  } else if (activity.category === "payment") {
                    return "bg-emerald-50 dark:bg-emerald-950/20"
                  }
                  return "bg-muted"
                }

                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className={`mt-0.5 flex-shrink-0 p-2 rounded-md ${getActivityBgColor()}`}>
                      <div className={getActivityColor()}>
                        {getActivityIcon()}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(activity.created_at)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Henüz aktivite bulunmuyor</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hızlı İşlemler */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/contacts">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="text-sm font-medium">Kişi/Firma Ekle</div>
              <p className="text-xs text-muted-foreground mt-1">
                Yeni kişi veya firma ekleyin
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/debt-transactions">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="text-sm font-medium">Borç/Alacak Kaydı</div>
              <p className="text-xs text-muted-foreground mt-1">
                Yeni borç veya alacak kaydı oluşturun
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
