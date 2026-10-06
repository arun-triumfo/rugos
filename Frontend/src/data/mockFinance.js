export const mockReceivables = [
  { id: 'INV-B2B-001', invoice: 'INV-B2B-001', customer: 'HomeStyle Distributors LLC', country: 'USA', currency: 'USD', invoiceAmount: 28500, paid: 0, outstanding: 28500, invoiceDate: '2026-08-15', dueDate: '2026-09-14', status: 'Overdue', paymentReference: null, bankReference: null },
  { id: 'INV-B2B-002', invoice: 'INV-B2B-002', customer: 'Nordic Living AB', country: 'Germany', currency: 'EUR', invoiceAmount: 18200, paid: 9100, outstanding: 9100, invoiceDate: '2026-08-28', dueDate: '2026-09-27', status: 'Partially Paid', paymentReference: 'PAY-8821', bankReference: 'BNK-44102' },
  { id: 'INV-B2B-003', invoice: 'INV-B2B-003', customer: 'Pacific Imports Pty', country: 'Australia', currency: 'AUD', invoiceAmount: 22400, paid: 22400, outstanding: 0, invoiceDate: '2026-08-01', dueDate: '2026-08-31', status: 'Paid', paymentReference: 'PAY-8700', bankReference: 'BNK-43900' },
  { id: 'INV-B2B-004', invoice: 'INV-B2B-004', customer: 'Maple Retail Co', country: 'Canada', currency: 'CAD', invoiceAmount: 15600, paid: 0, outstanding: 15600, invoiceDate: '2026-09-01', dueDate: '2026-10-01', status: 'Open', paymentReference: null, bankReference: null },
  { id: 'INV-B2B-005', invoice: 'INV-B2B-005', customer: 'Britannia Home Ltd', country: 'UK', currency: 'GBP', invoiceAmount: 19800, paid: 0, outstanding: 19800, invoiceDate: '2026-07-20', dueDate: '2026-08-19', status: 'Overdue', paymentReference: null, bankReference: null },
  { id: 'INV-B2B-006', invoice: 'INV-B2B-006', customer: 'Texas Flooring Wholesale', country: 'USA', currency: 'USD', invoiceAmount: 31200, paid: 15600, outstanding: 15600, invoiceDate: '2026-09-05', dueDate: '2026-10-05', status: 'Partially Paid', paymentReference: 'PAY-8910', bankReference: 'BNK-45001' },
  { id: 'INV-B2B-007', invoice: 'INV-B2B-007', customer: 'Berlin Interiors GmbH', country: 'Germany', currency: 'EUR', invoiceAmount: 27500, paid: 0, outstanding: 27500, invoiceDate: '2026-09-10', dueDate: '2026-10-10', status: 'Open', paymentReference: null, bankReference: null },
  { id: 'INV-B2B-008', invoice: 'INV-B2B-008', customer: 'Sydney Design Hub', country: 'Australia', currency: 'AUD', invoiceAmount: 14200, paid: 0, outstanding: 14200, invoiceDate: '2026-06-15', dueDate: '2026-07-15', status: 'Overdue', paymentReference: null, bankReference: null },
  { id: 'INV-B2B-009', invoice: 'INV-B2B-009', customer: 'Cascade Rugs Inc', country: 'USA', currency: 'USD', invoiceAmount: 45000, paid: 45000, outstanding: 0, invoiceDate: '2026-08-10', dueDate: '2026-09-09', status: 'Paid', paymentReference: 'PAY-8755', bankReference: 'BNK-44200' },
  { id: 'INV-B2B-010', invoice: 'INV-B2B-010', customer: 'Ontario Décor Group', country: 'Canada', currency: 'CAD', invoiceAmount: 11800, paid: 0, outstanding: 11800, invoiceDate: '2026-09-12', dueDate: '2026-10-12', status: 'Open', paymentReference: null, bankReference: null },
  { id: 'INV-MKT-1001', invoice: 'INV-MKT-1001', customer: 'Jennifer Walsh (Amazon #1001)', country: 'USA', currency: 'INR', invoiceAmount: 20000, paid: 20000, outstanding: 0, invoiceDate: '2026-09-18', dueDate: '2026-09-18', status: 'Paid', paymentReference: 'AMZ-SETTLE', bankReference: null },
];

