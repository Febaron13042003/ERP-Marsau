import { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { useMockDB } from '../../contexts/MockDBContext';
import { useToast } from '../../components/ui/Toast';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Plus, Pencil } from 'lucide-react';
import { cn, today } from '../../lib/utils';
import type { Employee } from '../../contexts/MockDBContext';

function Funcionarios() {
  const { employees, addEmployee, updateEmployee } = useMockDB();
  const { toast } = useToast();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);

  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [dept, setDept] = useState('Mecânica');
  const [contract, setContract] = useState<'CLT' | 'PJ' | 'Autônomo'>('CLT');
  const [salary, setSalary] = useState('');
  const [admission, setAdmission] = useState(today());

  const openNew = () => { setEditing(null); setName(''); setCpf(''); setPhone(''); setRole(''); setSalary(''); setModal(true); };
  const openEdit = (e: Employee) => { setEditing(e); setName(e.name); setCpf(e.cpf); setPhone(e.phone); setRole(e.role); setContract(e.contractType); setSalary(String(e.baseSalary)); setAdmission(e.admissionDate); setModal(true); };

  const handleSave = () => {
    const payload = { name, cpf, phone, role, department: dept, contractType: contract, baseSalary: parseFloat(salary) || 0, admissionDate: admission, active: true };
    if (editing) { updateEmployee(editing.id, payload); toast('Funcionário atualizado!', 'success'); }
    else { addEmployee(payload); toast('Funcionário cadastrado!', 'success'); }
    setModal(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Funcionários ({employees.length})</h2>
        <Button size="sm" onClick={openNew} className="gap-2"><Plus className="h-4 w-4" />Novo</Button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>{['Nome', 'CPF', 'Cargo', 'Depto.', 'Tipo', 'Sal. Base', 'Admissão', 'Status', ''].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map(e => (
              <tr key={e.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{e.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-600">{e.cpf}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{e.role}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{e.department}</td>
                <td className="px-4 py-3"><Badge variant="default" className="text-xs">{e.contractType}</Badge></td>
                <td className="px-4 py-3 font-semibold text-slate-900 text-right">{e.baseSalary.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{e.admissionDate}</td>
                <td className="px-4 py-3"><Badge variant={e.active ? 'success' : 'default'}>{e.active ? 'Ativo' : 'Inativo'}</Badge></td>
                <td className="px-4 py-3"><button onClick={() => openEdit(e)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600"><Pencil className="h-4 w-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Editar Funcionário' : 'Novo Funcionário'} size="md">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Nome Completo *" value={name} onChange={e => setName(e.target.value)} className="col-span-2" />
          <Input label="CPF *" value={cpf} onChange={e => setCpf(e.target.value)} />
          <Input label="Telefone" value={phone} onChange={e => setPhone(e.target.value)} />
          <Input label="Cargo" value={role} onChange={e => setRole(e.target.value)} />
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Departamento</label>
            <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={dept} onChange={e => setDept(e.target.value)}>
              {['Mecânica', 'Administrativo', 'Financeiro', 'Estoque'].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Tipo de Contrato</label>
            <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={contract} onChange={e => setContract(e.target.value as any)}>
              {['CLT', 'PJ', 'Autônomo'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <Input label="Salário Base (R$)" type="number" value={salary} onChange={e => setSalary(e.target.value)} />
          <Input label="Data Admissão" type="date" value={admission} onChange={e => setAdmission(e.target.value)} />
          <div className="col-span-2 flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setModal(false)}>Cancelar</Button>
            <Button className="flex-1" onClick={handleSave}>Salvar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Ponto() {
  const { employees, timeEntries, addTimeEntry } = useMockDB();
  const { toast } = useToast();
  const [empId, setEmpId] = useState(employees[0]?.id ?? '');
  const [date, setDate] = useState(today());
  const [entry, setEntry] = useState('08:00');
  const [exit, setExit] = useState('17:00');
  const [lunch, setLunch] = useState('01:00');

  const entries = timeEntries.filter(t => !empId || t.employeeId === empId);

  const calcHours = (entry: string, exit: string, lunch: string) => {
    const [eh, em] = entry.split(':').map(Number);
    const [xh, xm] = exit.split(':').map(Number);
    const [lh, lm] = lunch.split(':').map(Number);
    return Math.max(0, (xh * 60 + xm) - (eh * 60 + em) - (lh * 60 + lm)) / 60;
  };

  const handleAdd = () => {
    const totalHours = calcHours(entry, exit, lunch);
    addTimeEntry({ employeeId: empId, date, entryTime: entry, exitTime: exit, lunchTime: lunch, totalHours });
    toast('Ponto registrado!', 'success');
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-6">Controle de Ponto</h2>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6 grid grid-cols-2 md:grid-cols-6 gap-4 items-end">
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-700 block mb-1">Funcionário</label>
          <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={empId} onChange={e => setEmpId(e.target.value)}>
            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
        <Input label="Data" type="date" value={date} onChange={e => setDate(e.target.value)} />
        <Input label="Entrada" type="time" value={entry} onChange={e => setEntry(e.target.value)} />
        <Input label="Saída" type="time" value={exit} onChange={e => setExit(e.target.value)} />
        <Button onClick={handleAdd}>Registrar</Button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>{['Funcionário', 'Data', 'Entrada', 'Saída', 'Almoço', 'Horas Trabalhadas'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.length === 0 ? <tr><td colSpan={6} className="text-center py-12 text-slate-400">Nenhum registro de ponto.</td></tr> :
              entries.map(e => {
                const emp = employees.find(em => em.id === e.employeeId);
                return (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{emp?.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{e.date}</td>
                    <td className="px-4 py-3 text-sm text-emerald-700 font-mono">{e.entryTime}</td>
                    <td className="px-4 py-3 text-sm text-red-600 font-mono">{e.exitTime}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 font-mono">{e.lunchTime}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{(e.totalHours ?? 0).toFixed(1)}h {(e.totalHours ?? 0) > 8 ? <span className="text-xs text-amber-600 ml-1">+{((e.totalHours ?? 0) - 8).toFixed(1)}h extra</span> : ''}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function RHLayout() {
  const tabs = [{ to: '/rh', label: 'Funcionários', end: true }, { to: '/rh/ponto', label: 'Controle de Ponto' }];
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Recursos Humanos</h1>
      <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
        {tabs.map(t => (
          <NavLink key={t.to} to={t.to} end={t.end}
            className={({ isActive }) => cn('px-6 py-3 border-b-2 text-sm font-medium transition-colors whitespace-nowrap', isActive ? 'border-blue-600 text-blue-700 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700')}
          >{t.label}</NavLink>
        ))}
      </div>
      <Routes>
        <Route index element={<Funcionarios />} />
        <Route path="ponto" element={<Ponto />} />
      </Routes>
    </div>
  );
}
