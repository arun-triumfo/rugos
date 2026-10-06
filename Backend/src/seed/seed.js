import { connectDb } from '../config/db.js';
import { Plan } from '../models/Plan.js';
import { Tenant } from '../models/Tenant.js';
import { Subscription } from '../models/Subscription.js';
import { User } from '../models/User.js';
import { AuditLog } from '../models/AuditLog.js';
import { Order } from '../models/Order.js';
import { InventoryItem } from '../models/InventoryItem.js';
import { StockLedger } from '../models/StockLedger.js';
import { TenantAppState } from '../models/TenantAppState.js';
import { getAllSeedOrders, getFreshInventory } from './orderSeedData.js';
import { buildAppStateData } from './appStateSeed.js';

const plansSeed = [
  {
    key: 'plan-starter',
    name: 'Starter',
    description: 'For single-warehouse teams starting marketplace operations.',
    monthlyPrice: 9999,
    yearlyPrice: 99990,
    currency: 'INR',
    popular: false,
    active: true,
    usersAllowed: 3,
    features: [
      'Orders & SKU mapping',
      'Inventory (India + USA views)',
      'Pick, pack & shipping labels',
      '1 marketplace connector (demo)',
      'Email support',
      'Up to 3 users',
    ],
  },
  {
    key: 'plan-growth',
    name: 'Growth',
    description: 'For India↔USA replenishment and multi-channel selling.',
    monthlyPrice: 24999,
    yearlyPrice: 249990,
    currency: 'INR',
    popular: true,
    active: true,
    usersAllowed: 15,
    features: [
      'Everything in Starter',
      'Replenishment & USA receipts',
      'True cost & profitability',
      'Courier invoice audit',
      'Amazon + Etsy + Walmart (demo)',
      'Up to 15 users',
      'Priority support',
    ],
  },
  {
    key: 'plan-enterprise',
    name: 'Enterprise',
    description: 'For multi-entity export/import operators with advanced controls.',
    monthlyPrice: 49999,
    yearlyPrice: 499990,
    currency: 'INR',
    popular: false,
    active: true,
    usersAllowed: 999,
    features: [
      'Everything in Growth',
      'EBRC / BRC / FIRA workflows',
      'Advanced roles & audit',
      'Custom integrations roadmap',
      'Dedicated success manager',
      'Unlimited users',
      'SLA-backed support',
    ],
  },
];

