import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../lib/auth";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Shield, Lock, Mail, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = await login(email, password);

    if (success) {
      toast.success("Inicio de sesión exitoso");
      navigate("/");
    } else {
      setError("Credenciales incorrectas");
      toast.error("Credenciales incorrectas");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-semibold text-foreground">Banco Nexus Cloud</h1>
            <p className="text-muted-foreground mt-2">Banca digital segura y moderna</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Iniciar Sesión</h2>

            {error && (
              <div className="mb-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  label="Correo Electrónico"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Input
                  type="password"
                  label="Contraseña"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                <Lock className="w-5 h-5" />
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                ¿No tienes cuenta?{" "}
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Regístrate aquí
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Conexión segura con encriptación de extremo a extremo</span>
              </div>
            </div>
          </div>

          <div className="bg-accent rounded-xl p-4 border border-border">
            <p className="text-xs font-medium text-foreground mb-2">Cuentas de Demostración:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>📧 ana@demo.com / demo123</p>
              <p>📧 carlos@demo.com / demo123</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Hero */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#0F172A] via-[#1e293b] to-[#2563EB] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />

        <div className="relative z-10 text-white max-w-lg">
          <h2 className="text-4xl font-bold mb-6">
            Banca del futuro, disponible hoy
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Gestiona tus finanzas con seguridad cloud, transferencias instantáneas y total transparencia.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">Seguridad Bancaria</p>
                <p className="text-sm text-white/70">Protección de grado empresarial</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">Encriptación Total</p>
                <p className="text-sm text-white/70">Tus datos siempre protegidos</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">Soporte 24/7</p>
                <p className="text-sm text-white/70">Estamos aquí cuando nos necesites</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
