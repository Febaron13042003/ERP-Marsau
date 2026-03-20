import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMockDB } from '../../contexts/MockDBContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { ArrowLeft, Plus, Truck, Trash2 } from 'lucide-react';
import type { Cliente, Truck as TruckType } from '../../contexts/MockDBContext';
import { today } from '../../lib/utils';

export function ClienteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clientes, addCliente, updateCliente, addTruckToCliente } = useMockDB();
  const { toast } = useToast();
  const existing = clientes.find(c => c.id === id);

  const [type, setType] = useState<'PF' | 'PJ'>(existing?.type ?? 'PJ');
  const [name, setName] = useState(existing?.name ?? '');
  const [document, setDocument] = useState(existing?.document ?? '');
  const [phone, setPhone] = useState(existing?.phone ?? '');
  const [whatsapp, setWhatsapp] = useState(existing?.whatsapp ?? '');
  const [email, setEmail] = useState(existing?.email ?? '');
  const [cep, setCep] = useState(existing?.cep ?? '');
  const [street, setStreet] = useState(existing?.street ?? '');
  const [number, setNumber] = useState(existing?.number ?? '');
  const [complement, setComplement] = useState(existing?.complement ?? '');
  const [neighborhood, setNeighborhood] = useState(existing?.neighborhood ?? '');
  const [city, setCity] = useState(existing?.city ?? '');
  const [state, setState] = useState(existing?.state ?? 'PR');
  const [ie, setIe] = useState(existing?.ie ?? '');
  const [tradeName, setTradeName] = useState(existing?.tradeName ?? '');
  const [creditLimit, setCreditLimit] = useState(String(existing?.creditLimit ?? ''));
  const [notes, setNotes] = useState(existing?.notes ?? '');

  // Truck modal
  const [showTruckModal, setShowTruckModal] = useState(false);
  const [truckPlate, setTruckPlate] = useState('');
  const [truckModel, setTruckModel] = useState('');
  const [truckBrand, setTruckBrand] = useState('');
  const [truckYear, setTruckYear] = useState('');
  const [truckKm, setTruckKm] = useState('');
  const [truckFleet, setTruckFleet] = useState('');

  const fakeCepLookup = (c: string) => {
    if (c.replace(/\D/g, '').length === 8) {
      setStreet('Av. Colombo'); setNeighborhood('Zona 01'); setCity('Maringá'); setState('PR');
    }
  };

  const handleSave = () => {
    if (!name || !document || !phone) { toast('Preencha nome, documento e telefone.', 'error'); return; }
    const payload: Omit<Cliente, 'id'> = {
      type, name, document, phone, whatsapp, email, cep, street, number: number, complement, neighborhood, city, state,
      ie, tradeName, creditLimit: parseFloat(creditLimit) || 0, notes,
      status: existing?.status ?? 'Ativo', trucks: existing?.trucks ?? [], drivers: existing?.drivers ?? [],
    };
    if (existing) {
      updateCliente(existing.id, payload);
      toast('Cliente atualizado!', 'success');
    } else {
      addCliente(payload);
      toast('Cliente cadastrado!', 'success');
    }
    navigate('/clientes');
  };

  const handleAddTruck = () => {
    if (!truckPlate) { toast('Placa é obrigatória.', 'error'); return; }
    const clientId = existing?.id;
    if (!clientId) { toast('Salve o cliente antes de adicionar caminhões.', 'warning'); return; }
    addTruckToCliente(clientId, { plate: truckPlate.toUpperCase(), model: truckModel, brand: truckBrand, year: truckYear, chassis: '', km: parseInt(truckKm) || 0, fleetNumber: truckFleet });
    toast('Caminhão adicionado!', 'success');
    setShowTruckModal(false);
    setTruckPlate(''); setTruckModel(''); setTruckBrand(''); setTruckYear(''); setTruckKm(''); setTruckFleet('');
  };

  const trucks = existing?.trucks ?? [];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/clientes')} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft className="h-5 w-5" /></button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{existing ? 'Editar Cliente' : 'Novo Cliente'}</h1>
          <p className="text-sm text-slate-500">{existing?.name}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Type */}
        <Card>
          <CardHeader><CardTitle>Tipo de Pessoa</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-3">
              {(['PJ', 'PF'] as const).map(t => (
                <button key={t} onClick={() => setType(t)} className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-all text-sm ${type === t ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                  {t === 'PJ' ? '🏢 Pessoa Jurídica' : '👤 Pessoa Física'}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Basic Data */}
        <Card>
          <CardHeader><CardTitle>{type === 'PJ' ? 'Dados da Empresa' : 'Dados Pessoais'}</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label={type === 'PJ' ? 'Razão Social *' : 'Nome Completo *'} value={name} onChange={e => setName(e.target.value)} className="md:col-span-2" />
            {type === 'PJ' && <Input label="Nome Fantasia" value={tradeName} onChange={e => setTradeName(e.target.value)} className="md:col-span-2" />}
            <Input label={type === 'PJ' ? 'CNPJ *' : 'CPF *'} value={document} onChange={e => setDocument(e.target.value)} placeholder={type === 'PJ' ? '00.000.000/0001-00' : '000.000.000-00'} />
            {type === 'PJ' && <Input label="Inscrição Estadual" value={ie} onChange={e => setIe(e.target.value)} />}
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader><CardTitle>Contato</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Telefone *" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(44) 99999-9999" />
            <Input label="WhatsApp" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="(44) 99999-9999" />
            <Input label="E-mail" value={email} onChange={e => setEmail(e.target.value)} type="email" />
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader><CardTitle>Endereço</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input label="CEP" value={cep} onChange={e => { setCep(e.target.value); fakeCepLookup(e.target.value); }} onBlur={() => fakeCepLookup(cep)} placeholder="00000-000" />
            <Input label="Logradouro" value={street} onChange={e => setStreet(e.target.value)} className="md:col-span-2" />
            <Input label="Número" value={number} onChange={e => setNumber(e.target.value)} />
            <Input label="Complemento" value={complement} onChange={e => setComplement(e.target.value)} className="md:col-span-2" />
            <Input label="Bairro" value={neighborhood} onChange={e => setNeighborhood(e.target.value)} />
            <Input label="Cidade" value={city} onChange={e => setCity(e.target.value)} />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Estado</label>
              <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={state} onChange={e => setState(e.target.value)}>
                {['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Commercial */}
        <Card>
          <CardHeader><CardTitle>Dados Comerciais</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Limite de Crédito (R$)" type="number" value={creditLimit} onChange={e => setCreditLimit(e.target.value)} />
            <div />
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700 block mb-1">Observações Internas</label>
              <textarea className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Trucks */}
        {existing && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Caminhões ({trucks.length})</CardTitle>
              <button onClick={() => setShowTruckModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                <Plus className="h-4 w-4" />Adicionar Caminhão
              </button>
            </CardHeader>
            <CardContent>
              {trucks.length === 0 ? (
                <p className="text-slate-400 text-center py-6">Nenhum caminhão cadastrado.</p>
              ) : (
                <div className="grid gap-3">
                  {trucks.map(t => (
                    <div key={t.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="font-mono font-bold text-slate-900 bg-yellow-100 border border-yellow-300 px-2 py-0.5 rounded text-sm">{t.plate}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{t.brand} {t.model} {t.year && `(${t.year})`}</div>
                          <div className="text-xs text-slate-500">{t.km.toLocaleString('pt-BR')} km · {t.fleetNumber ? `Frota: ${t.fleetNumber}` : ''}</div>
                        </div>
                      </div>
                      <Truck className="h-5 w-5 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => navigate('/clientes')}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar Cliente</Button>
        </div>
      </div>

      {/* Add Truck Modal */}
      <Modal isOpen={showTruckModal} onClose={() => setShowTruckModal(false)} title="Adicionar Caminhão" size="md">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Placa *" value={truckPlate} onChange={e => setTruckPlate(e.target.value)} placeholder="ABC-1234" className="col-span-2" />
          <Input label="Marca" value={truckBrand} onChange={e => setTruckBrand(e.target.value)} placeholder="Volvo, Scania..." />
          <Input label="Modelo" value={truckModel} onChange={e => setTruckModel(e.target.value)} placeholder="FH 540, R 450..." />
          <Input label="Ano" value={truckYear} onChange={e => setTruckYear(e.target.value)} placeholder="2022" />
          <Input label="KM Atual" type="number" value={truckKm} onChange={e => setTruckKm(e.target.value)} />
          <Input label="Nº Frota" value={truckFleet} onChange={e => setTruckFleet(e.target.value)} className="col-span-2" />
          <div className="col-span-2 flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowTruckModal(false)}>Cancelar</Button>
            <Button className="flex-1" onClick={handleAddTruck}>Adicionar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
