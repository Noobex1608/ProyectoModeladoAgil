-- =====================================================
-- FINANZAPP - ESQUEMA DE BASE DE DATOS SUPABASE
-- Sistema de Gestión de Finanzas Personales
-- =====================================================

-- =====================================================
-- 1. TABLA: profiles
-- Almacena información adicional del usuario
-- =====================================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  full_name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  avatar_url TEXT,
  monthly_budget DECIMAL(12, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para profiles
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);

-- =====================================================
-- 2. TABLA: categories
-- Categorías predefinidas y personalizadas para transacciones
-- =====================================================
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('ingreso', 'gasto')),
  color TEXT DEFAULT '#A2D3C7',
  icon TEXT,
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name, type)
);

-- Índices para categories
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_type ON categories(type);
CREATE INDEX idx_categories_is_system ON categories(is_system);

-- =====================================================
-- 3. TABLA: transactions
-- Registro de todos los ingresos y gastos
-- =====================================================
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('ingreso', 'gasto')),
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  description TEXT,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para transactions
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date DESC);
CREATE INDEX idx_transactions_user_type ON transactions(user_id, type);

-- =====================================================
-- 4. TABLA: budgets
-- Presupuestos mensuales por categoría
-- =====================================================
CREATE TABLE budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL CHECK (year >= 2020),
  alert_threshold DECIMAL(5, 2) DEFAULT 80.00 CHECK (alert_threshold BETWEEN 0 AND 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, category_id, month, year)
);

-- Índices para budgets
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_category_id ON budgets(category_id);
CREATE INDEX idx_budgets_month_year ON budgets(month, year);
CREATE INDEX idx_budgets_user_month_year ON budgets(user_id, month, year);

-- =====================================================
-- 5. TABLA: alerts
-- Alertas de presupuesto excedido
-- =====================================================
CREATE TABLE alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  is_read BOOLEAN DEFAULT FALSE,
  triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Índices para alerts
CREATE INDEX idx_alerts_user_id ON alerts(user_id);
CREATE INDEX idx_alerts_is_read ON alerts(is_read);
CREATE INDEX idx_alerts_triggered_at ON alerts(triggered_at DESC);
CREATE INDEX idx_alerts_user_unread ON alerts(user_id, is_read) WHERE is_read = FALSE;

-- =====================================================
-- 6. FUNCIÓN: Actualizar updated_at automáticamente
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. FUNCIÓN: Crear perfil automáticamente al registrarse
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'Nuevo')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil al registrarse
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 8. FUNCIÓN: Verificar y crear alertas de presupuesto
-- =====================================================
CREATE OR REPLACE FUNCTION check_budget_alert()
RETURNS TRIGGER AS $$
DECLARE
  budget_record RECORD;
  total_spent DECIMAL(12, 2);
  percentage DECIMAL(5, 2);
  current_month INTEGER;
  current_year INTEGER;
BEGIN
  -- Solo verificar para gastos
  IF NEW.type != 'gasto' THEN
    RETURN NEW;
  END IF;

  -- Obtener mes y año actual
  current_month := EXTRACT(MONTH FROM NEW.transaction_date);
  current_year := EXTRACT(YEAR FROM NEW.transaction_date);

  -- Buscar presupuestos activos para esta categoría
  FOR budget_record IN
    SELECT * FROM budgets
    WHERE user_id = NEW.user_id
      AND category_id = NEW.category_id
      AND month = current_month
      AND year = current_year
  LOOP
    -- Calcular total gastado en este mes/año/categoría
    SELECT COALESCE(SUM(amount), 0) INTO total_spent
    FROM transactions
    WHERE user_id = NEW.user_id
      AND category_id = NEW.category_id
      AND type = 'gasto'
      AND EXTRACT(MONTH FROM transaction_date) = current_month
      AND EXTRACT(YEAR FROM transaction_date) = current_year;

    -- Calcular porcentaje
    percentage := (total_spent / budget_record.amount) * 100;

    -- Crear alerta si se excede el umbral
    IF percentage >= budget_record.alert_threshold THEN
      INSERT INTO alerts (user_id, budget_id, category_id, message, severity)
      VALUES (
        NEW.user_id,
        budget_record.id,
        NEW.category_id,
        format('Has gastado %.2f%% de tu presupuesto en %s para %s/%s',
               percentage,
               (SELECT name FROM categories WHERE id = NEW.category_id),
               current_month,
               current_year),
        CASE
          WHEN percentage >= 100 THEN 'critical'
          WHEN percentage >= 90 THEN 'warning'
          ELSE 'info'
        END
      )
      ON CONFLICT DO NOTHING;
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para verificar presupuesto al crear transacción
CREATE TRIGGER check_budget_on_transaction
  AFTER INSERT ON transactions
  FOR EACH ROW EXECUTE FUNCTION check_budget_alert();

