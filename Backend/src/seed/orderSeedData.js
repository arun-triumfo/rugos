import { mockOrders, baseTimeline1001, WORKFLOW_STEPS } from '../../../Frontend/src/data/mockOrders.js';
import { mockInventory } from '../../../Frontend/src/data/mockInventory.js';

export { baseTimeline1001, WORKFLOW_STEPS };

export function getFreshInventory() {
  return JSON.parse(JSON.stringify(mockInventory));
}

export function getFreshOrder1001() {
  const o = mockOrders.find((x) => x.id === '1001');
  const clone = JSON.parse(JSON.stringify(o));
  clone.timeline = JSON.parse(JSON.stringify(baseTimeline1001));
  return stripClientId(clone);
}

function stripClientId(order) {
  const { id, ...rest } = order;
  return {
    ...rest,
    key: id,
    date: order.date ? new Date(order.date) : new Date(),
  };
}

export function getAllSeedOrders() {
  return mockOrders.map((o) => stripClientId(JSON.parse(JSON.stringify(o))));
}
