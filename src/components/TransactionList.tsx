import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Calendar, Tag } from "lucide-react";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: 'INCOME' | 'EXPENSE';
  date: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

const getCategoryColor = (category: string, type: 'INCOME' | 'EXPENSE') => {
  const colors = {
    // Income categories
    'Trabajo': 'bg-success/10 text-success border-success/20',
    'Freelance': 'bg-primary/10 text-primary border-primary/20',
    'Inversiones': 'bg-accent/10 text-accent border-accent/20',
    'Otros Ingresos': 'bg-success/10 text-success border-success/20',
    
    // Expense categories
    'Alimentación': 'bg-destructive/10 text-destructive border-destructive/20',
    'Transporte': 'bg-warning/10 text-warning border-warning/20',
    'Vivienda': 'bg-primary/10 text-primary border-primary/20',
    'Entretenimiento': 'bg-accent/10 text-accent border-accent/20',
    'Salud': 'bg-destructive/10 text-destructive border-destructive/20',
    'Educación': 'bg-primary/10 text-primary border-primary/20',
    'Otros Gastos': 'bg-muted/10 text-muted-foreground border-muted/20'
  };
  
  return colors[category as keyof typeof colors] || 'bg-muted/10 text-muted-foreground border-muted/20';
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const TransactionList = ({ transactions }: TransactionListProps) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No hay transacciones</p>
          <p className="text-sm">Agrega tu primera transacción para comenzar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <Card 
          key={transaction.id} 
          className="bg-gradient-card shadow-soft border-0 hover:shadow-medium transition-all duration-300"
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'INCOME' 
                    ? 'bg-success/10 text-success' 
                    : 'bg-destructive/10 text-destructive'
                }`}>
                  {transaction.type === 'INCOME' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">
                    {transaction.description}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge 
                      variant="outline"
                      className={`text-xs ${getCategoryColor(transaction.category, transaction.type)}`}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {transaction.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(transaction.date)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-lg font-semibold ${
                  transaction.type === 'INCOME' 
                    ? 'text-success' 
                    : 'text-destructive'
                }`}>
                  {transaction.type === 'INCOME' ? '+' : '-'}${transaction.amount.toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};