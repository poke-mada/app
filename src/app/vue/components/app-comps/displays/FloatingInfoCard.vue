<template>
  <div class="floating-card">
    <p>Holis</p>
  </div>
</template>

<script setup>

</script>

<style scoped>
.floating-card {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background-color: #111;
  color: white;
  padding: 10px;
  border-radius: 8px;
  z-index: 9999;
  box-shadow: 0 0 10px rgba(0,0,0,0.4);
  pointer-events: none;
}
</style>