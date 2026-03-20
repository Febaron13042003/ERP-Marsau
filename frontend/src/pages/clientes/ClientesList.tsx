import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, ToggleLeft, Truck } from 'lucide-react';
import { useMockDB } from '../../contexts/MockDBContext';
import { Badge } from '../../components/ui/Badge';

export function ClientesList() {
  const { clientes } = useMockDB();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  const filtered = useMemo(() => clientes.filter(c => {
    const matchSearch = !search || [c.name, c.document, c.city ?? '', ...c.trucks.map(t => t.plate)].some(v => v.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'Todos' || c.status === statusFilter;
    return matchSearch && matchStatus;
  }), [clientes, search, statusFilter]);

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
          <p className="text-sm text-slate-500 mt-1">{filtered.length} clientes</p>
        </div>
        <Link to="/clientes/novo">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Plus className="h-4 w-4" />Novo Cliente
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-wrap gap-3 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Buscar nome, CPF/CNPJ, placa..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option>Todos</option><option>Ativo</option><option>Inativo</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Nome / Razão Social', 'CPF / CNPJ', 'Telefone', 'Cidade', 'Caminhões', 'Status', 'Ações'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-slate-400">Nenhum cliente encontrado.</td></tr>
              ) : filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{c.name}</div>
                    <div className="text-xs text-slate-400">{c.type === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-slate-600">{c.document}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{c.phone}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{c.city} - {c.state}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {c.trucks.slice(0, 3).map(t => (
                        <span key={t.id} className="font-mono text-xs bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">{t.plate}</span>
                      ))}
                      {c.trucks.length > 3 && <span className="text-xs text-slate-400">+{c.trucks.length - 3}</span>}
                      {c.trucks.length === 0 && <span className="text-xs text-slate-400">Nenhum</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={c.status === 'Ativo' ? 'success' : 'default'}>{c.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Link to={`/clientes/${c.id}`}>
                        <button className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors" title="Editar"><Pencil className="h-4 w-4" /></button>
                      </Link>
                      <button className="p-1.5 rounded hover:bg-slate-100 text-slate-500 transition-colors" title="Caminhões"><Truck className="h-4 w-4" /></button>
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
