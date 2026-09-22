export const mockShipments = [
  { id: 'SHP-1001', order: '#1001', courier: null, awb: null, origin: 'India Main Warehouse', destination: 'USA East Warehouse', weight: 28.5, dimWeight: 32, chargeableWeight: 32, estimatedCost: 1250, actualCost: null, status: 'Not Created', lastUpdate: '2026-09-18T09:05:00', tracking: [] },
  { id: 'SHP-1002', order: '#1002', courier: 'UPS', awb: '1Z999AA10123456784', origin: 'USA East Warehouse', destination: 'Seattle, WA', weight: 13.0, dimWeight: 14, chargeableWeight: 14, estimatedCost: 1600, actualCost: 1800, status: 'In Transit', lastUpdate: '2026-09-21T14:00:00', tracking: [
    { at: '2026-09-19T10:00:00', event: 'Shipment created', location: 'USA East Warehouse' },
    { at: '2026-09-19T16:00:00', event: 'Picked up by UPS', location: 'Newark, NJ' },
    { at: '2026-09-21T08:00:00', event: 'In transit', location: 'Chicago Hub' },
  ]},
  { id: 'SHP-1003', order: '#1003', courier: 'Delhivery International', awb: 'DLV88321001', origin: 'India Main Warehouse', destination: 'Chicago, IL', weight: 11.8, dimWeight: 13, chargeableWeight: 13, estimatedCost: 850, actualCost: 900, status: 'Ready', lastUpdate: '2026-09-17T15:00:00', tracking: [] },
  { id: 'SHP-1004', order: '#1004', courier: 'FedEx', awb: '794612345678', origin: 'USA East Warehouse', destination: 'Toronto, ON', weight: 22.0, dimWeight: 24, chargeableWeight: 24, estimatedCost: 2200, actualCost: 2400, status: 'Delivered', lastUpdate: '2026-09-20T11:00:00', tracking: [
    { at: '2026-09-17T09:00:00', event: 'Dispatched', location: 'Newark, NJ' },
    { at: '2026-09-19T18:00:00', event: 'Customs cleared', location: 'Toronto' },
    { at: '2026-09-20T11:00:00', event: 'Delivered', location: 'Toronto, ON' },
  ]},
  { id: 'SHP-1005', order: '#1005', courier: 'DHL', awb: 'JD0146000099887766', origin: 'India Main Warehouse', destination: 'Denver, CO', weight: 14.2, dimWeight: 16, chargeableWeight: 16, estimatedCost: 1300, actualCost: 1400, status: 'In Transit', lastUpdate: '2026-09-20T08:00:00', tracking: [
    { at: '2026-09-16T14:00:00', event: 'Dispatched India', location: 'Jaipur' },
    { at: '2026-09-18T06:00:00', event: 'Departed origin', location: 'DEL Airport' },
    { at: '2026-09-20T08:00:00', event: 'In transit to destination', location: 'CVG Hub' },
  ]},
  { id: 'SHP-1007', order: '#1007', courier: 'Amazon Logistics', awb: 'AMZL-554433', origin: 'Amazon FBA', destination: 'San Francisco, CA', weight: 38.0, dimWeight: 40, chargeableWeight: 40, estimatedCost: 0, actualCost: 0, status: 'Delivered', lastUpdate: '2026-09-16T12:00:00', tracking: [] },
  { id: 'SHP-1008', order: '#1008', courier: 'USPS', awb: '9400111899223344556677', origin: 'USA East Warehouse', destination: 'Miami, FL', weight: 18.0, dimWeight: 19, chargeableWeight: 19, estimatedCost: 900, actualCost: 950, status: 'Out for Delivery', lastUpdate: '2026-09-22T07:30:00', tracking: [] },
  { id: 'SHP-1012', order: '#1012', courier: 'Delhivery International', awb: 'DLV88401002', origin: 'India Main Warehouse', destination: 'USA East Warehouse', weight: 12.5, dimWeight: 14, chargeableWeight: 14, estimatedCost: 950, actualCost: 1000, status: 'Dispatched', lastUpdate: '2026-09-12T18:00:00', tracking: [] },
  { id: 'SHP-1013', order: '#1013', courier: 'FedEx', awb: '794698765432', origin: 'USA East Warehouse', destination: 'New York, NY', weight: 24.0, dimWeight: 26, chargeableWeight: 26, estimatedCost: 1400, actualCost: 1600, status: 'Exception', lastUpdate: '2026-09-21T09:00:00', tracking: [
    { at: '2026-09-18T10:00:00', event: 'Shipped', location: 'Newark, NJ' },
    { at: '2026-09-21T09:00:00', event: 'Delivery exception — recipient unavailable', location: 'New York, NY' },
  ]},
  { id: 'SHP-1016', order: '#1016', courier: 'UPS', awb: '1Z999CC30345678901', origin: 'USA East Warehouse', destination: 'Portland, OR', weight: 28.5, dimWeight: 32, chargeableWeight: 32, estimatedCost: 1800, actualCost: 2200, status: 'RTO', lastUpdate: '2026-09-18T16:00:00', tracking: [] },
  { id: 'SHP-1011', order: '#1011', courier: 'UPS', awb: '1Z999BB20234567890', origin: 'USA East Warehouse', destination: 'Atlanta, GA', weight: 15.6, dimWeight: 16, chargeableWeight: 16, estimatedCost: 1000, actualCost: 1100, status: 'Delivered', lastUpdate: '2026-09-15T14:00:00', tracking: [] },
  { id: 'SHP-1019', order: '#1019', courier: 'UPS', awb: '1Z999DD40456789012', origin: 'USA East Warehouse', destination: 'Mountain View, CA', weight: 22.0, dimWeight: 24, chargeableWeight: 24, estimatedCost: 2000, actualCost: 2100, status: 'Delivered', lastUpdate: '2026-09-12T11:00:00', tracking: [] },
  { id: 'SHP-1020', order: '#1020', courier: 'USPS', awb: '9400111899229988776655', origin: 'USA East Warehouse', destination: 'Philadelphia, PA', weight: 15.0, dimWeight: 15, chargeableWeight: 15, estimatedCost: 750, actualCost: 780, status: 'Delivered', lastUpdate: '2026-09-11T10:00:00', tracking: [] },
  { id: 'SHP-1022', order: '#1022', courier: 'DHL', awb: 'JD0146000055667788', origin: 'India Main Warehouse', destination: 'Melbourne, AU', weight: 14.2, dimWeight: 16, chargeableWeight: 16, estimatedCost: 2600, actualCost: 2800, status: 'In Transit', lastUpdate: '2026-09-20T06:00:00', tracking: [] },
  { id: 'SHP-1023', order: '#1023', courier: 'FedEx', awb: '794611122233', origin: 'USA East Warehouse', destination: 'Dallas, TX', weight: 38.0, dimWeight: 40, chargeableWeight: 40, estimatedCost: 2600, actualCost: 2800, status: 'Delivered', lastUpdate: '2026-09-10T15:00:00', tracking: [] },
  { id: 'SHP-1025', order: '#1025', courier: 'UPS', awb: '1Z999EE50567890123', origin: 'USA East Warehouse', destination: 'Philadelphia, PA', weight: 28.5, dimWeight: 32, chargeableWeight: 32, estimatedCost: 1050, actualCost: 1100, status: 'Delivered', lastUpdate: '2026-09-08T12:00:00', tracking: [] },
];

