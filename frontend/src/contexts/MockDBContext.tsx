import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type Truck = {
  id: string; plate: string; model: string; brand: string; year: string;
  chassis: string; km: number; fleetNumber?: string; notes?: string;
  kmInterval?: number; dayInterval?: number; photos?: string[];
};

export type Driver = { id: string; name: string; cpf: string; cnh: string; phone: string; notes?: string; };

export type Cliente = {
  id: string; type: 'PF' | 'PJ';
  name: string; document: string; phone: string; whatsapp?: string; email?: string;
  cep?: string; street?: string; number?: string; complement?: string;
  neighborhood?: string; city?: string; state?: string;
  rg?: string; birthDate?: string;
  companyName?: string; ie?: string; tradeName?: string;
  creditLimit?: number; paymentCondition?: string;
  notes?: string; status: 'Ativo' | 'Inativo';
  trucks: Truck[]; drivers: Driver[];
};

export type Mechanic = { id: string; name: string; specialty: string; hourlyRate: number; active: boolean; };

export type Service = { id: string; name: string; description: string; price: number; category: string; };

export type Part = {
  id: string; internalCode: string; reference: string; barcode?: string;
  description: string; shortDescription: string; category: string; brand: string; unit: string;
  ncm?: string; cest?: string; cfop?: string; origin?: string; cst?: string;
  costPrice: number; averagePrice: number; markup: number; salePrice: number;
  qty: number; minQty: number; location?: string; supplierId?: string;
};

export type Kit = {
  id: string; name: string; description: string; price: number;
  items: { partId: string; qty: number }[];
};

export type StockMovement = {
  id: string; date: string; type: 'Entrada' | 'Saída' | 'Correção' | 'Inventário';
  partId: string; qty: number; balanceAfter: number;
  origin: string; userId: string;
};

export type LaborEntry = {
  id: string; mechanicId: string; mechanicName: string;
  hourlyRate: number; totalMinutes: number; totalValue: number;
  timerState: 'idle' | 'running' | 'paused' | 'finished';
  startedAt?: string; pausedAt?: string;
};

export type OSPart = { id: string; partId: string; code: string; description: string; qty: number; unitPrice: number; isKit?: boolean; kitId?: string; };
export type OSService = { id: string; serviceId: string; name: string; description: string; price: number; };

export type OS = {
  id: string; number: string; date: string; openedAt: string;
  clientId: string; clientName: string; truckId: string; plate: string;
  km: number; mechanicId: string; mechanicName: string;
  status: 'Aberta' | 'Em execução' | 'Concluída';
  notes?: string; orderNumber?: string;
  labor: LaborEntry[]; services: OSService[]; parts: OSPart[];
  photos: string[];
  subtotalLabor: number; subtotalServices: number; subtotalParts: number; total: number;
  paymentMethods: string[];
  closedAt?: string; invoiceIds?: string[];
};

export type AccountReceivable = {
  id: string; osId?: string; osNumber?: string;
  clientId: string; clientName: string; plate?: string;
  description: string; planId: string; planName: string;
  accrualDate: string; dueDate: string;
  value: number; paidValue?: number;
  paymentMethod?: string; bankAccount?: string;
  status: 'Aberto' | 'Recebido' | 'Vencido' | 'Parcial';
  receivedAt?: string; notes?: string;
  parentId?: string;
};

export type AccountPayable = {
  id: string; invoiceId?: string; invoiceKey?: string;
  supplierId?: string; supplierName: string;
  description: string; planId: string; planName: string;
  accrualDate: string; dueDate: string;
  value: number; paidValue?: number;
  paymentMethod?: string;
  status: 'Aberto' | 'Pago' | 'Vencido' | 'Parcial';
  paidAt?: string; notes?: string; attachmentUrl?: string;
  recurring?: 'weekly' | 'monthly' | 'yearly'; recurrences?: number;
};

export type AccountPlan = {
  id: string; code: string; name: string; type: 'Receita' | 'Despesa';
  parentId?: string; level: number;
};

export type Supplier = {
  id: string; name: string; cnpj?: string; phone?: string; email?: string;
  city?: string; state?: string; notes?: string;
};

export type Invoice = {
  id: string; osId: string; osNumber: string;
  type: 'NF-e' | 'NFS-e'; number: string; series?: string;
  clientId: string; clientName: string; plate: string;
  issueDate: string; value: number;
  status: 'Autorizada' | 'Cancelada' | 'Denegada' | 'Pendente';
  key?: string; xmlUrl?: string; pdfUrl?: string;
};

export type Employee = {
  id: string; name: string; cpf: string; rg?: string; birthDate?: string;
  phone: string; email?: string; address?: string;
  role: string; department: string; admissionDate: string;
  contractType: 'CLT' | 'PJ' | 'Autônomo';
  baseSalary: number; bankAccount?: string;
  dependents?: number; vt?: number; vr?: number;
  userId?: string; active: boolean;
};

export type TimeEntry = {
  id: string; employeeId: string; date: string;
  entryTime: string; exitTime?: string; lunchTime?: string;
  totalHours?: number; overtime?: number; absent?: boolean;
};

