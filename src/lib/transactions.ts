// Función para agregar un nuevo registro usando la API externa
export async function addTransaction({
  amount,
  description,
  category,
  type,
  date,
}: {
  amount: number;
  description: string;
  category: string;
  type: "INCOME" | "EXPENSE";
  date: string;
}) {
  // Convertir la fecha a formato ISO-8601 completo
  const isoDate = new Date(date + 'T00:00:00.000Z').toISOString();
  
  const res = await fetch(
    "https://amaicontrolback.vercel.app/api/agregarregistro",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, description, category, type, date: isoDate }),
    }
  );
  if (!res.ok) throw new Error("Error al agregar registro");
  return res.json();
}

// Función para leer registros usando la API externa y filtros
export async function getTransactions() {
  const res = await fetch(
    `https://amaicontrolback.vercel.app/api/leerregistro`
  );
  if (!res.ok) throw new Error("Error al leer registros");
  return res.json();
}