export const mockCourierReferences = [
  { id: 'CR-001', order: '#1003', provider: 'Delhivery International', reference: 'DLV-INT-88321', awb: 'DLV88321001', qrReference: 'QR-DLV-88321', serviceType: 'Express', weight: 11.8, dimensions: '120x80x15 cm', estimatedCost: 850, notes: 'Mapped from India courier portal', status: 'Mapped' },
  { id: 'CR-002', order: '#1005', provider: 'DHL', reference: 'DHL-99887766', awb: 'JD0146000099887766', qrReference: 'QR-DHL-9988', serviceType: 'Express Worldwide', weight: 14.2, dimensions: '100x70x12 cm', estimatedCost: 1300, notes: 'Manual AWB entry', status: 'Mapped' },
  { id: 'CR-003', order: '#1012', provider: 'Delhivery International', reference: 'DLV-INT-88401', awb: 'DLV88401002', qrReference: 'QR-DLV-88401', serviceType: 'Standard', weight: 12.5, dimensions: '90x60x12 cm', estimatedCost: 950, notes: '', status: 'Mapped' },
  { id: 'CR-004', order: '#1017', provider: 'DHL', reference: 'DHL-11223344', awb: 'JD0146000011223344', qrReference: 'QR-DHL-1122', serviceType: 'Express', weight: 11.8, dimensions: '120x80x15 cm', estimatedCost: 850, notes: '', status: 'Mapped' },
  { id: 'CR-005', order: '#1001', provider: null, reference: null, awb: null, qrReference: null, serviceType: null, weight: 28.5, dimensions: '250x180x12 cm', estimatedCost: 1250, notes: 'Awaiting external courier portal reference', status: 'Pending' },
];