export const mockCourierInvoices = [
  { id: 'CI-001', invoiceNumber: 'DHL-INV-88201', courier: 'DHL', invoiceDate: '2026-09-01', amount: 48500, awbs: 12, status: 'Audited' },
  { id: 'CI-002', invoiceNumber: 'DLV-INV-99102', courier: 'Delhivery International', invoiceDate: '2026-09-05', amount: 32800, awbs: 8, status: 'Disputed' },
  { id: 'CI-003', invoiceNumber: 'UPS-INV-71001', courier: 'UPS', invoiceDate: '2026-09-08', amount: 52000, awbs: 15, status: 'Pending Audit' },
  { id: 'CI-004', invoiceNumber: 'FDX-INV-33012', courier: 'FedEx', invoiceDate: '2026-09-10', amount: 41200, awbs: 10, status: 'Audited' },
  { id: 'CI-005', invoiceNumber: 'USPS-INV-22001', courier: 'USPS', invoiceDate: '2026-09-12', amount: 18500, awbs: 9, status: 'Pending Audit' },
];

export const mockCourierAuditLines = [
  { id: 'CAL-001', invoice: 'CI-001', awb: 'JD0146000099887766', systemWeight: 14.2, billedWeight: 16.0, systemRate: 90, billedRate: 95, expectedCharge: 1300, billedCharge: 1520, variance: 220, duplicate: false, disputeStatus: 'Open' },
  { id: 'CAL-002', invoice: 'CI-001', awb: 'JD0146000011223344', systemWeight: 11.8, billedWeight: 11.8, systemRate: 72, billedRate: 72, expectedCharge: 850, billedCharge: 850, variance: 0, duplicate: false, disputeStatus: 'None' },
  { id: 'CAL-003', invoice: 'CI-001', awb: 'JD0146000055667788', systemWeight: 14.2, billedWeight: 18.0, systemRate: 180, billedRate: 195, expectedCharge: 2600, billedCharge: 3510, variance: 910, duplicate: false, disputeStatus: 'Open' },
  { id: 'CAL-004', invoice: 'CI-002', awb: 'DLV88321001', systemWeight: 11.8, billedWeight: 13.0, systemRate: 65, billedRate: 72, expectedCharge: 850, billedCharge: 936, variance: 86, duplicate: false, disputeStatus: 'Submitted' },
  { id: 'CAL-005', invoice: 'CI-002', awb: 'DLV88401002', systemWeight: 12.5, billedWeight: 12.5, systemRate: 76, billedRate: 76, expectedCharge: 950, billedCharge: 950, variance: 0, duplicate: false, disputeStatus: 'None' },
  { id: 'CAL-006', invoice: 'CI-002', awb: 'DLV88321001', systemWeight: 11.8, billedWeight: 13.0, systemRate: 65, billedRate: 72, expectedCharge: 850, billedCharge: 936, variance: 86, duplicate: true, disputeStatus: 'Open' },
  { id: 'CAL-007', invoice: 'CI-003', awb: '1Z999AA10123456784', systemWeight: 13.0, billedWeight: 14.0, systemRate: 114, billedRate: 128, expectedCharge: 1600, billedCharge: 1792, variance: 192, duplicate: false, disputeStatus: 'Open' },
  { id: 'CAL-008', invoice: 'CI-003', awb: '1Z999BB20234567890', systemWeight: 15.6, billedWeight: 15.6, systemRate: 70, billedRate: 70, expectedCharge: 1100, billedCharge: 1100, variance: 0, duplicate: false, disputeStatus: 'None' },
  { id: 'CAL-009', invoice: 'CI-003', awb: '1Z999CC30345678901', systemWeight: 28.5, billedWeight: 32.0, systemRate: 68, billedRate: 75, expectedCharge: 1800, billedCharge: 2400, variance: 600, duplicate: false, disputeStatus: 'Open' },
  { id: 'CAL-010', invoice: 'CI-003', awb: '1Z999DD40456789012', systemWeight: 22.0, billedWeight: 24.0, systemRate: 87, billedRate: 87, expectedCharge: 2000, billedCharge: 2088, variance: 88, duplicate: false, disputeStatus: 'None' },
  { id: 'CAL-011', invoice: 'CI-004', awb: '794612345678', systemWeight: 22.0, billedWeight: 24.0, systemRate: 100, billedRate: 100, expectedCharge: 2200, billedCharge: 2400, variance: 200, duplicate: false, disputeStatus: 'Recovered' },
  { id: 'CAL-012', invoice: 'CI-004', awb: '794698765432', systemWeight: 24.0, billedWeight: 26.0, systemRate: 61, billedRate: 68, expectedCharge: 1400, billedCharge: 1768, variance: 368, duplicate: false, disputeStatus: 'Open' },
  { id: 'CAL-013', invoice: 'CI-004', awb: '794611122233', systemWeight: 38.0, billedWeight: 40.0, systemRate: 70, billedRate: 70, expectedCharge: 2600, billedCharge: 2800, variance: 200, duplicate: false, disputeStatus: 'None' },
  { id: 'CAL-014', invoice: 'CI-005', awb: '9400111899223344556677', systemWeight: 18.0, billedWeight: 19.0, systemRate: 50, billedRate: 50, expectedCharge: 900, billedCharge: 950, variance: 50, duplicate: false, disputeStatus: 'None' },
  { id: 'CAL-015', invoice: 'CI-005', awb: '9400111899229988776655', systemWeight: 15.0, billedWeight: 15.0, systemRate: 52, billedRate: 52, expectedCharge: 750, billedCharge: 780, variance: 30, duplicate: false, disputeStatus: 'None' },
];

