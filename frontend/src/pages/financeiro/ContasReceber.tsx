import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Plus, Search, DollarSign } from 'lucide-react';
import { useMockDB } from '../../contexts/MockDBContext';

export function ContasReceber() {
  const { financeiro, addFinanceiro } = useMockDB();

  const handleAddNew = () => {
    const value = parseFloat(prompt('Digite o valor do recebimento R$:') || '0');
    const client = prompt('Nome do Cliente:') || 'Avulso';
    const origin = prompt('Origem (ex: OS #1090):') || 'Balcão';

    if (value > 0) {
      addFinanceiro({
        origin,
        client,
        dueDate: new Date().toLocaleDateString('pt-BR'),
        value,
        status: 'Pendente',
        method: 'Boleto'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-5 rounded-lg shadow-sm border border-slate-200">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Contas a Receber</h3>
          <p className="text-sm text-slate-500 mt-1">Acompanhe receitas geradas por OS e avulsos.</p>
        </div>
        <Button size="sm" onClick={handleAddNew} className="gap-2 bg-green-600 hover:bg-green-700 shadow-sm text-base py-5 px-6">
          <Plus className="h-5 w-5" /> Novo Recebimento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-emerald-50 border-emerald-200 shadow-sm">
          <CardContent className="p-6">
            <div className="text-sm font-semibold text-emerald-800 mb-2">Total a Receber (Hoje)</div>
            <div className="text-3xl font-bold text-emerald-600 font-mono">R$ 2.450,00</div>
          </CardContent>
        </Card>
        <Card className="bg-rose-50 border-rose-200 shadow-sm">
          <CardContent className="p-6">
            <div className="text-sm font-semibold text-rose-800 mb-2">Total Vencido</div>
            <div className="text-3xl font-bold text-rose-600 font-mono">R$ 1.200,00</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200 shadow-sm">
          <CardContent className="p-6">
            <div className="text-sm font-semibold text-blue-800 mb-2">Recebido (Mês Atual)</div>
            <div className="text-3xl font-bold text-blue-600 font-mono">R$ 15.350,00</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 bg-slate-50/50 rounded-t-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input type="text" placeholder="Buscar por cliente, OS ou descrição..." className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
          </div>
          <select className="border border-slate-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-700">
            <option>Todos os Status</option>
            <option>Pendente</option>
            <option>Recebido</option>
            <option>Vencido</option>
          </select>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold text-slate-700">Origem</TableHead>
                <TableHead className="font-semibold text-slate-700">Cliente</TableHead>
                <TableHead className="font-semibold text-slate-700">Vencimento</TableHead>
                <TableHead className="font-semibold text-slate-700">Forma</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Valor</TableHead>
                <TableHead className="font-semibold text-slate-700">Status</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financeiro.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-bold text-blue-600 cursor-pointer hover:underline">{item.origin}</TableCell>
                  <TableCell className="font-medium text-slate-800">{item.client}</TableCell>
                  <TableCell className="text-slate-600">{item.dueDate}</TableCell>
                  <TableCell className="text-slate-500">{item.method}</TableCell>
                  <TableCell className="text-right font-bold text-slate-900">R$ {item.value.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'Recebido' ? 'success' : item.status === 'Vencido' ? 'danger' : 'warning'} className="px-2.5 py-1">
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-green-600 hover:bg-green-50" title="Baixar / Efetuar Recebimento"><DollarSign className="h-5 w-5" /></Button>
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