export const mockExceptions = [
  { id: 'EX-001', shipment: 'SHP-1013', order: '#1013', type: 'Delivery Exception', courier: 'FedEx', awb: '794698765432', status: 'Open', age: '1 day', notes: 'Recipient unavailable' },
  { id: 'EX-002', shipment: 'SHP-1016', order: '#1016', type: 'RTO', courier: 'UPS', awb: '1Z999CC30345678901', status: 'In Progress', age: '4 days', notes: 'Customer refused delivery' },
  { id: 'EX-003', shipment: 'SHP-1005', order: '#1005', type: 'Delay', courier: 'DHL', awb: 'JD0146000099887766', status: 'Monitoring', age: '2 days', notes: 'Hub delay at CVG' },
  { id: 'EX-004', shipment: 'SHP-1008', order: '#1008', type: 'Address Issue', courier: 'USPS', awb: '9400111899223344556677', status: 'Resolved', age: '0 days', notes: 'Address corrected' },
];

export const mockReplenishments = [
  {
    id: 'REP-2026-001', createdDate: '2026-09-05', indiaWarehouse: 'India Main Warehouse', usaWarehouse: 'USA East Warehouse',
    skus: [
      { sku: 'RUG-1001', product: 'Hand Knotted Wool Rug', qty: 4 },
      { sku: 'RUG-1002', product: 'Hand Tufted Rug', qty: 8 },
      { sku: 'RUG-1006', product: 'Flatweave Kilim', qty: 10 },
      { sku: 'RUG-1009', product: 'Natural Jute Runner', qty: 15 },
    ],
    totalUnits: 37, cartons: 12, grossWeight: 285, freightCost: 185000, etd: '2026-09-08', eta: '2026-09-18',
    status: 'USA Received', timeline: [
      { at: '2026-09-05', title: 'Draft created' },
      { at: '2026-09-06', title: 'Approved by Management' },
      { at: '2026-09-07', title: 'Packing completed' },
      { at: '2026-09-08', title: 'Dispatched India' },
      { at: '2026-09-09', title: 'In Transit' },
      { at: '2026-09-18', title: 'USA Received — matched' },
    ],
  },
  {
    id: 'REP-2026-002', createdDate: '2026-09-12', indiaWarehouse: 'India Main Warehouse', usaWarehouse: 'USA East Warehouse',
    skus: [
      { sku: 'RUG-1003', product: 'Jute Area Rug', qty: 20 },
      { sku: 'RUG-1007', product: 'Modern Geometric Rug', qty: 12 },
      { sku: 'RUG-1014', product: 'Outdoor Patio Rug', qty: 15 },
    ],
    totalUnits: 47, cartons: 16, grossWeight: 340, freightCost: 210000, etd: '2026-09-15', eta: '2026-09-25',
    status: 'In Transit', timeline: [
      { at: '2026-09-12', title: 'Draft created' },
      { at: '2026-09-13', title: 'Approved' },
      { at: '2026-09-14', title: 'Packing' },
      { at: '2026-09-15', title: 'Dispatched India' },
      { at: '2026-09-16', title: 'In Transit' },
    ],
  },
  {
    id: 'REP-2026-003', createdDate: '2026-09-18', indiaWarehouse: 'India Main Warehouse', usaWarehouse: 'USA East Warehouse',
    skus: [
      { sku: 'RUG-1004', product: 'Vintage Persian Rug', qty: 3 },
      { sku: 'RUG-1005', product: 'Wool Silk Rug', qty: 2 },
      { sku: 'RUG-1010', product: 'Luxury Wool Rug', qty: 3 },
    ],
    totalUnits: 8, cartons: 8, grossWeight: 220, freightCost: 95000, etd: '2026-09-22', eta: '2026-10-02',
    status: 'Packing', timeline: [
      { at: '2026-09-18', title: 'Draft created' },
      { at: '2026-09-19', title: 'Approved' },
      { at: '2026-09-20', title: 'Packing started' },
    ],
  },
  {
    id: 'REP-2026-004', createdDate: '2026-09-20', indiaWarehouse: 'India Main Warehouse', usaWarehouse: 'Amazon FBA',
    skus: [
      { sku: 'RUG-1003', product: 'Jute Area Rug', qty: 25 },
      { sku: 'RUG-1009', product: 'Natural Jute Runner', qty: 30 },
      { sku: 'RUG-1016', product: 'Kids Playroom Rug', qty: 20 },
    ],
    totalUnits: 75, cartons: 22, grossWeight: 410, freightCost: 275000, etd: null, eta: null,
    status: 'Approved', timeline: [
      { at: '2026-09-20', title: 'Draft created' },
      { at: '2026-09-21', title: 'Approved for FBA replenishment' },
    ],
  },
  {
    id: 'REP-2026-005', createdDate: '2026-09-21', indiaWarehouse: 'India Main Warehouse', usaWarehouse: 'USA East Warehouse',
    skus: [
      { sku: 'RUG-1013', product: 'Moroccan Trellis Rug', qty: 10 },
      { sku: 'RUG-1008', product: 'Traditional Oriental Rug', qty: 6 },
    ],
    totalUnits: 16, cartons: 10, grossWeight: 190, freightCost: 120000, etd: null, eta: null,
    status: 'Draft', timeline: [
      { at: '2026-09-21', title: 'Draft created — awaiting approval' },
    ],
  },
];