-- =====================================================
-- 9. ROW LEVEL SECURITY (RLS) - POLÍTICAS DE SEGURIDAD
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- ===== POLÍTICAS PARA PROFILES =====
-- Los usuarios solo pueden ver y editar su propio perfil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ===== POLÍTICAS PARA CATEGORIES =====
-- Los usuarios pueden ver categorías del sistema y sus propias categorías
CREATE POLICY "Users can view system categories"
  ON categories FOR SELECT
  USING (is_system = TRUE OR user_id = auth.uid());

CREATE POLICY "Users can insert own categories"
  ON categories FOR INSERT
  WITH CHECK (user_id = auth.uid() AND is_system = FALSE);

CREATE POLICY "Users can update own categories"
  ON categories FOR UPDATE
  USING (user_id = auth.uid() AND is_system = FALSE);

CREATE POLICY "Users can delete own categories"
  ON categories FOR DELETE
  USING (user_id = auth.uid() AND is_system = FALSE);

-- ===== POLÍTICAS PARA TRANSACTIONS =====
-- Los usuarios solo pueden ver y gestionar sus propias transacciones
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);

-- ===== POLÍTICAS PARA BUDGETS =====
-- Los usuarios solo pueden ver y gestionar sus propios presupuestos
CREATE POLICY "Users can view own budgets"
  ON budgets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budgets"
  ON budgets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budgets"
  ON budgets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own budgets"
  ON budgets FOR DELETE
  USING (auth.uid() = user_id);

-- ===== POLÍTICAS PARA ALERTS =====
-- Los usuarios solo pueden ver y marcar sus propias alertas
CREATE POLICY "Users can view own alerts"
  ON alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts"
  ON alerts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own alerts"
  ON alerts FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 10. DATOS INICIALES - CATEGORÍAS DEL SISTEMA
-- =====================================================

-- Categorías de GASTOS predefinidas
INSERT INTO categories (user_id, name, type, color, icon, is_system) VALUES
  (NULL, 'Alimentación', 'gasto', '#EF8E7D', '🍔', TRUE),
  (NULL, 'Transporte', 'gasto', '#E2AA87', '🚌', TRUE),
  (NULL, 'Educación', 'gasto', '#A2D3C7', '📚', TRUE),
  (NULL, 'Entretenimiento', 'gasto', '#8BC9BD', '🎮', TRUE),
  (NULL, 'Salud', 'gasto', '#7FBDB6', '🏥', TRUE),
  (NULL, 'Vivienda', 'gasto', '#6BAAA3', '🏠', TRUE),
  (NULL, 'Servicios', 'gasto', '#579690', '💡', TRUE),
  (NULL, 'Ropa', 'gasto', '#43827C', '👕', TRUE),
  (NULL, 'Otros Gastos', 'gasto', '#2F6E69', '📦', TRUE);

-- Categorías de INGRESOS predefinidas
INSERT INTO categories (user_id, name, type, color, icon, is_system) VALUES
  (NULL, 'Salario', 'ingreso', '#27AE60', '💰', TRUE),
  (NULL, 'Mesada', 'ingreso', '#2ECC71', '💵', TRUE),
  (NULL, 'Beca', 'ingreso', '#52D98C', '🎓', TRUE),
  (NULL, 'Freelance', 'ingreso', '#76E5A7', '💻', TRUE),
  (NULL, 'Venta', 'ingreso', '#9BF2C2', '🛍️', TRUE),
  (NULL, 'Regalo', 'ingreso', '#C0FFDD', '🎁', TRUE),
  (NULL, 'Otros Ingresos', 'ingreso', '#E5FFF8', '📈', TRUE);

-- =====================================================
-- 11. VISTAS ÚTILES PARA ESTADÍSTICAS
-- =====================================================

-- Vista: Balance actual del usuario
CREATE OR REPLACE VIEW user_balance AS
SELECT
  user_id,
  COALESCE(SUM(CASE WHEN type = 'ingreso' THEN amount ELSE 0 END), 0) AS total_ingresos,
  COALESCE(SUM(CASE WHEN type = 'gasto' THEN amount ELSE 0 END), 0) AS total_gastos,
  COALESCE(SUM(CASE WHEN type = 'ingreso' THEN amount ELSE -amount END), 0) AS balance