export type Vacation = {
  id: string; employeeId: string; startDate: string; endDate: string; days: number; notes?: string;
};

export type AppUser = {
  id: string; name: string; email: string; role: 'Administrador' | 'Operacional' | 'Almoxarifado' | 'Financeiro' | 'Sócio' | 'Auditoria';
  employeeId?: string; photoUrl?: string; active: boolean; createdAt: string;
};

export type AuditLog = {
  id: string; userId: string; userName: string; action: string;
  module: string; recordId: string; recordLabel: string;
  before?: string; after?: string; ip: string; createdAt: string;
};

export type Boleto = {
  id: string; osId: string; osNumber: string; arId?: string;
  clientId: string; clientName: string; invoiceId?: string;
  dueDate: string; value: number;
  status: 'Aberto' | 'Pago' | 'Vencido';
  barcode?: string; issuedAt: string;
};

// ─────────────────────────────────────────────
// CONTEXT TYPE
// ─────────────────────────────────────────────
type MockDBState = {
  clientes: Cliente[];
  mechanics: Mechanic[];
  services: Service[];
  parts: Part[];
  kits: Kit[];
  stockMovements: StockMovement[];
  os: OS[];
  accountsReceivable: AccountReceivable[];
  accountsPayable: AccountPayable[];
  accountPlans: AccountPlan[];
  suppliers: Supplier[];
  invoices: Invoice[];
  employees: Employee[];
  timeEntries: TimeEntry[];
  vacations: Vacation[];
  users: AppUser[];
  auditLogs: AuditLog[];
  boletos: Boleto[];

  // Mutations
  addCliente: (c: Omit<Cliente, 'id'>) => Cliente;
  updateCliente: (id: string, c: Partial<Cliente>) => void;
  addTruckToCliente: (clientId: string, t: Omit<Truck, 'id'>) => void;
  addOS: (o: Omit<OS, 'id'>) => OS;
  updateOS: (id: string, o: Partial<OS>) => void;
  closeOS: (id: string, paymentMethods: string[], emitNFe: boolean, emitNFSe: boolean) => void;
  addPart: (p: Omit<Part, 'id'>) => Part;
  updatePart: (id: string, p: Partial<Part>) => void;
  addStockMovement: (m: Omit<StockMovement, 'id'>) => void;
  addAccountReceivable: (a: Omit<AccountReceivable, 'id'>) => void;
  updateAccountReceivable: (id: string, a: Partial<AccountReceivable>) => void;
  addAccountPayable: (a: Omit<AccountPayable, 'id'>) => void;
  updateAccountPayable: (id: string, a: Partial<AccountPayable>) => void;
  addInvoice: (inv: Omit<Invoice, 'id'>) => void;
  addEmployee: (e: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, e: Partial<Employee>) => void;
  addTimeEntry: (t: Omit<TimeEntry, 'id'>) => void;
  addUser: (u: Omit<AppUser, 'id' | 'createdAt'>) => void;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'createdAt'>) => void;
  addSupplier: (s: Omit<Supplier, 'id'>) => Supplier;
  addKit: (k: Omit<Kit, 'id'>) => void;
  addBoleto: (b: Omit<Boleto, 'id'>) => void;
  updateBoleto: (id: string, b: Partial<Boleto>) => void;
};

// ─────────────────────────────────────────────
// SEED DATA
// ─────────────────────────────────────────────

const seedMechanics: Mechanic[] = [
  { id: 'm1', name: 'João Carlos', specialty: 'Eletricista Sênior', hourlyRate: 120, active: true },
  { id: 'm2', name: 'Carlos Eduardo', specialty: 'Injeção Eletrônica', hourlyRate: 100, active: true },
  { id: 'm3', name: 'Marcos Vinícius', specialty: 'Eletricista Geral', hourlyRate: 90, active: true },
];

const seedServices: Service[] = [
  { id: 'sv1', name: 'Diagnóstico Eletrônico', description: 'Scanner completo do veículo', price: 250, category: 'Diagnóstico' },
  { id: 'sv2', name: 'Revisão Preventiva', description: 'Revisão completa 60.000 km', price: 800, category: 'Revisão' },
  { id: 'sv3', name: 'Reparo Alternador', description: 'Desmontagem, análise e reparo do alternador', price: 650, category: 'Elétrica' },
  { id: 'sv4', name: 'Reparo Motor de Partida', description: 'Revisão e reparo do motor de partida', price: 450, category: 'Elétrica' },
  { id: 'sv5', name: 'Troca de Bateria', description: 'Fornecimento e instalação', price: 180, category: 'Bateria' },
];

