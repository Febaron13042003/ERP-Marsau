import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Pencil, FileText } from 'lucide-react';
import { useMockDB } from '../../contexts/MockDBContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { fmtCurrency } from '../../lib/utils';

const STATUS_COLORS: Record<string, 'info' | 'warning' | 'success'> = {
  'Aberta': 'info', 'Em execução': 'warning', 'Concluída': 'success'
};

export function OSList() {
  const { os } = useMockDB();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = useMemo(() => os.filter(o => {
    const matchSearch = !search || [o.number, o.clientName, o.plate, o.mechanicName].some(v => v.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'Todos' || o.status === statusFilter;
    return matchSearch && matchStatus;
  }), [os, search, statusFilter]);

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ordens de Serviço</h1>
          <p className="text-sm text-slate-500 mt-1">{filtered.length} de {os.length} ordens</p>
        </div>
        <Link to="/operacional/nova">
          <Button className="gap-2"><Plus className="h-4 w-4" /> Nova OS</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-wrap gap-3 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Buscar por nº, cliente, placa..."
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option>Todos</option><option>Aberta</option><option>Em execução</option><option>Concluída</option>
        </select>
        <input type="date" className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        <input type="date" className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={dateTo} onChange={e => setDateTo(e.target.value)} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Nº OS', 'Data', 'Cliente', 'Placa', 'Mecânico', 'Status', 'Total', 'Ações'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16 text-slate-400">Nenhuma OS encontrada</td></tr>
              ) : filtered.map(o => (
                <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-blue-700">#{o.number}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{o.date}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 max-w-[200px] truncate">{o.clientName}</td>
                  <td className="px-4 py-3"><span className="font-mono text-xs bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">{o.plate}</span></td>
                  <td className="px-4 py-3 text-sm text-slate-600">{o.mechanicName}</td>
                  <td className="px-4 py-3"><Badge variant={STATUS_COLORS[o.status]}>{o.status}</Badge></td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900">{fmtCurrency(o.total)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Link to={`/operacional/${o.id}`}>
                        <button className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors" title="Ver/Editar OS"><Pencil className="h-4 w-4" /></button>
                      </Link>
                      <button className="p-1.5 rounded hover:bg-slate-100 text-slate-500 transition-colors" title="Relatório PDF"><FileText className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
