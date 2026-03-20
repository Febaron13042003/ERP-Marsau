import { useMockDB } from '../../contexts/MockDBContext';
import { fmtCurrency } from '../../lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function Relatorios() {
  const { os, parts, accountsReceivable, accountsPayable, invoices } = useMockDB();

  const completedOS = os.filter(o => o.status === 'Concluída');
  const totalRev = completedOS.reduce((s, o) => s + o.total, 0);
  const avgTicket = completedOS.length > 0 ? totalRev / completedOS.length : 0;

  // ABC curve - parts by revenue (mock from stock movement + salePrice)
  const abcData = parts
    .map(p => ({ name: p.shortDescription, value: p.qty * p.salePrice }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // Service frequency mock
  const serviceData = [
    { name: 'Revisão Preventiva', qty: 24 },
    { name: 'Diagnóstico Eletrônico', qty: 18 },
    { name: 'Reparo Alternador', qty: 12 },
    { name: 'Motor de Partida', qty: 9 },
    { name: 'Troca de Bateria', qty: 7 },
  ];

  // Mechanic performance
  const mechanicData = completedOS.reduce((acc, o) => {
    o.labor.forEach(l => {
      const found = acc.find((x: any) => x.name === l.mechanicName);
      if (found) { found.total += l.totalValue; found.os += 1; }
      else acc.push({ name: l.mechanicName, total: l.totalValue, os: 1 });
    });
    return acc;
  }, [] as { name: string; total: number; os: number }[]);

  const totalAR = accountsReceivable.reduce((s, a) => s + a.value, 0);
  const totalAP = accountsPayable.reduce((s, a) => s + a.value, 0);
  const totalInvNFe = invoices.filter(i => i.type === 'NF-e').reduce((s, i) => s + i.value, 0);

  const COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ec4899', '#06b6d4', '#84cc16', '#f97316'];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Relatórios</h1>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          ['OS Concluídas', completedOS.length, ''],
          ['Faturamento Total', fmtCurrency(totalRev), ''],
          ['Ticket Médio', fmtCurrency(avgTicket), ''],
          ['Notas NF-e Emitidas', fmtCurrency(totalInvNFe), ''],
        ].map(([l, v]) => (
          <div key={l as string} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="text-sm text-slate-500">{l}</div>
            <div className="text-xl font-bold text-slate-900 mt-1">{v}</div>
          </div>
        ))}
      </div>

      {/* Service Frequency & Mechanic Performance */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Top Serviços do Mês</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} width={140} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px -1px rgb(0 0 0 / 0.15)' }} />
                <Bar dataKey="qty" name="Qtd." radius={[0, 6, 6, 0]} barSize={18}>
                  {serviceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Performance por Mecânico</h3>
          {mechanicData.length === 0 ? (
            <p className="text-slate-400 text-center py-8">Nenhum dado disponível.</p>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-100 text-xs text-slate-500 uppercase">{['Mecânico', 'OS', 'Mão de Obra'].map(h => <th key={h} className="text-left pb-2 pr-4">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-50">
                {mechanicData.map(m => (
                  <tr key={m.name}>
                    <td className="py-2.5 font-medium text-slate-900 pr-4">{m.name}</td>
                    <td className="py-2.5 text-slate-600 pr-4">{m.os} OS</td>
                    <td className="py-2.5 font-semibold text-emerald-700">{fmtCurrency(m.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ABC Curve */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h3 className="font-semibold text-slate-900 mb-4">Curva ABC — Valor em Estoque (R$)</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={abcData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => fmtCurrency(v)} contentStyle={{ borderRadius: '8px', border: 'none' }} />
              <Bar dataKey="value" name="Valor em Estoque" radius={[4, 4, 0, 0]} barSize={32}>
                {abcData.map((_, i) => <Cell key={i} fill={i < 2 ? '#3b82f6' : i < 5 ? '#10b981' : '#94a3b8'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500 inline-block" />Classe A (80%)</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500 inline-block" />Classe B (15%)</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-400 inline-block" />Classe C (5%)</span>
        </div>
      </div>

      {/* OS List Report */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between">
          <h3 className="font-semibold text-slate-900">Relatório de OS — Período Atual</h3>
          <button className="text-sm text-blue-600 hover:underline">Exportar CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>{['Nº OS', 'Data', 'Cliente', 'Placa', 'Mecânico', 'Mão de Obra', 'Serviços', 'Peças', 'Total'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {completedOS.map(o => (
                <tr key={o.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono font-bold text-blue-700">#{o.number}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{o.date}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 max-w-[160px] truncate">{o.clientName}</td>
                  <td className="px-4 py-3 font-mono text-xs">{o.plate}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{o.mechanicName}</td>
                  <td className="px-4 py-3 text-sm text-right">{fmtCurrency(o.subtotalLabor)}</td>
                  <td className="px-4 py-3 text-sm text-right">{fmtCurrency(o.subtotalServices)}</td>
                  <td className="px-4 py-3 text-sm text-right">{fmtCurrency(o.subtotalParts)}</td>
                  <td className="px-4 py-3 font-bold text-slate-900 text-right">{fmtCurrency(o.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 border-t border-slate-200">
              <tr>
                <td colSpan={5} className="px-4 py-3 font-bold text-slate-700">TOTAL</td>
                <td className="px-4 py-3 font-bold text-right">{fmtCurrency(completedOS.reduce((s, o) => s + o.subtotalLabor, 0))}</td>
                <td className="px-4 py-3 font-bold text-right">{fmtCurrency(completedOS.reduce((s, o) => s + o.subtotalServices, 0))}</td>
                <td className="px-4 py-3 font-bold text-right">{fmtCurrency(completedOS.reduce((s, o) => s + o.subtotalParts, 0))}</td>
                <td className="px-4 py-3 font-bold text-emerald-700 text-right text-base">{fmtCurrency(totalRev)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
