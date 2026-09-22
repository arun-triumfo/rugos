import { cn } from '../../utils/format';

export default function DataTable({ columns, rows, rowKey = 'id', emptyMessage = 'No records found', onRowClick, compact }) {
  if (!rows?.length) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-panel px-4 py-12 text-center text-sm text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-panel shadow-sm scrollbar-thin">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={cn('px-3 py-2.5 font-semibold whitespace-nowrap', col.className)}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr
              key={row[rowKey] ?? JSON.stringify(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn('hover:bg-slate-50/80', onRowClick && 'cursor-pointer')}
            >
              {columns.map((col) => (
                <td key={col.key} className={cn(compact ? 'px-3 py-1.5' : 'px-3 py-2.5', 'align-middle whitespace-nowrap', col.tdClassName)}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
