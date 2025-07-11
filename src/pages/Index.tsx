import { useState, useEffect } from "react";
import Dashboard from "@/components/Dashboard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Intentar cargar usuario de localStorage
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(""); // Limpiar mensaje de éxito al iniciar autenticación
    try {
      let payload: { email: string; password: string; name?: string } = { ...form };
      if (!isRegister) {
        // Si es login, no enviar username
        const { name, ...rest } = payload;
        payload = rest;
      }
      console.log("Payload enviado:", payload); // <-- Agrega esto
      const endpoint = isRegister ? "https://amaicontrolback.vercel.app/api/auth/register" : "https://amaicontrolback.vercel.app/api/auth/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.log("Respuesta error:", errorData); // <-- Y esto
        throw new Error(errorData.message || (isRegister ? "Error al registrar" : "Credenciales incorrectas"));
      }
      const data = await res.json();
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      setSuccess(isRegister ? "¡Registro exitoso!" : "¡Inicio de sesión exitoso!");
    } catch (err: any) {
      setError(err.message || "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <form onSubmit={handleAuth} className="bg-card p-8 rounded shadow-md w-full max-w-sm space-y-4">
          <h2 className="text-xl font-bold mb-2">{isRegister ? "Registrarse" : "Iniciar sesión"}</h2>
          <Input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            required
          />
          {isRegister && (
            <Input
              name="name"
              type="text"
              placeholder="Nombre"
              value={form.name}
              onChange={handleChange}
              required
            />
          )}
          <Input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (isRegister ? "Registrando..." : "Entrando...") : isRegister ? "Registrarse" : "Entrar"}
          </Button>
          <div className="text-center text-sm mt-2">
            {isRegister ? (
              <>
                ¿Ya tienes cuenta?{' '}
                <button type="button" className="text-primary underline" onClick={() => setIsRegister(false)}>
                  Inicia sesión
                </button>
              </>
            ) : (
              <>
                ¿No tienes cuenta?{' '}
                <button type="button" className="text-primary underline" onClick={() => setIsRegister(true)}>
                  Regístrate
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    );
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
};

export default Index;
