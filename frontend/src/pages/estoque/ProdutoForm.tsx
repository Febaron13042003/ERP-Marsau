import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMockDB } from '../../contexts/MockDBContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { ArrowLeft } from 'lucide-react';

export function ProdutoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { parts, addPart, updatePart } = useMockDB();
  const { toast } = useToast();
  const existing = parts.find(p => p.id === id);

  const [code, setCode] = useState(existing?.internalCode ?? '');
  const [reference, setReference] = useState(existing?.reference ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [shortDesc, setShortDesc] = useState(existing?.shortDescription ?? '');
  const [category, setCategory] = useState(existing?.category ?? '');
  const [brand, setBrand] = useState(existing?.brand ?? '');
  const [unit, setUnit] = useState(existing?.unit ?? 'UN');
  const [ncm, setNcm] = useState(existing?.ncm ?? '');
  const [cfop, setCfop] = useState(existing?.cfop ?? '5102');
  const [costPrice, setCostPrice] = useState(String(existing?.costPrice ?? ''));
  const [markup, setMarkup] = useState(String(existing?.markup ?? '40'));
  const [salePrice, setSalePrice] = useState(String(existing?.salePrice ?? ''));
  const [qty, setQty] = useState(String(existing?.qty ?? '0'));
  const [minQty, setMinQty] = useState(String(existing?.minQty ?? '5'));
  const [location, setLocation] = useState(existing?.location ?? '');

  const calcSalePrice = () => {
    const cost = parseFloat(costPrice) || 0;
    const mk = parseFloat(markup) || 0;
    setSalePrice((cost * (1 + mk / 100)).toFixed(2));
  };

  const handleSave = () => {
    if (!description) { toast('Descrição é obrigatória.', 'error'); return; }
    const payload = {
      internalCode: code, reference, description, shortDescription: shortDesc || description,
      category, brand, unit, ncm, cfop, origin: '0', cst: '00',
      costPrice: parseFloat(costPrice) || 0, averagePrice: parseFloat(costPrice) || 0,
      markup: parseFloat(markup) || 0, salePrice: parseFloat(salePrice) || 0,
      qty: parseInt(qty) || 0, minQty: parseInt(minQty) || 0, location,
    };
    if (existing) { updatePart(existing.id, payload); toast('Peça atualizada!', 'success'); }
    else { addPart(payload); toast('Peça cadastrada!', 'success'); }
    navigate('/estoque');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/estoque')} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="text-2xl font-bold text-slate-900">{existing ? 'Editar Peça' : 'Nova Peça'}</h1>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Identificação</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Input label="Código Interno" value={code} onChange={e => setCode(e.target.value)} />
            <Input label="Referência Fabricante" value={reference} onChange={e => setReference(e.target.value)} />
            <Input label="Unidade" value={unit} onChange={e => setUnit(e.target.value)} />
            <Input label="Descrição Completa *" value={description} onChange={e => setDescription(e.target.value)} className="col-span-2 md:col-span-3" />
            <Input label="Descrição Resumida" value={shortDesc} onChange={e => setShortDesc(e.target.value)} className="col-span-2" />
            <Input label="Categoria" value={category} onChange={e => setCategory(e.target.value)} />
            <Input label="Marca" value={brand} onChange={e => setBrand(e.target.value)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Dados Fiscais</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Input label="NCM" value={ncm} onChange={e => setNcm(e.target.value)} placeholder="0000.00.00" />
            <Input label="CFOP" value={cfop} onChange={e => setCfop(e.target.value)} placeholder="5102" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Preços e Estoque</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Input label="Preço de Custo (R$)" type="number" value={costPrice} onChange={e => setCostPrice(e.target.value)} onBlur={calcSalePrice} />
            <Input label="Markup (%)" type="number" value={markup} onChange={e => setMarkup(e.target.value)} onBlur={calcSalePrice} />
            <Input label="Preço de Venda (R$)" type="number" value={salePrice} onChange={e => setSalePrice(e.target.value)} />
            <Input label="Quantidade Atual" type="number" value={qty} onChange={e => setQty(e.target.value)} />
            <Input label="Estoque Mínimo" type="number" value={minQty} onChange={e => setMinQty(e.target.value)} />
            <Input label="Localização Física" value={location} onChange={e => setLocation(e.target.value)} placeholder="A-01, B-02..." />
          </CardContent>
        </Card>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => navigate('/estoque')}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar Peça</Button>
        </div>
      </div>
    </div>
  );
}
