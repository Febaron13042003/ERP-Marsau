import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMockDB } from '../../contexts/MockDBContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { fmtCurrency } from '../../lib/utils';

const MOCK_XML_ITEMS = [
  { code: 'BOSCH-0001', description: 'Bateria Estacionária 180Ah Bosch', ncm: '8507.10.00', cfop: '1102', unit: 'UN', qty: 5, unitCost: 620, total: 3100, matched: true, matchedCode: 'P001' },
  { code: 'HELLA-R40A', description: 'Relé 24V 40A Hella', ncm: '8536.49.00', cfop: '1102', unit: 'UN', qty: 20, unitCost: 15.5, total: 310, matched: false, matchedCode: '' },
  { code: 'MANN-C30850', description: 'Filtro de Ar Mann C30850', ncm: '8421.39.90', cfop: '1102', unit: 'UN', qty: 10, unitCost: 80, total: 800, matched: true, matchedCode: 'P003' },
];

export function ImportXML() {
  const navigate = useNavigate();
  const { parts, addPart, addStockMovement } = useMockDB();
  const { toast } = useToast();
  const [step, setStep] = useState<'upload' | 'review' | 'done'>('upload');
  const [margin, setMargin] = useState('40');
  const [dragging, setDragging] = useState(false);

  const handleFakeUpload = () => setStep('review');

  const handleConfirm = () => {
    MOCK_XML_ITEMS.forEach(item => {
      const mk = parseFloat(margin) || 40;
      const salePrice = item.unitCost * (1 + mk / 100);
      if (!item.matched) {
        addPart({ internalCode: item.code, reference: item.code, description: item.description, shortDescription: item.description.slice(0, 40), category: 'Importado', brand: '', unit: item.unit, ncm: item.ncm, cfop: item.cfop, origin: '0', cst: '00', costPrice: item.unitCost, averagePrice: item.unitCost, markup: mk, salePrice, qty: item.qty, minQty: 5 });
      } else {
        const p = parts.find(x => x.internalCode === item.matchedCode);
        if (p) {
          addStockMovement({ date: new Date().toLocaleDateString('pt-BR'), type: 'Entrada', partId: p.id, qty: item.qty, balanceAfter: p.qty + item.qty, origin: `NF XML Importada`, userId: 'u1' });
        }
      }
    });
    toast('XML importado com sucesso! Estoque atualizado.', 'success');
    setStep('done');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/estoque')} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="text-2xl font-bold text-slate-900">Entrada por XML de NF-e</h1>
      </div>

      {step === 'upload' && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFakeUpload(); }}
          className={`border-2 border-dashed rounded-2xl p-20 text-center transition-all cursor-pointer ${dragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50'}`}
          onClick={handleFakeUpload}
        >
          <Upload className="h-14 w-14 mx-auto mb-4 text-slate-400" />
          <p className="text-lg font-semibold text-slate-700">Arraste o arquivo XML da NF-e aqui</p>
          <p className="text-sm text-slate-500 mt-1">ou clique para selecionar o arquivo</p>
          <p className="text-xs text-slate-400 mt-4">(clique para simular com dados de demonstração)</p>
        </div>
      )}

      {step === 'review' && (
        <div className="space-y-5">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 flex justify-between items-center">
            <span>📋 NF-e: <strong>Distribuidora Elétrica Auto — CNPJ 12.345.678/0001-11</strong></span>
            <span>Total: {fmtCurrency(MOCK_XML_ITEMS.reduce((s, i) => s + i.total, 0))}</span>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-700">Margem padrão para toda a nota (%)</label>
            <input type="number" className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm w-24" value={margin} onChange={e => setMargin(e.target.value)} />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>{['Código NF', 'Descrição', 'UN', 'Qtd', 'R$ Unit.', 'R$ Total', 'Status', ''].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_XML_ITEMS.map(item => (
                  <tr key={item.code} className={item.matched ? '' : 'bg-red-50/50'}>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{item.code}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{item.description}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{item.unit}</td>
                    <td className="px-4 py-3 text-sm font-bold text-center">{item.qty}</td>
                    <td className="px-4 py-3 text-sm text-right">{fmtCurrency(item.unitCost)}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-right">{fmtCurrency(item.total)}</td>
                    <td className="px-4 py-3">
                      {item.matched
                        ? <span className="flex items-center gap-1 text-xs text-emerald-700"><CheckCircle className="h-3.5 w-3.5" />Vinculado ({item.matchedCode})</span>
                        : <span className="flex items-center gap-1 text-xs text-red-600"><AlertCircle className="h-3.5 w-3.5" />Novo item</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      {!item.matched && <span className="text-xs text-blue-600 underline cursor-pointer">Cadastrar</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setStep('upload')}>Voltar</Button>
            <Button onClick={handleConfirm} className="bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle className="h-4 w-4 mr-2" />Confirmar Entrada ({MOCK_XML_ITEMS.length} itens)
            </Button>
          </div>
        </div>
      )}

      {step === 'done' && (
        <div className="text-center py-24">
          <CheckCircle className="h-20 w-20 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900">XML importado com sucesso!</h2>
          <p className="text-slate-500 mt-2">O estoque foi atualizado e os itens novos foram cadastrados.</p>
          <Button onClick={() => navigate('/estoque')} className="mt-8">Ver Estoque</Button>
        </div>
      )}
    </div>
  );
}
