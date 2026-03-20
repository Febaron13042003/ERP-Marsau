import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, AlertTriangle } from 'lucide-react';
import { useMockDB } from '../../contexts/MockDBContext';
import { Badge } from '../../components/ui/Badge';
import { fmtCurrency } from '../../lib/utils';

export function EstoqueList() {
  const { parts, stockMovements } = useMockDB();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Todos');

  const belowMin = parts.filter(p => p.qty <= p.minQty);

  const filtered = useMemo(() => parts.filter(p => {
    const matchSearch = !search || [p.internalCode, p.description, p.reference, p.brand].some(v => v.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === 'Todos' || (filter === 'Crítico' && p.qty <= p.minQty);
    return matchSearch && matchFilter;
  }), [parts, search, filter]);

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Estoque</h1>
          <p className="text-sm text-slate-500 mt-1">{parts.length} itens cadastrados</p>
        </div>
        <div className="flex gap-2">
          <Link to="/estoque/xml"><button className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">📥 Entrada XML</button></Link>
          <Link to="/estoque/inventario"><button className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">📋 Inventário</button></Link>
          <Link to="/estoque/novo"><button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"><Plus className="h-4 w-4" />Nova Peça</button></Link>
        </div>
      </div>

      {belowMin.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3 text-red-800">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <span className="font-medium"><strong>{belowMin.length} itens</strong> abaixo do estoque mínimo.</span>
          </div>
          <button onClick={() => setFilter('Crítico')} className="text-sm text-red-700 font-medium underline hover:no-underline">Filtrar critérios</button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-wrap gap-3 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Buscar código, descrição, referência..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={filter} onChange={e => setFilter(e.target.value)}>
          <option>Todos</option><option>Crítico</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Código', 'Referência', 'Descrição', 'UN', 'Qtd.', 'Mín.', 'R$ Custo', 'R$ Médio', 'R$ Venda', 'Margem %', 'Status', 'Ações'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={12} className="text-center py-16 text-slate-400">Nenhum item encontrado.</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} className={`hover:bg-slate-50 transition-colors ${p.qty <= p.minQty ? 'bg-red-50/50' : ''}`}>
                  <td className="px-4 py-3 font-mono text-xs font-bold text-slate-700">{p.internalCode}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.reference}</td>
                  <td className="px-4 py-3 text-sm text-slate-900 max-w-[200px]">
                    <div className="font-medium">{p.shortDescription}</div>
                    <div className="text-xs text-slate-400">{p.brand} · {p.category}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{p.unit}</td>
                  <td className={`px-4 py-3 font-bold text-center ${p.qty <= p.minQty ? 'text-red-600' : 'text-slate-900'}`}>{p.qty}</td>
                  <td className="px-4 py-3 text-center text-xs text-slate-500">{p.minQty}</td>
                  <td className="px-4 py-3 text-sm text-right text-slate-600">{fmtCurrency(p.costPrice)}</td>
                  <td className="px-4 py-3 text-sm text-right text-slate-600">{fmtCurrency(p.averagePrice)}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-slate-900">{fmtCurrency(p.salePrice)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-bold ${p.markup >= 40 ? 'text-emerald-600' : p.markup >= 20 ? 'text-yellow-600' : 'text-red-600'}`}>{p.markup}%</span>
                  </td>
                  <td className="px-4 py-3">
                    {p.qty <= p.minQty
                      ? <Badge variant="danger" className="text-xs">Crítico</Badge>
                      : <Badge variant="success" className="text-xs">Normal</Badge>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/estoque/${p.id}`}>
                      <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">Editar</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 flex flex-wrap gap-6 text-sm text-slate-600">
          <span>Total itens: <strong className="text-slate-900">{filtered.length}</strong></span>
          <span>Valor em estoque (custo): <strong className="text-slate-900">{fmtCurrency(filtered.reduce((s, p) => s + p.qty * p.costPrice, 0))}</strong></span>
          <span>Valor em estoque (venda): <strong className="text-slate-900">{fmtCurrency(filtered.reduce((s, p) => s + p.qty * p.salePrice, 0))}</strong></span>
        </div>
      </div>
    </div>
  );
}