FROM transactions
GROUP BY user_id;

-- Vista: Gastos por categoría (mes actual)
CREATE OR REPLACE VIEW monthly_expenses_by_category AS
SELECT
  t.user_id,
  t.category_id,
  c.name AS category_name,
  c.color AS category_color,
  c.icon AS category_icon,
  EXTRACT(MONTH FROM t.transaction_date) AS month,
  EXTRACT(YEAR FROM t.transaction_date) AS year,
  COUNT(*) AS transaction_count,
  SUM(t.amount) AS total_amount
FROM transactions t
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.type = 'gasto'
GROUP BY t.user_id, t.category_id, c.name, c.color, c.icon,
         EXTRACT(MONTH FROM t.transaction_date),
         EXTRACT(YEAR FROM t.transaction_date);

-- Vista: Resumen de presupuestos vs gastos reales
CREATE OR REPLACE VIEW budget_vs_actual AS
SELECT
  b.user_id,
  b.id AS budget_id,
  b.category_id,
  c.name AS category_name,
  b.month,
  b.year,
  b.amount AS budgeted_amount,
  COALESCE(SUM(t.amount), 0) AS actual_spent,
  b.amount - COALESCE(SUM(t.amount), 0) AS remaining,
  CASE
    WHEN b.amount > 0 THEN (COALESCE(SUM(t.amount), 0) / b.amount) * 100
    ELSE 0
  END AS percentage_used
FROM budgets b
LEFT JOIN categories c ON b.category_id = c.id
LEFT JOIN transactions t ON
  t.user_id = b.user_id AND
  t.category_id = b.category_id AND
  t.type = 'gasto' AND
  EXTRACT(MONTH FROM t.transaction_date) = b.month AND
  EXTRACT(YEAR FROM t.transaction_date) = b.year
GROUP BY b.id, b.user_id, b.category_id, c.name, b.month, b.year, b.amount;

-- =====================================================
-- 12. FUNCIONES ÚTILES PARA LA APLICACIÓN
-- =====================================================

-- Función: Obtener balance del usuario
CREATE OR REPLACE FUNCTION get_user_balance(uid UUID)
RETURNS TABLE (
  total_ingresos DECIMAL(12, 2),
  total_gastos DECIMAL(12, 2),
  balance DECIMAL(12, 2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(CASE WHEN type = 'ingreso' THEN amount ELSE 0 END), 0)::DECIMAL(12, 2),
    COALESCE(SUM(CASE WHEN type = 'gasto' THEN amount ELSE 0 END), 0)::DECIMAL(12, 2),
    COALESCE(SUM(CASE WHEN type = 'ingreso' THEN amount ELSE -amount END), 0)::DECIMAL(12, 2)
  FROM transactions
  WHERE user_id = uid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función: Obtener gastos del mes actual por categoría
CREATE OR REPLACE FUNCTION get_monthly_expenses_by_category(uid UUID, target_month INTEGER, target_year INTEGER)
RETURNS TABLE (
  category_id UUID,
  category_name TEXT,
  category_color TEXT,
  category_icon TEXT,
  total_amount DECIMAL(12, 2),
  transaction_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.name,
    c.color,
    c.icon,
    COALESCE(SUM(t.amount), 0)::DECIMAL(12, 2),
    COUNT(t.id)
  FROM categories c
  LEFT JOIN transactions t ON
    t.category_id = c.id AND
    t.user_id = uid AND
    t.type = 'gasto' AND
    EXTRACT(MONTH FROM t.transaction_date) = target_month AND
    EXTRACT(YEAR FROM t.transaction_date) = target_year
  WHERE (c.is_system = TRUE OR c.user_id = uid) AND c.type = 'gasto'
  GROUP BY c.id, c.name, c.color, c.icon
  HAVING COUNT(t.id) > 0
  ORDER BY SUM(t.amount) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FIN DEL ESQUEMA
-- =====================================================

-- INSTRUCCIONES DE USO:
-- 1. Copia todo este script
-- 2. Ve a Supabase Dashboard → SQL Editor
-- 3. Pega el script y ejecuta
-- 4. Verifica que todas las tablas se crearon correctamente
-- 5. Las políticas RLS protegerán automáticamente los datos
