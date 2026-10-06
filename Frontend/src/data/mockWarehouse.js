export const mockReturns = [
  { id: 'RET-001', originalOrder: '#1016', originalShipment: 'SHP-1016', customer: 'Chris Evans', sku: 'RUG-1001', product: 'Hand Knotted Wool Rug', qty: 1, reason: 'Customer refused delivery (RTO)', returnDestination: 'USA East Warehouse', condition: 'Resalable', refundStatus: 'Pending', replacementStatus: 'None', status: 'In Transit Return' },
  { id: 'RET-002', originalOrder: '#1013', originalShipment: 'SHP-1013', customer: 'Olivia Martinez', sku: 'RUG-1015', product: 'Antique Wash Rug', qty: 1, reason: 'Delivery exception — customer requested return', returnDestination: 'USA East Warehouse', condition: 'Resalable', refundStatus: 'Not Started', replacementStatus: 'None', status: 'Requested' },
  { id: 'RET-003', originalOrder: '#1004', originalShipment: 'SHP-1004', customer: 'Michael Torres', sku: 'RUG-1008', product: 'Traditional Oriental Rug', qty: 1, reason: 'Color not as expected', returnDestination: 'USA East Warehouse', condition: 'Resalable', refundStatus: 'Refunded', replacementStatus: 'None', status: 'Closed' },
  { id: 'RET-004', originalOrder: '#1002', originalShipment: 'SHP-1002', customer: 'Robert Chen', sku: 'RUG-1006', product: 'Flatweave Kilim', qty: 1, reason: 'Damaged in transit', returnDestination: 'USA East Warehouse', condition: 'Damaged', refundStatus: 'Pending', replacementStatus: 'Approved', status: 'Inspected' },
  { id: 'RET-005', originalOrder: '#1011', originalShipment: 'SHP-1011', customer: 'Karen Davis', sku: 'RUG-1009', product: 'Natural Jute Runner', qty: 1, reason: 'Wrong size shipped', returnDestination: 'USA East Warehouse', condition: 'Resalable', refundStatus: 'Refunded', replacementStatus: 'Shipped', status: 'Closed' },
  { id: 'RET-006', originalOrder: '#1008', originalShipment: 'SHP-1008', customer: 'Lisa Nguyen', sku: 'RUG-1007', product: 'Modern Geometric Rug', qty: 1, reason: 'Changed mind', returnDestination: 'USA East Warehouse', condition: 'Resalable', refundStatus: 'Not Started', replacementStatus: 'None', status: 'Approved' },
  { id: 'RET-007', originalOrder: '#1020', originalShipment: 'SHP-1020', customer: 'Patricia White', sku: 'RUG-1016', product: 'Kids Playroom Rug', qty: 1, reason: 'Stain on arrival', returnDestination: 'USA East Warehouse', condition: 'Repairable', refundStatus: 'Pending', replacementStatus: 'None', status: 'Received' },
  { id: 'RET-008', originalOrder: '#1007', originalShipment: 'SHP-1007', customer: 'David Park', sku: 'RUG-1010', product: 'Luxury Wool Rug', qty: 1, reason: 'Quality concern', returnDestination: 'Amazon FBA', condition: 'Resalable', refundStatus: 'Refunded', replacementStatus: 'None', status: 'Closed' },
];

export const mockClaims = [
  { id: 'CLM-001', shipment: 'SHP-1016', order: '#1016', courier: 'UPS', claimType: 'RTO Damage', claimAmount: 2200, approvedAmount: null, status: 'Submitted', evidence: ['Photos', 'AWB'], notes: 'Tentative Workflow — claim rules pending finalization', tentative: true },
  { id: 'CLM-002', shipment: 'SHP-1013', order: '#1013', courier: 'FedEx', claimType: 'Delay Compensation', claimAmount: 500, approvedAmount: 250, status: 'Partially Approved', evidence: ['Tracking log'], notes: 'Tentative Workflow', tentative: true },
  { id: 'CLM-003', shipment: 'SHP-1005', order: '#1005', courier: 'DHL', claimType: 'Weight Overbilling', claimAmount: 220, approvedAmount: 220, status: 'Recovered', evidence: ['Courier invoice audit'], notes: 'Linked to courier audit CAL-001', tentative: true },
  { id: 'CLM-004', shipment: 'REP-2026-001', order: null, courier: 'Ocean Freight', claimType: 'Shortage', claimAmount: 3100, approvedAmount: null, status: 'Under Review', evidence: ['USA receipt RCP-USA-043'], notes: '1 unit short on RUG-1006', tentative: true },
  { id: 'CLM-005', shipment: 'SHP-1022', order: '#1022', courier: 'DHL', claimType: 'Transit Damage', claimAmount: 1500, approvedAmount: null, status: 'Draft', evidence: [], notes: 'Tentative Workflow — awaiting photos', tentative: true },
];

