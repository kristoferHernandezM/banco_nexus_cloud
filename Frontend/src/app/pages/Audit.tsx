import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import {
  Shield,
  LogIn,
  ArrowLeftRight,
  XCircle,
  CheckCircle2,
  Clock,
  Activity,
} from "lucide-react";
import { formatDateTime } from "../lib/utils";

interface AuditEvent {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  status: "success" | "error" | "pending";
}

export function Audit() {
  const [auditLog, setAuditLog] = useState<AuditEvent[]>([]);

  useEffect(() => {
  const cargarAuditorias = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/api/auditorias", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      const eventos = data.map((e: any) => ({
        id: e._id,
        type: e.accion === "LOGIN" ? "login_success" : "transfer",
        description:
          e.accion === "LOGIN"
            ? `Inicio de sesión ${e.estado}`
            : `Transferencia ${e.estado}`,
        timestamp: e.fecha,
        status:
          e.estado === "exitoso"
            ? "success"
            : e.estado === "fallido"
            ? "error"
            : "pending"
      }));

      setAuditLog(eventos);
    } catch (error) {
      console.error(error);
    }
  };

  cargarAuditorias();
}, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "login_success":
      case "login_failed":
        return LogIn;
      case "transfer":
        return ArrowLeftRight;
      case "password_change":
        return Shield;
      default:
        return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "success";
      case "error":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return CheckCircle2;
      case "error":
        return XCircle;
      case "pending":
        return Clock;
      default:
        return Activity;
    }
  };

  const stats = {
    total: auditLog.length,
    success: auditLog.filter((e) => e.status === "success").length,
    error: auditLog.filter((e) => e.status === "error").length,
    pending: auditLog.filter((e) => e.status === "pending").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">
          Auditoría y Notificaciones
        </h1>
        <p className="text-muted-foreground">
          Monitorea toda la actividad de tu cuenta en tiempo real
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total de Eventos</p>
                <p className="text-2xl font-semibold text-foreground">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Exitosos</p>
                <p className="text-2xl font-semibold text-success">{stats.success}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Errores</p>
                <p className="text-2xl font-semibold text-destructive">{stats.error}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pendientes</p>
                <p className="text-2xl font-semibold text-warning">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Línea de Tiempo de Eventos</CardTitle>
          <CardDescription>Historial completo de actividad en tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          {auditLog.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No hay eventos registrados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {auditLog.map((event, index) => {
                const EventIcon = getEventIcon(event.type);
                const StatusIcon = getStatusIcon(event.status);

                return (
                  <div
                    key={event.id}
                    className="relative pl-8 pb-8 last:pb-0 before:absolute before:left-[15px] before:top-8 before:bottom-0 before:w-[2px] before:bg-border last:before:hidden"
                  >
                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-card border-2 border-border flex items-center justify-center">
                      <EventIcon className="w-4 h-4 text-primary" />
                    </div>

                    <div className="bg-accent rounded-xl p-4 hover:bg-accent/80 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-foreground">{event.description}</h4>
                            <Badge variant={getStatusColor(event.status) as any}>
                              <StatusIcon className="w-3 h-3" />
                              {event.status === "success"
                                ? "Exitoso"
                                : event.status === "error"
                                ? "Error"
                                : "Pendiente"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDateTime(event.timestamp)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Shield className="w-3 h-3" />
                        <span>
                          Evento #{auditLog.length - index} • Registro de seguridad
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">
                Monitoreo de Seguridad Activo
              </h3>
              <p className="text-sm text-muted-foreground">
                Todos los eventos importantes son registrados automáticamente. Si detectas
                actividad sospechosa, contacta a soporte inmediatamente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
