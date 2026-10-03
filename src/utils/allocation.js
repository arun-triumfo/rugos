/**
 * Fulfilment allocation rule (client):
 * 1. Check USA free stock first
 * 2. If not available, check India free stock
 * 3. If neither available → Make to Order (MTO)
 */
export function decideFulfilment(inventoryRow, qty = 1, forcePath = null) {
  if (forcePath === 'USA' || forcePath === 'INDIA' || forcePath === 'MTO') {
    return buildDecision(forcePath, inventoryRow, qty, true);
  }

  const usaFree = Number(inventoryRow?.usa || 0);
  const indiaFree = Math.max(0, Number(inventoryRow?.indiaAvailable || 0) - Number(inventoryRow?.reserved || 0));

  if (usaFree >= qty) return buildDecision('USA', inventoryRow, qty, false);
  if (indiaFree >= qty) return buildDecision('INDIA', inventoryRow, qty, false);
  return buildDecision('MTO', inventoryRow, qty, false);
}

function buildDecision(path, inventoryRow, qty, forced) {
  const usaFree = Number(inventoryRow?.usa || 0);
  const indiaFree = Math.max(0, Number(inventoryRow?.indiaAvailable || 0) - Number(inventoryRow?.reserved || 0));

  const base = {
    path,
    qty,
    forced,
    checks: {
      usaFree,
      indiaFree,
      usaOk: usaFree >= qty,
      indiaOk: indiaFree >= qty,
    },
  };

  if (path === 'USA') {
    return {
      ...base,
      fulfilmentLocation: 'USA East Warehouse',
      warehouse: 'USA East Warehouse',
      bin: inventoryRow?.usaBin || 'USA-RUG-01',
      fulfilmentType: 'USA Stock → Customer',
      status: 'Reserved',
      inventoryStatus: 'Reserved (USA)',
      message: 'USA stock available — reserved for fulfilment',
    };
  }

  if (path === 'INDIA') {
    return {
      ...base,
      fulfilmentLocation: 'India Main Warehouse',
      warehouse: 'India Main Warehouse',
      bin: inventoryRow?.bin || 'IND-RUG-01',
      fulfilmentType: 'India Stock → Customer',
      status: 'Reserved',
      inventoryStatus: 'Reserved (India)',
      message: 'USA unavailable — India stock reserved for fulfilment',
    };
  }

  return {
    ...base,
    fulfilmentLocation: 'India Main Warehouse (MTO)',
    warehouse: 'India Main Warehouse',
    bin: null,
    fulfilmentType: 'Make to Order',
    status: 'Processing',
    inventoryStatus: 'MTO — To Make',
    message: 'USA & India unavailable — Make to Order created',
  };
}