const seedParts: Part[] = [
  { id: 'p1', internalCode: 'P001', reference: 'BOSCH-0001', description: 'Bateria 180Ah Bosch', shortDescription: 'Bateria 180Ah', category: 'Bateria', brand: 'Bosch', unit: 'UN', ncm: '8507.10.00', cfop: '5102', origin: '0', cst: '00', costPrice: 650, averagePrice: 662, markup: 30, salePrice: 860, qty: 8, minQty: 3, location: 'A-01', supplierId: 'sup1' },
  { id: 'p2', internalCode: 'P002', reference: 'DELPHI-ALT-01', description: 'Alternador 24V 100A Delphi', shortDescription: 'Alternador 24V', category: 'Alternador', brand: 'Delphi', unit: 'UN', ncm: '8511.50.00', cfop: '5102', origin: '0', cst: '00', costPrice: 890, averagePrice: 905, markup: 35, salePrice: 1220, qty: 4, minQty: 2, location: 'B-02', supplierId: 'sup2' },
  { id: 'p3', internalCode: 'P003', reference: 'FILTRO-AR-001', description: 'Filtro de Ar Mann C30850', shortDescription: 'Filtro de Ar Mann', category: 'Filtros', brand: 'Mann', unit: 'UN', ncm: '8421.39.90', cfop: '5102', origin: '0', cst: '00', costPrice: 85, averagePrice: 87, markup: 40, salePrice: 122, qty: 15, minQty: 5, location: 'C-01' },
  { id: 'p4', internalCode: 'P004', reference: 'FILTRO-COMB', description: 'Filtro de Combustível WK9050', shortDescription: 'Filtro Combustível', category: 'Filtros', brand: 'Mann', unit: 'UN', ncm: '8421.23.00', cfop: '5102', origin: '0', cst: '00', costPrice: 45, averagePrice: 46, markup: 45, salePrice: 67, qty: 22, minQty: 8, location: 'C-02' },
  { id: 'p5', internalCode: 'P005', reference: 'RELAY-24V', description: 'Relé 24V 40A Universal', shortDescription: 'Relé 24V 40A', category: 'Elétrico', brand: 'Hella', unit: 'UN', ncm: '8536.49.00', cfop: '5102', origin: '0', cst: '00', costPrice: 18, averagePrice: 18.5, markup: 55, salePrice: 29, qty: 2, minQty: 10, location: 'D-01' },
  { id: 'p6', internalCode: 'P006', reference: 'CABO-POT-6MM', description: 'Cabo de Potência 6mm (metro)', shortDescription: 'Cabo 6mm', category: 'Cabos', brand: 'Procable', unit: 'MT', ncm: '8544.49.00', cfop: '5102', origin: '0', cst: '00', costPrice: 8.5, averagePrice: 8.7, markup: 50, salePrice: 13, qty: 120, minQty: 20, location: 'E-01' },
  { id: 'p7', internalCode: 'P007', reference: 'FUSIVEL-30A', description: 'Fusível Lâmina 30A (PCT 10un)', shortDescription: 'Fusível 30A PCT', category: 'Elétrico', brand: 'Hella', unit: 'PCT', ncm: '8536.10.00', cfop: '5102', origin: '0', cst: '00', costPrice: 12, averagePrice: 12, markup: 50, salePrice: 18, qty: 30, minQty: 5, location: 'D-02' },
];

const seedSuppliers: Supplier[] = [
  { id: 'sup1', name: 'Distribuidora Elétrica Auto Ltda', cnpj: '12.345.678/0001-11', phone: '(44) 3333-1111', email: 'compras@distrib.com.br', city: 'Maringá', state: 'PR' },
  { id: 'sup2', name: 'Auto Peças Delphi SP', cnpj: '98.765.432/0001-22', phone: '(11) 4444-2222', email: 'vendas@autodelphi.com.br', city: 'São Paulo', state: 'SP' },
];

const seedClientes: Cliente[] = [
  {
    id: 'c1', type: 'PJ', name: 'Transportadora Rápida ABC Ltda', companyName: 'Transportadora Rápida ABC Ltda',
    tradeName: 'Transp. ABC', document: '12.345.678/0001-90', ie: '123.456.789.012',
    phone: '(44) 3322-1100', whatsapp: '44991112233', email: 'frota@transportabc.com.br',
    cep: '87013-000', street: 'Av. Mandacaru', number: '800', city: 'Maringá', state: 'PR',
    creditLimit: 20000, paymentCondition: '30 dias', status: 'Ativo', notes: 'Cliente VIP - frota prioritária',
    trucks: [
      { id: 't1', plate: 'BRA-2E19', model: 'FH 540', brand: 'Volvo', year: '2022', chassis: '9BWDZZ7X2NB123456', km: 185420, fleetNumber: 'F-001', kmInterval: 30000, dayInterval: 90 },
      { id: 't2', plate: 'ABC-4D21', model: 'Axor 2544', brand: 'Mercedes-Benz', year: '2020', chassis: '9BM9580051B654321', km: 320100, fleetNumber: 'F-002', kmInterval: 20000 },
    ],
    drivers: [{ id: 'd1', name: 'Paulo Rogério', cpf: '111.222.333-44', cnh: '12345678900', phone: '44991234567' }]
  },
  {
    id: 'c2', type: 'PJ', name: 'Logística Sigma S.A.', companyName: 'Logística Sigma S.A.',
    tradeName: 'Sigma Log', document: '98.765.432/0001-11',
    phone: '(44) 3311-4422', whatsapp: '44998877665', email: 'manutencao@logisticasigma.com.br',
    city: 'Sarandi', state: 'PR', creditLimit: 15000, status: 'Ativo',
    trucks: [
      { id: 't3', plate: 'XYZ-9I00', model: 'R 450', brand: 'Scania', year: '2019', chassis: 'XLB4X20009E098765', km: 467300, fleetNumber: 'S-003', kmInterval: 25000, dayInterval: 60 },
    ],
    drivers: []
  },
  {
    id: 'c3', type: 'PF', name: 'José Aparecido Martins', document: '321.654.987-00',
    phone: '(44) 99555-3344', email: 'joseaparecido@gmail.com',
    city: 'Paiçandu', state: 'PR', status: 'Ativo', creditLimit: 5000,
    trucks: [
      { id: 't4', plate: 'QRS-7H12', model: 'Constellation 24-280', brand: 'Volkswagen', year: '2018', chassis: '9BWFB62WXJ8000001', km: 289000, kmInterval: 30000 },
    ],
    drivers: []
  },
  {
    id: 'c4', type: 'PJ', name: 'Frigo Norte Transportes Ltda', companyName: 'Frigo Norte Transportes Ltda',
    document: '45.678.901/0001-33', phone: '(44) 3255-9988',
    city: 'Maringá', state: 'PR', status: 'Ativo', creditLimit: 30000,
    trucks: [
      { id: 't5', plate: 'MNO-3K55', model: 'TGX 28.400', brand: 'MAN', year: '2021', chassis: 'WM82540034LX12345', km: 124000, fleetNumber: 'FN-010' },
    ],
    drivers: []
  },
];

