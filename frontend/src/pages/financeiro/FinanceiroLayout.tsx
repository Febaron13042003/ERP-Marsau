import { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useMockDB } from '../../contexts/MockDBContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { fmtCurrency, today } from '../../lib/utils';
import { cn } from '../../lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { CheckCircle, Plus, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// ── Contas a Receber ────────────────────────────────────────
function ContasReceber() {
  const { accountsReceivable, updateAccountReceivable } = useMockDB();
  const { toast } = useToast();
  const [filter, setFilter] = useState('Todos');
  const [receiveId, setReceiveId] = useState<string | null>(null);
  const [recDate, setRecDate] = useState(today());
  const [recValue, setRecValue] = useState('');
  const [recMethod, setRecMethod] = useState('PIX');

  const filtered = accountsReceivable.filter(a => filter === 'Todos' || a.status === filter);
  const totals = { aberto: filtered.filter(a => a.status === 'Aberto').reduce((s, a) => s + a.value, 0), recebido: filtered.filter(a => a.status === 'Recebido').reduce((s, a) => s + a.value, 0), vencido: filtered.filter(a => a.status === 'Vencido').reduce((s, a) => s + a.value, 0) };
  const item = accountsReceivable.find(a => a.id === receiveId);

  const handleReceive = () => {
    if (!receiveId) return;
    const val = parseFloat(recValue) || item?.value || 0;
    updateAccountReceivable(receiveId, { status: 'Recebido', paidValue: val, receivedAt: recDate, paymentMethod: recMethod });
    toast('Recebimento registrado!', 'success');
    setReceiveId(null);
  };

  const STATUS_VARIANT: Record<string, 'info' | 'success' | 'danger' | 'warning'> = { Aberto: 'info', Recebido: 'success', Vencido: 'danger', Parcial: 'warning' };

  return (
    <div>
      {/* Totals */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[['Em Aberto', totals.aberto, 'text-blue-700 bg-blue-50'], ['Recebido', totals.recebido, 'text-emerald-700 bg-emerald-50'], ['Vencido', totals.vencido, 'text-red-700 bg-red-50']].map(([l, v, cls]) => (
          <div key={l as string} className={`rounded-xl p-4 ${cls as string}`}>
            <div className="text-sm font-medium opacity-80">{l}</div>
            <div className="text-2xl font-bold mt-1">{fmtCurrency(v as number)}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {['Todos', 'Aberto', 'Recebido', 'Vencido'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors', filter === f ? 'bg-blue-600 text-white' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50')}>{f}</button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>{['Nº', 'Origem', 'Cliente', 'Plano de Conta', 'Competência', 'Vencimento', 'Valor', 'Forma', 'Status', ''].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((a, i) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">#{String(i + 1).padStart(4, '0')}</td>
                  <td className="px-4 py-3 text-xs text-blue-700 font-medium">{a.osNumber ? `OS #${a.osNumber}` : '—'}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 max-w-[160px] truncate">{a.clientName}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{a.planName}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{a.accrualDate}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{a.dueDate}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900 text-right">{fmtCurrency(a.value)}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{a.paymentMethod}</td>
                  <td className="px-4 py-3"><Badge variant={STATUS_VARIANT[a.status] ?? 'default'}>{a.status}</Badge></td>
                  <td className="px-4 py-3">
                    {a.status !== 'Recebido' && (
                      <button onClick={() => { setReceiveId(a.id); setRecValue(String(a.value)); }} className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900 font-medium">
                        <CheckCircle className="h-3.5 w-3.5" />Receber
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receive Modal */}
      <Modal isOpen={!!receiveId} onClose={() => setReceiveId(null)} title="Registrar Recebimento" size="sm">
        {item && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4 text-sm space-y-1">
              <div><span className="text-slate-500">Cliente:</span> <strong>{item.clientName}</strong></div>
              <div><span className="text-slate-500">Origem:</span> {item.osNumber ? `OS #${item.osNumber}` : item.description}</div>
              <div><span className="text-slate-500">Valor original:</span> <strong>{fmtCurrency(item.value)}</strong></div>
            </div>
            <Input label="Data de Recebimento" type="date" value={recDate} onChange={e => setRecDate(e.target.value)} />
            <Input label="Valor Recebido" type="number" value={recValue} onChange={e => setRecValue(e.target.value)} />
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Forma de Recebimento</label>
              <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={recMethod} onChange={e => setRecMethod(e.target.value)}>
                {['PIX', 'Dinheiro', 'Boleto', 'Cartão Crédito', 'Cartão Débito'].map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setReceiveId(null)}>Cancelar</Button>
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={handleReceive}>Confirmar</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ── Contas a Pagar ─────────────────────────────────────────
function ContasPagar() {
  const { accountsPayable, accountPlans, suppliers, addAccountPayable, updateAccountPayable } = useMockDB();
  const { toast } = useToast();
  const [filter, setFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [paying, setPaying] = useState<string | null>(null);

  const [desc, setDesc] = useState('');
  const [supplier, setSupplier] = useState('');
  const [plan, setPlan] = useState('ap11');
  const [accrual, setAccrual] = useState(today());
  const [dueDate, setDueDate] = useState(today());
  const [value, setValue] = useState('');
  const [method, setMethod] = useState('PIX');

  const filtered = accountsPayable.filter(a => filter === 'Todos' || a.status === filter);
  const totals = { aberto: filtered.filter(a => a.status === 'Aberto').reduce((s, a) => s + a.value, 0), pago: filtered.filter(a => a.status === 'Pago').reduce((s, a) => s + a.value, 0), vencido: filtered.filter(a => a.status === 'Vencido').reduce((s, a) => s + a.value, 0) };

  const leafPlans = accountPlans.filter(p => !accountPlans.some(pp => pp.parentId === p.id));

  const handleSave = () => {
    addAccountPayable({ supplierName: supplier, description: desc, planId: plan, planName: accountPlans.find(p => p.id === plan)?.name ?? '', accrualDate: accrual, dueDate, value: parseFloat(value) || 0, paymentMethod: method, status: 'Aberto' });
    toast('Conta a pagar cadastrada!', 'success');
    setShowModal(false);
  };

  const handlePay = (id: string) => {
    updateAccountPayable(id, { status: 'Pago', paidAt: today() });
    toast('Pagamento registrado!', 'success');
    setPaying(null);
  };

  const STATUS_VARIANT: Record<string, 'info' | 'success' | 'danger' | 'warning'> = { Aberto: 'info', Pago: 'success', Vencido: 'danger', Parcial: 'warning' };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[['Em Aberto', totals.aberto, 'text-blue-700 bg-blue-50'], ['Pago', totals.pago, 'text-emerald-700 bg-emerald-50'], ['Vencido', totals.vencido, 'text-red-700 bg-red-50']].map(([l, v, cls]) => (
          <div key={l as string} className={`rounded-xl p-4 ${cls as string}`}>
            <div className="text-sm font-medium opacity-80">{l}</div>
            <div className="text-2xl font-bold mt-1">{fmtCurrency(v as number)}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mb-4 justify-between">
        <div className="flex gap-2">
          {['Todos', 'Aberto', 'Pago', 'Vencido'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors', filter === f ? 'bg-blue-600 text-white' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50')}>{f}</button>
          ))}
        </div>
        <Button size="sm" onClick={() => setShowModal(true)} className="gap-2"><Plus className="h-4 w-4" />Nova Conta</Button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>{['Fornecedor', 'Descrição', 'Plano de Conta', 'Competência', 'Vencimento', 'Valor', 'Status', ''].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 max-w-[140px] truncate">{a.supplierName}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 max-w-[180px] truncate">{a.description}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{a.planName}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{a.accrualDate}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{a.dueDate}</td>
                  <td className="px-4 py-3 font-semibold text-right">{fmtCurrency(a.value)}</td>
                  <td className="px-4 py-3"><Badge variant={STATUS_VARIANT[a.status] ?? 'default'}>{a.status}</Badge></td>
                  <td className="px-4 py-3">
                    {a.status !== 'Pago' && <button onClick={() => handlePay(a.id)} className="text-xs text-emerald-700 font-medium hover:text-emerald-900">Pagar</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nova Conta a Pagar" size="md">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-sm font-medium text-slate-700 block mb-1">Fornecedor / Beneficiário</label>
            <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={supplier} onChange={e => setSupplier(e.target.value)} placeholder="Nome do fornecedor" />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium text-slate-700 block mb-1">Descrição</label>
            <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium text-slate-700 block mb-1">Plano de Conta</label>
            <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={plan} onChange={e => setPlan(e.target.value)}>
              {leafPlans.map(p => <option key={p.id} value={p.id}>{p.code} - {p.name}</option>)}
            </select>
          </div>
          <Input label="Data Competência *" type="date" value={accrual} onChange={e => setAccrual(e.target.value)} />
          <Input label="Data Vencimento *" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          <Input label="Valor (R$)" type="number" value={value} onChange={e => setValue(e.target.value)} />
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Forma de Pagamento</label>
            <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={method} onChange={e => setMethod(e.target.value)}>
              {['PIX', 'Boleto', 'Transferência', 'Dinheiro', 'Débito automático'].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="col-span-2 flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button className="flex-1" onClick={handleSave}>Salvar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ── DRE ────────────────────────────────────────────────────
function DRE() {
  const { accountsReceivable, accountsPayable } = useMockDB();
  const totalRec = accountsReceivable.filter(a => a.status === 'Recebido').reduce((s, a) => s + a.value, 0);
  const totalPag = accountsPayable.filter(a => a.status === 'Pago').reduce((s, a) => s + a.value, 0);
  const lucro = totalRec - totalPag;

  const rows = [
    { label: '(+) RECEITA BRUTA', value: totalRec, indent: 0, bold: true, color: 'text-emerald-700' },
    { label: '    Receita de Serviços/Peças', value: totalRec, indent: 1 },
    { label: '(-) DEDUÇÕES (Simples Nacional ~6%)', value: -(totalRec * 0.06), indent: 0, color: 'text-red-600' },
    { label: '(=) RECEITA LÍQUIDA', value: totalRec * 0.94, indent: 0, bold: true },
    { label: '(-) CUSTO DOS PRODUTOS/SERVIÇOS', value: -(totalPag * 0.4), indent: 0, color: 'text-red-600' },
    { label: '(=) LUCRO BRUTO', value: totalRec * 0.94 - totalPag * 0.4, indent: 0, bold: true, color: 'text-blue-700' },
    { label: '(-) DESPESAS OPERACIONAIS', value: -(totalPag * 0.6), indent: 0, color: 'text-red-600' },
    { label: '(=) LUCRO LÍQUIDO', value: lucro, indent: 0, bold: true, color: lucro >= 0 ? 'text-emerald-700' : 'text-red-700' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-semibold text-slate-900 text-lg">DRE — Demonstrativo de Resultado</h3>
        <span className="text-sm text-slate-400">(Dados simulados da base atual)</span>
      </div>
      <div className="p-5">
        {rows.map((row, i) => (
          <div key={i} className={cn('flex justify-between py-2.5 border-b border-slate-50 last:border-0', row.indent === 1 && 'pl-6 text-slate-500', row.bold && 'font-bold', !row.indent && !row.bold && 'font-medium')}>
            <span className={row.color}>{row.label}</span>
            <span className={cn('font-mono', row.color ?? 'text-slate-900')}>{fmtCurrency(row.value)}</span>
          </div>
        ))}
        <div className={cn('flex justify-between pt-4 mt-4 border-t-2', lucro >= 0 ? 'border-emerald-200' : 'border-red-200')}>
          <span className="text-xl font-black">Margem Líquida</span>
          <span className={cn('text-xl font-black', lucro >= 0 ? 'text-emerald-700' : 'text-red-700')}>{totalRec > 0 ? ((lucro / totalRec) * 100).toFixed(1) : 0}%</span>
        </div>
      </div>
    </div>
  );
}

// ── Fluxo de Caixa ─────────────────────────────────────────
function FluxoCaixa() {
  const data = [
    { dia: '14/03', entradas: 2020, saidas: 780, saldo: 1240 },
    { dia: '15/03', entradas: 0, saidas: 3500, saldo: -2260 },
    { dia: '16/03', entradas: 1374, saidas: 0, saldo: -886 },
    { dia: '17/03', entradas: 0, saidas: 0, saldo: -886 },
    { dia: '18/03', entradas: 0, saidas: 0, saldo: -886, previsto: true },
    { dia: '19/03', entradas: 0, saidas: 0, saldo: -886, previsto: true },
    { dia: '20/03', entradas: 1620, saidas: 6800, saldo: -6066, previsto: true },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-semibold text-slate-900 text-lg">Fluxo de Caixa</h3>
        <span className="text-xs text-slate-400 bg-yellow-50 border border-yellow-200 text-yellow-700 px-2 py-1 rounded-lg">Itens marcados = previsto</span>
      </div>
      <div className="h-48 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => fmtCurrency(v)} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px -1px rgb(0 0 0 / 0.15)' }} />
            <Bar dataKey="entradas" name="Entradas" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
            <Bar dataKey="saidas" name="Saídas" fill="#f87171" radius={[4, 4, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-y border-slate-200">
            <tr>{['Data', 'Entradas', 'Saídas', 'Saldo do Dia'].map(h => <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map(row => (
              <tr key={row.dia} className={cn('hover:bg-slate-50', row.previsto && 'bg-yellow-50/50')}>
                <td className="px-4 py-2.5 text-sm font-medium text-slate-900">{row.dia} {row.previsto && <span className="text-xs text-yellow-600 bg-yellow-100 px-1 py-0.5 rounded">previsto</span>}</td>
                <td className="px-4 py-2.5 text-emerald-700 font-semibold text-sm">{row.entradas > 0 ? fmtCurrency(row.entradas) : '—'}</td>
                <td className="px-4 py-2.5 text-red-600 font-semibold text-sm">{row.saidas > 0 ? fmtCurrency(row.saidas) : '—'}</td>
                <td className={cn('px-4 py-2.5 font-bold text-sm', row.saldo >= 0 ? 'text-slate-900' : 'text-red-700')}>{fmtCurrency(row.saldo)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Layout ─────────────────────────────────────────────────
export function FinanceiroLayout() {
  const tabs = [
    { to: '/financeiro', label: 'Contas a Receber', end: true },
    { to: '/financeiro/pagar', label: 'Contas a Pagar' },
    { to: '/financeiro/fluxo', label: 'Fluxo de Caixa' },
    { to: '/financeiro/dre', label: 'DRE' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Financeiro</h1>
      <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
        {tabs.map(t => (
          <NavLink key={t.to} to={t.to} end={t.end}
            className={({ isActive }) => cn('px-6 py-3 border-b-2 text-sm font-medium transition-colors whitespace-nowrap', isActive ? 'border-blue-600 text-blue-700 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700')}
          >{t.label}</NavLink>
        ))}
      </div>
      <Routes>
        <Route index element={<ContasReceber />} />
        <Route path="pagar" element={<ContasPagar />} />
        <Route path="fluxo" element={<FluxoCaixa />} />
        <Route path="dre" element={<DRE />} />
      </Routes>
    </div>
  );
}
