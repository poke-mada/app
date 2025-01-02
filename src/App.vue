<template>
  <div class="container">
      <CombatPanel team="enemy"/>
      <div class="row" style="height: 1rem"></div>
      <CombatPanel team="you"/>
  </div>
</template>

<script>
import CombatPanel from './components/CombatPanel.vue'


export default {
  name: 'App',
  components: {
    CombatPanel
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
