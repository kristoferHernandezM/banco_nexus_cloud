import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Wallet, Plus, Trash2, Edit2, X } from "lucide-react";
import { toast } from "sonner";

interface SavedAccount {
  id: string;
  alias: string;
  accountNumber: string;
  bankName: string;
  createdAt: string;
}

export function Accounts() {
  const [accounts, setAccounts] = useState<SavedAccount[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    alias: "",
    accountNumber: "",
    bankName: "",
  });

  useEffect(() => {
    const savedAccounts = JSON.parse(localStorage.getItem("nexus_saved_accounts") || "[]");
    setAccounts(savedAccounts);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.accountNumber.length !== 10) {
      toast.error("El número de cuenta debe tener 10 dígitos");
      return;
    }

    const newAccounts = [...accounts];

    if (editingId) {
      const index = accounts.findIndex((a) => a.id === editingId);
      newAccounts[index] = {
        ...newAccounts[index],
        ...formData,
      };
      toast.success("Cuenta actualizada exitosamente");
    } else {
      const newAccount: SavedAccount = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
      };
      newAccounts.push(newAccount);
      toast.success("Cuenta agregada exitosamente");
    }

    localStorage.setItem("nexus_saved_accounts", JSON.stringify(newAccounts));
    setAccounts(newAccounts);
    setShowModal(false);
    setEditingId(null);
    setFormData({ alias: "", accountNumber: "", bankName: "" });
  };

  const handleDelete = (id: string) => {
    const newAccounts = accounts.filter((a) => a.id !== id);
    localStorage.setItem("nexus_saved_accounts", JSON.stringify(newAccounts));
    setAccounts(newAccounts);
    toast.success("Cuenta eliminada");
  };

  const handleEdit = (account: SavedAccount) => {
    setEditingId(account.id);
    setFormData({
      alias: account.alias,
      accountNumber: account.accountNumber,
      bankName: account.bankName,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ alias: "", accountNumber: "", bankName: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Mis Cuentas Registradas</h1>
          <p className="text-muted-foreground">
            Guarda cuentas frecuentes para transferir más rápido
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-5 h-5" />
          Agregar Cuenta
        </Button>
      </div>

      {accounts.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium text-foreground mb-2">
              No tienes cuentas registradas
            </h3>
            <p className="text-muted-foreground mb-6">
              Agrega cuentas de destino para realizar transferencias más rápido
            </p>
            <Button onClick={() => setShowModal(true)}>
              <Plus className="w-5 h-5" />
              Agregar Primera Cuenta
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <Card key={account.id} hover>
              <CardContent className="py-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(account)}
                      className="p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-1">{account.alias}</h3>
                <p className="text-sm text-muted-foreground mb-4">{account.bankName}</p>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Número de Cuenta</p>
                    <p className="text-sm font-mono text-foreground">{account.accountNumber}</p>
                  </div>

                  <Badge variant="info">Verificada</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={handleCloseModal} />

          <Card className="relative z-10 w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {editingId ? "Editar Cuenta" : "Agregar Nueva Cuenta"}
                  </CardTitle>
                  <CardDescription>
                    {editingId
                      ? "Actualiza la información de la cuenta"
                      : "Registra una cuenta de destino frecuente"}
                  </CardDescription>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Alias"
                  placeholder="Ej: Cuenta de Ahorros"
                  value={formData.alias}
                  onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                  required
                />

                <Input
                  label="Número de Cuenta"
                  placeholder="10 dígitos"
                  type="text"
                  maxLength={10}
                  value={formData.accountNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, accountNumber: e.target.value.replace(/\D/g, "") })
                  }
                  required
                />

                <Input
                  label="Banco"
                  placeholder="Ej: Banco Nexus Cloud"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  required
                />

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingId ? "Actualizar" : "Agregar"}
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
