import { useState } from "react";
import { useAuth } from "../lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { User, Mail, CreditCard, Lock, Shield, CheckCircle2, Edit2 } from "lucide-react";
import { formatCurrency } from "../lib/utils";
import { toast } from "sonner";

export function Profile() {
  const { user } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    const users = JSON.parse(localStorage.getItem("nexus_users") || "[]");
    const userIndex = users.findIndex((u: any) => u.id === user?.id);

    if (userIndex !== -1) {
      if (users[userIndex].password !== passwordForm.currentPassword) {
        toast.error("Contraseña actual incorrecta");
        return;
      }

      users[userIndex].password = passwordForm.newPassword;
      localStorage.setItem("nexus_users", JSON.stringify(users));

      const auditLog = JSON.parse(localStorage.getItem("nexus_audit") || "[]");
      auditLog.unshift({
        id: Date.now().toString(),
        type: "password_change",
        description: "Contraseña actualizada exitosamente",
        timestamp: new Date().toISOString(),
        status: "success",
      });
      localStorage.setItem("nexus_audit", JSON.stringify(auditLog));

      toast.success("Contraseña actualizada exitosamente");
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Mi Perfil</h1>
        <p className="text-muted-foreground">Gestiona tu información personal y configuración</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>Tus datos de registro</CardDescription>
                </div>
                <Badge variant="success">
                  <CheckCircle2 className="w-3 h-3" />
                  Verificado
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Nombre Completo</label>
                  <div className="flex items-center gap-3 p-3 bg-accent rounded-xl">
                    <User className="w-5 h-5 text-primary" />
                    <span className="text-foreground">{user?.name}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Correo Electrónico
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-accent rounded-xl">
                    <Mail className="w-5 h-5 text-primary" />
                    <span className="text-foreground">{user?.email}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Información Bancaria</CardTitle>
              <CardDescription>Detalles de tu cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Número de Cuenta
                </label>
                <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                  <CreditCard className="w-6 h-6 text-primary" />
                  <div className="flex-1">
                    <p className="font-mono text-lg text-foreground">{user?.accountNumber}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Generado automáticamente al registrarte
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Saldo Actual</label>
                <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-success/10 to-success/5 rounded-xl border border-success/20">
                  <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-2xl font-semibold text-foreground">
                      {formatCurrency(user?.balance || 0)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Disponible para usar</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle>Seguridad</CardTitle>
              <CardDescription>Protege tu cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-accent rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Contraseña</p>
                    <p className="text-sm text-muted-foreground">••••••••</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowPasswordModal(true)}>
                  <Edit2 className="w-4 h-4" />
                  Cambiar
                </Button>
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground mb-1">
                      Autenticación de Dos Factores
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Agrega una capa extra de seguridad a tu cuenta
                    </p>
                    <Badge variant="warning">Próximamente</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-[#0F172A] to-[#2563EB] border-none text-white">
            <CardContent className="py-8 text-center">
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-1">{user?.name}</h3>
              <p className="text-white/80 text-sm mb-4">{user?.email}</p>
              <Badge className="bg-white/20 text-white border-white/30">Cliente Premium</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cuenta Activa</span>
                <Badge variant="success">Activo</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Nivel de Seguridad</span>
                <Badge variant="info">Alto</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cuenta Verificada</span>
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowPasswordModal(false)} />

          <Card className="relative z-10 w-full max-w-md">
            <CardHeader>
              <CardTitle>Cambiar Contraseña</CardTitle>
              <CardDescription>Actualiza tu contraseña de acceso</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <Input
                  type="password"
                  label="Contraseña Actual"
                  placeholder="••••••••"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  required
                />

                <Input
                  type="password"
                  label="Nueva Contraseña"
                  placeholder="Mínimo 6 caracteres"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                  required
                />

                <Input
                  type="password"
                  label="Confirmar Nueva Contraseña"
                  placeholder="Repite la nueva contraseña"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  required
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">
                    Actualizar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
