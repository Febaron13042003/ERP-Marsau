import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { SettingsLayout } from './pages/settings/SettingsLayout';
import { ClientesList } from './pages/clientes/ClientesList';
import { ClienteForm } from './pages/clientes/ClienteForm';
import { EstoqueList } from './pages/estoque/EstoqueList';
import { ProdutoForm } from './pages/estoque/ProdutoForm';
import { ImportXML } from './pages/estoque/ImportXML';
import { Inventario } from './pages/estoque/Inventario';
import { OSList } from './pages/operacional/OSList';
import { OSForm } from './pages/operacional/OSForm';
import { FinanceiroLayout } from './pages/financeiro/FinanceiroLayout';
import { FiscalList } from './pages/fiscal/FiscalList';
import { RHLayout } from './pages/rh/RHLayout';
import { Home } from './pages/dashboard/Home';
import { Relatorios } from './pages/relatorios/Relatorios';
import { MockDBProvider } from './contexts/MockDBContext';
import { ToastProvider } from './components/ui/Toast';

function App() {
  return (
    <MockDBProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/clientes" element={<ClientesList />} />
              <Route path="/clientes/novo" element={<ClienteForm />} />
              <Route path="/clientes/:id" element={<ClienteForm />} />
              <Route path="/operacional" element={<OSList />} />
              <Route path="/operacional/nova" element={<OSForm />} />
              <Route path="/operacional/:id" element={<OSForm />} />
              <Route path="/estoque" element={<EstoqueList />} />
              <Route path="/estoque/novo" element={<ProdutoForm />} />
              <Route path="/estoque/xml" element={<ImportXML />} />
              <Route path="/estoque/inventario" element={<Inventario />} />
              <Route path="/estoque/:id" element={<ProdutoForm />} />
              <Route path="/financeiro/*" element={<FinanceiroLayout />} />
              <Route path="/fiscal" element={<FiscalList />} />
              <Route path="/rh/*" element={<RHLayout />} />
              <Route path="/relatorios/*" element={<Relatorios />} />
              <Route path="/configuracoes/*" element={<SettingsLayout />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </MockDBProvider>
  );
}

export default App;