async function seed() {
  await connectDb();

  console.log('Clearing collections...');
  await Promise.all([
    Plan.deleteMany({}),
    Tenant.deleteMany({}),
    Subscription.deleteMany({}),
    User.deleteMany({}),
    AuditLog.deleteMany({}),
    Order.deleteMany({}),
    InventoryItem.deleteMany({}),
    StockLedger.deleteMany({}),
    TenantAppState.deleteMany({}),
  ]);

  console.log('Seeding plans...');
  const plans = await Plan.insertMany(plansSeed);
  const planByKey = Object.fromEntries(plans.map((p) => [p.key, p]));

  console.log('Seeding tenants (buyers)...');
  const tenants = await Tenant.insertMany([
    {
      key: 'ten-001',
      companyName: 'Rugos Demo Exports Pvt Ltd',
      contactName: 'Priya Sharma',
      email: 'tenant@rugos.demo',
      phone: '+91 98765 43210',
      businessMode: 'export',
      status: 'Active',
      planId: planByKey['plan-growth']._id,
      billingCycle: 'yearly',
      usersAllowed: 15,
      activatedAt: new Date('2026-08-02T09:00:00Z'),
      notes: 'Primary export demo tenant',
      createdAt: new Date('2026-08-01T10:00:00Z'),
    },
    {
      key: 'ten-002',
      companyName: 'Pacific Import House LLC',
      contactName: 'Mike Chen',
      email: 'import@rugos.demo',
      phone: '+1 512 555 0199',
      businessMode: 'import',
      status: 'Active',
      planId: planByKey['plan-starter']._id,
      billingCycle: 'monthly',
      usersAllowed: 3,
      activatedAt: new Date('2026-09-11T08:30:00Z'),
      notes: 'USA-side import operations demo',
      createdAt: new Date('2026-09-10T11:00:00Z'),
    },
    {
      key: 'ten-003',
      companyName: 'Nordic Living AB',
      contactName: 'Anna Berg',
      email: 'anna@nordicliving.demo',
      phone: '+46 70 123 4567',
      businessMode: null,
      status: 'Pending Approval',
      planId: planByKey['plan-growth']._id,
      billingCycle: 'yearly',
      usersAllowed: 15,
      activatedAt: null,
      notes: 'Purchased Growth yearly — awaiting Superadmin mode selection',
      createdAt: new Date('2026-10-02T14:20:00Z'),
    },
    {
      key: 'ten-004',
      companyName: 'Austin Floor Co',
      contactName: 'James Carter',
      email: 'james@austinfloor.demo',
      phone: '+1 737 555 0144',
      businessMode: null,
      status: 'Pending Approval',
      planId: planByKey['plan-starter']._id,
      billingCycle: 'monthly',
      usersAllowed: 3,
      activatedAt: null,
      notes: 'New Starter purchase — Import or Export not chosen yet',
      createdAt: new Date('2026-10-03T06:15:00Z'),
    },
  ]);

  const tenantByKey = Object.fromEntries(tenants.map((t) => [t.key, t]));

  console.log('Seeding subscriptions...');
  await Subscription.insertMany([
    {
      key: 'sub-001',
      tenantId: tenantByKey['ten-001']._id,
      planId: planByKey['plan-growth']._id,
      billingCycle: 'yearly',
      amount: 249990,
      status: 'Active',
      startedAt: new Date('2026-08-02T09:00:00Z'),
      renewsAt: new Date('2027-08-02T09:00:00Z'),
      paymentRef: 'PAY-DEMO-8801',
    },
    {
      key: 'sub-002',
      tenantId: tenantByKey['ten-002']._id,
      planId: planByKey['plan-starter']._id,
      billingCycle: 'monthly',
      amount: 9999,
      status: 'Active',
      startedAt: new Date('2026-09-11T08:30:00Z'),
      renewsAt: new Date('2026-11-11T08:30:00Z'),
      paymentRef: 'PAY-DEMO-8802',
    },
    {
      key: 'sub-003',
      tenantId: tenantByKey['ten-003']._id,
      planId: planByKey['plan-growth']._id,
      billingCycle: 'yearly',
      amount: 249990,
      status: 'Pending Activation',
      startedAt: null,
      renewsAt: null,
      paymentRef: 'PAY-DEMO-9910',
    },
    {
      key: 'sub-004',
      tenantId: tenantByKey['ten-004']._id,
      planId: planByKey['plan-starter']._id,
      billingCycle: 'monthly',
      amount: 9999,
      status: 'Pending Activation',
      startedAt: null,
      renewsAt: null,
      paymentRef: 'PAY-DEMO-9911',
    },
  ]);

  console.log('Seeding users...');
  const passwordHash = await User.hashPassword('demo123');
  const tenantId = tenantByKey['ten-001']._id;

  const roleUsers = [
    { name: 'Arjun Mehta', email: 'admin@rugos.demo', role: 'Super Admin' },
    { name: 'Neha Kapoor', email: 'management@rugos.demo', role: 'Management' },
    { name: 'Ravi Kumar', email: 'india.wh@rugos.demo', role: 'India Warehouse' },
    { name: 'Mike Johnson', email: 'usa.wh@rugos.demo', role: 'USA Warehouse' },
    { name: 'Sonia Patel', email: 'accounts@rugos.demo', role: 'Accounts' },
    { name: 'Aisha Khan', email: 'sales@rugos.demo', role: 'Sales' },
    { name: 'Dev Verma', email: 'logistics@rugos.demo', role: 'Logistics' },
    { name: 'Anita Desai', email: 'auditor@rugos.demo', role: 'Auditor' },
  ];

  await User.insertMany([
    ...roleUsers.map((u) => ({
      ...u,
      passwordHash,
      isPlatformAdmin: false,
      tenantId,
      status: 'Active',
    })),
    {
      name: 'Platform Superadmin',
      email: 'superadmin@rugos.demo',
      passwordHash,
      role: 'Platform Superadmin',
      isPlatformAdmin: true,
      tenantId: null,
      status: 'Active',
    },
  ]);

  console.log('Seeding inventory for ten-001...');
  await InventoryItem.insertMany(
    getFreshInventory().map((row) => ({ ...row, tenantId }))
  );

  console.log('Seeding orders for ten-001...');
  const orders = getAllSeedOrders().map((o) => ({ ...o, tenantId }));
  await Order.insertMany(orders);

  console.log('Seeding full app modules for ten-001...');
  await TenantAppState.create({ tenantId, data: buildAppStateData() });

  console.log('Seed complete.');
  console.log(`  Orders: ${orders.length} · Inventory SKUs: ${getFreshInventory().length} · App modules: seeded`);
  console.log('Logins (password: demo123):');
  console.log('  admin@rugos.demo       → main app');
  console.log('  superadmin@rugos.demo  → SaaS only');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
