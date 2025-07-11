import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown, PiggyBank, Calendar, Filter, Search } from "lucide-react";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";
import { addTransaction, getTransactions } from "@/lib/transactions";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: 'INCOME' | 'EXPENSE';
  date: string;
}

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
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
    const data = await getTransactions();
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

  const handleAddTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    await addTransaction({
      ...transaction,
      type: transaction.type.toUpperCase() as 'INCOME' | 'EXPENSE',
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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Amaicontrol</h1>
            <p className="text-muted-foreground">Gestiona tus finanzas personales</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)} 
            className="bg-gradient-primary shadow-medium hover:shadow-strong transition-all duration-300"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nueva Transacción
          </Button>
        </div>

        {/* Filtros */}
        <Card className="bg-gradient-card shadow-soft border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Filter className="h-5 w-5" /> Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <select
                className="border rounded px-2 py-1"
                value={filters.type}
                onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
              >
                <option value="">Todos</option>
                <option value="INCOME">Ingresos</option>
                <option value="EXPENSE">Gastos</option>
              </select>
              <input
                type="number"
                className="border rounded px-2 py-1"
                placeholder="Monto mínimo"
                value={filters.minAmount}
                onChange={e => setFilters(f => ({ ...f, minAmount: e.target.value }))}
              />
              <input
                type="number"
                className="border rounded px-2 py-1"
                placeholder="Monto máximo"
                value={filters.maxAmount}
                onChange={e => setFilters(f => ({ ...f, maxAmount: e.target.value }))}
              />
              <input
                type="date"
                className="border rounded px-2 py-1"
                value={filters.fromDate}
                onChange={e => setFilters(f => ({ ...f, fromDate: e.target.value }))}
              />
              <input
                type="date"
                className="border rounded px-2 py-1"
                value={filters.toDate}
                onChange={e => setFilters(f => ({ ...f, toDate: e.target.value }))}
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="border rounded px-2 py-1"
                  placeholder="Buscar descripción"
                  value={filters.search}
                  onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                />
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-card shadow-soft border-0 hover:shadow-medium transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Balance Total
              </CardTitle>
              <PiggyBank className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${balance.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {balance >= 0 ? '+' : ''}
                {totalIncome === 0 ? '0.0' : ((balance / totalIncome) * 100).toFixed(1)}% del total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft border-0 hover:shadow-medium transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ingresos
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                ${totalIncome.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% vs mes anterior
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft border-0 hover:shadow-medium transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Gastos
              </CardTitle>
              <TrendingDown className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                ${totalExpenses.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                -5% vs mes anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Section */}
        <Card className="bg-gradient-card shadow-soft border-0">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold text-foreground">
                Transacciones Recientes
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
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
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;