-- ERP Oficina Auto Elétrica de Caminhões - V3
-- Initial Database Schema

-- Users / Profiles (Extended from Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text DEFAULT 'Operacional',
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Módulo 2: Clientes
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  document text UNIQUE NOT NULL, -- CPF ou CNPJ
  contact jsonb, -- { phone, whatsapp, email }
  address jsonb, -- { cep, logradouro, numero, bairro, cidade, uf }
  type text NOT NULL, -- 'PF' ou 'PJ'
  observations text,
  status text DEFAULT 'Ativo',
  limit_credit numeric(10,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Módulo 2: Caminhões (Vehicles)
CREATE TABLE IF NOT EXISTS public.vehicles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  plate text UNIQUE NOT NULL,
  brand text,
  model text,
  year text,
  current_km integer,
  km_revision_interval integer,
  days_revision_interval integer,
  last_service_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Módulo 3: Estoque (Inventory)
CREATE TABLE IF NOT EXISTS public.inventory (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  internal_code text UNIQUE,
  manufacturer_ref text,
  description text NOT NULL,
  category text,
  unit text DEFAULT 'UN',
  quantity numeric(10,2) DEFAULT 0,
  min_quantity numeric(10,2) DEFAULT 0,
  cost_price numeric(10,2) DEFAULT 0.00,
  sale_price numeric(10,2) DEFAULT 0.00,
  supplier_id uuid, -- For later FK
  status text DEFAULT 'Normal',
  created_at timestamptz DEFAULT now()
);

-- Módulo 1: Ordem de Serviço (OS)
CREATE TABLE IF NOT EXISTS public.service_orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  os_number serial UNIQUE,
  client_id uuid REFERENCES public.clients(id),
  vehicle_id uuid REFERENCES public.vehicles(id),
  mechanic_id uuid REFERENCES public.profiles(id),
  status text DEFAULT 'Aberta', -- Aberta, Em execução, Concluída
  current_km integer,
  total_labor numeric(10,2) DEFAULT 0.00,
  total_parts numeric(10,2) DEFAULT 0.00,
  total_services numeric(10,2) DEFAULT 0.00,
  total_amount numeric(10,2) DEFAULT 0.00,
  payment_method text,
  observations text,
  created_at timestamptz DEFAULT now(),
  closed_at timestamptz
);

-- Módulo 4: Financeiro (Lançamentos)
CREATE TABLE IF NOT EXISTS public.financial_entries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL, -- 'RECEBER' ou 'PAGAR'
  origin_type text, -- 'OS', 'NF', 'MANUAL'
  origin_id uuid,
  entity_id uuid, -- Fornecedor ou Cliente
  description text NOT NULL,
  chart_of_account text,
  due_date date NOT NULL,
  competence_date date NOT NULL,
  amount numeric(10,2) NOT NULL,
  paid_amount numeric(10,2) DEFAULT 0.00,
  status text DEFAULT 'Aberto', -- Aberto, Pago, Vencido, Parcial
  payment_method text,
  created_at timestamptz DEFAULT now()
);
