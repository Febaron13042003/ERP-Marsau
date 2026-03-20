import { useState } from 'react';
import { useMockDB } from '../../contexts/MockDBContext';
import { Badge } from '../../components/ui/Badge';
import { fmtCurrency } from '../../lib/utils';
import { Eye, RotateCcw, Send } from 'lucide-react';

export function FiscalList() {
  const { invoices } = useMockDB();
  const [type, setType] = useState('Todos');
  const [search, setSearch] = useState('');

  const filtered = invoices.filter(inv =>
    (type === 'Todos' || inv.type === type) &&
    (!search || [inv.number, inv.clientName, inv.plate, inv.osNumber].some(v => v?.toLowerCase().includes(search.toLowerCase())))
  );

  const STATUS_VARIANT: Record<string, 'success' | 'danger' | 'warning' | 'default'> = {
    Autorizada: 'success', Cancelada: 'danger', Denegada: 'warning', Pendente: 'default'
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Notas Fiscais Emitidas</h1>
        <p className="text-sm text-slate-500 mt-1">{filtered.length} notas</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-wrap gap-3 shadow-sm">
        <input
          className="flex-1 min-w-[200px] border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Buscar nº nota, cliente, placa..."
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white" value={type} onChange={e => setType(e.target.value)}>
          <option>Todos</option><option>NF-e</option><option>NFS-e</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>{['Nº Nota', 'Tipo', 'OS Origem', 'Cliente', 'Placa', 'Data Emissão', 'Valor', 'Status SEFAZ', 'Ações'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-16 text-slate-400">Nenhuma nota fiscal encontrada.</td></tr>
              ) : filtered.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono font-bold text-blue-700">{inv.number}</td>
                  <td className="px-4 py-3">
                    <Badge variant={inv.type === 'NF-e' ? 'info' : 'warning'} className="text-xs">{inv.type}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-600">OS #{inv.osNumber}</td>
                  <td className="px-4 py-3 text-sm text-slate-900 max-w-[160px] truncate">{inv.clientName}</td>
                  <td className="px-4 py-3"><span className="font-mono text-xs bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">{inv.plate}</span></td>
                  <td className="px-4 py-3 text-sm text-slate-600">{inv.issueDate}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900 text-right">{fmtCurrency(inv.value)}</td>
                  <td className="px-4 py-3"><Badge variant={STATUS_VARIANT[inv.status] ?? 'default'}>{inv.status}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors" title="Ver DANFE"><Eye className="h-4 w-4" /></button>
                      <button className="p-1.5 rounded hover:bg-slate-100 text-slate-500 transition-colors" title="Reenviar"><Send className="h-4 w-4" /></button>
                      {inv.status === 'Autorizada' && <button className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors" title="Cancelar"><RotateCcw className="h-4 w-4" /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h3 className="font-semibold text-amber-900 mb-2">⚙️ Configurações Fiscais</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-amber-800">
          <div><div className="font-medium">CNPJ</div><div>12.345.678/0001-90</div></div>
          <div><div className="font-medium">Regime</div><div>Simples Nacional</div></div>
          <div><div className="font-medium">Ambiente</div><div className="text-emerald-700 font-semibold">Produção</div></div>
          <div><div className="font-medium">Série NF-e</div><div>1 — A partir de #342</div></div>
        </div>
      </div>
    </div>
  );
}
