import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown, PiggyBank, Calendar, Filter, Search, Menu } from "lucide-react";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";
import { addTransaction, getTransactions } from "@/lib/transactions";
import { formatSoles, formatSolesCompact } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: 'INCOME' | 'EXPENSE';
  date: string;
}

// NUEVO: Definir props para Dashboard
interface DashboardProps {
  user: any;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    minAmount: '',
    maxAmount: '',
    search: '',
    fromDate: '',
    toDate: ''
  });
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    const data = await getTransactions(user.id);
    setTransactions(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line
  }, []); // Solo se ejecuta al montar el componente

  // Función para filtrar transacciones localmente
  const filteredTransactions = transactions.filter(transaction => {
    // Filtro por tipo
    if (filters.type && transaction.type !== filters.type) {
      return false;
    }

    // Filtro por monto mínimo
    if (filters.minAmount && transaction.amount < parseFloat(filters.minAmount)) {
      return false;
    }

    // Filtro por monto máximo
    if (filters.maxAmount && transaction.amount > parseFloat(filters.maxAmount)) {
      return false;
    }

    // Filtro por búsqueda en descripción
    if (filters.search && !transaction.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    // Filtro por fecha desde
    if (filters.fromDate && transaction.date < filters.fromDate) {
      return false;
    }

    // Filtro por fecha hasta
    if (filters.toDate && transaction.date > filters.toDate) {
      return false;
    }

    return true;
  });

  const handleAddTransaction = async (transaction: Omit<Transaction, 'id'> & { userId?: number }) => {
    await addTransaction({
      ...transaction,
      type: transaction.type.toUpperCase() as 'INCOME' | 'EXPENSE',
      userId: user.id,
    });
    fetchTransactions();
    setShowForm(false);
  };

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:w-auto">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Amaicontrol</h1>
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                Soles (PEN)
              </Badge>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">Gestiona tus finanzas personales</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              onClick={() => setShowFilters(!showFilters)} 
              variant="outline"
              size="sm"
              className="sm:hidden"
            >
              <Filter className="h-4 w-4 mr-1" />
              Filtros
            </Button>
            <Button 
              onClick={() => setShowForm(true)} 
              className="bg-gradient-primary shadow-medium hover:shadow-strong transition-all duration-300 flex-1 sm:flex-none"
              size="sm"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Nueva Transacción</span>
              <span className="sm:hidden">Nueva</span>
            </Button>
            {/* NUEVO: Botón de cerrar sesión */}
            {user && (
              <Button onClick={onLogout} variant="outline" size="sm">
                Cerrar sesión
              </Button>
            )}
          </div>
        </div>

        {/* Filtros */}
        <Card className={`bg-gradient-card shadow-soft border-0 transition-all duration-300 ${showFilters ? 'block' : 'hidden sm:block'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5" /> 
              <span className="hidden sm:inline">Filtros</span>
              <span className="sm:hidden">Filtros de búsqueda</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
              <select
                className="border rounded px-3 py-2 text-sm bg-background"
                value={filters.type}
                onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
              >
                <option value="">Todos los tipos</option>
                <option value="INCOME">Ingresos</option>
                <option value="EXPENSE">Gastos</option>
              </select>
              
              <div className="relative">
                <input
                  type="number"
                  className="border rounded px-3 py-2 text-sm bg-background w-full"
                  placeholder="Monto mínimo"
                  value={filters.minAmount}
                  onChange={e => setFilters(f => ({ ...f, minAmount: e.target.value }))}
                />
              </div>
              
              <div className="relative">
                <input
                  type="number"
                  className="border rounded px-3 py-2 text-sm bg-background w-full"
                  placeholder="Monto máximo"
                  value={filters.maxAmount}
                  onChange={e => setFilters(f => ({ ...f, maxAmount: e.target.value }))}
                />
              </div>
              
              <input
                type="date"
                className="border rounded px-3 py-2 text-sm bg-background"
                value={filters.fromDate}
                onChange={e => setFilters(f => ({ ...f, fromDate: e.target.value }))}
              />
              
              <input
                type="date"
                className="border rounded px-3 py-2 text-sm bg-background"
                value={filters.toDate}
                onChange={e => setFilters(f => ({ ...f, toDate: e.target.value }))}
              />
              
              <div className="relative">
                <input
                  type="text"
                  className="border rounded px-3 py-2 pr-8 text-sm bg-background w-full"
                  placeholder="Buscar descripción"
                  value={filters.search}
                  onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                />
                <Search className="h-4 w-4 text-muted-foreground absolute right-2 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="bg-gradient-card shadow-soft border-0 hover:shadow-medium transition-all duration-300 cursor-help">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                      Balance Total
                    </CardTitle>
                    <PiggyBank className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold text-foreground">
                      {formatSoles(balance)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {balance >= 0 ? '+' : ''}
                      {totalIncome === 0 ? '0.0' : ((balance / totalIncome) * 100).toFixed(1)}% del total
                    </p>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Balance total: {formatSoles(balance)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="bg-gradient-card shadow-soft border-0 hover:shadow-medium transition-all duration-300 cursor-help">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                      Ingresos
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold text-success">
                      {formatSoles(totalIncome)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +12% vs mes anterior
                    </p>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Total ingresos: {formatSoles(totalIncome)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="bg-gradient-card shadow-soft border-0 hover:shadow-medium transition-all duration-300 sm:col-span-2 lg:col-span-1 cursor-help">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                      Gastos
                    </CardTitle>
                    <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold text-destructive">
                      {formatSoles(totalExpenses)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      -5% vs mes anterior
                    </p>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Total gastos: {formatSoles(totalExpenses)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Transactions Section */}
        <Card className="bg-gradient-card shadow-soft border-0">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg sm:text-xl font-semibold text-foreground">
                Transacciones Recientes
              </CardTitle>
              <div className="text-sm text-muted-foreground hidden sm:block">
                {filteredTransactions.length} transacciones
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Cargando...</div>
            ) : (
              <TransactionList transactions={filteredTransactions} />
            )}
          </CardContent>
        </Card>

        {/* Transaction Form Modal */}
        {showForm && (
          <TransactionForm 
            onSubmit={handleAddTransaction}
            onCancel={() => setShowForm(false)}
            userId={user.id}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;