<template>
  <form @submit.prevent="handleSubmit" class="transaction-form">
    <div class="form-header">
      <h2 class="form-title">Nueva Transacción</h2>
      <p class="form-subtitle">Registra tus ingresos y gastos</p>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label for="type" class="form-label">
          <Icon icon="material-symbols:category" width="20" height="20" class="label-icon" />
          Tipo
        </label>
        <select 
          id="type"
          name="type" 
          v-model="formData.type" 
          class="form-select"
          required
        >
          <option value="">Selecciona tipo</option>
          <option value="ingreso">
            <Icon icon="material-symbols:trending-up" width="20" height="20" />
            Ingreso
          </option>
          <option value="egreso">
            <Icon icon="material-symbols:trending-down" width="20" height="20" />
            Egreso
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="amount" class="form-label">
          <Icon icon="material-symbols:attach-money" width="20" height="20" class="label-icon" />
          Monto
        </label>
        <input 
          id="amount"
          name="amount"
          type="number" 
          v-model.number="formData.amount" 
          class="form-input"
          placeholder="0.00"
          step="0.01"
          min="0"
          required
        />
      </div>

      <div class="form-group">
        <label for="category" class="form-label">
          <Icon icon="material-symbols:label" width="20" height="20" class="label-icon" />
          Categoría
        </label>
        <input 
          id="category"
          name="category"
          type="text" 
          v-model="formData.category" 
          class="form-input"
          placeholder="Ej: Salario, Comida, Transporte"
          required
        />
      </div>
    </div>

    <div class="form-actions">
      <button 
        type="button" 
        @click="resetForm" 
        class="btn-secondary"
      >
        <Icon icon="material-symbols:close" width="20" height="20" />
        Cancelar
      </button>
      <button 
        type="submit" 
        class="btn-primary"
        :disabled="loading"
      >
        <Icon icon="material-symbols:add" width="20" height="20" />
        {{ loading ? 'Guardando...' : 'Agregar Transacción' }}
      </button>
    </div>

    <div v-if="error" class="error-message">
      <Icon icon="material-symbols:error" width="20" height="20" />
      {{ error }}
    </div>
    <div v-if="success" class="success-message">
      <Icon icon="material-symbols:check-circle" width="20" height="20" />
      Transacción agregada exitosamente
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Icon } from '@iconify/vue'

const emit = defineEmits<{
  submit: [data: { type: string; amount: number; category: string }]
}>()

interface TransactionData {
  type: 'ingreso' | 'egreso' | ''
  amount: number | null
  category: string
}

const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

const formData = reactive<TransactionData>({
  type: '',
  amount: null,
  category: ''
})

const handleSubmit = () => {
  if (!formData.type || !formData.amount || !formData.category) {
    error.value = 'Por favor completa todos los campos requeridos'
    return
  }

  loading.value = true
  error.value = null

  try {
    emit('submit', {
      type: formData.type,
      amount: formData.amount,
      category: formData.category
    })

    success.value = true
    setTimeout(() => {
      success.value = false
      resetForm()
    }, 2000)
  } catch (err) {
    error.value = 'Error al agregar la transacción'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  formData.type = ''
  formData.amount = null
  formData.category = ''
  error.value = null
  success.value = false
}
</script>

<style scoped>
.transaction-form {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-title {
  font-size: 2rem;
  font-weight: 900;
  color: #35495e;
  margin-bottom: 8px;
}

.form-subtitle {
  color: #888;
  font-size: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-weight: 600;
  color: #35495e;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.label-icon {
  color: #A2D3C7;
}

.form-input,
.form-select {
  padding: 12px 16px;
  border: 2px solid #E2AA87;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #A2D3C7;
  box-shadow: 0 0 0 3px rgba(162, 211, 199, 0.1);
}

.form-select {
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
}

.btn-primary,
.btn-secondary {
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, #A2D3C7, #8BC9BD);
  color: #35495e;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #EF8E7D, #E89A89);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(239, 142, 125, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e0e0e0;
  color: #35495e;
}

.btn-secondary:hover {
  background: #d0d0d0;
}

.error-message {
  margin-top: 16px;
  padding: 12px 16px;
  background: #ffe0e0;
  color: #c00;
  border-radius: 8px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.success-message {
  margin-top: 16px;
  padding: 12px 16px;
  background: #d4edda;
  color: #155724;
  border-radius: 8px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .form-group:first-child {
    grid-column: span 2;
  }
}
</style>

