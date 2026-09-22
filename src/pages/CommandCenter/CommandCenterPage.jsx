import { Link } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import { useDemo } from '../../context/DemoContext';
import { formatNumber } from '../../utils/format';

export default function CommandCenterPage() {
  const { state } = useDemo();
  const blocks = state.commandCenter;

  return (
    <div>
      <PageHeader
        title="Operations Command Center"
        subtitle="End-to-end business flow from marketplace to profitability"
        breadcrumbs={[{ label: 'Overview' }, { label: 'Command Center' }]}
        actions={<Link to="/orders/1001" className="btn-primary">Run Order #1001 Workflow</Link>}
      />

      <div className="mb-4 rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-900">
        Marketplace Order → SKU Mapping → Inventory → Warehouse → Packing → India Dispatch → In Transit → USA Receipt → Fulfilment → Finance → Profitability
      </div>

      <div className="mx-auto flex max-w-3xl flex-col items-stretch gap-0">
        {blocks.map((block, i) => (
          <div key={block.key} className="flex flex-col items-center">
            <Link
              to={block.link}
              className={`w-full rounded-lg border bg-panel p-4 shadow-sm transition hover:border-accent/50 hover:shadow-md ${
                block.exceptions > 0 ? 'border-amber-300' : 'border-border'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Stage {i + 1}</p>
                  <p className="text-base font-semibold text-navy-900">{block.label}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold tabular-nums text-navy-900">
                    {typeof block.count === 'number' ? formatNumber(block.count) : block.count}
                  </p>
                  <StatusBadge status={block.status} />
                </div>
              </div>
              {block.exceptions > 0 && (
                <p className="mt-2 text-xs font-medium text-amber-700">{block.exceptions} exception{block.exceptions !== 1 ? 's' : ''} require attention</p>
              )}
            </Link>
            {i < blocks.length - 1 && (
              <div className="flex flex-col items-center py-1 text-slate-400">
                <ArrowDown size={18} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
