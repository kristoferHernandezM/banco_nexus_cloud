import { useAuth } from "../lib/auth";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  History,
  User,
  ArrowLeftRight,
  TrendingUp,
  Shield,
  CreditCard,
} from "lucide-react";
import { formatCurrency, formatDateTime } from "../lib/utils";
import { useEffect, useState } from "react";

interface Transaction {
  id: string;
  type: "incoming" | "outgoing";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending";
}

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [totalTransferencias, setTotalTransferencias] = useState(0);

  useEffect(() => {

  const cargarDashboard = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      setTotalTransferencias(
        data.totalTransferencias
      );

      const movimientos = (data.movimientosRecientes || []).map(
        (t: any) => ({
          id: t._id,
          type:
            t.cuentaDestino === user?.accountNumber
              ? "incoming"
              : "outgoing",
          amount: t.monto,
          description: t.mensaje || "Transferencia",
          date: t.fecha,
          status: "completed" as "completed"
        })
      );

      setRecentTransactions(
        movimientos
      );

    } catch (error) {

      console.error(error);

    }

  };

  cargarDashboard();

}, [user]);

  const quickActions = [
    {
      icon: ArrowLeftRight,
      label: "Transferir",
      description: "Enviar dinero",
      path: "/transfer",
      color: "text-primary",
    },
    {
      icon: Wallet,
      label: "Mis Cuentas",
      description: "Ver cuentas guardadas",
      path: "/accounts",
      color: "text-warning",
    },
    {
      icon: History,
      label: "Historial",
      description: "Ver movimientos",
      path: "/transactions",
      color: "text-success",
    },
    {
      icon: User,
      label: "Perfil",
      description: "Configuración",
      path: "/profile",
      color: "text-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">
          ¡Hola, {user?.name}! 👋
        </h1>
        <p className="text-muted-foreground">
          Aquí está el resumen de tu cuenta bancaria
        </p>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-[#0F172A] to-[#2563EB] border-none text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />

        <CardContent className="relative z-10 py-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-white/80 mb-1">Saldo Disponible</p>
              <h2 className="text-4xl font-bold">{formatCurrency(user?.balance || 0)}</h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-white/20">
            <div>
              <p className="text-white/80 text-sm mb-1">Número de Cuenta</p>
              <p className="font-mono text-lg">{user?.accountNumber}</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4" />
              <span className="text-white/80">Protegido</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.path}
                className="cursor-pointer group"
                hover
                onClick={() => navigate(action.path)}
              >
                <CardContent className="py-6 text-center">
                  <div className={`w-12 h-12 rounded-xl bg-accent ${action.color} mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-medium text-foreground mb-1">{action.label}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ingresos del Mes</p>
                <p className="text-2xl font-semibold text-success">+{formatCurrency(12450)}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <ArrowDownRight className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Gastos del Mes</p>
                <p className="text-2xl font-semibold text-destructive">-{formatCurrency(8320)}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Transacciones</p>
                <p className="text-2xl font-semibold text-foreground">{totalTransferencias}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Movimientos Recientes</CardTitle>
              <CardDescription>Tus últimas transacciones</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/transactions")}>
              Ver todos
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {totalTransferencias === 0 ? (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No tienes transacciones recientes</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => navigate("/transfer")}
              >
                Realizar primera transferencia
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        transaction.type === "incoming"
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {transaction.type === "incoming" ? (
                        <ArrowDownRight className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTime(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        transaction.type === "incoming" ? "text-success" : "text-foreground"
                      }`}
                    >
                      {transaction.type === "incoming" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <Badge variant={transaction.status === "completed" ? "success" : "warning"}>
                      {transaction.status === "completed" ? "Completado" : "Pendiente"}
                    </Badge>
                  </div>
                </div>
              ))}
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
              <h3 className="font-medium text-foreground mb-1">Tu cuenta está protegida</h3>
              <p className="text-sm text-muted-foreground">
                Utilizamos encriptación de nivel bancario y autenticación multifactor para mantener
                tu dinero seguro.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
