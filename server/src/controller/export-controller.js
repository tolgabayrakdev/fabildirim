import ExportService from "../service/export-service.js";
import ExcelExportService from "../service/excel-export-service.js";

export default class ExportController {
    constructor() {
        this.exportService = new ExportService();
        this.excelExportService = new ExcelExportService();
    }

    exportDebtTransactions = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const { status, type } = req.query;
            
            const filters = {};
            if (status) filters.status = status;
            if (type) filters.type = type;
            
            const html = await this.exportService.generateDebtTransactionReport(userId, filters);
            
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.send(html);
        } catch (error) {
            next(error);
        }
    };

    exportContacts = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const html = await this.exportService.generateContactReport(userId);
            
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.send(html);
        } catch (error) {
            next(error);
        }
    };

    exportDashboard = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const upcomingDays = parseInt(req.query.upcoming_days) || 7;
            
            const html = await this.exportService.generateDashboardReport(userId, upcomingDays);
            
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.send(html);
        } catch (error) {
            next(error);
        }
    };

    // Excel (CSV) Export endpoints
    exportDebtTransactionsToExcel = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const { status, type } = req.query;
            
            const filters = {};
            if (status) filters.status = status;
            if (type) filters.type = type;
            
            const csv = await this.excelExportService.exportDebtTransactionsToCSV(userId, filters);
            
            const filename = `borc-alacak-raporu-${new Date().toISOString().split("T")[0]}.csv`;
            
            res.setHeader("Content-Type", "text/csv; charset=utf-8");
            res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
            res.send(csv);
        } catch (error) {
            next(error);
        }
    };

    exportContactsToExcel = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const csv = await this.excelExportService.exportContactsToCSV(userId);
            
            const filename = `kisi-firma-raporu-${new Date().toISOString().split("T")[0]}.csv`;
            
            res.setHeader("Content-Type", "text/csv; charset=utf-8");
            res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
            res.send(csv);
        } catch (error) {
            next(error);
        }
    };

    exportDashboardToExcel = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const upcomingDays = parseInt(req.query.upcoming_days) || 7;
            
            const csv = await this.excelExportService.exportDashboardToCSV(userId, upcomingDays);
            
            const filename = `dashboard-raporu-${new Date().toISOString().split("T")[0]}.csv`;
            
            res.setHeader("Content-Type", "text/csv; charset=utf-8");
            res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
            res.send(csv);
        } catch (error) {
            next(error);
        }
    };
}

