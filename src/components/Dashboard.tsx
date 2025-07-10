import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, TrendingDown, PiggyBank, Calendar, Filter } from "lucide-react";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: string;
}

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      description: 'Salario Diciembre',
      amount: 3500,
      category: 'Trabajo',
      type: 'income',
      date: '2024-12-01'
    },
    {
      id: '2',
      description: 'Supermercado',
      amount: 150,
      category: 'Alimentación',
      type: 'expense',
      date: '2024-12-05'
    },
    {
      id: '3',
      description: 'Gasolina',
      amount: 60,
      category: 'Transporte',
      type: 'expense',
      date: '2024-12-06'
    }
  ]);

  const [showForm, setShowForm] = useState(false);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setTransactions([newTransaction, ...transactions]);
    setShowForm(false);
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Control de Gastos</h1>
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
                {balance >= 0 ? '+' : ''}{((balance / totalIncome) * 100 || 0).toFixed(1)}% del total
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
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Este mes
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <TransactionList transactions={transactions} />
          </CardContent>
        </Card>

        {/* Transaction Form Modal */}
        {showForm && (
          <TransactionForm 
            onSubmit={addTransaction}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;