export const mockMto = [
  { id: 'MTO-001', order: '#1018', sku: 'RUG-1006', product: 'Flatweave Kilim', qty: 1, customer: 'Nina Patel', expectedReady: '2026-09-28', stage: 'Production', pendingQty: 1, notes: 'Custom colorway — indigo/cream', attachments: [] },
  { id: 'MTO-002', order: '#1027', sku: 'RUG-1005', product: 'Wool Silk Rug', qty: 1, customer: 'Custom B2B', expectedReady: '2026-10-05', stage: 'To Make', pendingQty: 1, notes: 'Bespoke size 7x11', attachments: [] },
  { id: 'MTO-003', order: '#1028', sku: 'RUG-1001', product: 'Hand Knotted Wool Rug', qty: 2, customer: 'Cascade Rugs Inc', expectedReady: '2026-10-12', stage: 'QC Ready', pendingQty: 0, notes: 'Bulk B2B order', attachments: ['QC sheet'] },
  { id: 'MTO-004', order: '#1029', sku: 'RUG-1015', product: 'Antique Wash Rug', qty: 1, customer: 'Private Client', expectedReady: '2026-09-25', stage: 'Pack', pendingQty: 0, notes: 'Ready to pack', attachments: [] },
  { id: 'MTO-005', order: '#1030', sku: 'RUG-1004', product: 'Vintage Persian Rug', qty: 1, customer: 'Nordic Living AB', expectedReady: '2026-10-20', stage: 'To Make', pendingQty: 1, notes: 'Special dye lot', attachments: [] },
  { id: 'MTO-006', order: '#1031', sku: 'RUG-1010', product: 'Luxury Wool Rug', qty: 1, customer: 'HomeStyle Distributors', expectedReady: '2026-10-08', stage: 'Production', pendingQty: 1, notes: '', attachments: [] },
];

export const mockPickPack = [
  { id: 'PP-001', order: '#1001', sku: 'RUG-1001', product: 'Hand Knotted Wool Rug', thumbnail: null, bin: 'IND-RUG-01', orderedQty: 1, pickQty: 0, packedQty: 0, barcode: '8901001001001', operator: 'Amit Singh', status: 'Awaiting Pick' },
  { id: 'PP-002', order: '#1009', sku: 'RUG-1004', product: 'Vintage Persian Rug', thumbnail: null, bin: 'IND-B-01', orderedQty: 1, pickQty: 1, packedQty: 0, barcode: '8901001001004', operator: 'Amit Singh', status: 'Picking' },
  { id: 'PP-003', order: '#1003', sku: 'RUG-1003', product: 'Jute Area Rug', thumbnail: null, bin: 'IND-A-02', orderedQty: 1, pickQty: 1, packedQty: 1, barcode: '8901001001003', operator: 'Ravi Kumar', status: 'Packed' },
  { id: 'PP-004', order: '#1006', sku: 'RUG-1005', product: 'Wool Silk Rug', thumbnail: null, bin: 'IND-RUG-01', orderedQty: 1, pickQty: 1, packedQty: 1, barcode: '8901001001005', operator: 'Ravi Kumar', status: 'Packed' },
  { id: 'PP-005', order: '#1017', sku: 'RUG-1003', product: 'Jute Area Rug', thumbnail: null, bin: 'IND-A-02', orderedQty: 1, pickQty: 1, packedQty: 1, barcode: '8901001001003', operator: 'Amit Singh', status: 'Packed' },
  { id: 'PP-006', order: '#1014', sku: 'RUG-1011', product: 'Round Braided Rug', thumbnail: null, bin: 'IND-A-01', orderedQty: 2, pickQty: 0, packedQty: 0, barcode: '8901001001011', operator: 'Unassigned', status: 'Awaiting Pick' },
  { id: 'PP-007', order: '#1021', sku: 'RUG-1005', product: 'Wool Silk Rug', thumbnail: null, bin: 'IND-RUG-01', orderedQty: 1, pickQty: 0, packedQty: 0, barcode: '8901001001005', operator: 'Unassigned', status: 'Awaiting Pick' },
  { id: 'PP-008', order: '#1012', sku: 'RUG-1012', product: 'Shaggy Plush Rug', thumbnail: null, bin: 'IND-A-02', orderedQty: 1, pickQty: 1, packedQty: 1, barcode: '8901001001012', operator: 'Ravi Kumar', status: 'Packed' },
];

export const mockPackingQueue = [
  { id: 'PQ-001', order: '#1009', sku: 'RUG-1004', status: 'Awaiting Pack Spec', cartons: 0, proof: null },
  { id: 'PQ-002', order: '#1003', sku: 'RUG-1003', status: 'Ready for Dispatch', cartons: 1, proof: 'packing-proof-1003.jpg' },
  { id: 'PQ-003', order: '#1006', sku: 'RUG-1005', status: 'Ready for Dispatch', cartons: 1, proof: 'packing-proof-1006.jpg' },
  { id: 'PQ-004', order: '#1017', sku: 'RUG-1003', status: 'Ready for Dispatch', cartons: 1, proof: 'packing-proof-1017.jpg' },
];
