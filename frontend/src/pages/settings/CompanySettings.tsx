import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function CompanySettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dados da Oficina</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Razão Social" placeholder="Marsau Auto Elétrica Ltda" />
            <Input label="Nome Fantasia" placeholder="Marsau" />
            <Input label="CNPJ" placeholder="00.000.000/0001-00" />
            <Input label="Inscrição Estadual" placeholder="Opcional" />
          </div>
          
          <div className="pt-2">
            <h4 className="text-sm font-medium text-slate-900 pb-3 border-b border-slate-100 mb-4">Endereço</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input label="CEP" />
              <div className="md:col-span-2">
                <Input label="Logradouro" />
              </div>
              <Input label="Número" />
              <Input label="Bairro" />
              <Input label="Cidade" />
            </div>
          </div>

          <div className="pt-2">
            <h4 className="text-sm font-medium text-slate-900 pb-3 border-b border-slate-100 mb-4">Contato</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Telefone Principal" />
              <Input label="E-mail de Contato" type="email" />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button>Salvar Alterações</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
