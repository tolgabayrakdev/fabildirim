import { useState, useEffect } from "react"
import { Loader2, TrendingUp, TrendingDown, BarChart3, PieChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { apiUrl } from "@/lib/api"
import { toast } from "sonner"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, LineChart, Line } from "recharts"
import type { DashboardData, DebtTransaction, Contact } from "@/types"

const COLORS = {
  receivable: "#22c55e", // green
  debt: "#ef4444", // red
}

export default function Statistics() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [transactions, setTransactions] = useState<DebtTransaction[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      
      // Dashboard data
      const dashboardRes = await fetch(apiUrl("/api/dashboard"), {
        method: "GET",
        credentials: "include",
      })
      
      if (dashboardRes.ok) {
        const dashboardJson = await dashboardRes.json()
        if (dashboardJson.success) {
          setDashboardData(dashboardJson.data)
        }
      }

      // Transactions
      const transactionsRes = await fetch(apiUrl("/api/debt-transactions"), {
        method: "GET",
        credentials: "include",
      })
      
      if (transactionsRes.ok) {
        const transactionsJson = await transactionsRes.json()
        if (transactionsJson.success) {
          setTransactions(transactionsJson.data || [])
        }
      }

      // Contacts
      const contactsRes = await fetch(apiUrl("/api/contacts"), {
        method: "GET",
        credentials: "include",
      })
      
      if (contactsRes.ok) {
        const contactsJson = await contactsRes.json()
        if (contactsJson.success) {
          setContacts(contactsJson.data || [])
        }
      }
    } catch (error) {
      toast.error("Veriler yüklenirken bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // Toplam Alacak vs Borç Pie Chart Data
  const pieChartData = dashboardData ? [
    {
      name: "Alacak",
      value: dashboardData.total_receivable,
      fill: COLORS.receivable,
    },
    {
      name: "Borç",
      value: dashboardData.total_debt,
      fill: COLORS.debt,
    },
  ] : []

  // Kişi/Firmalara göre borç/alacak dağılımı
  const contactDistribution = contacts.map((contact) => {
    const contactTransactions = transactions.filter(
      (t) => t.contact_id === contact.id && t.status === "active"
    )
    
    const totalReceivable = contactTransactions
      .filter((t) => t.type === "receivable")
      .reduce((sum, t) => sum + parseFloat(t.remaining_amount), 0)
    
    const totalDebt = contactTransactions
      .filter((t) => t.type === "debt")
      .reduce((sum, t) => sum + parseFloat(t.remaining_amount), 0)
    
    return {
      name: contact.name.length > 15 ? contact.name.substring(0, 15) + "..." : contact.name,
      alacak: totalReceivable,
      borç: totalDebt,
      net: totalReceivable - totalDebt,
    }
  }).filter((item) => item.alacak > 0 || item.borç > 0).sort((a, b) => Math.abs(b.net) - Math.abs(a.net)).slice(0, 10)

  // Borç/Alacak tipine göre dağılım
  const typeDistribution = [
    {
      name: "Alacak",
      value: transactions.filter((t) => t.type === "receivable" && t.status === "active").length,
      fill: COLORS.receivable,
    },
    {
      name: "Borç",
      value: transactions.filter((t) => t.type === "debt" && t.status === "active").length,
      fill: COLORS.debt,
    },
  ]

  // Durum dağılımı
  const statusDistribution = [
    {
      name: "Aktif",
      value: transactions.filter((t) => t.status === "active").length,
      fill: "#3b82f6",
    },
    {
      name: "Kapalı",
      value: transactions.filter((t) => t.status === "closed").length,
      fill: "#6b7280",
    },
  ]

  // Aylık trend (son 6 ay)
  const monthlyTrend = (() => {
    const months: { [key: string]: { alacak: number; borç: number } } = {}
    const now = new Date()
    
    // Son 6 ay
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = date.toLocaleDateString("tr-TR", { month: "short", year: "numeric" })
      months[monthKey] = { alacak: 0, borç: 0 }
    }

    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.created_at)
      const monthKey = transactionDate.toLocaleDateString("tr-TR", { month: "short", year: "numeric" })
      
      if (months[monthKey]) {
        if (transaction.type === "receivable") {
          months[monthKey].alacak += parseFloat(transaction.amount)
        } else {
          months[monthKey].borç += parseFloat(transaction.amount)
        }
      }
    })

    return Object.entries(months).map(([name, values]) => ({
      name,
      Alacak: values.alacak,
      Borç: values.borç,
    }))
  })()

  const pieChartConfig = {
    alacak: {
      label: "Alacak",
      color: COLORS.receivable,
    },
    borç: {
      label: "Borç",
      color: COLORS.debt,
    },
  }

  const barChartConfig = {
    alacak: {
      label: "Alacak",
      color: COLORS.receivable,
    },
    borç: {
      label: "Borç",
      color: COLORS.debt,
    },
    net: {
      label: "Net",
      color: "#3b82f6",
    },
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">İstatistikler</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Borç/Alacak analiz ve istatistikleri
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
        <h1 className="text-2xl md:text-3xl font-bold">İstatistikler</h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          Borç/Alacak analiz ve istatistikleri
        </p>
      </div>

      {/* Özet Kartları */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Alacak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {dashboardData ? formatCurrency(dashboardData.total_receivable) : formatCurrency(0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {transactions.filter((t) => t.type === "receivable" && t.status === "active").length} aktif kayıt
            </p>
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
            <p className="text-xs text-muted-foreground mt-1">
              {transactions.filter((t) => t.type === "debt" && t.status === "active").length} aktif kayıt
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Pozisyon</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
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
              {dashboardData && dashboardData.net_position >= 0 ? "Pozitif" : "Negatif"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kayıt</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transactions.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {contacts.length} kişi/firma
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grafikler */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Toplam Alacak vs Borç Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Toplam Alacak vs Borç</CardTitle>
            <CardDescription>Genel durum dağılımı</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pieChartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Borç/Alacak Tipine Göre Dağılım */}
        <Card>
          <CardHeader>
            <CardTitle>İşlem Tipi Dağılımı</CardTitle>
            <CardDescription>Aktif kayıt sayısı</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pieChartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={typeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {typeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Kişi/Firmalara Göre Dağılım */}
        <Card>
          <CardHeader>
            <CardTitle>Kişi/Firmalara Göre Dağılım</CardTitle>
            <CardDescription>En yüksek net pozisyonlu ilk 10</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={contactDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Bar dataKey="alacak" fill={COLORS.receivable} name="Alacak" />
                  <Bar dataKey="borç" fill={COLORS.debt} name="Borç" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Durum Dağılımı */}
        <Card>
          <CardHeader>
            <CardTitle>Durum Dağılımı</CardTitle>
            <CardDescription>Aktif vs Kapalı kayıtlar</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pieChartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Aylık Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Aylık Trend</CardTitle>
            <CardDescription>Son 6 ay içinde oluşturulan işlemler</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="Alacak" 
                    stroke={COLORS.receivable} 
                    strokeWidth={2}
                    name="Alacak"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Borç" 
                    stroke={COLORS.debt} 
                    strokeWidth={2}
                    name="Borç"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

