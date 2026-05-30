import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../lib/auth";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Shield, User, Mail, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    const success = await register(name, email, password);

    if (success) {
      toast.success("Cuenta creada exitosamente");
      navigate("/");
    } else {
      setError("El correo ya está registrado");
      toast.error("El correo ya está registrado");
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
            <p className="text-muted-foreground mt-2">Crea tu cuenta en minutos</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Registro de Cliente</h2>

            {error && (
              <div className="mb-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-primary">
                Al registrarte, se generará automáticamente una cuenta bancaria única de 10 dígitos
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  label="Nombre Completo"
                  placeholder="Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <Input
                  type="password"
                  label="Confirmar Contraseña"
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                <User className="w-5 h-5" />
                {loading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Al registrarte aceptas nuestros términos y condiciones</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Hero */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#0F172A] via-[#1e293b] to-[#2563EB] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />

        <div className="relative z-10 text-white max-w-lg">
          <h2 className="text-4xl font-bold mb-6">
            Únete a la banca digital
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Miles de usuarios ya confían en nosotros para gestionar sus finanzas de forma segura.
          </p>

          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                <h3 className="font-semibold">Cuenta Bancaria Instantánea</h3>
              </div>
              <p className="text-sm text-white/70 ml-9">
                Recibe tu número de cuenta único de 10 dígitos al instante
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                <h3 className="font-semibold">Saldo Inicial de Bienvenida</h3>
              </div>
              <p className="text-sm text-white/70 ml-9">
                Comienza con $50,000 MXN para explorar todas las funciones
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                <h3 className="font-semibold">Transferencias Sin Costo</h3>
              </div>
              <p className="text-sm text-white/70 ml-9">
                Envía dinero a cualquier cuenta sin comisiones ocultas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