const seedOS: OS[] = [
  {
    id: 'os1', number: '1001', date: '17/03/2026', openedAt: '2026-03-17T08:30:00',
    clientId: 'c1', clientName: 'Transportadora Rápida ABC Ltda', truckId: 't1', plate: 'BRA-2E19',
    km: 185420, mechanicId: 'm1', mechanicName: 'João Carlos', status: 'Concluída', notes: 'Revisão preventiva e troca de bateria',
    labor: [{ id: 'l1', mechanicId: 'm1', mechanicName: 'João Carlos', hourlyRate: 120, totalMinutes: 180, totalValue: 360, timerState: 'finished' }],
    services: [{ id: 'sv-os1', serviceId: 'sv2', name: 'Revisão Preventiva', description: 'Revisão 60.000 km', price: 800 }],
    parts: [{ id: 'pp1', partId: 'p1', code: 'P001', description: 'Bateria 180Ah Bosch', qty: 1, unitPrice: 860 }],
    photos: [], subtotalLabor: 360, subtotalServices: 800, subtotalParts: 860, total: 2020,
    paymentMethods: ['Boleto'], closedAt: '2026-03-17T14:00:00', invoiceIds: ['inv1', 'inv2']
  },
  {
    id: 'os2', number: '1002', date: '18/03/2026', openedAt: '2026-03-18T09:00:00',
    clientId: 'c2', clientName: 'Logística Sigma S.A.', truckId: 't3', plate: 'XYZ-9I00',
    km: 467300, mechanicId: 'm2', mechanicName: 'Carlos Eduardo', status: 'Em execução',
    labor: [{ id: 'l2', mechanicId: 'm2', mechanicName: 'Carlos Eduardo', hourlyRate: 100, totalMinutes: 90, totalValue: 150, timerState: 'running', startedAt: new Date().toISOString() }],
    services: [{ id: 'sv-os2', serviceId: 'sv1', name: 'Diagnóstico Eletrônico', description: 'Scanner completo', price: 250 }],
    parts: [{ id: 'pp2', partId: 'p2', code: 'P002', description: 'Alternador 24V 100A Delphi', qty: 1, unitPrice: 1220 }],
    photos: [], subtotalLabor: 150, subtotalServices: 250, subtotalParts: 1220, total: 1620,
    paymentMethods: []
  },
  {
    id: 'os3', number: '1003', date: '19/03/2026', openedAt: '2026-03-19T10:15:00',
    clientId: 'c3', clientName: 'José Aparecido Martins', truckId: 't4', plate: 'QRS-7H12',
    km: 289000, mechanicId: 'm3', mechanicName: 'Marcos Vinícius', status: 'Aberta',
    labor: [], services: [], parts: [], photos: [],
    subtotalLabor: 0, subtotalServices: 0, subtotalParts: 0, total: 0, paymentMethods: []
  },
  {
    id: 'os4', number: '1000', date: '10/03/2026', openedAt: '2026-03-10T08:00:00',
    clientId: 'c4', clientName: 'Frigo Norte Transportes Ltda', truckId: 't5', plate: 'MNO-3K55',
    km: 124000, mechanicId: 'm1', mechanicName: 'João Carlos', status: 'Concluída',
    labor: [{ id: 'l3', mechanicId: 'm1', mechanicName: 'João Carlos', hourlyRate: 120, totalMinutes: 240, totalValue: 480, timerState: 'finished' }],
    services: [{ id: 'sv-os4', serviceId: 'sv3', name: 'Reparo Alternador', description: 'Desmontagem e reparo', price: 650 }],
    parts: [{ id: 'pp3', partId: 'p3', code: 'P003', description: 'Filtro de Ar Mann C30850', qty: 2, unitPrice: 122 }],
    photos: [], subtotalLabor: 480, subtotalServices: 650, subtotalParts: 244, total: 1374,
    paymentMethods: ['PIX'], closedAt: '2026-03-10T15:30:00'
  },
];

