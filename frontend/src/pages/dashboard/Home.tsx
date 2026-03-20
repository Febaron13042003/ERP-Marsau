import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Wrench, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';

export function Home() {
  const faturamentoData = [
    { name: 'Out', pecas: 4000, servicos: 2400, maoObra: 2400 },
    { name: 'Nov', pecas: 3000, servicos: 1398, maoObra: 2210 },
    { name: 'Dez', pecas: 2000, servicos: 9800, maoObra: 2290 },
    { name: 'Jan', pecas: 2780, servicos: 3908, maoObra: 2000 },
    { name: 'Fev', pecas: 1890, servicos: 4800, maoObra: 2181 },
    { name: 'Mar', pecas: 2390, servicos: 3800, maoObra: 2500 },
  ];

  const osStatusData = [
    { name: 'Aberta', value: 12 },
    { name: 'Em Execução', value: 5 },
    { name: 'Concluída', value: 38 },
  ];
  const COLORS = ['#3b82f6', '#f59e0b', '#22c55e'];

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-6 gap-4">
        <PageHeader 
          title="Dashboard Gerencial" 
          description="Visão geral e indicadores em tempo real."
        />
        <select className="border border-slate-300 rounded-md px-4 py-2 text-sm bg-white font-medium shadow-sm focus:ring-blue-500 mb-6">
          <option>Mês Atual (Março)</option>
          <option>Últimos 30 dias</option>
          <option>Ano Atual (2026)</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-none text-white shadow-md">
          <CardContent className="p-6">
            <div className="text-blue-100 text-sm font-medium mb-1">Faturamento Total</div>
            <div className="text-3xl font-bold">R$ 45.230,00</div>
            <div className="text-xs text-blue-200 mt-2 font-medium">↑ 12% vs. mês anterior</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-none text-white shadow-md">
          <CardContent className="p-6">
            <div className="text-emerald-100 text-sm font-medium mb-1">Lucro Líquido</div>
            <div className="text-3xl font-bold">R$ 18.500,00</div>
            <div className="text-xs text-emerald-100 mt-2 font-medium">Margem de 40.9%</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <div className="text-slate-500 text-sm font-medium mb-1">Ticket Médio (OS)</div>
              <div className="text-2xl font-bold text-slate-800">R$ 1.150,00</div>
            </div>
            <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <div className="text-slate-500 text-sm font-medium mb-1">OS Abertas</div>
              <div className="text-2xl font-bold text-slate-800">17</div>
            </div>
            <div className="h-12 w-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
              <Wrench className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Evolução de Faturamento (6 meses)</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={faturamentoData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13}} tickFormatter={(value: number) => `R$ ${value}`} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="pecas" name="Peças" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} barSize={40} />
                <Bar dataKey="servicos" name="Serviços" stackId="a" fill="#10b981" />
                <Bar dataKey="maoObra" name="Mão de Obra" stackId="a" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

         <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Composição de Status (OS)</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={osStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label
                >
                  {osStatusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & secondary info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-red-500 shadow-sm">
          <CardHeader className="pb-3 border-b border-red-50">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" /> Painel de Alertas
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-3">
              <li className="flex justify-between items-center py-2.5 border-b border-red-50 last:border-0 hover:bg-slate-50 transition-colors px-2 rounded -mx-2">
                <span className="text-slate-700"><strong>4 peças</strong> atingiram o estoque mínimo</span>
                <Link to="/estoque" className="text-sm font-medium text-blue-600 hover:underline">Repor Estoque</Link>
              </li>
              <li className="flex justify-between items-center py-2.5 border-b border-red-50 last:border-0 hover:bg-slate-50 transition-colors px-2 rounded -mx-2">
                <span className="text-slate-700"><strong>2 clientes</strong> no radar de Retorno (CRM)</span>
                <Link to="/clientes" className="text-sm font-medium text-blue-600 hover:underline">Ver Tabela</Link>
              </li>
              <li className="flex justify-between items-center py-2.5 border-b border-red-50 last:border-0 hover:bg-slate-50 transition-colors px-2 rounded -mx-2">
                <span className="text-slate-700"><strong>3 contas a pagar</strong> vencendo hoje</span>
                <Link to="/financeiro" className="text-sm font-medium text-blue-600 hover:underline">Pagar Agora</Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-50">
             <CardTitle className="flex items-center gap-2 text-slate-800">
              <CheckCircle className="h-5 w-5 text-emerald-500" /> Previsão de Mais Feitos (Mês)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-4">
              <li className="flex justify-between items-center p-3 rounded-md bg-slate-50 border border-slate-100">
                <span className="text-sm font-medium text-slate-800">1. Revisão Preventiva (Diesel)</span>
                <Badge variant="success" className="px-2">24x</Badge>
              </li>
              <li className="flex justify-between items-center p-3 rounded-md bg-slate-50 border border-slate-100">
                <span className="text-sm font-medium text-slate-800">2. Troca de Óleo e Filtros</span>
                <Badge variant="success" className="px-2">18x</Badge>
              </li>
              <li className="flex justify-between items-center p-3 rounded-md bg-slate-50 border border-slate-100">
                <span className="text-sm font-medium text-slate-800">3. Reparo Alternador / Motor de Partida</span>
                <Badge variant="success" className="px-2">12x</Badge>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
