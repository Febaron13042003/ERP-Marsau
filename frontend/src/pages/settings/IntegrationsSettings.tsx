import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function IntegrationsSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>Focus NF-e (Emissão Fiscal)</CardTitle>
            <p className="text-sm text-slate-500 mt-1">Integração para emissão automática de NF-e e NFS-e</p>
          </div>
          <Badge variant="warning">Pendente</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input label="Token de API (Produção)" type="password" placeholder="Cole aqui seu token Focus NF-e" />
          <div className="flex items-center gap-4">
            <Input label="Código IBGE Município" className="w-1/2" />
            <Input label="Série Padrão NF-e" className="w-1/2" />
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="secondary" size="sm">Testar Conexão</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>Sicoob Open Finance / Boletos</CardTitle>
            <p className="text-sm text-slate-500 mt-1">Sincronização bancária para conciliação automática</p>
          </div>
          <Badge variant="default">Não Configurado</Badge>
        </CardHeader>
        <CardContent className="space-y-4 shadow-inner bg-slate-50/50 p-6 rounded-md border border-slate-100 mx-6 mb-6">
           <p className="text-sm text-slate-600 text-center">Entre em contato com o suporte Sicoob para gerar as chaves de API.</p>
           <div className="flex justify-center pt-2">
             <Button variant="outline" size="sm">Configurar Sicoob</Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