const seedAccountPlans: AccountPlan[] = [
  { id: 'ap1', code: '1', name: 'RECEITAS', type: 'Receita', level: 1 },
  { id: 'ap2', code: '1.1', name: 'Receita de Serviços', type: 'Receita', parentId: 'ap1', level: 2 },
  { id: 'ap3', code: '1.1.1', name: 'Mão de Obra', type: 'Receita', parentId: 'ap2', level: 3 },
  { id: 'ap4', code: '1.1.2', name: 'Serviços Avulsos', type: 'Receita', parentId: 'ap2', level: 3 },
  { id: 'ap5', code: '1.2', name: 'Receita de Peças', type: 'Receita', parentId: 'ap1', level: 2 },
  { id: 'ap6', code: '1.2.1', name: 'Venda de Peças', type: 'Receita', parentId: 'ap5', level: 3 },
  { id: 'ap7', code: '1.2.2', name: 'Venda de Kits', type: 'Receita', parentId: 'ap5', level: 3 },
  { id: 'ap8', code: '1.3', name: 'Outras Receitas', type: 'Receita', parentId: 'ap1', level: 2 },
  { id: 'ap9', code: '2', name: 'DESPESAS', type: 'Despesa', level: 1 },
  { id: 'ap10', code: '2.1', name: 'Custos Operacionais', type: 'Despesa', parentId: 'ap9', level: 2 },
  { id: 'ap11', code: '2.1.1', name: 'Compra de Peças', type: 'Despesa', parentId: 'ap10', level: 3 },
  { id: 'ap12', code: '2.1.2', name: 'Ferramentas e Equipamentos', type: 'Despesa', parentId: 'ap10', level: 3 },
  { id: 'ap13', code: '2.2', name: 'Despesas de Pessoal', type: 'Despesa', parentId: 'ap9', level: 2 },
  { id: 'ap14', code: '2.2.1', name: 'Salários', type: 'Despesa', parentId: 'ap13', level: 3 },
  { id: 'ap15', code: '2.2.2', name: 'Encargos Sociais', type: 'Despesa', parentId: 'ap13', level: 3 },
  { id: 'ap16', code: '2.3', name: 'Despesas Administrativas', type: 'Despesa', parentId: 'ap9', level: 2 },
  { id: 'ap17', code: '2.3.1', name: 'Aluguel', type: 'Despesa', parentId: 'ap16', level: 3 },
  { id: 'ap18', code: '2.3.2', name: 'Energia Elétrica', type: 'Despesa', parentId: 'ap16', level: 3 },
  { id: 'ap19', code: '2.3.3', name: 'Internet e Telefone', type: 'Despesa', parentId: 'ap16', level: 3 },
  { id: 'ap20', code: '2.4', name: 'Impostos e Taxas', type: 'Despesa', parentId: 'ap9', level: 2 },
];

const seedAR: AccountReceivable[] = [
  { id: 'ar1', osId: 'os1', osNumber: '1001', clientId: 'c1', clientName: 'Transportadora Rápida ABC Ltda', plate: 'BRA-2E19', description: 'OS #1001 - Revisão + Bateria', planId: 'ap6', planName: 'Venda de Peças/Serviços', accrualDate: '17/03/2026', dueDate: '17/04/2026', value: 2020, status: 'Aberto', paymentMethod: 'Boleto' },
  { id: 'ar2', osId: 'os4', osNumber: '1000', clientId: 'c4', clientName: 'Frigo Norte Transportes Ltda', plate: 'MNO-3K55', description: 'OS #1000 - Alternador + Filtro', planId: 'ap3', planName: 'Mão de Obra', accrualDate: '10/03/2026', dueDate: '10/03/2026', value: 1374, status: 'Recebido', paymentMethod: 'PIX', paidValue: 1374, receivedAt: '10/03/2026' },
  { id: 'ar3', osId: 'os2', osNumber: '1002', clientId: 'c2', clientName: 'Logística Sigma S.A.', plate: 'XYZ-9I00', description: 'OS #1002 - Diagnóstico + Alternador (Pendente)', planId: 'ap3', planName: 'Mão de Obra', accrualDate: '18/03/2026', dueDate: '18/04/2026', value: 1620, status: 'Aberto', paymentMethod: 'A prazo' },
];

