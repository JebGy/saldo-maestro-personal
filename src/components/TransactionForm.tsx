import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, DollarSign, Plus, Minus, Coins } from "lucide-react";

interface TransactionFormProps {
  onSubmit: (transaction: {
    description: string;
    amount: number;
    category: string;
    type: 'INCOME' | 'EXPENSE';
    date: string;
  }) => void;
  onCancel: () => void;
}

const CATEGORIES = {
  income: ['Trabajo', 'Freelance', 'Inversiones', 'Otros Ingresos'],
  expense: ['Alimentación', 'Transporte', 'Vivienda', 'Entretenimiento', 'Salud', 'Educación', 'Otros Gastos']
};

export const TransactionForm = ({ onSubmit, onCancel }: TransactionFormProps) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'expense' as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.category) return;

    onSubmit({
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type.toUpperCase() as 'INCOME' | 'EXPENSE',
      date: formData.date
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
      <Card className="w-full max-w-sm sm:max-w-md bg-card shadow-strong border-0 max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-3 sm:pb-4 sticky top-0 bg-card z-10">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg sm:text-xl font-semibold">
              Nueva Transacción
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Type Selection */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant={formData.type === 'income' ? 'default' : 'outline'}
                className={`flex-1 text-sm sm:text-base ${formData.type === 'income' ? 'bg-success hover:bg-success/90' : ''}`}
                onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Ingreso</span>
                <span className="hidden lg:inline">+</span>
              </Button>
              <Button
                type="button"
                variant={formData.type === 'expense' ? 'default' : 'outline'}
                className={`flex-1 text-sm sm:text-base ${formData.type === 'expense' ? 'bg-destructive hover:bg-destructive/90' : ''}`}
                onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
              >
                <Minus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Gasto</span>
                <span className="hidden lg:inline">-</span>
              </Button>
            </div>

            {/* Description */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="description" className="text-sm sm:text-base">Descripción</Label>
              <Input
                id="description"
                placeholder="Ej: Compra en supermercado"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="text-sm sm:text-base"
                required
              />
            </div>

            {/* Amount */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="amount" className="text-sm sm:text-base">Monto (S/)</Label>
              <div className="relative">
                <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-10 text-sm sm:text-base"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="category" className="text-sm sm:text-base">Categoría</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES[formData.type].map((category) => (
                    <SelectItem key={category} value={category} className="text-sm sm:text-base">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="date" className="text-sm sm:text-base">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="text-sm sm:text-base"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3 sm:pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 text-sm sm:text-base"
                onClick={onCancel}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-primary shadow-medium hover:shadow-strong transition-all duration-300 text-sm sm:text-base"
              >
                Guardar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};