export const mockEbrc = [
  { id: 'EBRC-001', invoice: 'INV-EXP-8821', customer: 'Pacific Imports Pty', currency: 'AUD', invoiceAmount: 22400, realizedAmount: 22400, bankReference: 'SBI-FIRC-441', exportDate: '2026-08-01', dueDate: '2026-09-15', ebrcStatus: 'Completed', brcStatus: 'Completed', documents: ['Shipping Bill', 'FIRC'] },
  { id: 'EBRC-002', invoice: 'INV-EXP-8901', customer: 'HomeStyle Distributors LLC', currency: 'USD', invoiceAmount: 28500, realizedAmount: 0, bankReference: null, exportDate: '2026-08-15', dueDate: '2026-09-30', ebrcStatus: 'Pending', brcStatus: 'Pending', documents: ['Commercial Invoice'] },
  { id: 'EBRC-003', invoice: 'INV-EXP-9010', customer: 'Britannia Home Ltd', currency: 'GBP', invoiceAmount: 19800, realizedAmount: 19800, bankReference: 'HDFC-FIRC-992', exportDate: '2026-07-20', dueDate: '2026-09-01', ebrcStatus: 'Verified', brcStatus: 'Submitted', documents: ['Shipping Bill', 'AWB', 'FIRC'] },
  { id: 'EBRC-004', invoice: 'INV-EXP-9102', customer: 'Nordic Living AB', currency: 'EUR', invoiceAmount: 18200, realizedAmount: 9100, bankReference: 'SBI-FIRC-502', exportDate: '2026-08-28', dueDate: '2026-10-10', ebrcStatus: 'Submitted', brcStatus: 'Pending', documents: ['Commercial Invoice', 'Packing List'] },
  { id: 'EBRC-005', invoice: 'INV-EXP-9200', customer: 'Berlin Interiors GmbH', currency: 'EUR', invoiceAmount: 27500, realizedAmount: 0, bankReference: null, exportDate: '2026-09-10', dueDate: '2026-10-25', ebrcStatus: 'Pending', brcStatus: 'Pending', documents: [] },
];

export const mockFira = [
  { id: 'FIRA-001', invoice: 'INV-EXP-8821', customer: 'Pacific Imports Pty', foreignCurrency: 'AUD', amount: 22400, receiptDate: '2026-08-28', bank: 'SBI', transactionReference: 'SBI-FIRC-441', firaStatus: 'Completed', documents: ['FIRC', 'Bank Advice'] },
  { id: 'FIRA-002', invoice: 'INV-EXP-9010', customer: 'Britannia Home Ltd', foreignCurrency: 'GBP', amount: 19800, receiptDate: '2026-08-25', bank: 'HDFC', transactionReference: 'HDFC-FIRC-992', firaStatus: 'Verified', documents: ['FIRC'] },
  { id: 'FIRA-003', invoice: 'INV-EXP-8901', customer: 'HomeStyle Distributors LLC', foreignCurrency: 'USD', amount: 28500, receiptDate: null, bank: 'SBI', transactionReference: null, firaStatus: 'Pending', documents: [] },
  { id: 'FIRA-004', invoice: 'INV-EXP-9102', customer: 'Nordic Living AB', foreignCurrency: 'EUR', amount: 9100, receiptDate: '2026-09-15', bank: 'SBI', transactionReference: 'SBI-FIRC-502', firaStatus: 'Submitted', documents: ['Partial FIRC'] },
];