const seedAP: AccountPayable[] = [
  { id: 'cp1', supplierId: 'sup1', supplierName: 'Distribuidora Elétrica Auto', description: 'NF 4521 - Lote de Baterias', planId: 'ap11', planName: 'Compra de Peças', accrualDate: '01/03/2026', dueDate: '31/03/2026', value: 4200, status: 'Vencido', paymentMethod: 'Boleto' },
  { id: 'cp2', supplierId: 'sup2', supplierName: 'Auto Peças Delphi SP', description: 'NF 8877 - Alternadores e Filtros', planId: 'ap11', planName: 'Compra de Peças', accrualDate: '15/03/2026', dueDate: '15/04/2026', value: 6800, status: 'Aberto', paymentMethod: 'Boleto' },
  { id: 'cp3', supplierName: 'Imóvel Aluguel Av. Colombo', description: 'Aluguel Março 2026', planId: 'ap17', planName: 'Aluguel', accrualDate: '01/03/2026', dueDate: '05/03/2026', value: 3500, status: 'Pago', paymentMethod: 'PIX', paidAt: '05/03/2026', paidValue: 3500 },
  { id: 'cp4', supplierName: 'Copel Energia', description: 'Energia Elétrica Março', planId: 'ap18', planName: 'Energia Elétrica', accrualDate: '01/03/2026', dueDate: '20/03/2026', value: 780, status: 'Aberto', paymentMethod: 'Débito automático' },
];

const seedInvoices: Invoice[] = [
  { id: 'inv1', osId: 'os1', osNumber: '1001', type: 'NF-e', number: '000342', series: '1', clientId: 'c1', clientName: 'Transportadora Rápida ABC Ltda', plate: 'BRA-2E19', issueDate: '17/03/2026', value: 860, status: 'Autorizada', key: '43260312345678000190550010000003421000034219' },
  { id: 'inv2', osId: 'os1', osNumber: '1001', type: 'NFS-e', number: '000215', clientId: 'c1', clientName: 'Transportadora Rápida ABC Ltda', plate: 'BRA-2E19', issueDate: '17/03/2026', value: 1160, status: 'Autorizada' },
];

const seedEmployees: Employee[] = [
  { id: 'emp1', name: 'João Carlos Ferreira', cpf: '111.222.333-00', rg: '7.777.777-0', birthDate: '1985-04-15', phone: '44991234001', email: 'joaocarlos@marsau.com.br', role: 'Eletricista Sênior', department: 'Mecânica', admissionDate: '2018-03-01', contractType: 'CLT', baseSalary: 4800, dependents: 2, vt: 200, vr: 350, userId: 'u2', active: true },
  { id: 'emp2', name: 'Carlos Eduardo Lima', cpf: '444.555.666-00', phone: '44991234002', role: 'Técnico em Injeção', department: 'Mecânica', admissionDate: '2020-06-15', contractType: 'CLT', baseSalary: 4200, dependents: 1, vt: 200, vr: 350, active: true },
  { id: 'emp3', name: 'Ana Paula Souza', cpf: '777.888.999-00', phone: '44991234003', email: 'anapula@marsau.com.br', role: 'Recepcionista', department: 'Administrativo', admissionDate: '2021-01-10', contractType: 'CLT', baseSalary: 2500, dependents: 0, vt: 150, vr: 350, userId: 'u3', active: true },
];

const seedUsers: AppUser[] = [
  { id: 'u1', name: 'Administrador Marsau', email: 'admin@marsau.com.br', role: 'Administrador', active: true, createdAt: '2026-01-01' },
  { id: 'u2', name: 'João Carlos', email: 'joaocarlos@marsau.com.br', role: 'Operacional', employeeId: 'emp1', active: true, createdAt: '2026-01-01' },
  { id: 'u3', name: 'Ana Paula', email: 'anapula@marsau.com.br', role: 'Operacional', employeeId: 'emp3', active: true, createdAt: '2026-01-01' },
  { id: 'u4', name: 'Financeiro', email: 'financeiro@marsau.com.br', role: 'Financeiro', active: true, createdAt: '2026-01-01' },
];

const seedBoletos: Boleto[] = [
  { id: 'bol1', osId: 'os1', osNumber: '1001', arId: 'ar1', clientId: 'c1', clientName: 'Transportadora Rápida ABC Ltda', invoiceId: 'inv1', dueDate: '17/04/2026', value: 2020, status: 'Aberto', barcode: '75691.12345 67890.123456 78901.234567 8 00000000002020', issuedAt: '17/03/2026' },
];

const seedMovements: StockMovement[] = [
  { id: 'sm1', date: '17/03/2026', type: 'Saída', partId: 'p1', qty: 1, balanceAfter: 8, origin: 'OS #1001 | BRA-2E19 | Transp. ABC', userId: 'u2' },
  { id: 'sm2', date: '10/03/2026', type: 'Saída', partId: 'p3', qty: 2, balanceAfter: 15, origin: 'OS #1000 | MNO-3K55 | Frigo Norte', userId: 'u2' },
  { id: 'sm3', date: '05/03/2026', type: 'Entrada', partId: 'p1', qty: 5, balanceAfter: 9, origin: 'NF 4521 - Distribuidora Elétrica', userId: 'u1' },
];

const idgen = () => Math.random().toString(36).substr(2, 9);

// ─────────────────────────────────────────────
// CONTEXT & PROVIDER
// ─────────────────────────────────────────────

const MockDBContext = createContext<MockDBState | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch { return fallback; }
}

