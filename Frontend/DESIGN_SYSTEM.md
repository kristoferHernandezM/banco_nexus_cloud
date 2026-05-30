# 🎨 Banco Nexus Cloud - Design System

## Paleta de Colores

### Colores Primarios

```css
/* Azul Brillante - Color principal de la marca */
--primary: #2563EB
--primary-foreground: #ffffff

/* Azul Oscuro - Color de sidebar y textos principales */
--foreground: #0F172A
```

### Colores de Fondo

```css
--background: #f8fafc      /* Fondo principal de la aplicación */
--card: #ffffff            /* Fondo de tarjetas */
--secondary: #f1f5f9       /* Fondos secundarios */
--accent: #dbeafe          /* Acentos y highlights */
--muted: #f1f5f9          /* Elementos apagados */
```

### Colores de Estado

```css
--success: #10b981         /* Verde - Operaciones exitosas */
--warning: #f59e0b         /* Naranja - Advertencias */
--destructive: #ef4444     /* Rojo - Errores y acciones destructivas */
```

### Colores de Texto

```css
--foreground: #0f172a           /* Texto principal */
--muted-foreground: #64748b     /* Texto secundario */
```

### Bordes y Separadores

```css
--border: #e2e8f0          /* Bordes estándar */
--input: #e2e8f0           /* Bordes de inputs */
```

## Tipografía

### Fuente Principal

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Pesos de Fuente

- **Light (300)**: Textos muy ligeros, poco usado
- **Regular (400)**: Texto de cuerpo, párrafos
- **Medium (500)**: Labels, botones, subtítulos
- **Semibold (600)**: Títulos de tarjetas
- **Bold (700)**: Títulos principales, énfasis

### Escala de Tamaños

```css
/* Tailwind CSS clases aplicables */
text-xs     /* 12px - Metadatos, badges pequeños */
text-sm     /* 14px - Texto secundario, descripciones */
text-base   /* 16px - Texto principal, inputs */
text-lg     /* 18px - Subtítulos */
text-xl     /* 20px - Títulos de sección */
text-2xl    /* 24px - Títulos de página */
text-3xl    /* 30px - Títulos hero */
text-4xl    /* 36px - Títulos grandes */
```

## Espaciado

### Sistema de Spacing

Basado en escala de 4px:

```
1 = 4px
2 = 8px
3 = 12px
4 = 16px
5 = 20px
6 = 24px
8 = 32px
10 = 40px
12 = 48px
16 = 64px
```

### Aplicación Común

- **Padding de Cards**: `p-6` (24px)
- **Gap entre Cards**: `gap-4` o `gap-6`
- **Espacio entre secciones**: `space-y-6`
- **Padding de botones**: `px-5 py-3`

## Bordes Redondeados

```css
--radius: 0.75rem          /* 12px - Radio base */
```

### Clases de Tailwind

```css
rounded-lg   /* 8px - Elementos pequeños */
rounded-xl   /* 12px - Cards, botones, inputs */
rounded-2xl  /* 16px - Cards principales, modales */
rounded-full /* Círculos completos - avatares, badges */
```

## Sombras

### Cards

```css
shadow-sm    /* Sombra suave para cards */
shadow-md    /* Sombra media en hover */
shadow-lg    /* Sombra grande para modales */
```

### Implementación

```jsx
className="shadow-sm hover:shadow-md transition-shadow"
```

## Componentes

### Button

**Variantes disponibles:**

