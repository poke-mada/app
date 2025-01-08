<template>
  <div class="container-fluid">
    <EnemyCombatPanel/>
    <div class="row" style="height: 1rem"></div>
    <AllyCombatPanel/>
  </div>
</template>

<script>
import AllyCombatPanel from './components/AllyCombatPanel.vue'
import EnemyCombatPanel from './components/EnemyCombatPanel.vue'


export default {
  name: 'App',
  components: {
    AllyCombatPanel,
    EnemyCombatPanel
  }, created() {
    window.electron.startComms()
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

body {
  background-repeat: no-repeat;
  background-size: cover;
}

.img-thumbnail {
  cursor: pointer;
}

* {
  cursor: default;
}
</style>
