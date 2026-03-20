import { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { useMockDB } from '../../contexts/MockDBContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Plus } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { AppUser } from '../../contexts/MockDBContext';

const ROLE_COLORS: Record<string, 'info' | 'success' | 'warning' | 'danger' | 'default'> = {
  Administrador: 'danger', Operacional: 'info', Almoxarifado: 'warning',
  Financeiro: 'success', Sócio: 'default', Auditoria: 'default'
};

function Usuarios() {
  const { users, addUser } = useMockDB();
  const { toast } = useToast();
  const [modal, setModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AppUser['role']>('Operacional');

  const handleSave = () => {
    addUser({ name, email, role, active: true });
    toast('Usuário criado!', 'success');
    setModal(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Usuários do Sistema ({users.length})</h2>
        <Button size="sm" onClick={() => setModal(true)} className="gap-2"><Plus className="h-4 w-4" />Novo Usuário</Button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>{['Nome', 'E-mail', 'Perfil', 'Status', 'Criado em'].map(h => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-slate-900">{u.name}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{u.email}</td>
                <td className="px-5 py-3"><Badge variant={ROLE_COLORS[u.role] ?? 'default'}>{u.role}</Badge></td>
                <td className="px-5 py-3"><Badge variant={u.active ? 'success' : 'default'}>{u.active ? 'Ativo' : 'Inativo'}</Badge></td>
                <td className="px-5 py-3 text-sm text-slate-500">{u.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={modal} onClose={() => setModal(false)} title="Novo Usuário" size="sm">
        <div className="space-y-4">
          <Input label="Nome Completo" value={name} onChange={e => setName(e.target.value)} />
          <Input label="E-mail (login)" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Perfil de Acesso</label>
            <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={role} onChange={e => setRole(e.target.value as AppUser['role'])}>
              {['Administrador', 'Operacional', 'Almoxarifado', 'Financeiro', 'Sócio', 'Auditoria'].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="pt-2 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setModal(false)}>Cancelar</Button>
            <Button className="flex-1" onClick={handleSave}>Criar Usuário</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function LogAuditoria() {
  const { auditLogs } = useMockDB();
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-6">Log de Auditoria</h2>
      {auditLogs.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
          <p>Nenhuma ação registrada ainda.</p>
          <p className="text-sm mt-1">As ações serão registradas automaticamente conforme o uso do sistema.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>{['Data/Hora', 'Usuário', 'Módulo', 'Ação', 'Registro'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-xs font-mono text-slate-600">{new Date(log.createdAt).toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-3 text-sm font-medium">{log.userName}</td>
                  <td className="px-4 py-3 text-xs"><Badge variant="default">{log.module}</Badge></td>
                  <td className="px-4 py-3 text-sm text-slate-600">{log.action}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{log.recordLabel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function SettingsLayout() {
  const tabs = [{ to: '/configuracoes', label: 'Usuários', end: true }, { to: '/configuracoes/auditoria', label: 'Log de Auditoria' }, { to: '/configuracoes/empresa', label: 'Empresa' }];
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Configurações</h1>
      <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
        {tabs.map(t => (
          <NavLink key={t.to} to={t.to} end={t.end}
            className={({ isActive }) => cn('px-6 py-3 border-b-2 text-sm font-medium transition-colors whitespace-nowrap', isActive ? 'border-blue-600 text-blue-700 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700')}
          >{t.label}</NavLink>
        ))}
      </div>
      <Routes>
        <Route index element={<Usuarios />} />
        <Route path="auditoria" element={<LogAuditoria />} />
        <Route path="empresa" element={<EmpresaConfig />} />
      </Routes>
    </div>
  );
}

function EmpresaConfig() {
  const [name, setName] = useState('Marsau Auto Elétrica de Caminhões');
  const [cnpj, setCnpj] = useState('12.345.678/0001-90');
  const [phone, setPhone] = useState('(44) 3025-1234');
  const [hourRate, setHourRate] = useState('100');
  const { toast } = useToast();
  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-slate-900 text-lg">Dados da Empresa</h2>
        <Input label="Razão Social" value={name} onChange={e => setName(e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="CNPJ" value={cnpj} onChange={e => setCnpj(e.target.value)} />
          <Input label="Telefone" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        <Button onClick={() => toast('Dados salvos!', 'success')}>Salvar</Button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-slate-900 text-lg">Configurações Operacionais</h2>
        <Input label="Valor Padrão Hora de Mão de Obra (R$)" type="number" value={hourRate} onChange={e => setHourRate(e.target.value)} />
        <Input label="Alerta de OS sem movimentação (horas)" type="number" defaultValue="48" />
        <Input label="Intervalo padrão de retorno CRM (dias)" type="number" defaultValue="90" />
        <Button onClick={() => toast('Configurações salvas!', 'success')}>Salvar</Button>
      </div>
    </div>
  );
}
