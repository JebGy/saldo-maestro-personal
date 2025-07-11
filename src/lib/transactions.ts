// Función para agregar un nuevo registro usando la API externa
export async function addTransaction({
  amount,
  description,
  category,
  type,
  date,
  userId,
}: {
  amount: number;
  description: string;
  category: string;
  type: "INCOME" | "EXPENSE";
  date: string;
  userId: number;
}) {
  const isoDate = new Date(date + 'T00:00:00.000Z').toISOString();
  const token = localStorage.getItem("token");
  const res = await fetch(
    "/api/agregarregistro",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ amount, description, category, type, date: isoDate, userId }),
    }
  );
  if (!res.ok) throw new Error("Error al agregar registro");
  return res.json();
}

// Función para leer registros usando la API externa y filtros
export async function getTransactions(userId: number) {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `/api/leerregistro?userId=${userId}`,
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
  if (!res.ok) throw new Error("Error al leer registros");
  return res.json();
}
