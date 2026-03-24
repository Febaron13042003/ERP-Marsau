import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Wrench, CheckCircle, TrendingUp, AlertCircle, Truck, Zap, Calendar } from 'lucide-react';
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
  
  // Cores Marsau: Amarelo Vibrante, Preto, Cinza Escuro
  const COLORS = ['#FBBF24', '#000000', '#4B5563'];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-8 gap-4">
        <PageHeader 
          title="CENTRAL DE CONTROLE MARSAU" 
          description="Monitoramento em tempo real da oficina e indicadores financeiros."
        />
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-slate-200">
           <Calendar className="h-4 w-4 text-yellow-600" />
           <select className="text-sm font-bold bg-transparent focus:outline-none uppercase tracking-tighter">
             <option>Março / 2026</option>
             <option>Fevereiro / 2026</option>
             <option>Ano Completo</option>
           </select>
        </div>
      </div>

      {/* KPI Cards Estilo Marsau */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-black border-none text-white shadow-xl overflow-hidden relative">
          <div className="absolute right-[-10px] top-[-10px] opacity-10">
            <TrendingUp size={100} />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="text-yellow-500 text-xs font-black uppercase tracking-widest mb-1">Faturamento Bruto</div>
            <div className="text-3xl font-black">R$ 45.230,00</div>
            <div className="flex items-center gap-1 text-xs text-emerald-400 mt-2 font-bold">
              <span>↑ 12%</span>
              <span className="text-slate-400 font-normal">vs. mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-2 border-black shadow-md">
          <CardContent className="p-6">
            <div className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Lucro Líquido</div>
            <div className="text-3xl font-black text-black">R$ 18.500,00</div>
            <div className="inline-block bg-yellow-400 text-black text-[10px] px-2 py-0.5 rounded mt-2 font-black">
              MARGEM 40.9%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-slate-200">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Ticket Médio OS</div>
              <div className="text-2xl font-black text-slate-800">R$ 1.150,00</div>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded flex items-center justify-center text-yellow-600">
              <Zap className="h-6 w-6 fill-current" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-slate-200">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Caminhões no Pátio</div>
              <div className="text-2xl font-black text-slate-800">17</div>
            </div>
            <div className="h-12 w-12 bg-slate-900 rounded flex items-center justify-center text-white">
              <Truck className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos com cores Marsau */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 shadow-sm border-t-4 border-t-black">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase italic">Desempenho de Vendas (6 meses)</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={faturamentoData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#000', fontWeight: 'bold', fontSize: 11}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                <Tooltip cursor={{fill: '#FBBF24', opacity: 0.1}} contentStyle={{ borderRadius: '4px', border: '1px solid #000' }} />
                <Bar dataKey="pecas" name="Peças" stackId="a" fill="#000000" barSize={35} />
                <Bar dataKey="servicos" name="Serviços" stackId="a" fill="#FBBF24" />
                <Bar dataKey="maoObra" name="Mão de Obra" stackId="a" fill="#9CA3AF" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

         <Card className="shadow-sm border-t-4 border-t-yellow-500">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase italic">Distribuição de Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={osStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {osStatusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Painel de Alertas e Serviços */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
        <Card className="border-2 border-red-100 shadow-sm bg-white">
          <CardHeader className="pb-3 border-b border-red-50 bg-red-50/50">
            <CardTitle className="flex items-center gap-2 text-red-700 uppercase font-black text-sm italic">
              <AlertCircle className="h-5 w-5" /> Alertas Críticos da Oficina
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-3">
              <li className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors px-2 rounded -mx-2">
                <span className="text-slate-700 font-bold text-sm">⚠️ Estoque Crítico: 4 itens abaixo do mínimo</span>
                <Link to="/estoque" className="text-[10px] font-black uppercase bg-black text-white px-2 py-1 rounded">Resolver</Link>
              </li>
              <li className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors px-2 rounded -mx-2">
                <span className="text-slate-700 font-bold text-sm">📅 3 Boletos vencendo hoje</span>
                <Link to="/financeiro" className="text-[10px] font-black uppercase bg-black text-white px-2 py-1 rounded">Pagar</Link>
              </li>
              <li className="flex justify-between items-center py-3 last:border-0 hover:bg-slate-50 px-2 rounded -mx-2">
                <span className="text-slate-700 font-bold text-sm">🚚 2 Retornos de Frota pendentes (CRM)</span>
                <Link to="/clientes" className="text-[10px] font-black uppercase bg-black text-white px-2 py-1 rounded">Ligar</Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-slate-200">
          <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
             <CardTitle className="flex items-center gap-2 text-slate-800 uppercase font-black text-sm italic">
              <Wrench className="h-5 w-5 text-yellow-500" /> Top Serviços Realizados
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-2">
              {[
                { label: "Manutenção de Alternador / Motor de Partida", qty: 24 },
                { label: "Revisão Elétrica Preventiva (Frota)", qty: 18 },
                { label: "Instalação de Acessórios / Iluminação", qty: 12 },
              ].map((item, i) => (
                <li key={i} className="flex justify-between items-center p-3 rounded bg-white border border-slate-100 shadow-sm">
                  <span className="text-xs font-bold text-slate-900 uppercase">{i+1}. {item.label}</span>
                  <span className="bg-yellow-400 text-black text-[10px] font-black px-2 py-1 rounded">{item.qty} OS</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
