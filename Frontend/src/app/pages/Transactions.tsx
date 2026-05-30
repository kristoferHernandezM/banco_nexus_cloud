import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Search,
} from "lucide-react";
import { formatCurrency, formatDateTime } from "../lib/utils";

interface Transaction {
  id: string;
  type: "incoming" | "outgoing";
  fromAccount: string;
  toAccount: string;
  amount: number;
  concept: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
}

export function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "incoming" | "outgoing">("all");

  useEffect(() => {
    const allTransactions = JSON.parse(localStorage.getItem("nexus_transactions") || "[]");
    const userTransactions = allTransactions
      .filter(
        (t: any) =>
          t.fromAccount === user?.accountNumber || t.toAccount === user?.accountNumber
      )
      .map((t: any) => ({
        ...t,
        type: t.toAccount === user?.accountNumber ? "incoming" : "outgoing",
      }))
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    setTransactions(userTransactions);
    setFilteredTransactions(userTransactions);
  }, [user]);

  useEffect(() => {
    let filtered = transactions;

    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.fromAccount.includes(searchTerm) ||
          t.toAccount.includes(searchTerm)
      );
    }

    setFilteredTransactions(filtered);
  }, [searchTerm, filterType, transactions]);

  const totalIncoming = transactions
    .filter((t) => t.type === "incoming" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutgoing = transactions
    .filter((t) => t.type === "outgoing" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Historial de Movimientos</h1>
        <p className="text-muted-foreground">Todas tus transacciones en un solo lugar</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Ingresos</p>
                <p className="text-2xl font-semibold text-success">
                  +{formatCurrency(totalIncoming)}
                </p>
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
                <p className="text-sm text-muted-foreground mb-1">Total Egresos</p>
                <p className="text-2xl font-semibold text-destructive">
                  -{formatCurrency(totalOutgoing)}
                </p>
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
                <p className="text-2xl font-semibold text-foreground">{transactions.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Filter className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="py-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar por concepto o cuenta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "primary" : "outline"}
                onClick={() => setFilterType("all")}
              >
                Todos
              </Button>
              <Button
                variant={filterType === "incoming" ? "success" : "outline"}
                onClick={() => setFilterType("incoming")}
              >
                Ingresos
              </Button>
              <Button
                variant={filterType === "outgoing" ? "destructive" : "outline"}
                onClick={() => setFilterType("outgoing")}
              >
                Egresos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transacciones</CardTitle>
              <CardDescription>
                {filteredTransactions.length} transacciones encontradas
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Fecha
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Tipo
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Cuenta Origen
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Cuenta Destino
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Concepto
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Monto
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <p className="text-muted-foreground">No se encontraron transacciones</p>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-border hover:bg-accent transition-colors"
                    >
                      <td className="py-4 px-4">
                        <p className="text-sm text-foreground">
                          {formatDateTime(transaction.timestamp)}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {transaction.type === "incoming" ? (
                            <>
                              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                                <ArrowDownRight className="w-4 h-4 text-success" />
                              </div>
                              <span className="text-sm text-success font-medium">Ingreso</span>
                            </>
                          ) : (
                            <>
                              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                                <ArrowUpRight className="w-4 h-4 text-destructive" />
                              </div>
                              <span className="text-sm text-destructive font-medium">Egreso</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm font-mono text-foreground">
                          {transaction.fromAccount}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm font-mono text-foreground">
                          {transaction.toAccount}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-foreground">{transaction.concept}</p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p
                          className={`text-sm font-semibold ${
                            transaction.type === "incoming" ? "text-success" : "text-foreground"
                          }`}
                        >
                          {transaction.type === "incoming" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge
                          variant={
                            transaction.status === "completed"
                              ? "success"
                              : transaction.status === "pending"
                              ? "warning"
                              : "error"
                          }
                        >
                          {transaction.status === "completed"
                            ? "Completado"
                            : transaction.status === "pending"
                            ? "Pendiente"
                            : "Fallido"}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
