import { BRAND_NAME } from "./email-templates.js";

/**
 * PDF Rapor Base Template
 */
export function getPdfBaseTemplate(content, title) {
    return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - ${BRAND_NAME}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            font-size: 12px;
            line-height: 1.5;
            color: #18181b;
            background: #ffffff;
            padding: 20px;
            max-width: 100%;
        }
        
        .header {
            border-bottom: 3px solid #52525b;
            padding-bottom: 15px;
            margin-bottom: 25px;
            page-break-after: avoid;
        }
        
        .header h1 {
            font-size: 22px;
            font-weight: 700;
            color: #18181b;
            margin-bottom: 8px;
            line-height: 1.2;
        }
        
        .header .brand {
            font-size: 13px;
            color: #71717a;
            font-weight: 500;
            margin-bottom: 5px;
        }
        
        .header .date {
            font-size: 10px;
            color: #a1a1aa;
            margin-top: 5px;
        }
        
        .content {
            margin-bottom: 30px;
            width: 100%;
        }
        
        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        
        .section-title {
            font-size: 15px;
            font-weight: 600;
            color: #18181b;
            margin-bottom: 12px;
            padding-bottom: 6px;
            border-bottom: 2px solid #e4e4e7;
            page-break-after: avoid;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 10px;
            page-break-inside: auto;
        }
        
        table thead {
            display: table-header-group;
        }
        
        table tbody {
            display: table-row-group;
        }
        
        table tr {
            page-break-inside: avoid;
            page-break-after: auto;
        }
        
        table th {
            background: #f4f4f5;
            color: #18181b;
            font-weight: 600;
            padding: 8px 6px;
            text-align: left;
            border: 1px solid #e4e4e7;
            font-size: 10px;
        }
        
        table td {
            padding: 6px;
            border: 1px solid #e4e4e7;
            font-size: 10px;
            word-wrap: break-word;
            max-width: 150px;
        }
        
        table tr:last-child td {
            border-bottom: 1px solid #e4e4e7;
        }
        
        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 600;
        }
        
        .badge-receivable {
            background: #dcfce7;
            color: #166534;
        }
        
        .badge-debt {
            background: #fee2e2;
            color: #991b1b;
        }
        
        .badge-active {
            background: #dbeafe;
            color: #1e40af;
        }
        
        .badge-closed {
            background: #f3f4f6;
            color: #374151;
        }
        
        .summary-box {
            background: #f9fafb;
            border: 1px solid #e4e4e7;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        
        .summary-row {
            display: table;
            width: 100%;
            padding: 6px 0;
            border-bottom: 1px solid #e4e4e7;
        }
        
        .summary-row:last-child {
            border-bottom: none;
        }
        
        .summary-label {
            display: table-cell;
            font-weight: 500;
            color: #52525b;
            width: 50%;
            padding-right: 10px;
        }
        
        .summary-value {
            display: table-cell;
            font-weight: 600;
            color: #18181b;
            text-align: right;
            width: 50%;
        }
        
        .summary-value.positive {
            color: #166534;
        }
        
        .summary-value.negative {
            color: #991b1b;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e4e4e7;
            text-align: center;
            font-size: 10px;
            color: #71717a;
        }
        
        .text-right {
            text-align: right;
        }
        
        .text-center {
            text-align: center;
        }
        
        @media print {
            body {
                padding: 15px;
                margin: 0;
            }
            
            .no-print {
                display: none;
            }
            
            .section {
                page-break-inside: avoid;
            }
            
            table {
                page-break-inside: auto;
            }
            
            table thead {
                display: table-header-group;
            }
            
            table tfoot {
                display: table-footer-group;
            }
            
            table tr {
                page-break-inside: avoid;
            }
            
            .header {
                page-break-after: avoid;
            }
            
            .summary-box {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${title}</h1>
        <div class="brand">${BRAND_NAME}</div>
        <div class="date">Oluşturulma Tarihi: ${new Date().toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })}</div>
    </div>
    
    <div class="content">
        ${content}
    </div>
    
    <div class="footer">
        <p>Bu rapor ${BRAND_NAME} tarafından oluşturulmuştur.</p>
        <p>© ${new Date().getFullYear()} ${BRAND_NAME}. Tüm hakları saklıdır.</p>
    </div>
</body>
</html>
    `.trim();
}

/**
 * Borç/Alacak Raporu Template
 */
export function getDebtTransactionReportTemplate(data) {
    const { summary, transactions } = data;
    
    const summaryHtml = `
        <div class="summary-box">
            <div class="summary-row">
                <span class="summary-label">Toplam Alacak:</span>
                <span class="summary-value positive">${formatCurrency(summary.total_receivable)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Toplam Borç:</span>
                <span class="summary-value negative">${formatCurrency(summary.total_debt)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Net Pozisyon:</span>
                <span class="summary-value ${summary.net_position >= 0 ? "positive" : "negative"}">
                    ${formatCurrency(summary.net_position)}
                </span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Toplam Kayıt:</span>
                <span class="summary-value">${transactions.length} adet</span>
            </div>
        </div>
    `;
    
    const transactionsHtml = transactions.length > 0 ? `
        <div class="section">
            <h2 class="section-title">Borç/Alacak Kayıtları</h2>
            <table>
                <thead>
                    <tr>
                        <th>Kişi/Firma</th>
                        <th>Tip</th>
                        <th>Toplam Tutar</th>
                        <th>Kalan Tutar</th>
                        <th>Vade Tarihi</th>
                        <th>Durum</th>
                    </tr>
                </thead>
                <tbody>
                    ${transactions.map((t) => `
                        <tr>
                            <td>${escapeHtml(t.contact_name || "-")}</td>
                            <td>
                                <span class="badge ${t.type === "receivable" ? "badge-receivable" : "badge-debt"}">
                                    ${t.type === "receivable" ? "Alacak" : "Borç"}
                                </span>
                            </td>
                            <td class="text-right">${formatCurrency(parseFloat(t.amount))}</td>
                            <td class="text-right">${formatCurrency(parseFloat(t.remaining_amount))}</td>
                            <td>${formatDate(t.due_date)}</td>
                            <td>
                                <span class="badge ${t.status === "active" ? "badge-active" : "badge-closed"}">
                                    ${t.status === "active" ? "Aktif" : "Kapalı"}
                                </span>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    ` : `
        <div class="section">
            <p>Henüz borç/alacak kaydı bulunmamaktadır.</p>
        </div>
    `;
    
    const content = summaryHtml + transactionsHtml;
    
    return getPdfBaseTemplate(content, "Borç/Alacak Raporu");
}

/**
 * Kişi/Firma Raporu Template
 */
export function getContactReportTemplate(data) {
    const { contacts } = data;
    
    const contactsHtml = contacts.length > 0 ? `
        <div class="section">
            <h2 class="section-title">Kişi/Firmalar (${contacts.length} adet)</h2>
            <table>
                <thead>
                    <tr>
                        <th>Ad</th>
                        <th>Telefon</th>
                        <th>E-posta</th>
                        <th>Adres</th>
                    </tr>
                </thead>
                <tbody>
                    ${contacts.map((c) => `
                        <tr>
                            <td>${escapeHtml(c.name)}</td>
                            <td>${c.phone || "-"}</td>
                            <td>${c.email || "-"}</td>
                            <td>${c.address ? escapeHtml(c.address.substring(0, 50)) + (c.address.length > 50 ? "..." : "") : "-"}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    ` : `
        <div class="section">
            <p>Henüz kişi/firma kaydı bulunmamaktadır.</p>
        </div>
    `;
    
    return getPdfBaseTemplate(contactsHtml, "Kişi/Firma Raporu");
}

/**
 * Dashboard Özet Raporu Template
 */
export function getDashboardReportTemplate(data) {
    const { summary, todayDue, upcomingDue } = data;
    
    const summaryHtml = `
        <div class="summary-box">
            <div class="summary-row">
                <span class="summary-label">Toplam Alacak:</span>
                <span class="summary-value positive">${formatCurrency(summary.total_receivable)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Toplam Borç:</span>
                <span class="summary-value negative">${formatCurrency(summary.total_debt)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Net Pozisyon:</span>
                <span class="summary-value ${summary.net_position >= 0 ? "positive" : "negative"}">
                    ${formatCurrency(summary.net_position)}
                </span>
            </div>
        </div>
    `;
    
    const todayDueHtml = todayDue.length > 0 ? `
        <div class="section">
            <h2 class="section-title">Bugün Vadesi Gelenler (${todayDue.length} adet)</h2>
            <table>
                <thead>
                    <tr>
                        <th>Kişi/Firma</th>
                        <th>Tip</th>
                        <th>Kalan Tutar</th>
                        <th>Vade Tarihi</th>
                    </tr>
                </thead>
                <tbody>
                    ${todayDue.map((t) => `
                        <tr>
                            <td>${escapeHtml(t.contact_name || "-")}</td>
                            <td>
                                <span class="badge ${t.type === "receivable" ? "badge-receivable" : "badge-debt"}">
                                    ${t.type === "receivable" ? "Alacak" : "Borç"}
                                </span>
                            </td>
                            <td class="text-right">${formatCurrency(parseFloat(t.remaining_amount))}</td>
                            <td>${formatDate(t.due_date)}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    ` : "";
    
    const upcomingDueHtml = upcomingDue.length > 0 ? `
        <div class="section">
            <h2 class="section-title">Vadesi Yaklaşanlar (${upcomingDue.length} adet)</h2>
            <table>
                <thead>
                    <tr>
                        <th>Kişi/Firma</th>
                        <th>Tip</th>
                        <th>Kalan Tutar</th>
                        <th>Vade Tarihi</th>
                    </tr>
                </thead>
                <tbody>
                    ${upcomingDue.map((t) => `
                        <tr>
                            <td>${escapeHtml(t.contact_name || "-")}</td>
                            <td>
                                <span class="badge ${t.type === "receivable" ? "badge-receivable" : "badge-debt"}">
                                    ${t.type === "receivable" ? "Alacak" : "Borç"}
                                </span>
                            </td>
                            <td class="text-right">${formatCurrency(parseFloat(t.remaining_amount))}</td>
                            <td>${formatDate(t.due_date)}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    ` : "";
    
    const content = summaryHtml + todayDueHtml + upcomingDueHtml;
    
    return getPdfBaseTemplate(content, "Dashboard Özet Raporu");
}

// Helper functions
function formatCurrency(amount) {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function escapeHtml(text) {
    if (!text) return "";
    const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    };
    return text.toString().replace(/[&<>"']/g, (m) => map[m]);
}

