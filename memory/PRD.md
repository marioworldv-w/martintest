# SellerRadar Pro - Product Requirements Document

## Original Problem Statement
Build a premium internal research dashboard for analyzing third-party sellers on Amazon EU marketplaces (amazon.de, amazon.es, amazon.fr, amazon.it). Features marketplace selection, mock automation worker, seller data collection, deduplication, session memory, Excel/CSV exports, and a premium dark dashboard UI.

## Architecture
- **Frontend**: React + Tailwind CSS + shadcn/ui (dark luxury theme)
- **Backend**: FastAPI (Python) with MongoDB
- **Worker**: Mock automation worker (asyncio background task) - ready for Playwright integration
- **Database**: MongoDB collections: sellers, scan_log, sessions, processed_urls, settings
- **Exports**: openpyxl for Excel, csv module for CSV

## User Personas
- Internal marketplace researcher analyzing Amazon EU sellers
- Lead qualification analyst organizing seller data

## Core Requirements (Static)
1. Marketplace selector (DE, ES, FR, IT)
2. Run controls (start/stop/resume, continuous/target modes)
3. Delay settings (min/max seconds)
4. Live activity log (terminal-style)
5. Sellers data table with search, filters, pagination
6. Stats dashboard cards
7. Excel/CSV export (3-sheet Excel)
8. Google Sheets sync toggle (hooks ready)
9. Manual review mode
10. Session memory & resume
11. Deduplication logic

## What's Been Implemented (March 14, 2026)
- Full premium dark dashboard with glassmorphism effects
- 6 real-time stats cards (products scanned, unique sellers, records saved, duplicates, run status, sellers/hour)
- Control panel with marketplace, mode, delay controls
- Mock worker generating realistic seller data for 4 EU marketplaces
- 42+ unique seller profiles across all marketplaces
- Sellers table with search, pagination, delete, external links
- Filters panel: marketplace, country, has_phone, has_email, has_vat, has_registration, date range (calendar)
- Activity log with color-coded entries (terminal-style, JetBrains Mono)
- Excel export (3 sheets: Sellers, Scan Log, Duplicate Summary)
- CSV export
- Manual review dialog (confirm/skip pending sellers)
- Google Sheets toggle (UI ready, not connected)
- Session recovery & resume functionality
- Seed demo data (28 sellers, 87 products, 60 log entries)
- All 22 backend API endpoints tested and passing

## Prioritized Backlog
### P0 (Done)
- [x] Dashboard UI
- [x] Stats cards
- [x] Sellers table with filters/search/pagination
- [x] Control panel
- [x] Mock worker
- [x] Activity log
- [x] Excel/CSV export
- [x] Manual review mode
- [x] Session memory

### P1 (Next)
- [ ] Connect real Playwright browser automation worker
- [ ] Real Google Sheets API integration
- [ ] Google Drive export sync
- [ ] Advanced deduplication with merge logic

### P2 (Future)
- [ ] Seller detail page with full history
- [ ] Analytics charts (sellers/hour over time, marketplace distribution)
- [ ] Notification system for target reached
- [ ] Bulk operations (select multiple, export selected)
- [ ] Custom notes per seller
- [ ] Windows installer/deployment script

## Next Tasks
1. Integrate real Playwright browser automation for Amazon page browsing
2. Connect Google Sheets API for real-time sync
3. Add Recharts-based analytics (marketplace pie chart, scan rate sparkline)
4. Implement advanced bulk operations
