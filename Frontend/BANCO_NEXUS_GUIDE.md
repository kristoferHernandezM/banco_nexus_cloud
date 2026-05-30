# 🏦 Banco Nexus Cloud - Guía de Usuario

## Aplicación Bancaria Digital Moderna

Una aplicación bancaria completa con diseño profesional inspirado en BBVA, Nu Bank, Mercado Pago y Revolut.

## 🎨 Características de Diseño

- **Colores principales**: Azul oscuro (#0F172A), Azul brillante (#2563EB)
- **Diseño**: Profesional, moderno y minimalista
- **Tarjetas**: Bordes redondeados con sombras suaves
- **Efectos**: Glassmorphism ligero
- **Responsive**: Optimizado para escritorio y móvil

## 📱 Pantallas Implementadas

### 1. Login
- Autenticación segura
- Validación de credenciales
- Registro de auditoría automático

### 2. Registro de Cliente
- Formulario de registro completo
- Generación automática de cuenta bancaria de 10 dígitos
- Saldo inicial de bienvenida: $50,000 MXN

### 3. Dashboard Principal
- Saludo personalizado
- Tarjeta destacada con saldo disponible
- Número de cuenta bancaria
- Accesos rápidos a todas las funciones
- Resumen de movimientos recientes
- Estadísticas de ingresos y egresos

### 4. Historial de Movimientos
- Tabla completa de transacciones
- Filtros por tipo (ingresos/egresos)
- Búsqueda por concepto o cuenta
- Estadísticas totales
- Exportación de datos

### 5. Gestión de Cuentas Destino
- Lista de cuentas registradas
- Agregar nuevas cuentas (validación de 10 dígitos)
- Editar y eliminar cuentas
- Alias personalizados

### 6. Transferencias Bancarias
- Selección de cuenta destino
- Validación de saldo disponible
- Concepto de transferencia
- Resumen previo a confirmación
- Confirmación visual de éxito
- Actualización automática de saldo

### 7. Perfil de Usuario
- Información personal
- Número de cuenta único
- Cambio de contraseña
- Estadísticas de cuenta
- Configuración de seguridad

### 8. Auditoría y Notificaciones
- Línea de tiempo de eventos
- Login exitoso/fallido
- Transferencias realizadas
- Cambios de contraseña
- Estados con colores distintivos
- Estadísticas de eventos

## 🔐 Cuentas de Demostración

Puedes iniciar sesión con estas cuentas pre-configuradas:

**Cuenta 1:**
- Email: `ana@demo.com`
- Contraseña: `demo123`
- Cuenta: 1234567890
- Saldo: $75,000 MXN

**Cuenta 2:**
- Email: `carlos@demo.com`
- Contraseña: `demo123`
- Cuenta: 0987654321
- Saldo: $120,000 MXN

## 🎯 Funcionalidades

### Autenticación
- Login con validación
- Registro de nuevos usuarios
- Cierre de sesión
- Protección de rutas

### Transferencias
- Entre cuentas registradas
- Validación de saldo
- Confirmación en dos pasos
- Registro de auditoría

### Gestión de Cuentas
- Guardar cuentas favoritas
- Editar información
- Eliminar cuentas
- Validación de formato

### Seguridad
- Cambio de contraseña
- Registro de eventos
- Monitoreo de actividad
- Notificaciones en tiempo real

## 🎨 Design System

### Componentes Reutilizables

- **Button**: 6 variantes (primary, secondary, outline, ghost, destructive, success)
- **Input**: Con labels y validación de errores
- **Card**: Con soporte para hover y glassmorphism
- **Badge**: 5 variantes de estado
- **Modal**: Para confirmaciones y formularios
- **Toast Notifications**: Feedback inmediato con Sonner

### Colores del Sistema

```css
--primary: #2563EB (Azul brillante)
--background: #f8fafc (Gris muy claro)
--foreground: #0f172a (Azul oscuro)
--success: #10b981 (Verde)
--warning: #f59e0b (Naranja)
--destructive: #ef4444 (Rojo)
```

### Tipografía

- Fuente principal: Inter
- Pesos: 300, 400, 500, 600, 700
- Escala tipográfica responsive

## 🚀 Navegación

- **/** - Dashboard principal
- **/transfer** - Realizar transferencias
- **/accounts** - Gestión de cuentas
- **/transactions** - Historial completo
- **/profile** - Perfil de usuario
- **/audit** - Auditoría y eventos
- **/login** - Inicio de sesión
- **/register** - Registro de cliente

## 💾 Almacenamiento

Todos los datos se guardan en localStorage:

- `nexus_user` - Usuario actual
- `nexus_users` - Todos los usuarios registrados
- `nexus_transactions` - Historial de transacciones
- `nexus_saved_accounts` - Cuentas guardadas
- `nexus_audit` - Log de auditoría

## 🎨 Experiencia de Usuario

### Sidebar
- Navegación principal en escritorio
- Menú hamburguesa en móvil
- Iconografía consistente con Lucide React

### Navbar
- Saludo personalizado
- Fecha actual
- Saldo disponible (escritorio)

### Feedback Visual
- Toast notifications con Sonner
- Confirmaciones modales
- Estados de carga
- Validaciones en tiempo real
- Colores distintivos por estado

## 🔒 Seguridad

- Validación de contraseñas (mínimo 6 caracteres)
- Registro de todos los eventos importantes
- Confirmación en transferencias
- Validación de saldo disponible
- Protección de rutas privadas

## 📊 Características Técnicas

- React 18.3.1
- React Router 7 (Data Mode)
- Tailwind CSS 4
- TypeScript
- Lucide React (iconos)
- Sonner (notificaciones)
- LocalStorage (persistencia)

## 🎯 Próximas Funcionalidades

- Autenticación de dos factores (2FA)
- Pagos con QR
- Gestión de tarjetas
- Inversiones
- Notificaciones push
- Exportación de estados de cuenta
- Análisis de gastos
- Metas de ahorro
