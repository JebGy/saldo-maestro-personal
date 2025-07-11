import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea un número como moneda en soles peruanos
 * @param amount - El monto a formatear
 * @param options - Opciones de formateo
 * @returns String formateado como moneda peruana
 */
export function formatCurrency(
  amount: number, 
  options: {
    showSymbol?: boolean;
    showDecimals?: boolean;
    locale?: string;
  } = {}
) {
  const {
    showSymbol = true,
    showDecimals = true,
    locale = 'es-PE'
  } = options;

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });

  const formatted = formatter.format(amount);
  
  // Si no queremos mostrar el símbolo, lo removemos
  if (!showSymbol) {
    return formatted.replace('S/', '').trim();
  }
  
  return formatted;
}

/**
 * Formatea un número como moneda en soles peruanos con símbolo personalizado
 * @param amount - El monto a formatear
 * @param showDecimals - Si mostrar decimales
 * @returns String formateado como "S/ 1,234.56"
 */
export function formatSoles(amount: number, showDecimals: boolean = true): string {
  const formatter = new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });
  
  return `S/${formatter.format(amount)}`;
}

/**
 * Formatea un número grande en soles con abreviación (K, M, B)
 * @param amount - El monto a formatear
 * @returns String formateado como "S/ 1.2K", "S/ 1.5M", etc.
 */
export function formatSolesCompact(amount: number): string {
  if (amount >= 1000000000) {
    return `S/${(amount / 1000000000).toFixed(1)}B`;
  } else if (amount >= 1000000) {
    return `S/${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `S/${(amount / 1000).toFixed(1)}K`;
  } else {
    return formatSoles(amount);
  }
}

/**
 * Convierte un string de moneda a número
 * @param currencyString - String con formato de moneda (ej: "S/ 1,234.56")
 * @returns Número extraído del string
 */
export function parseCurrency(currencyString: string): number {
  // Remueve el símbolo de moneda y espacios
  const cleanString = currencyString.replace(/[S/$\s]/g, '');
  // Remueve las comas de miles
  const numberString = cleanString.replace(/,/g, '');
  return parseFloat(numberString) || 0;
}
