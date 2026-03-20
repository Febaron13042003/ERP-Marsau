import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Plus, Search, Edit, FileText } from 'lucide-react';

export function FuncionariosList() {
  const mockFunc = [
    { id: 1, name: 'João Miguel Mendes', role: 'Mecânico Eletricista', type: 'CLT', admission: '15/01/2021', salary: 3500.00, status: 'Ativo' },
    { id: 2, name: 'Carlos Santos Vieira', role: 'Mecânico Diesel', type: 'PJ', admission: '20/03/2023', salary: 4200.00, status: 'Ativo' },
    { id: 3, name: 'Maria de Oliveira', role: 'Auxiliar Administrativo', type: 'CLT', admission: '10/05/2022', salary: 2500.00, status: 'Férias' },
    { id: 4, name: 'Pedro de Assis Dias', role: 'Ajudante Geral', type: 'CLT', admission: '01/10/2025', salary: 1800.00, status: 'Demitido' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-5 rounded-lg shadow-sm border border-slate-200">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Quadro de Funcionários</h3>
          <p className="text-sm text-slate-500 mt-1">Gestão de colaboradores, seus dados de contrato, cargos e salários base.</p>
        </div>
        <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm text-base py-5 px-6">
          <Plus className="h-5 w-5" /> Contratar / Novo Funcionário
        </Button>
      </div>

      <Card className="shadow-sm border-slate-200">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 bg-slate-50/50 rounded-t-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input type="text" placeholder="Localizar pelo nome completo ou função..." className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
          </div>
          <select className="border border-slate-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-700">
            <option>Filtrar: Somente Ativos</option>
            <option>Filtrar: Todos os Status</option>
            <option>Filtrar: Em Férias ou Afastados</option>
          </select>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold text-slate-700">Nome do Colaborador</TableHead>
                <TableHead className="font-semibold text-slate-700">Cargo Registrado</TableHead>
                <TableHead className="font-semibold text-slate-700 text-center">Contrato</TableHead>
                <TableHead className="font-semibold text-slate-700">Data de Admissão</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Salário Base (R$)</TableHead>
                <TableHead className="font-semibold text-slate-700">Situação</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Editar Perfil</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockFunc.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-bold text-slate-900">{item.name}</TableCell>
                  <TableCell className="text-slate-600 font-medium">{item.role}</TableCell>
                  <TableCell className="text-center">
                    <span className="bg-slate-200 text-slate-700 rounded text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wide">
                      {item.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-500">{item.admission}</TableCell>
                  <TableCell className="text-right font-medium text-slate-800">R$ {item.salary.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'Ativo' ? 'success' : item.status === 'Férias' ? 'warning' : 'danger'} className="px-2.5 py-1">
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                       <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 px-2" title="Ficha Completa / Documentos"><FileText className="h-4 w-4" /></Button>
                       <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 px-2" title="Editar Cadastro"><Edit className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
