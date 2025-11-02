# 📊 Base de Datos FINANZAPP - Guía de Configuración

## 🎯 Resumen

Base de datos completa para el sistema de gestión de finanzas personales FINANZAPP, diseñada en PostgreSQL para Supabase con Row Level Security (RLS).

## 📋 Tablas Principales

### 1. **profiles** - Perfiles de Usuario

Almacena información adicional del usuario más allá de la autenticación.

```sql
- id (UUID) - Primary Key, referencia a auth.users
- email (TEXT) - Email del usuario
- first_name (TEXT) - Nombre
- last_name (TEXT) - Apellido
- full_name (TEXT) - Generado automáticamente
- avatar_url (TEXT) - URL del avatar
- monthly_budget (DECIMAL) - Presupuesto mensual general
- created_at, updated_at (TIMESTAMP)
```

### 2. **categories** - Categorías de Transacciones

Categorías predefinidas del sistema y personalizadas por usuario.

```sql
- id (UUID) - Primary Key
- user_id (UUID) - NULL para categorías del sistema
- name (TEXT) - Nombre de la categoría
- type (TEXT) - 'ingreso' o 'gasto'
- color (TEXT) - Color hexadecimal
- icon (TEXT) - Emoji o nombre de ícono
- is_system (BOOLEAN) - true para categorías predefinidas
- created_at, updated_at (TIMESTAMP)
```

**Categorías Predefinidas:**

- **Gastos:** Alimentación, Transporte, Educación, Entretenimiento, Salud, Vivienda, Servicios, Ropa, Otros
- **Ingresos:** Salario, Mesada, Beca, Freelance, Venta, Regalo, Otros

### 3. **transactions** - Transacciones

Registro de todos los ingresos y gastos.

```sql
- id (UUID) - Primary Key
- user_id (UUID) - Dueño de la transacción
- category_id (UUID) - Categoría asociada
- type (TEXT) - 'ingreso' o 'gasto'
- amount (DECIMAL) - Monto de la transacción
- description (TEXT) - Descripción opcional
- transaction_date (DATE) - Fecha de la transacción
- created_at, updated_at (TIMESTAMP)
```

### 4. **budgets** - Presupuestos Mensuales

Presupuestos configurados por categoría y mes.

```sql
- id (UUID) - Primary Key
- user_id (UUID) - Dueño del presupuesto
- category_id (UUID) - Categoría del presupuesto
- amount (DECIMAL) - Monto del presupuesto
- month (INTEGER) - Mes (1-12)
- year (INTEGER) - Año
- alert_threshold (DECIMAL) - % para disparar alerta (ej: 80)
- created_at, updated_at (TIMESTAMP)
```

### 5. **alerts** - Alertas de Presupuesto

Alertas generadas automáticamente cuando se excede el presupuesto.

```sql
- id (UUID) - Primary Key
- user_id (UUID) - Destinatario de la alerta
- budget_id (UUID) - Presupuesto relacionado
- category_id (UUID) - Categoría relacionada
- message (TEXT) - Mensaje de la alerta
- severity (TEXT) - 'info', 'warning', 'critical'
- is_read (BOOLEAN) - Estado de lectura
- triggered_at (TIMESTAMP) - Cuándo se generó
- read_at (TIMESTAMP) - Cuándo se leyó
```

## 🔒 Seguridad (Row Level Security)

Todas las tablas tienen RLS habilitado con políticas que garantizan:

✅ **Los usuarios solo pueden:**

- Ver sus propios datos
- Crear datos para sí mismos
- Editar sus propios datos
- Eliminar sus propios datos
- Ver categorías del sistema (pero no editarlas)

## 🔧 Funciones Automáticas

### 1. **handle_new_user()** - Trigger

Crea automáticamente un perfil cuando un usuario se registra.

### 2. **update_updated_at_column()** - Trigger

Actualiza el campo `updated_at` automáticamente en cada edición.

### 3. **check_budget_alert()** - Trigger

Genera alertas automáticamente cuando:

- Se registra un gasto
- El gasto excede el umbral del presupuesto configurado
- Severidad: `info` (>80%), `warning` (>90%), `critical` (>100%)

### 4. **get_user_balance(uid)** - Función

Obtiene el balance total del usuario.

```sql
SELECT * FROM get_user_balance('user-uuid-here');
-- Retorna: total_ingresos, total_gastos, balance
```

