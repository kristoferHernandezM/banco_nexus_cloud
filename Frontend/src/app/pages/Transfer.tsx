import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { ArrowLeftRight, CheckCircle2, AlertCircle, Wallet } from "lucide-react";
import { formatCurrency } from "../lib/utils";
import { toast } from "sonner";

interface SavedAccount {
  id: string;
  alias: string;
  accountNumber: string;
  bankName: string;
}

export function Transfer() {
  const { user, updateBalance } = useAuth();
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<SavedAccount | null>(null);
  const [amount, setAmount] = useState("");
  const [concept, setConcept] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const accounts = JSON.parse(localStorage.getItem("nexus_saved_accounts") || "[]");
    setSavedAccounts(accounts);
  }, []);

  const handleSelectAccount = (account: SavedAccount) => {
    setSelectedAccount(account);
  };

  const handleReview = () => {
    if (!selectedAccount) {
      toast.error("Selecciona una cuenta de destino");
      return;
    }

    const transferAmount = parseFloat(amount);

    if (isNaN(transferAmount) || transferAmount <= 0) {
      toast.error("Ingresa un monto válido");
      return;
    }

    if (transferAmount > (user?.balance || 0)) {
      toast.error("Saldo insuficiente");
      return;
    }

    if (!concept.trim()) {
      toast.error("Ingresa un concepto");
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const transferAmount = parseFloat(amount);
    const newBalance = (user?.balance || 0) - transferAmount;

    const transaction = {
      id: Date.now().toString(),
      fromAccount: user?.accountNumber,
      toAccount: selectedAccount?.accountNumber,
      amount: transferAmount,
      concept,
      timestamp: new Date().toISOString(),
      status: "completed",
    };

    const transactions = JSON.parse(localStorage.getItem("nexus_transactions") || "[]");
    transactions.unshift(transaction);
    localStorage.setItem("nexus_transactions", JSON.stringify(transactions));

    const auditLog = JSON.parse(localStorage.getItem("nexus_audit") || "[]");
    auditLog.unshift({
      id: Date.now().toString(),
      type: "transfer",
      description: `Transferencia de ${formatCurrency(transferAmount)} a ${selectedAccount?.alias}`,
      timestamp: new Date().toISOString(),
      status: "success",
    });
    localStorage.setItem("nexus_audit", JSON.stringify(auditLog));

    updateBalance(newBalance);

    toast.success("Transferencia realizada exitosamente");

    setAmount("");
    setConcept("");
    setSelectedAccount(null);
    setShowConfirmation(false);
    setLoading(false);
  };

  const transferAmount = parseFloat(amount) || 0;
  const newBalance = (user?.balance || 0) - transferAmount;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Transferir Dinero</h1>
        <p className="text-muted-foreground">Envía dinero a cuentas registradas de forma segura</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transfer Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Select Account */}
          <Card>
            <CardHeader>
              <CardTitle>Seleccionar Cuenta Destino</CardTitle>
              <CardDescription>Elige una de tus cuentas guardadas</CardDescription>
            </CardHeader>
            <CardContent>
              {savedAccounts.length === 0 ? (
                <div className="text-center py-8">
                  <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground mb-4">
                    No tienes cuentas guardadas
                  </p>
                  <Button variant="outline" onClick={() => window.location.href = "/accounts"}>
                    Agregar Cuenta
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {savedAccounts.map((account) => (
                    <button
                      key={account.id}
                      onClick={() => handleSelectAccount(account)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedAccount?.id === account.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Wallet className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground mb-1">{account.alias}</h4>
                          <p className="text-xs text-muted-foreground mb-1">{account.bankName}</p>
                          <p className="text-xs font-mono text-foreground">
                            {account.accountNumber}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Amount and Concept */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Transferencia</CardTitle>
              <CardDescription>Ingresa el monto y concepto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  label="Monto a Transferir"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
                {transferAmount > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {transferAmount > (user?.balance || 0) ? (
                      <span className="text-destructive flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        Saldo insuficiente
                      </span>
                    ) : (
                      <span className="text-success flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Saldo suficiente disponible
                      </span>
                    )}
                  </p>
                )}
              </div>

              <div>
                <Input
                  label="Concepto / Mensaje"
                  placeholder="Ej: Pago de servicios"
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {concept.length}/100 caracteres
                </p>
              </div>

              <Button
                onClick={handleReview}
                className="w-full"
                disabled={!selectedAccount || transferAmount <= 0 || !concept.trim()}
              >
                <ArrowLeftRight className="w-5 h-5" />
                Revisar Transferencia
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
              <CardDescription>Verifica los detalles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Cuenta Origen</p>
                <p className="font-mono text-sm text-foreground">{user?.accountNumber}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Cuenta Destino</p>
                {selectedAccount ? (
                  <>
                    <p className="font-medium text-foreground">{selectedAccount.alias}</p>
                    <p className="font-mono text-sm text-muted-foreground">
                      {selectedAccount.accountNumber}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">No seleccionada</p>
                )}
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-1">Monto</p>
                <p className="text-2xl font-semibold text-foreground">
                  {formatCurrency(transferAmount)}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Saldo Actual</p>
                <p className="text-lg font-medium text-foreground">
                  {formatCurrency(user?.balance || 0)}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Saldo Después</p>
                <p
                  className={`text-lg font-medium ${
                    newBalance < 0 ? "text-destructive" : "text-success"
                  }`}
                >
                  {formatCurrency(newBalance)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => !loading && setShowConfirmation(false)}
          />

          <Card className="relative z-10 w-full max-w-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <ArrowLeftRight className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-center">Confirmar Transferencia</CardTitle>
              <CardDescription className="text-center">
                Revisa los detalles antes de confirmar
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="bg-accent rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Cuenta Origen</span>
                  <span className="text-sm font-mono text-foreground">{user?.accountNumber}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Cuenta Destino</span>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{selectedAccount?.alias}</p>
                    <p className="text-xs font-mono text-muted-foreground">
                      {selectedAccount?.accountNumber}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between pt-3 border-t border-border">
                  <span className="text-sm text-muted-foreground">Monto</span>
                  <span className="text-lg font-semibold text-foreground">
                    {formatCurrency(transferAmount)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Concepto</span>
                  <span className="text-sm text-foreground">{concept}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button onClick={handleConfirm} className="flex-1" disabled={loading}>
                  {loading ? (
                    "Procesando..."
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Confirmar
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
