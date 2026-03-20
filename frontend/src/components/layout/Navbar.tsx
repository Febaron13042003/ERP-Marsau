import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Users, Settings, Package, 
  DollarSign, FileText, Briefcase, BarChart, Truck, Wrench as Tools 
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Clientes', path: '/clientes', icon: Users },
  { name: 'Operacional', path: '/operacional', icon: Tools },
  { name: 'Cadastros', path: '/cadastros', icon: Settings },
  { name: 'Estoque', path: '/estoque', icon: Package },
  { name: 'Financeiro', path: '/financeiro', icon: DollarSign },
  { name: 'Fiscal', path: '/fiscal', icon: FileText },
  { name: 'RH', path: '/rh', icon: Briefcase },
  { name: 'Relatórios', path: '/relatorios', icon: BarChart },
  { name: 'Configurações', path: '/configuracoes', icon: Settings },
];

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 z-50 w-full bg-slate-900 text-white shadow-lg">
      <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex-shrink-0 flex items-center gap-2 mr-6">
          <Truck className="h-7 w-7 text-blue-400" />
          <span className="font-bold text-lg tracking-tight text-white uppercase hidden md:block">
            Mestre ERP
          </span>
        </div>
        
        {/* Navigation - Top Horizontal Menu */}
        <div className="flex-1 flex items-center justify-start overflow-x-auto hide-scrollbar">
          <div className="flex space-x-1 sm:space-x-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                               (item.path !== '/' && location.pathname.startsWith(item.path));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md transition-all whitespace-nowrap",
                    isActive 
                      ? "bg-blue-600/20 text-blue-400 font-medium" 
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                  title={item.name}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-[10px] sm:text-xs md:text-sm">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </nav>
  );
}
