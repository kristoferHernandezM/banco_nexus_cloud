import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { Transactions } from "./pages/Transactions";
import { Accounts } from "./pages/Accounts";
import { Transfer } from "./pages/Transfer";
import { Profile } from "./pages/Profile";
import { Audit } from "./pages/Audit";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/",
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      { index: true, Component: Dashboard },
      { path: "transactions", Component: Transactions },
      { path: "accounts", Component: Accounts },
      { path: "transfer", Component: Transfer },
      { path: "profile", Component: Profile },
      { path: "audit", Component: Audit },
    ],
  },
]);
