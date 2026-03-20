import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../components/ui/Toast';
import { useMockDB } from '../../contexts/MockDBContext';
import { fmtCurrency, today } from '../../lib/utils';
import { cn } from '../../lib/utils';
import {
  Clock, Hammer, Package, Camera, CreditCard,
  Play, Square, Pause, Plus, Trash2, Search,
  CheckCircle, ArrowLeft, User
} from 'lucide-react';
import type { LaborEntry, OSService, OSPart, OS } from '../../contexts/MockDBContext';

type Tab = 'labor' | 'services' | 'parts' | 'photos' | 'closure';

// ── Timer hook ──────────────────────────────────────────────
function useTimer(initialMinutes: number, state: LaborEntry['timerState'], startedAt?: string) {
  const [elapsed, setElapsed] = useState(() => {
    if (state === 'running' && startedAt) {
      const diff = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
      return initialMinutes * 60 + diff;
    }
    return initialMinutes * 60;
  });
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (state === 'running') {
      interval.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      if (interval.current) clearInterval(interval.current);
    }
    return () => { if (interval.current) clearInterval(interval.current); };
  }, [state]);

  const fmt = `${String(Math.floor(elapsed / 3600)).padStart(2, '0')}:${String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;
  return { elapsed, fmt, minutes: Math.floor(elapsed / 60) };
}

// ── LaborRow ────────────────────────────────────────────────
function LaborRow({ entry, onChange, onRemove }: { entry: LaborEntry; onChange: (e: LaborEntry) => void; onRemove: () => void }) {
  const { fmt, minutes } = useTimer(entry.totalMinutes, entry.timerState, entry.startedAt);
  const value = parseFloat(((minutes / 60) * entry.hourlyRate).toFixed(2));

  const start = () => onChange({ ...entry, timerState: 'running', startedAt: new Date().toISOString(), totalValue: value });
  const pause = () => onChange({ ...entry, timerState: 'paused', totalMinutes: minutes, pausedAt: new Date().toISOString() });
  const finish = () => onChange({ ...entry, timerState: 'finished', totalMinutes: minutes, totalValue: value });

  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[160px]">
          <div className="font-semibold text-slate-900">{entry.mechanicName}</div>
          <div className="text-xs text-slate-500 mt-1">R$ {entry.hourlyRate.toFixed(2)}/hora</div>
        </div>
        <div className={cn('font-mono text-3xl font-bold px-4 py-2 rounded-lg border',
          entry.timerState === 'running' ? 'text-blue-700 bg-blue-50 border-blue-200 animate-pulse' :
          entry.timerState === 'finished' ? 'text-slate-400 bg-slate-100 border-slate-200' :
          'text-slate-700 bg-white border-slate-200'
        )}>{fmt}</div>
        <div className="flex gap-2">
          {entry.timerState === 'idle' && <Button size="sm" onClick={start} className="gap-1 bg-emerald-600 hover:bg-emerald-700"><Play className="h-3 w-3" />Iniciar</Button>}
          {entry.timerState === 'running' && <>
            <Button size="sm" variant="outline" onClick={pause} className="gap-1 text-orange-600 border-orange-200"><Pause className="h-3 w-3" />Pausar</Button>
            <Button size="sm" variant="danger" onClick={finish} className="gap-1"><Square className="h-3 w-3" />Finalizar</Button>
          </>}
          {entry.timerState === 'paused' && <>
            <Button size="sm" onClick={start} className="gap-1 bg-emerald-600 hover:bg-emerald-700"><Play className="h-3 w-3" />Retomar</Button>
            <Button size="sm" variant="danger" onClick={finish} className="gap-1"><Square className="h-3 w-3" />Finalizar</Button>
          </>}
          {entry.timerState === 'finished' && <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">{fmtCurrency(entry.totalValue)}</span>}
        </div>
        <button onClick={onRemove} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

// ── Main OSForm ─────────────────────────────────────────────
export function OSForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { os, clientes, mechanics, services, parts, kits, addOS, updateOS, closeOS } = useMockDB();
  const { toast } = useToast();

  const existingOS = os.find(o => o.id === id);
  const isNew = !existingOS;
  const isReadOnly = existingOS?.status === 'Concluída';

  const [activeTab, setActiveTab] = useState<Tab>('labor');

  // Header state
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState(existingOS ? clientes.find(c => c.id === existingOS.clientId) : undefined);
  const [selectedTruckId, setSelectedTruckId] = useState(existingOS?.truckId ?? '');
  const [km, setKm] = useState(String(existingOS?.km ?? ''));
  const [mechanicId, setMechanicId] = useState(existingOS?.mechanicId ?? '');
  const [notes, setNotes] = useState(existingOS?.notes ?? '');
  const [osNumber] = useState(existingOS?.number ?? String(1004 + Math.floor(Math.random() * 10)));

  // Tab state
  const [laborEntries, setLaborEntries] = useState<LaborEntry[]>(existingOS?.labor ?? []);
  const [serviceEntries, setServiceEntries] = useState<OSService[]>(existingOS?.services ?? []);
  const [partEntries, setPartEntries] = useState<OSPart[]>(existingOS?.parts ?? []);

  // Modals
  const [showClientSearch, setShowClientSearch] = useState(isNew);
  const [showMechanicModal, setShowMechanicModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showPartsModal, setShowPartsModal] = useState(false);
  const [showClosureModal, setShowClosureModal] = useState(false);
  const [partSearch, setPartSearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [clientSearchText, setClientSearchText] = useState('');

  // Closure state
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [emitNFe, setEmitNFe] = useState(true);
  const [emitNFSe, setEmitNFSe] = useState(true);

  const subtotalLabor = laborEntries.reduce((s, e) => s + (e.timerState === 'finished' ? e.totalValue : 0), 0);
  const subtotalServices = serviceEntries.reduce((s, e) => s + e.price, 0);
  const subtotalParts = partEntries.reduce((s, e) => s + e.qty * e.unitPrice, 0);
  const total = subtotalLabor + subtotalServices + subtotalParts;

  const selectedTruck = selectedClient?.trucks.find(t => t.id === selectedTruckId);

  // Auto-save every 30s
  useEffect(() => {
    if (!existingOS || isNew) return;
    const t = setInterval(() => {
      updateOS(existingOS.id, { labor: laborEntries, services: serviceEntries, parts: partEntries, subtotalLabor, subtotalServices, subtotalParts, total });
    }, 30000);
    return () => clearInterval(t);
  }, [laborEntries, serviceEntries, partEntries, subtotalLabor, subtotalServices, subtotalParts, total]);

  const saveAndExit = useCallback(() => {
    if (isNew) {
      if (!selectedClient) { toast('Selecione um cliente primeiro.', 'error'); return; }
      const mech = mechanics.find(m => m.id === mechanicId);
      const truck = selectedClient.trucks.find(t => t.id === selectedTruckId);
      addOS({
        number: osNumber, date: today(), openedAt: new Date().toISOString(),
        clientId: selectedClient.id, clientName: selectedClient.name,
        truckId: selectedTruckId, plate: truck?.plate ?? '',
        km: parseInt(km) || 0, mechanicId, mechanicName: mech?.name ?? '',
        status: 'Aberta', notes,
        labor: laborEntries, services: serviceEntries, parts: partEntries, photos: [],
        subtotalLabor, subtotalServices, subtotalParts, total, paymentMethods: []
      });
      toast('OS criada com sucesso!', 'success');
    } else {
      updateOS(existingOS!.id, { labor: laborEntries, services: serviceEntries, parts: partEntries, notes, subtotalLabor, subtotalServices, subtotalParts, total });
      toast('OS salva com sucesso!', 'success');
    }
    navigate('/operacional');
  }, [isNew, selectedClient, laborEntries, serviceEntries, partEntries, subtotalLabor, subtotalServices, subtotalParts, total, notes, mechanicId, selectedTruckId, km, osNumber]);

  const handleClose = () => {
    if (!selectedClient && isNew) { toast('Selecione um cliente antes de fechar.', 'error'); return; }
    setShowClosureModal(true);
  };

  const confirmClose = () => {
    const mech = mechanics.find(m => m.id === mechanicId);
    const truck = selectedClient?.trucks.find(t => t.id === selectedTruckId);
    if (isNew) {
      const newOS = addOS({
        number: osNumber, date: today(), openedAt: new Date().toISOString(),
        clientId: selectedClient!.id, clientName: selectedClient!.name,
        truckId: selectedTruckId, plate: truck?.plate ?? '',
        km: parseInt(km) || 0, mechanicId, mechanicName: mech?.name ?? '',
        status: 'Aberta', notes,
        labor: laborEntries, services: serviceEntries, parts: partEntries, photos: [],
        subtotalLabor, subtotalServices, subtotalParts, total, paymentMethods: []
      });
      closeOS(newOS.id, paymentMethods, emitNFe, emitNFSe);
    } else {
      updateOS(existingOS!.id, { labor: laborEntries, services: serviceEntries, parts: partEntries, subtotalLabor, subtotalServices, subtotalParts, total });
      closeOS(existingOS!.id, paymentMethods, emitNFe, emitNFSe);
    }
    toast('OS concluída! Lançamento gerado no Contas a Receber.', 'success');
    navigate('/operacional');
  };

  const filteredClients = clientes.filter(c =>
    !clientSearchText || [c.name, c.document, ...c.trucks.map(t => t.plate)].some(v => v.toLowerCase().includes(clientSearchText.toLowerCase()))
  );
  const filteredParts = [...parts.map(p => ({ ...p, isKit: false })), ...kits.map(k => ({ id: k.id, internalCode: 'KIT', reference: '', description: k.name, shortDescription: k.name, category: 'Kit', brand: '', unit: 'UN', salePrice: k.price, qty: 999, isKit: true } as any))].filter(p =>
    !partSearch || p.description.toLowerCase().includes(partSearch.toLowerCase()) || p.internalCode.toLowerCase().includes(partSearch.toLowerCase())
  );
  const filteredServices = services.filter(s => !serviceSearch || s.name.toLowerCase().includes(serviceSearch.toLowerCase()));

  const addLabor = (mechId: string) => {
    const mech = mechanics.find(m => m.id === mechId);
    if (!mech) return;
    setLaborEntries(prev => [...prev, { id: Math.random().toString(36).substr(2,9), mechanicId: mechId, mechanicName: mech.name, hourlyRate: mech.hourlyRate, totalMinutes: 0, totalValue: 0, timerState: 'idle' }]);
    setShowMechanicModal(false);
  };

  const addPart = (p: any) => {
    setPartEntries(prev => {
      const existing = prev.find(x => x.partId === p.id);
      if (existing) return prev.map(x => x.partId === p.id ? { ...x, qty: x.qty + 1 } : x);
      return [...prev, { id: Math.random().toString(36).substr(2,9), partId: p.id, code: p.internalCode, description: p.description, qty: 1, unitPrice: p.salePrice, isKit: p.isKit }];
    });
    setShowPartsModal(false);
    toast(`${p.description} adicionada!`, 'success');
  };

  const addService = (s: typeof services[0]) => {
    setServiceEntries(prev => [...prev, { id: Math.random().toString(36).substr(2,9), serviceId: s.id, name: s.name, description: s.description, price: s.price }]);
    setShowServiceModal(false);
  };

  const tabs = [
    { id: 'labor' as Tab, label: 'Mão de Obra', icon: Clock },
    { id: 'services' as Tab, label: 'Serviços', icon: Hammer },
    { id: 'parts' as Tab, label: 'Peças', icon: Package },
    { id: 'photos' as Tab, label: 'Fotos', icon: Camera },
    { id: 'closure' as Tab, label: 'Resumo/Fechamento', icon: CreditCard },
  ];

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-xl p-5 mb-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <button onClick={() => navigate('/operacional')} className="text-slate-400 hover:text-white"><ArrowLeft className="h-5 w-5" /></button>
              <h1 className="text-2xl font-bold">OS #{osNumber}</h1>
              <Badge variant={existingOS?.status === 'Concluída' ? 'success' : existingOS?.status === 'Em execução' ? 'warning' : 'info'}>
                {existingOS?.status ?? 'Aberta'}
              </Badge>
            </div>
            {selectedClient ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div><span className="text-slate-400 block text-xs">Cliente</span><span className="font-medium">{selectedClient.name}</span></div>
                <div>
                  <span className="text-slate-400 block text-xs">Placa</span>
                  <select className="bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-sm font-mono" value={selectedTruckId} onChange={e => setSelectedTruckId(e.target.value)} disabled={isReadOnly}>
                    <option value="">Selecione...</option>
                    {selectedClient.trucks.map(t => <option key={t.id} value={t.id}>{t.plate}</option>)}
                  </select>
                </div>
                <div><span className="text-slate-400 block text-xs">Modelo</span><span>{selectedTruck?.brand} {selectedTruck?.model}</span></div>
                <div><span className="text-slate-400 block text-xs">KM</span><input className="bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-sm w-24" value={km} onChange={e => setKm(e.target.value)} disabled={isReadOnly} /></div>
              </div>
            ) : (
              <button onClick={() => setShowClientSearch(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <User className="h-4 w-4" /> Selecionar Cliente
              </button>
            )}
          </div>
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 text-right min-w-[160px]">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total</div>
            <div className="text-3xl font-bold text-emerald-400">{fmtCurrency(total)}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn('flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-medium transition-colors whitespace-nowrap',
                activeTab === tab.id ? 'border-blue-600 text-blue-700 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              )}>
              <Icon className={cn('h-4 w-4', activeTab === tab.id ? 'text-blue-600' : '')} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Labor Tab */}
      {activeTab === 'labor' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Cronômetros por Mecânico</CardTitle>
            {!isReadOnly && <Button size="sm" className="gap-2" onClick={() => setShowMechanicModal(true)}><Plus className="h-4 w-4" />Adicionar Mecânico</Button>}
          </CardHeader>
          <CardContent className="space-y-4">
            {laborEntries.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                Nenhum mecânico adicionado. Clique em "Adicionar Mecânico" para iniciar o cronômetro.
              </div>
            ) : laborEntries.map((e, i) => (
              <LaborRow key={e.id} entry={e} onRemove={() => setLaborEntries(prev => prev.filter((_, j) => j !== i))} onChange={updated => setLaborEntries(prev => prev.map((x, j) => j === i ? updated : x))} />
            ))}
            {laborEntries.length > 0 && <div className="flex justify-end pt-2 border-t border-slate-200"><span className="font-bold text-slate-900">Subtotal Mão de Obra: <span className="text-blue-700">{fmtCurrency(subtotalLabor)}</span></span></div>}
          </CardContent>
        </Card>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Serviços</CardTitle>
            {!isReadOnly && <Button size="sm" className="gap-2" onClick={() => setShowServiceModal(true)}><Plus className="h-4 w-4" />Adicionar Serviço</Button>}
          </CardHeader>
          <CardContent>
            {serviceEntries.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">Nenhum serviço lançado.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {serviceEntries.map((s, i) => (
                  <div key={s.id} className="flex items-center justify-between py-3 gap-4">
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{s.name}</div>
                      <input className="mt-1 text-sm text-slate-500 bg-transparent border-0 focus:outline-none w-full" value={s.description} onChange={e => setServiceEntries(prev => prev.map((x, j) => j === i ? { ...x, description: e.target.value } : x))} />
                    </div>
                    <input type="number" className="w-28 border border-slate-300 rounded px-2 py-1 text-sm text-right" value={s.price} onChange={e => setServiceEntries(prev => prev.map((x, j) => j === i ? { ...x, price: parseFloat(e.target.value) || 0 } : x))} />
                    {!isReadOnly && <button onClick={() => setServiceEntries(prev => prev.filter((_, j) => j !== i))} className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>}
                  </div>
                ))}
              </div>
            )}
            {serviceEntries.length > 0 && <div className="flex justify-end pt-3 border-t mt-3"><span className="font-bold">Subtotal: <span className="text-blue-700">{fmtCurrency(subtotalServices)}</span></span></div>}
          </CardContent>
        </Card>
      )}

      {/* Parts Tab */}
      {activeTab === 'parts' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Peças e Kits</CardTitle>
            {!isReadOnly && <Button size="sm" className="gap-2" onClick={() => setShowPartsModal(true)}><Plus className="h-4 w-4" />Adicionar Peça</Button>}
          </CardHeader>
          <CardContent>
            {partEntries.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">Nenhuma peça lançada nesta OS.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-slate-200 text-xs text-slate-500 uppercase">{['Código','Descrição','Qtd','R$ Unit','Subtotal',''].map(h => <th key={h} className="text-left pb-2 pr-4">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {partEntries.map((p, i) => (
                      <tr key={p.id} className="py-2">
                        <td className="py-2 pr-4 font-mono text-xs text-slate-500">{p.code}</td>
                        <td className="py-2 pr-4 text-sm font-medium max-w-[220px]">{p.description} {p.isKit && <Badge variant="info" className="ml-1 text-xs py-0">KIT</Badge>}</td>
                        <td className="py-2 pr-4"><input type="number" min={1} className="w-16 border border-slate-300 rounded px-2 py-1 text-sm text-center" value={p.qty} onChange={e => setPartEntries(prev => prev.map((x, j) => j === i ? { ...x, qty: parseInt(e.target.value) || 1 } : x))} /></td>
                        <td className="py-2 pr-4"><input type="number" step="0.01" className="w-24 border border-slate-300 rounded px-2 py-1 text-sm text-right" value={p.unitPrice} onChange={e => setPartEntries(prev => prev.map((x, j) => j === i ? { ...x, unitPrice: parseFloat(e.target.value) || 0 } : x))} /></td>
                        <td className="py-2 pr-4 font-semibold text-slate-900">{fmtCurrency(p.qty * p.unitPrice)}</td>
                        <td className="py-2">{!isReadOnly && <button onClick={() => setPartEntries(prev => prev.filter((_, j) => j !== i))} className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {partEntries.length > 0 && <div className="flex justify-end pt-3 border-t mt-3"><span className="font-bold">Subtotal: <span className="text-blue-700">{fmtCurrency(subtotalParts)}</span></span></div>}
          </CardContent>
        </Card>
      )}

      {/* Photos Tab */}
      {activeTab === 'photos' && (
        <Card>
          <CardContent className="p-12 text-center text-slate-400">
            <Camera className="h-14 w-14 mx-auto mb-4 text-slate-300" />
            <p className="font-medium">Módulo de fotos — Upload via dispositivo.</p>
            <p className="text-sm mt-1">No sistema completo, as fotos são gravadas no Supabase Storage vinculadas a esta OS.</p>
            {!isReadOnly && <button className="mt-4 border-2 border-dashed border-slate-300 rounded-xl px-8 py-3 text-sm hover:border-blue-400 hover:text-blue-600 transition-colors">+ Adicionar Fotos</button>}
          </CardContent>
        </Card>
      )}

      {/* Closure Tab */}
      {activeTab === 'closure' && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Resumo Financeiro</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[['Mão de Obra', subtotalLabor], ['Serviços', subtotalServices], ['Peças', subtotalParts]].map(([label, val]) => (
                <div key={label as string} className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">{label}</span>
                  <span className="font-semibold">{fmtCurrency(val as number)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-3">
                <span className="text-lg font-bold">Total Geral</span>
                <span className="text-2xl font-bold text-emerald-600">{fmtCurrency(total)}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Ações</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {!isReadOnly ? (
                <>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-sm text-slate-700">
                    <p><strong>Ao fechar esta OS:</strong></p>
                    <ul className="list-disc ml-4 space-y-1 text-slate-600">
                      <li>Status → <strong>Concluída</strong></li>
                      <li>Gera lançamento em Contas a Receber</li>
                      <li>Baixa as peças do estoque</li>
                      <li>OS fica somente leitura</li>
                    </ul>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={saveAndExit}>Salvar Rascunho</Button>
                    <Button className="flex-[2] bg-blue-600 hover:bg-blue-700" onClick={handleClose}><CheckCircle className="h-4 w-4 mr-2" />Fechar e Lançar OS</Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="font-medium">OS Concluída em {existingOS?.closedAt ? new Date(existingOS.closedAt).toLocaleDateString('pt-BR') : ''}</p>
                  <p className="text-sm mt-1">Esta OS está em modo somente leitura.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Modals ─────────────────────────────────────── */}

      {/* Client Search Modal */}
      <Modal isOpen={showClientSearch} onClose={() => { setShowClientSearch(false); if (!selectedClient) navigate('/operacional'); }} title="Selecionar Cliente" size="lg">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Buscar por nome, CPF/CNPJ ou placa..." value={clientSearchText} onChange={e => setClientSearchText(e.target.value)} autoFocus />
        </div>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {filteredClients.map(c => (
            <button key={c.id} className="w-full text-left p-4 border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all" onClick={() => { setSelectedClient(c); setSelectedTruckId(c.trucks[0]?.id ?? ''); setKm(String(c.trucks[0]?.km ?? '')); setShowClientSearch(false); }}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-slate-900">{c.name}</div>
                  <div className="text-sm text-slate-500">{c.document} — {c.phone}</div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {c.trucks.map(t => <span key={t.id} className="font-mono text-xs bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">{t.plate}</span>)}
                </div>
              </div>
            </button>
          ))}
          {filteredClients.length === 0 && <div className="text-center py-8 text-slate-400">Nenhum cliente encontrado. <Link to="/clientes/novo" className="text-blue-600 hover:underline">Cadastrar novo</Link></div>}
        </div>
      </Modal>

      {/* Add Mechanic Modal */}
      <Modal isOpen={showMechanicModal} onClose={() => setShowMechanicModal(false)} title="Adicionar Mecânico" size="sm">
        <div className="space-y-2">
          {mechanics.filter(m => m.active && !laborEntries.find(e => e.mechanicId === m.id)).map(m => (
            <button key={m.id} className="w-full text-left p-4 border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all" onClick={() => addLabor(m.id)}>
              <div className="font-semibold">{m.name}</div>
              <div className="text-sm text-slate-500">{m.specialty} — R$ {m.hourlyRate}/hora</div>
            </button>
          ))}
          {mechanics.filter(m => m.active && !laborEntries.find(e => e.mechanicId === m.id)).length === 0 && <p className="text-center text-slate-500 py-4">Todos os mecânicos já foram adicionados.</p>}
        </div>
      </Modal>

      {/* Add Service Modal */}
      <Modal isOpen={showServiceModal} onClose={() => setShowServiceModal(false)} title="Adicionar Serviço" size="md">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input autoFocus className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Buscar serviço..." value={serviceSearch} onChange={e => setServiceSearch(e.target.value)} />
        </div>
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {filteredServices.map(s => (
            <button key={s.id} className="w-full text-left p-3 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all" onClick={() => addService(s)}>
              <div className="flex justify-between">
                <div><span className="font-medium">{s.name}</span><div className="text-xs text-slate-500">{s.description}</div></div>
                <span className="font-semibold text-emerald-700">{fmtCurrency(s.price)}</span>
              </div>
            </button>
          ))}
        </div>
      </Modal>

      {/* Add Parts Modal */}
      <Modal isOpen={showPartsModal} onClose={() => setShowPartsModal(false)} title="Buscar Peças e Kits" size="lg">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input autoFocus className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Buscar por código, descrição..." value={partSearch} onChange={e => setPartSearch(e.target.value)} />
        </div>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {filteredParts.map((p: any) => (
            <button key={p.id} className="w-full text-left p-3 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all" onClick={() => addPart(p)}>
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{p.description}</span>
                  {p.isKit && <Badge variant="info" className="ml-2 text-xs">KIT</Badge>}
                  <div className="text-xs text-slate-500">{p.internalCode} {!p.isKit && `· Estoque: ${p.qty}`}</div>
                </div>
                <span className="font-semibold text-emerald-700">{fmtCurrency(p.salePrice)}</span>
              </div>
            </button>
          ))}
        </div>
      </Modal>

      {/* Closure Modal */}
      <Modal isOpen={showClosureModal} onClose={() => setShowClosureModal(false)} title="Fechar Ordem de Serviço" size="md">
        <div className="space-y-5">
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2">
            {[['Mão de Obra', subtotalLabor], ['Serviços', subtotalServices], ['Peças', subtotalParts]].map(([l, v]) => (
              <div key={l as string} className="flex justify-between text-sm"><span className="text-slate-600">{l}</span><span className="font-semibold">{fmtCurrency(v as number)}</span></div>
            ))}
            <div className="flex justify-between pt-2 border-t border-slate-200"><span className="font-bold text-slate-900">Total</span><span className="font-bold text-emerald-700 text-lg">{fmtCurrency(total)}</span></div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Formas de Pagamento</label>
            <div className="grid grid-cols-2 gap-2">
              {['Dinheiro', 'PIX', 'Cartão Crédito', 'Cartão Débito', 'Boleto', 'A prazo'].map(m => (
                <label key={m} className={cn('flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all text-sm', paymentMethods.includes(m) ? 'border-blue-500 bg-blue-50 text-blue-800 font-medium' : 'border-slate-200 hover:border-slate-300')}>
                  <input type="checkbox" className="rounded" checked={paymentMethods.includes(m)} onChange={e => setPaymentMethods(prev => e.target.checked ? [...prev, m] : prev.filter(x => x !== m))} />
                  {m}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-200 pt-4">
            <label className="flex items-center gap-3 text-sm cursor-pointer"><input type="checkbox" className="rounded" checked={emitNFe} onChange={e => setEmitNFe(e.target.checked)} /><span>Emitir <strong>NF-e</strong> (Peças)</span></label>
            <label className="flex items-center gap-3 text-sm cursor-pointer"><input type="checkbox" className="rounded" checked={emitNFSe} onChange={e => setEmitNFSe(e.target.checked)} /><span>Emitir <strong>NFS-e</strong> (Serviços + Mão de Obra)</span></label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowClosureModal(false)}>Cancelar</Button>
            <Button className="flex-[2] bg-blue-600 hover:bg-blue-700" onClick={confirmClose} disabled={paymentMethods.length === 0}>
              <CheckCircle className="h-4 w-4 mr-2" />Confirmar Fechamento
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
