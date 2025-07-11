import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Calendar, Tag } from "lucide-react";
import { formatSoles } from "@/lib/utils";

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

const formatDateMobile = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit'
  });
};

export const TransactionList = ({ transactions }: TransactionListProps) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <div className="text-muted-foreground">
          <TrendingUp className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
          <p className="text-base sm:text-lg font-medium">No hay transacciones</p>
          <p className="text-xs sm:text-sm">Agrega tu primera transacción para comenzar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {transactions.map((transaction) => (
        <Card 
          key={transaction.id} 
          className="bg-gradient-card shadow-soft border-0 hover:shadow-medium transition-all duration-300"
        >
          <CardContent className="p-3 sm:p-4">
            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between">
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
                  {transaction.type === 'INCOME' ? '+' : '-'}{formatSoles(transaction.amount)}
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="sm:hidden">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <div className={`p-1.5 rounded-full flex-shrink-0 ${
                    transaction.type === 'INCOME' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-destructive/10 text-destructive'
                  }`}>
                    {transaction.type === 'INCOME' ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground text-sm truncate">
                      {transaction.description}
                    </h3>
                  </div>
                </div>
                
                <div className="text-right flex-shrink-0 ml-2">
                  <div className={`text-base font-semibold ${
                    transaction.type === 'INCOME' 
                      ? 'text-success' 
                      : 'text-destructive'
                  }`}>
                    {transaction.type === 'INCOME' ? '+' : '-'}{formatSoles(transaction.amount)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge 
                  variant="outline"
                  className={`text-xs ${getCategoryColor(transaction.category, transaction.type)}`}
                >
                  <Tag className="h-2.5 w-2.5 mr-1" />
                  {transaction.category}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center">
                  <Calendar className="h-2.5 w-2.5 mr-1" />
                  {formatDateMobile(transaction.date)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};