### 5. **get_monthly_expenses_by_category(uid, month, year)** - Función

Obtiene gastos del mes agrupados por categoría.

```sql
SELECT * FROM get_monthly_expenses_by_category('user-uuid', 11, 2025);
-- Retorna: category_id, category_name, color, icon, total_amount, transaction_count
```

## 📊 Vistas Útiles

### **user_balance**

Balance total de cada usuario.

### **monthly_expenses_by_category**

Gastos agrupados por categoría, mes y año.

### **budget_vs_actual**

Comparación entre presupuesto y gasto real.

## 🚀 Instalación en Supabase

### Paso 1: Copiar el Script

1. Abre el archivo `database/schema.sql`
2. Copia todo el contenido

### Paso 2: Ejecutar en Supabase

1. Ve a tu proyecto en https://supabase.com/dashboard
2. Navega a **SQL Editor**
3. Pega el script completo
4. Click en **Run** o presiona `Ctrl/Cmd + Enter`

### Paso 3: Verificar

1. Ve a **Table Editor**
2. Deberías ver las tablas:
   - profiles
   - categories (con 16 categorías predefinidas)
   - transactions
   - budgets
   - alerts

## 📝 Ejemplos de Uso

### Crear una Transacción

```typescript
const { data, error } = await supabase.from("transactions").insert({
  user_id: user.id,
  category_id: "category-uuid",
  type: "gasto",
  amount: 50.0,
  description: "Almuerzo en la universidad",
  transaction_date: "2025-11-01",
});
```

### Obtener Transacciones del Mes

```typescript
const { data, error } = await supabase
  .from("transactions")
  .select(
    `
    *,
    category:categories(*)
  `
  )
  .eq("user_id", user.id)
  .gte("transaction_date", "2025-11-01")
  .lte("transaction_date", "2025-11-30")
  .order("transaction_date", { ascending: false });
```

### Crear un Presupuesto

```typescript
const { data, error } = await supabase.from("budgets").insert({
  user_id: user.id,
  category_id: "alimentacion-uuid",
  amount: 300.0,
  month: 11,
  year: 2025,
  alert_threshold: 80,
});
```

### Obtener Balance

```typescript
const { data, error } = await supabase.rpc("get_user_balance", {
  uid: user.id,
});
// data = { total_ingresos, total_gastos, balance }
```

### Obtener Gastos por Categoría

```typescript
const { data, error } = await supabase.rpc("get_monthly_expenses_by_category", {
  uid: user.id,
  target_month: 11,
  target_year: 2025,
});
```

### Obtener Alertas No Leídas

```typescript
const { data, error } = await supabase
  .from("alerts")
  .select(
    `
    *,
    category:categories(*),
    budget:budgets(*)
  `
  )
  .eq("user_id", user.id)
  .eq("is_read", false)
  .order("triggered_at", { ascending: false });
```

## 🎨 Colores de Categorías

Las categorías vienen con colores predefinidos:

- Gastos: Tonos naranjas/coral (#EF8E7D - #2F6E69)
- Ingresos: Tonos verdes (#27AE60 - #E5FFF8)

## ⚠️ Notas Importantes

1. **RLS Activado:** Todas las tablas están protegidas. No puedes desactivar RLS sin romper la seguridad.

2. **Categorías del Sistema:** No pueden ser editadas por usuarios. Son compartidas globalmente.

3. **Triggers Automáticos:**

   - Perfil se crea automáticamente al registrarse
   - Alertas se generan automáticamente al superar presupuesto
   - `updated_at` se actualiza automáticamente

4. **Cascadas:**
   - Si eliminas un usuario, se eliminan todos sus datos
   - Si eliminas una categoría, las transacciones mantienen el `category_id` en NULL

## 🔄 Actualizar updated_at manualmente

Si necesitas forzar una actualización:

```sql
UPDATE profiles SET updated_at = NOW() WHERE id = 'user-uuid';
```

## 📞 Soporte

Si encuentras algún problema con el esquema, verifica:

1. Que todas las extensiones necesarias estén habilitadas
2. Que el usuario tenga permisos adecuados
3. Que las políticas RLS estén activas

---

**Versión:** 1.0  
**Última Actualización:** Noviembre 2025  
**Compatible con:** Supabase PostgreSQL 15+