export const mockUsaReceipts = [
  { id: 'RCP-USA-041', replenishment: 'REP-2026-001', date: '2026-09-18', sku: 'RUG-1001', expected: 4, received: 4, difference: 0, condition: 'Good', status: 'Matched' },
  { id: 'RCP-USA-042', replenishment: 'REP-2026-001', date: '2026-09-18', sku: 'RUG-1002', expected: 8, received: 8, difference: 0, condition: 'Good', status: 'Matched' },
  { id: 'RCP-USA-043', replenishment: 'REP-2026-001', date: '2026-09-18', sku: 'RUG-1006', expected: 10, received: 9, difference: -1, condition: 'Good', status: 'Short' },
  { id: 'RCP-USA-044', replenishment: 'REP-2026-001', date: '2026-09-18', sku: 'RUG-1009', expected: 15, received: 15, difference: 0, condition: 'Good', status: 'Matched' },
  { id: 'RCP-USA-045', replenishment: 'REP-2026-002', date: '2026-09-25', sku: 'RUG-1003', expected: 20, received: null, difference: null, condition: null, status: 'Pending' },
  { id: 'RCP-USA-046', order: '#1001', date: null, sku: 'RUG-1001', expected: 1, received: null, difference: null, condition: null, status: 'Awaiting Dispatch' },
];