1. **Primary** (Default)
   - Color: Azul brillante (#2563EB)
   - Uso: Acciones principales, CTAs
   
2. **Secondary**
   - Color: Gris claro
   - Uso: Acciones secundarias

3. **Outline**
   - Border + fondo transparente
   - Uso: Acciones alternativas, filtros

4. **Ghost**
   - Sin background, solo hover
   - Uso: Navegación, acciones terciarias

5. **Destructive**
   - Color: Rojo (#ef4444)
   - Uso: Eliminar, cancelar

6. **Success**
   - Color: Verde (#10b981)
   - Uso: Confirmaciones, completar

**Tamaños:**
- `sm`: 36px altura
- `md`: 44px altura (default)
- `lg`: 48px altura

**Ejemplo:**

```jsx
<Button variant="primary" size="md">
  <Icon className="w-5 h-5" />
  Transferir
</Button>
```

### Card

**Props:**
- `hover`: Añade efecto hover (escala + sombra)
- `glass`: Efecto glassmorphism
- `className`: Clases adicionales

**Sub-componentes:**
- `CardHeader`
- `CardTitle`
- `CardDescription`
- `CardContent`

**Ejemplo:**

```jsx
<Card hover>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descripción</CardDescription>
  </CardHeader>
  <CardContent>
    Contenido
  </CardContent>
</Card>
```

### Input

**Props:**
- `label`: Texto del label
- `error`: Mensaje de error
- Todos los props nativos de input

**Ejemplo:**

```jsx
<Input
  label="Correo Electrónico"
  type="email"
  placeholder="tu@email.com"
  error={errors.email}
/>
```

### Badge

**Variantes:**
- `default`: Gris
- `success`: Verde
- `warning`: Naranja
- `error`: Rojo
- `info`: Azul

**Ejemplo:**

```jsx
<Badge variant="success">Completado</Badge>
```

## Iconografía

### Librería: Lucide React

**Tamaños comunes:**
- `w-4 h-4`: 16px - Icons en badges, textos
- `w-5 h-5`: 20px - Icons en botones
- `w-6 h-6`: 24px - Icons en cards
- `w-8 h-8`: 32px - Icons destacados
- `w-12 h-12`: 48px - Icons de estado vacío

**Icons principales:**
- `Shield`: Seguridad, protección
- `ArrowLeftRight`: Transferencias
- `Wallet`: Cuentas, dinero
- `User`: Perfil, usuario
- `History`: Historial, tiempo
- `Lock`: Contraseña, privacidad
- `CheckCircle2`: Éxito, completado
- `AlertCircle`: Error, advertencia
- `X`: Cerrar, cancelar

## Patrones de Diseño

### Cards con Glassmorphism

```jsx
<Card glass className="bg-card/80">
  ...
</Card>
```

### Gradientes Heroicos

```jsx
<div className="bg-gradient-to-br from-[#0F172A] via-[#1e293b] to-[#2563EB]">
  ...
</div>
```

### Grid de Patrones

```jsx
<div className="bg-[url('data:image/svg+xml;base64,...')] opacity-40" />
```

### Hover States

```jsx
className="transition-all hover:scale-[1.01] hover:shadow-md"
```

## Layout

### Sidebar

- Ancho: `w-64` (256px)
- Background: `#0F172A`
- Fixed en desktop, overlay en móvil

### Contenido Principal

- Padding: `p-6`
- Max-width: Ninguno (fluido)
- Background: `#f8fafc`

### Navbar

- Altura: Auto (padding vertical)
- Sticky: `top-0`
- Background: `bg-card/80 backdrop-blur-lg`

## Estados

### Loading

```jsx
<Button disabled>Procesando...</Button>
```

### Empty State

```jsx
<div className="text-center py-12">
  <Icon className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
  <p className="text-muted-foreground">No hay datos</p>
</div>
```

### Error State

```jsx
<div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
  <AlertCircle className="w-5 h-5 text-destructive" />
  <p className="text-destructive">Mensaje de error</p>
</div>
```

## Notificaciones (Toast)

**Usando Sonner:**

```jsx
import { toast } from "sonner";

// Success
toast.success("Operación exitosa");

// Error
toast.error("Algo salió mal");

// Info
toast.info("Información importante");

// Warning
toast.warning("Advertencia");
```

## Responsive

### Breakpoints

```css
sm: 640px   /* Tablet pequeña */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Desktop grande */
```

### Patrón común

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  ...
</div>
```

### Ocultar/Mostrar

```jsx
<div className="hidden lg:flex">Desktop only</div>
<div className="lg:hidden">Mobile only</div>
```

## Animaciones

### Transiciones

```jsx
className="transition-all duration-200"
className="transition-colors"
className="transition-transform hover:scale-105"
```

### Motion (Framer Motion)

Disponible pero no implementado aún en este diseño.

## Accesibilidad

### Contraste

- Todos los colores cumplen WCAG AA
- Ratio mínimo de contraste: 4.5:1

### Focus States

```css
focus:outline-none focus:ring-2 focus:ring-ring
```

### Labels

Todos los inputs tienen labels asociados.

### Alt Text

Todas las imágenes requieren alt descriptivo.

## Mejores Prácticas

1. **Usar variantes de componentes** en lugar de crear estilos custom
2. **Mantener espaciado consistente** (múltiplos de 4px)
3. **Limitar paleta de colores** a los definidos
4. **Aplicar hover states** a elementos interactivos
5. **Incluir feedback visual** para todas las acciones
6. **Responsive first**: diseñar mobile primero
7. **Accesibilidad**: siempre incluir labels y alt text
8. **Consistencia**: usar mismo patrón para casos similares

## Recursos

- **Iconos**: [Lucide React](https://lucide.dev/)
- **Fuentes**: [Google Fonts - Inter](https://fonts.google.com/specimen/Inter)
- **Tailwind CSS**: [Documentación oficial](https://tailwindcss.com/)
- **Inspiración**: BBVA, Nu Bank, Mercado Pago, Revolut
