import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Search, Loader2, Filter, CircleDollarSign, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { apiUrl } from "@/lib/api"
import type { DebtTransaction, Contact, Payment } from "@/types"
import { toast } from "sonner"

export default function DebtTransactions() {
  const [transactions, setTransactions] = useState<DebtTransaction[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<DebtTransaction | null>(null)
  const [formData, setFormData] = useState({
    contact_id: "",
    type: "receivable" as "debt" | "receivable",
    amount: "",
    remaining_amount: "",
    due_date: "",
    description: "",
    status: "active" as "active" | "closed",
  })
  const [submitting, setSubmitting] = useState(false)
  
  // Payment states
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<DebtTransaction | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loadingPayments, setLoadingPayments] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [paymentFormData, setPaymentFormData] = useState({
    amount: "",
    payment_date: "",
    description: "",
  })
  const [submittingPayment, setSubmittingPayment] = useState(false)

  const fetchContacts = async () => {
    try {
      const response = await fetch(apiUrl("/api/contacts"), {
        method: "GET",
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setContacts(data.data || [])
        }
      }
    } catch (error) {
      // Silent fail
    }
  }

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (typeFilter !== "all") params.append("type", typeFilter)
      if (statusFilter !== "all") params.append("status", statusFilter)

      const url = `/api/debt-transactions${params.toString() ? `?${params.toString()}` : ""}`
      const response = await fetch(apiUrl(url), {
        method: "GET",
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setTransactions(data.data || [])
        }
      } else {
        toast.error("Borç/Alacak kayıtları yüklenirken bir hata oluştu")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
    fetchTransactions()
  }, [typeFilter, statusFilter])

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numAmount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const handleOpenDialog = (transaction?: DebtTransaction) => {
    if (transaction) {
      setEditingTransaction(transaction)
      setFormData({
        contact_id: transaction.contact_id,
        type: transaction.type,
        amount: transaction.amount,
        remaining_amount: transaction.remaining_amount,
        due_date: transaction.due_date,
        description: transaction.description || "",
        status: transaction.status,
      })
    } else {
      setEditingTransaction(null)
      setFormData({
        contact_id: "",
        type: "receivable",
        amount: "",
        remaining_amount: "",
        due_date: "",
        description: "",
        status: "active",
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingTransaction(null)
    setFormData({
      contact_id: "",
      type: "receivable",
      amount: "",
      remaining_amount: "",
      due_date: "",
      description: "",
      status: "active",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const url = editingTransaction
        ? apiUrl(`/api/debt-transactions/${editingTransaction.id}`)
        : apiUrl("/api/debt-transactions")
      const method = editingTransaction ? "PUT" : "POST"

      const payload = editingTransaction
        ? formData
        : {
            contact_id: formData.contact_id,
            type: formData.type,
            amount: parseFloat(formData.amount),
            due_date: formData.due_date,
            description: formData.description || undefined,
          }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success(
          editingTransaction
            ? "Borç/Alacak kaydı başarıyla güncellendi"
            : "Borç/Alacak kaydı başarıyla oluşturuldu"
        )
        handleCloseDialog()
        fetchTransactions()
      } else {
        toast.error(data.message || "Bir hata oluştu")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bu borç/alacak kaydını silmek istediğinize emin misiniz?")) {
      return
    }

    try {
      const response = await fetch(apiUrl(`/api/debt-transactions/${id}`), {
        method: "DELETE",
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success("Borç/Alacak kaydı başarıyla silindi")
        fetchTransactions()
      } else {
        toast.error(data.message || "Bir hata oluştu")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    }
  }

  const handleOpenPaymentSheet = async (transaction: DebtTransaction) => {
    setSelectedTransaction(transaction)
    setIsPaymentSheetOpen(true)
    await fetchPayments(transaction.id)
  }

  const fetchPayments = async (transactionId: string) => {
    try {
      setLoadingPayments(true)
      const response = await fetch(apiUrl(`/api/payments/transaction/${transactionId}`), {
        method: "GET",
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setPayments(data.data || [])
        }
      } else {
        toast.error("Ödemeler yüklenirken bir hata oluştu")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    } finally {
      setLoadingPayments(false)
    }
  }

  const handleOpenPaymentDialog = () => {
    const today = new Date().toISOString().split("T")[0]
    setPaymentFormData({
      amount: "",
      payment_date: today,
      description: "",
    })
    setIsPaymentDialogOpen(true)
  }

  const handleClosePaymentDialog = () => {
    setIsPaymentDialogOpen(false)
    setPaymentFormData({
      amount: "",
      payment_date: "",
      description: "",
    })
  }

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTransaction) return

    setSubmittingPayment(true)

    try {
      const response = await fetch(apiUrl("/api/payments"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          transaction_id: selectedTransaction.id,
          amount: parseFloat(paymentFormData.amount),
          payment_date: paymentFormData.payment_date,
          description: paymentFormData.description || undefined,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success("Ödeme başarıyla eklendi")
        handleClosePaymentDialog()
        await fetchPayments(selectedTransaction.id)
        fetchTransactions() // Refresh transaction list to update remaining_amount
      } else {
        toast.error(data.message || "Bir hata oluştu")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    } finally {
      setSubmittingPayment(false)
    }
  }

  const handleDeletePayment = async (paymentId: string) => {
    if (!confirm("Bu ödemeyi silmek istediğinize emin misiniz?")) {
      return
    }

    if (!selectedTransaction) return

    try {
      const response = await fetch(apiUrl(`/api/payments/${paymentId}`), {
        method: "DELETE",
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success("Ödeme başarıyla silindi")
        await fetchPayments(selectedTransaction.id)
        fetchTransactions() // Refresh transaction list to update remaining_amount
      } else {
        toast.error(data.message || "Bir hata oluştu")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    }
  }

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.contact_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Borç/Alacak Kayıtları</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Borç ve alacak işlemlerinizi yönetin
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Yeni Kayıt
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Kişi/Firma ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-3 sm:gap-4">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Tip" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="receivable">Alacak</SelectItem>
              <SelectItem value="debt">Borç</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Durum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="closed">Kapalı</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kişi/Firma</TableHead>
                  <TableHead>Tip</TableHead>
                  <TableHead>Toplam Tutar</TableHead>
                  <TableHead>Kalan Tutar</TableHead>
                  <TableHead>Vade Tarihi</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "Arama sonucu bulunamadı" : "Henüz borç/alacak kaydı eklenmemiş"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {transaction.contact_name || "-"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            transaction.type === "receivable"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {transaction.type === "receivable" ? "Alacak" : "Borç"}
                        </span>
                      </TableCell>
                      <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(transaction.remaining_amount)}
                      </TableCell>
                      <TableCell>{formatDate(transaction.due_date)}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            transaction.status === "active"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                          }`}
                        >
                          {transaction.status === "active" ? "Aktif" : "Kapalı"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenPaymentSheet(transaction)}
                            disabled={transaction.status === "closed"}
                            className="text-xs"
                          >
                            Ödemeler
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(transaction)}
                            title="Düzenle"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(transaction.id)}
                            className="text-destructive hover:text-destructive"
                            title="Sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border rounded-lg">
                {searchTerm ? "Arama sonucu bulunamadı" : "Henüz borç/alacak kaydı eklenmemiş"}
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border rounded-lg p-4 space-y-3 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base truncate">
                        {transaction.contact_name || "-"}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            transaction.type === "receivable"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {transaction.type === "receivable" ? "Alacak" : "Borç"}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            transaction.status === "active"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                          }`}
                        >
                          {transaction.status === "active" ? "Aktif" : "Kapalı"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(transaction)}
                        className="h-8 w-8 p-0"
                        title="Düzenle"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(transaction.id)}
                        className="text-destructive hover:text-destructive h-8 w-8 p-0"
                        title="Sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Toplam: </span>
                      <span className="font-medium">{formatCurrency(transaction.amount)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Kalan: </span>
                      <span className="font-semibold">{formatCurrency(transaction.remaining_amount)}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Vade: </span>
                      <span>{formatDate(transaction.due_date)}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenPaymentSheet(transaction)}
                    disabled={transaction.status === "closed"}
                    className="w-full text-xs"
                  >
                    Ödemeler
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTransaction ? "Borç/Alacak Kaydı Düzenle" : "Yeni Borç/Alacak Kaydı"}
            </DialogTitle>
            <DialogDescription>
              {editingTransaction
                ? "Borç/Alacak kaydı bilgilerini güncelleyin"
                : "Yeni bir borç veya alacak kaydı oluşturun"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="contact_id">
                  Kişi/Firma <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.contact_id}
                  onValueChange={(value) => setFormData({ ...formData, contact_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kişi/Firma seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {contacts.map((contact) => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">
                    Tip <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "debt" | "receivable") =>
                      setFormData({ ...formData, type: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receivable">Alacak</SelectItem>
                      <SelectItem value="debt">Borç</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="due_date">
                    Vade Tarihi <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">
                    Toplam Tutar <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    placeholder="0.00"
                  />
                </div>

                {editingTransaction && (
                  <div className="space-y-2">
                    <Label htmlFor="remaining_amount">
                      Kalan Tutar <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="remaining_amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.remaining_amount}
                      onChange={(e) =>
                        setFormData({ ...formData, remaining_amount: e.target.value })
                      }
                      required
                      placeholder="0.00"
                    />
                  </div>
                )}

                {editingTransaction && (
                  <div className="space-y-2">
                    <Label htmlFor="status">
                      Durum <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: "active" | "closed") =>
                        setFormData({ ...formData, status: value })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Aktif</SelectItem>
                        <SelectItem value="closed">Kapalı</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Açıklama"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                İptal
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Kaydediliyor...
                  </>
                ) : editingTransaction ? (
                  "Güncelle"
                ) : (
                  "Oluştur"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Payment Sheet */}
      <Sheet open={isPaymentSheetOpen} onOpenChange={setIsPaymentSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Ödemeler</SheetTitle>
            <SheetDescription>
              {selectedTransaction && (
                <div className="space-y-2 mt-2">
                  <div>
                    <span className="font-medium">Kişi/Firma: </span>
                    {selectedTransaction.contact_name}
                  </div>
                  <div>
                    <span className="font-medium">Toplam Tutar: </span>
                    {formatCurrency(selectedTransaction.amount)}
                  </div>
                  <div>
                    <span className="font-medium">Kalan Tutar: </span>
                    <span className="font-semibold text-primary">
                      {formatCurrency(selectedTransaction.remaining_amount)}
                    </span>
                  </div>
                </div>
              )}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4 px-4">
            {loadingPayments ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-8">
                <CircleDollarSign className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Henüz ödeme kaydı bulunmuyor</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Bu borç/alacak kaydına ilk ödemeyi eklemek için aşağıdaki butona tıklayın
                </p>
                <Button 
                  onClick={handleOpenPaymentDialog} 
                  className="w-full h-12 text-base font-semibold" 
                  disabled={selectedTransaction?.status === "closed"}
                  size="lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Yeni Ödeme Ekle
                </Button>
                {selectedTransaction?.status === "closed" && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Bu kayıt kapalı olduğu için ödeme eklenemez
                  </p>
                )}
              </div>
            ) : (
              <>
                <Button 
                  onClick={handleOpenPaymentDialog} 
                  className="w-full h-11 text-base font-semibold" 
                  disabled={selectedTransaction?.status === "closed"}
                  size="lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Yeni Ödeme Ekle
                </Button>
                {selectedTransaction?.status === "closed" && (
                  <p className="text-xs text-muted-foreground text-center">
                    Bu kayıt kapalı olduğu için ödeme eklenemez
                  </p>
                )}
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Ödeme Geçmişi</h4>
                  <div className="space-y-2">
                    {payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-base">{formatCurrency(payment.amount)}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(payment.payment_date)}
                          </div>
                          {payment.description && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {payment.description}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePayment(payment.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <SheetFooter>
            <Button variant="outline" onClick={() => setIsPaymentSheetOpen(false)}>
              Kapat
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni Ödeme Ekle</DialogTitle>
            <DialogDescription>
              Bu işlem için yeni bir ödeme kaydı oluşturun
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitPayment}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="payment_amount">
                  Ödeme Tutarı <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="payment_amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={paymentFormData.amount}
                  onChange={(e) =>
                    setPaymentFormData({ ...paymentFormData, amount: e.target.value })
                  }
                  required
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_date">
                  Ödeme Tarihi <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="payment_date"
                  type="date"
                  value={paymentFormData.payment_date}
                  onChange={(e) =>
                    setPaymentFormData({ ...paymentFormData, payment_date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_description">Açıklama</Label>
                <Textarea
                  id="payment_description"
                  value={paymentFormData.description}
                  onChange={(e) =>
                    setPaymentFormData({ ...paymentFormData, description: e.target.value })
                  }
                  placeholder="Açıklama (opsiyonel)"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClosePaymentDialog}>
                İptal
              </Button>
              <Button type="submit" disabled={submittingPayment}>
                {submittingPayment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ekleniyor...
                  </>
                ) : (
                  "Ekle"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

