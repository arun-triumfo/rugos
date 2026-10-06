import { mockRequest } from './apiClient';

export async function getOrders(orders, filters = {}) {
  // Future: return apiGet('/api/orders?' + new URLSearchParams(filters));
  let result = [...orders];
  if (filters.marketplace) result = result.filter((o) => o.marketplace === filters.marketplace);
  if (filters.status) result = result.filter((o) => o.status === filters.status);
  if (filters.country) result = result.filter((o) => o.country === filters.country);
  if (filters.warehouse) result = result.filter((o) => o.warehouse === filters.warehouse);
  if (filters.sku) result = result.filter((o) => (o.sku || '').toLowerCase().includes(filters.sku.toLowerCase()));
  if (filters.customer) result = result.filter((o) => (o.customer || '').toLowerCase().includes(filters.customer.toLowerCase()));
  if (filters.q) {
    const q = filters.q.toLowerCase();
    result = result.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        (o.sku || '').toLowerCase().includes(q) ||
        (o.customer || '').toLowerCase().includes(q) ||
        (o.product || '').toLowerCase().includes(q)
    );
  }
  return mockRequest(result);
}

export async function getOrderById(orders, id) {
  // Future: return apiGet(`/api/orders/${id}`);
  const order = orders.find((o) => o.id === id || o.orderNumber === id || o.orderNumber === `#${id}`);
  if (!order) throw new Error('Order not found');
  return mockRequest(order);
}

export async function updateOrderStatus(orderId, status) {
  // Future: return apiPatch(`/api/orders/${orderId}`, { status });
  return mockRequest({ id: orderId, status });
}
