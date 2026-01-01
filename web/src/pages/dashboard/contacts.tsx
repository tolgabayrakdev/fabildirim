import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Search, Loader2, FileDown, AlertTriangle, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { apiUrl } from "@/lib/api"
import type { Contact } from "@/types"
import { toast } from "sonner"
import { useAuthStore } from "@/store/auth-store"
import { Link } from "react-router"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuthStore()
  const [usageStats, setUsageStats] = useState<{
    plan: string
    contacts: { used: number; limit: number | null; remaining: number | null; isUnlimited: boolean }
  } | null>(null)

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Sadece rakamları al (10 haneli, boşluk olmadan)
    const cleaned = value.replace(/\D/g, "").slice(0, 10)
    setFormData({ ...formData, phone: cleaned })
  }

  const formatPhoneForDisplay = (phone: string | null | undefined) => {
    if (!phone) return ""
    // 0 ile başlıyorsa kaldır (05371234567 -> 5371234567)
    const cleaned = phone.replace(/^0/, "").replace(/\D/g, "")
    return cleaned
  }

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const response = await fetch(apiUrl("/api/contacts"), {
        method: "GET",
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setContacts(data.data || [])
        }
      } else {
        toast.error("Kişi/Firmalar yüklenirken bir hata oluştu")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
    fetchUsageStats()
  }, [])

  const fetchUsageStats = async () => {
    try {
      const response = await fetch(apiUrl("/api/subscriptions/usage-stats"), {
        method: "GET",
        credentials: "include",
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUsageStats(data.data)
        }
      }
    } catch (error) {
      // Silent fail
    }
  }

  const handleExportPDF = async () => {
    try {
      const response = await fetch(apiUrl("/api/export/contacts"), {
        method: "GET",
        credentials: "include",
      })
      
      if (!response.ok) {
        toast.error("PDF oluşturulurken bir hata oluştu")
        return
      }
      
      const html = await response.text()
      
      // Yeni pencerede HTML'i aç
      const printWindow = window.open("", "_blank")
      if (!printWindow) {
        toast.error("Popup engelleyici nedeniyle pencere açılamadı")
        return
      }
      
      printWindow.document.write(html)
      printWindow.document.close()
      
      // Print dialog'unu aç (PDF'e kaydet seçeneği ile)
      setTimeout(() => {
        printWindow.print()
      }, 250)
    } catch (error) {
      toast.error("PDF oluşturulurken bir hata oluştu")
    }
  }

  const handleExportExcel = () => {
    window.location.href = apiUrl("/api/export/excel/contacts")
  }

  const isProPlan = user?.subscription?.plan?.name === "Pro"

  const handleOpenDialog = (contact?: Contact) => {
    if (contact) {
      setEditingContact(contact)
      setFormData({
        name: contact.name || "",
        phone: formatPhoneForDisplay(contact.phone),
        email: contact.email || "",
        address: contact.address || "",
        notes: contact.notes || "",
      })
    } else {
      setEditingContact(null)
      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        notes: "",
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingContact(null)
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const url = editingContact
        ? apiUrl(`/api/contacts/${editingContact.id}`)
        : apiUrl("/api/contacts")
      const method = editingContact ? "PUT" : "POST"

      // Telefon numarasını temizle (sadece rakamlar)
      const cleanPhone = formData.phone.replace(/\D/g, "")
      // Backend'e 0 ile başlayan 11 haneli format gönder (05379854456) veya boş bırak
      const phoneForBackend = cleanPhone.length === 10 ? `0${cleanPhone}` : cleanPhone || null

      const payload = {
        ...formData,
        phone: phoneForBackend,
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
          editingContact
            ? "Kişi/Firma başarıyla güncellendi"
            : "Kişi/Firma başarıyla oluşturuldu"
        )
        handleCloseDialog()
        fetchContacts()
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
    if (!confirm("Bu kişi/firmayı silmek istediğinize emin misiniz?")) {
      return
    }

    try {
      const response = await fetch(apiUrl(`/api/contacts/${id}`), {
        method: "DELETE",
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success("Kişi/Firma başarıyla silindi")
        fetchContacts()
      } else {
        toast.error(data.message || "Bir hata oluştu")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    }
  }

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Kişi/Firmalar</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Borç/alacak takibi yaptığınız kişi ve firmaları yönetin
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isProPlan && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <FileDown className="h-4 w-4 mr-2" />
                  Dışa Aktar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportPDF}>
                  PDF olarak dışa aktar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportExcel}>
                  Excel olarak dışa aktar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Kişi/Firma
          </Button>
        </div>
      </div>

      {/* Limit Uyarısı */}
      {usageStats && !usageStats.contacts.isUnlimited && usageStats.contacts.remaining !== null && usageStats.contacts.remaining <= 3 && (
        <Alert variant={usageStats.contacts.remaining === 0 ? "destructive" : "default"} className={usageStats.contacts.remaining === 0 ? "" : "border-amber-500 bg-amber-50 dark:bg-amber-950/20"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>
            {usageStats.contacts.remaining === 0 ? "Limit doldu!" : "Limit uyarısı"}
          </AlertTitle>
          <AlertDescription>
            {usageStats.contacts.remaining === 0 ? (
              <>
                Normal plan için maksimum {usageStats.contacts.limit} kişi/firma ekleyebilirsiniz.{" "}
                <Link to="/settings" className="text-primary hover:underline font-semibold inline-flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  Pro plana yükseltin
                </Link>
              </>
            ) : (
              <>
                {usageStats.contacts.remaining} kişi/firma ekleme hakkınız kaldı.{" "}
                <Link to="/settings" className="text-primary hover:underline font-semibold inline-flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  Pro plana yükseltin
                </Link>
              </>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Kişi/Firma ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ad</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>E-posta</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "Arama sonucu bulunamadı" : "Henüz kişi/firma eklenmemiş"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>{contact.phone || "-"}</TableCell>
                      <TableCell>{contact.email || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(contact)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(contact.id)}
                            className="text-destructive hover:text-destructive"
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
          <div className="md:hidden space-y-3">
            {filteredContacts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border rounded-lg">
                {searchTerm ? "Arama sonucu bulunamadı" : "Henüz kişi/firma eklenmemiş"}
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="border rounded-lg p-4 space-y-3 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base truncate">{contact.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(contact)}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(contact.id)}
                        className="text-destructive hover:text-destructive h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {contact.phone && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Telefon: </span>
                      {contact.phone}
                    </div>
                  )}
                  {contact.email && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">E-posta: </span>
                      <span className="break-all">{contact.email}</span>
                    </div>
                  )}
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
              {editingContact ? "Kişi/Firma Düzenle" : "Yeni Kişi/Firma Ekle"}
            </DialogTitle>
            <DialogDescription>
              {editingContact
                ? "Kişi/Firma bilgilerini güncelleyin"
                : "Yeni bir kişi veya firma ekleyin"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Ad <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Kişi veya firma adı"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 h-10 border border-input bg-background rounded-md">
                      <span className="text-lg">🇹🇷</span>
                      <span className="text-sm font-medium">+90</span>
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      placeholder="5371234567"
                      autoComplete="tel"
                      maxLength={10}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adres</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Adres bilgisi"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notlar</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Notlar"
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
                ) : editingContact ? (
                  "Güncelle"
                ) : (
                  "Oluştur"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