export function MockDBProvider({ children }: { children: ReactNode }) {
  const [clientes, setClientes] = useState<Cliente[]>(() => loadFromStorage('erp_clientes', seedClientes));
  const [mechanics] = useState<Mechanic[]>(seedMechanics);
  const [services] = useState<Service[]>(seedServices);
  const [parts, setParts] = useState<Part[]>(() => loadFromStorage('erp_parts', seedParts));
  const [kits, setKits] = useState<Kit[]>(() => loadFromStorage('erp_kits', []));
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => loadFromStorage('erp_stock_mv', seedMovements));
  const [os, setOs] = useState<OS[]>(() => loadFromStorage('erp_os', seedOS));
  const [accountsReceivable, setAR] = useState<AccountReceivable[]>(() => loadFromStorage('erp_ar', seedAR));
  const [accountsPayable, setAP] = useState<AccountPayable[]>(() => loadFromStorage('erp_ap', seedAP));
  const [accountPlans] = useState<AccountPlan[]>(seedAccountPlans);
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => loadFromStorage('erp_suppliers', seedSuppliers));
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadFromStorage('erp_invoices', seedInvoices));
  const [employees, setEmployees] = useState<Employee[]>(() => loadFromStorage('erp_employees', seedEmployees));
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(() => loadFromStorage('erp_time', []));
  const [vacations, setVacations] = useState<Vacation[]>(() => loadFromStorage('erp_vacations', []));
  const [users, setUsers] = useState<AppUser[]>(() => loadFromStorage('erp_users', seedUsers));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadFromStorage('erp_audit', []));
  const [boletos, setBoletos] = useState<Boleto[]>(() => loadFromStorage('erp_boletos', seedBoletos));

  useEffect(() => { localStorage.setItem('erp_clientes', JSON.stringify(clientes)); }, [clientes]);
  useEffect(() => { localStorage.setItem('erp_parts', JSON.stringify(parts)); }, [parts]);
  useEffect(() => { localStorage.setItem('erp_kits', JSON.stringify(kits)); }, [kits]);
  useEffect(() => { localStorage.setItem('erp_stock_mv', JSON.stringify(stockMovements)); }, [stockMovements]);
  useEffect(() => { localStorage.setItem('erp_os', JSON.stringify(os)); }, [os]);
  useEffect(() => { localStorage.setItem('erp_ar', JSON.stringify(accountsReceivable)); }, [accountsReceivable]);
  useEffect(() => { localStorage.setItem('erp_ap', JSON.stringify(accountsPayable)); }, [accountsPayable]);
  useEffect(() => { localStorage.setItem('erp_suppliers', JSON.stringify(suppliers)); }, [suppliers]);
  useEffect(() => { localStorage.setItem('erp_invoices', JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem('erp_employees', JSON.stringify(employees)); }, [employees]);
  useEffect(() => { localStorage.setItem('erp_time', JSON.stringify(timeEntries)); }, [timeEntries]);
  useEffect(() => { localStorage.setItem('erp_vacations', JSON.stringify(vacations)); }, [vacations]);
  useEffect(() => { localStorage.setItem('erp_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('erp_audit', JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem('erp_boletos', JSON.stringify(boletos)); }, [boletos]);

  const addCliente = (c: Omit<Cliente, 'id'>): Cliente => {
    const newC = { ...c, id: idgen() };
    setClientes(prev => [newC, ...prev]);
    return newC;
  };
  const updateCliente = (id: string, c: Partial<Cliente>) =>
    setClientes(prev => prev.map(x => x.id === id ? { ...x, ...c } : x));
  const addTruckToCliente = (clientId: string, t: Omit<Truck, 'id'>) =>
    setClientes(prev => prev.map(c => c.id === clientId ? { ...c, trucks: [...c.trucks, { ...t, id: idgen() }] } : c));

  const addOS = (o: Omit<OS, 'id'>): OS => {
    const newOS = { ...o, id: idgen() };
    setOs(prev => [newOS, ...prev]);
    return newOS;
  };
  const updateOS = (id: string, o: Partial<OS>) =>
    setOs(prev => prev.map(x => x.id === id ? { ...x, ...o } : x));
  const closeOS = (id: string, paymentMethods: string[], emitNFe: boolean, emitNFSe: boolean) => {
    const found = os.find(x => x.id === id);
    if (!found) return;
    const now = new Date().toLocaleDateString('pt-BR');
    setOs(prev => prev.map(x => x.id === id ? { ...x, status: 'Concluída', paymentMethods, closedAt: new Date().toISOString() } : x));
    // Create AR
    const arId = idgen();
    setAR(prev => [{
      id: arId, osId: found.id, osNumber: found.number,
      clientId: found.clientId, clientName: found.clientName, plate: found.plate,
      description: `OS #${found.number} - ${found.clientName}`,
      planId: 'ap3', planName: 'Receita de Serviços/Peças',
      accrualDate: found.date, dueDate: now,
      value: found.total, status: 'Aberto', paymentMethod: paymentMethods[0]
    }, ...prev]);
    // Debit parts from stock
    found.parts.forEach(part => {
      setParts(prev => prev.map(p => p.id === part.partId ? { ...p, qty: Math.max(0, p.qty - part.qty) } : p));
      setStockMovements(prev => [{
        id: idgen(), date: now, type: 'Saída', partId: part.partId,
        qty: part.qty, balanceAfter: 0,
        origin: `OS #${found.number} | ${found.plate} | ${found.clientName}`, userId: 'u1'
      }, ...prev]);
    });
    // Mock invoices
    if (emitNFe) {
      setInvoices(prev => [{ id: idgen(), osId: found.id, osNumber: found.number, type: 'NF-e', number: String(400 + prev.length), series: '1', clientId: found.clientId, clientName: found.clientName, plate: found.plate, issueDate: now, value: found.subtotalParts, status: 'Autorizada' }, ...prev]);
    }
    if (emitNFSe) {
      setInvoices(prev => [{ id: idgen(), osId: found.id, osNumber: found.number, type: 'NFS-e', number: String(300 + prev.length), clientId: found.clientId, clientName: found.clientName, plate: found.plate, issueDate: now, value: found.subtotalLabor + found.subtotalServices, status: 'Autorizada' }, ...prev]);
    }
    if (paymentMethods.includes('Boleto')) {
      setBoletos(prev => [{ id: idgen(), osId: found.id, osNumber: found.number, arId, clientId: found.clientId, clientName: found.clientName, dueDate: now, value: found.total, status: 'Aberto', issuedAt: now }, ...prev]);
    }
  };

  const addPart = (p: Omit<Part, 'id'>): Part => {
    const newP = { ...p, id: idgen() };
    setParts(prev => [newP, ...prev]);
    return newP;
  };
  const updatePart = (id: string, p: Partial<Part>) =>
    setParts(prev => prev.map(x => x.id === id ? { ...x, ...p } : x));
  const addStockMovement = (m: Omit<StockMovement, 'id'>) =>
    setStockMovements(prev => [{ ...m, id: idgen() }, ...prev]);

  const addAccountReceivable = (a: Omit<AccountReceivable, 'id'>) =>
    setAR(prev => [{ ...a, id: idgen() }, ...prev]);
  const updateAccountReceivable = (id: string, a: Partial<AccountReceivable>) =>
    setAR(prev => prev.map(x => x.id === id ? { ...x, ...a } : x));
  const addAccountPayable = (a: Omit<AccountPayable, 'id'>) =>
    setAP(prev => [{ ...a, id: idgen() }, ...prev]);
  const updateAccountPayable = (id: string, a: Partial<AccountPayable>) =>
    setAP(prev => prev.map(x => x.id === id ? { ...x, ...a } : x));
  const addInvoice = (inv: Omit<Invoice, 'id'>) =>
    setInvoices(prev => [{ ...inv, id: idgen() }, ...prev]);
  const addEmployee = (e: Omit<Employee, 'id'>) =>
    setEmployees(prev => [{ ...e, id: idgen() }, ...prev]);
  const updateEmployee = (id: string, e: Partial<Employee>) =>
    setEmployees(prev => prev.map(x => x.id === id ? { ...x, ...e } : x));
  const addTimeEntry = (t: Omit<TimeEntry, 'id'>) =>
    setTimeEntries(prev => [{ ...t, id: idgen() }, ...prev]);
  const addUser = (u: Omit<AppUser, 'id' | 'createdAt'>) =>
    setUsers(prev => [{ ...u, id: idgen(), createdAt: new Date().toLocaleDateString('pt-BR') }, ...prev]);
  const addAuditLog = (log: Omit<AuditLog, 'id' | 'createdAt'>) =>
    setAuditLogs(prev => [{ ...log, id: idgen(), createdAt: new Date().toISOString() }, ...prev]);
  const addSupplier = (s: Omit<Supplier, 'id'>): Supplier => {
    const newS = { ...s, id: idgen() };
    setSuppliers(prev => [newS, ...prev]);
    return newS;
  };
  const addKit = (k: Omit<Kit, 'id'>) =>
    setKits(prev => [{ ...k, id: idgen() }, ...prev]);
  const addBoleto = (b: Omit<Boleto, 'id'>) =>
    setBoletos(prev => [{ ...b, id: idgen() }, ...prev]);
  const updateBoleto = (id: string, b: Partial<Boleto>) =>
    setBoletos(prev => prev.map(x => x.id === id ? { ...x, ...b } : x));

  return (
    <MockDBContext.Provider value={{
      clientes, mechanics, services, parts, kits, stockMovements,
      os, accountsReceivable, accountsPayable, accountPlans, suppliers,
      invoices, employees, timeEntries, vacations, users, auditLogs, boletos,
      addCliente, updateCliente, addTruckToCliente,
      addOS, updateOS, closeOS,
      addPart, updatePart, addStockMovement,
      addAccountReceivable, updateAccountReceivable,
      addAccountPayable, updateAccountPayable,
      addInvoice, addEmployee, updateEmployee, addTimeEntry,
      addUser, addAuditLog, addSupplier, addKit, addBoleto, updateBoleto
    }}>
      {children}
    </MockDBContext.Provider>
  );
}

export function useMockDB() {
  const context = useContext(MockDBContext);
  if (!context) throw new Error('useMockDB must be used within MockDBProvider');
  return context;
}
