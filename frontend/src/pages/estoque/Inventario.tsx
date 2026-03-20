import { useState } from 'react';
import { useMockDB } from '../../contexts/MockDBContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { fmtCurrency } from '../../lib/utils';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export function Inventario() {
  const { parts, updatePart, addStockMovement } = useMockDB();
  const { toast } = useToast();
  const [counts, setCounts] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState(false);

  const diffParts = parts.map(p => {
    const counted = parseInt(counts[p.id] ?? String(p.qty)) || 0;
    return { ...p, counted, diff: counted - p.qty };
  }).filter(p => p.diff !== 0);

  const handleConfirm = () => {
    diffParts.forEach(p => {
      updatePart(p.id, { qty: p.counted });
      addStockMovement({ date: new Date().toLocaleDateString('pt-BR'), type: 'Inventário', partId: p.id, qty: Math.abs(p.diff), balanceAfter: p.counted, origin: 'Inventário físico', userId: 'u1' });
    });
    toast(`Inventário confirmado. ${diffParts.length} itens ajustados.`, 'success');
    setConfirmed(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventário Físico</h1>
          <p className="text-sm text-slate-500">Insira as quantidades contadas fisicamente. Diferenças serão destacadas.</p>
        </div>
        {!confirmed && diffParts.length > 0 && (
          <Button onClick={handleConfirm} className="bg-amber-600 hover:bg-amber-700 gap-2">
            <CheckCircle className="h-4 w-4" />Confirmar Ajustes ({diffParts.length})
          </Button>
        )}
      </div>

      {diffParts.length > 0 && !confirmed && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-5 flex items-center gap-3 text-amber-800">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500" />
          <span className="font-medium">{diffParts.length} item(s) com divergência detectado(s). Revise antes de confirmar.</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>{['Código', 'Descrição', 'Un.', 'Qtd. Sistema', 'Qtd. Contada', 'Diferença'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {parts.map(p => {
                const counted = parseInt(counts[p.id] ?? '') ?? -1;
                const hasCounted = counts[p.id] !== undefined && counts[p.id] !== '';
                const diff = hasCounted ? counted - p.qty : 0;
                const hasDiff = hasCounted && diff !== 0;
                return (
                  <tr key={p.id} className={hasDiff ? 'bg-red-50/70' : 'hover:bg-slate-50'}>
                    <td className="px-4 py-2.5 font-mono text-xs font-bold text-slate-600">{p.internalCode}</td>
                    <td className="px-4 py-2.5 text-sm text-slate-900">{p.shortDescription}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-500">{p.unit}</td>
                    <td className="px-4 py-2.5 text-center font-mono font-bold text-slate-700">{p.qty}</td>
                    <td className="px-4 py-2.5">
                      <input
                        type="number" min={0}
                        className={`w-24 border rounded-lg px-3 py-1.5 text-sm text-center font-mono ${hasDiff ? 'border-red-400 bg-red-50 text-red-800' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder={String(p.qty)}
                        value={counts[p.id] ?? ''}
                        onChange={e => setCounts(prev => ({ ...prev, [p.id]: e.target.value }))}
                        disabled={confirmed}
                      />
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {hasDiff ? (
                        <span className={`font-bold text-sm ${diff > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {diff > 0 ? '+' : ''}{diff}
                        </span>
                      ) : <span className="text-slate-300">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