export const mockExportDocuments = [
  { id: 'DOC-001', documentNumber: 'CI-2026-0918-1001', shipment: 'SHP-1001', type: 'Commercial Invoice', version: 1, createdDate: '2026-09-18', status: 'Draft', createdBy: 'System' },
  { id: 'DOC-002', documentNumber: 'PL-2026-0918-1001', shipment: 'SHP-1001', type: 'Packing List', version: 1, createdDate: '2026-09-18', status: 'Draft', createdBy: 'System' },
  { id: 'DOC-003', documentNumber: 'CI-2026-0908-REP1', shipment: 'REP-2026-001', type: 'Commercial Invoice', version: 2, createdDate: '2026-09-08', status: 'Final', createdBy: 'Accounts Manager' },
  { id: 'DOC-004', documentNumber: 'PL-2026-0908-REP1', shipment: 'REP-2026-001', type: 'Packing List', version: 2, createdDate: '2026-09-08', status: 'Final', createdBy: 'Logistics Manager' },
  { id: 'DOC-005', documentNumber: 'PI-2026-0912-REP2', shipment: 'REP-2026-002', type: 'Proforma Invoice', version: 1, createdDate: '2026-09-12', status: 'Approved', createdBy: 'Sales Manager' },
  { id: 'DOC-006', documentNumber: 'SB-2026-0915-REP2', shipment: 'REP-2026-002', type: 'Shipping Bill', version: 1, createdDate: '2026-09-15', status: 'Submitted', createdBy: 'Logistics Manager' },
  { id: 'DOC-007', documentNumber: 'AWB-DHL-1005', shipment: 'SHP-1005', type: 'AWB / BL', version: 1, createdDate: '2026-09-16', status: 'Final', createdBy: 'India Warehouse' },
  { id: 'DOC-008', documentNumber: 'COO-2026-0908', shipment: 'REP-2026-001', type: 'Certificate / Origin Reference', version: 1, createdDate: '2026-09-08', status: 'Final', createdBy: 'Accounts Manager' },
  { id: 'DOC-009', documentNumber: 'CI-2026-0916-1005', shipment: 'SHP-1005', type: 'Commercial Invoice', version: 1, createdDate: '2026-09-16', status: 'Generated', createdBy: 'System' },
  { id: 'DOC-010', documentNumber: 'PL-2026-0916-1005', shipment: 'SHP-1005', type: 'Packing List', version: 1, createdDate: '2026-09-16', status: 'Generated', createdBy: 'System' },
  { id: 'DOC-011', documentNumber: 'CI-2026-0912-1012', shipment: 'SHP-1012', type: 'Commercial Invoice', version: 1, createdDate: '2026-09-12', status: 'Approved', createdBy: 'Accounts Manager' },
  { id: 'DOC-012', documentNumber: 'EXP-DET-001', shipment: 'REP-2026-001', type: 'Exporter Details', version: 1, createdDate: '2026-09-05', status: 'Final', createdBy: 'Super Admin' },
  { id: 'DOC-013', documentNumber: 'INCO-FOB-REP1', shipment: 'REP-2026-001', type: 'Incoterms', version: 1, createdDate: '2026-09-05', status: 'Final', createdBy: 'Logistics Manager' },
  { id: 'DOC-014', documentNumber: 'HS-5701-RUG', shipment: 'REP-2026-001', type: 'HS Codes', version: 1, createdDate: '2026-09-05', status: 'Final', createdBy: 'Accounts Manager' },
  { id: 'DOC-015', documentNumber: 'SUP-QC-REP1', shipment: 'REP-2026-001', type: 'Supporting Documents', version: 1, createdDate: '2026-09-07', status: 'Final', createdBy: 'India Warehouse' },
  { id: 'DOC-016', documentNumber: 'CI-2026-0907-1022', shipment: 'SHP-1022', type: 'Commercial Invoice', version: 1, createdDate: '2026-09-07', status: 'Submitted', createdBy: 'Accounts Manager' },
];

export const mockPayments = [
  { id: 'PAY-8700', invoice: 'INV-B2B-003', amount: 22400, date: '2026-08-30', method: 'Wire', reference: 'BNK-43900' },
  { id: 'PAY-8755', invoice: 'INV-B2B-009', amount: 45000, date: '2026-09-08', method: 'Wire', reference: 'BNK-44200' },
  { id: 'PAY-8821', invoice: 'INV-B2B-002', amount: 9100, date: '2026-09-10', method: 'Wire', reference: 'BNK-44102' },
  { id: 'PAY-8910', invoice: 'INV-B2B-006', amount: 15600, date: '2026-09-18', method: 'Wire', reference: 'BNK-45001' },
];
