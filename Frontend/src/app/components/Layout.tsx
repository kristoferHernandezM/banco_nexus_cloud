import { Outlet, useNavigate, useLocation } from "react-router";
import { useAuth } from "../lib/auth";
import {
  LayoutDashboard,
  ArrowLeftRight,
  History,
  User,
  Wallet,
  LogOut,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn, formatCurrency } from "../lib/utils";

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: ArrowLeftRight, label: "Transferir", path: "/transfer" },
    { icon: Wallet, label: "Mis Cuentas", path: "/accounts" },
    { icon: History, label: "Historial", path: "/transactions" },
    { icon: Shield, label: "Auditoría", path: "/audit" },
    { icon: User, label: "Perfil", path: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar Desktop */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border hidden lg:flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-sidebar-foreground">Banco Nexus</h1>
              <p className="text-xs text-sidebar-foreground/60">Cloud Banking</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
            <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-semibold text-sidebar-foreground">Banco Nexus</h1>
                  <p className="text-xs text-sidebar-foreground/60">Cloud Banking</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5 text-sidebar-foreground" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-sidebar-border">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Navbar */}
        <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-accent rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-lg font-medium text-foreground">
                  Bienvenido, {user?.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString("es-MX", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-sm text-muted-foreground">Saldo Disponible</p>
                <p className="text-xl font-semibold text-foreground">
                  {formatCurrency(user?.balance || 0)}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
