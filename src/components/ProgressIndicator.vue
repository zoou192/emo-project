<template>
  <div class="progress-indicator">
    <div class="steps">
      <div 
        v-for="(step, index) in steps" 
        :key="index"
        class="step"
        :class="{ 
          'active': currentStep > index,
          'current': currentStep === index,
          'completed': currentStep > index
        }"
      >
        <div class="step-line"></div>
        <div class="step-label">{{ step }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentStep: {
    type: Number,
    required: true
  },
  steps: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.progress-indicator {
  margin-bottom: 30px;
}

.steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  position: relative;
  padding: 0 20px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  flex: 1;
}

.step-line {
  width: 100%;
  height: 6px;
  background: #f5f5f5;
  border-radius: 3px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.step.active .step-line {
  background: #9d26ff;
}

.step.current .step-line {
  background: #9d26ff;
  box-shadow: 0 0 0 2px rgba(157, 38, 255, 0.2);
}

.step-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.step.active .step-label,
.step.current .step-label {
  color: #fff;
  font-weight: 500;
}
</style> 