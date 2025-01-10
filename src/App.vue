<template>
  <v-container fluid>
    <div v-if="gameData && gameData.combat_info.combat_type === 'OFF'" class="row justify-content-center">
      <AllyCombatPanel :data="gameData.your_data"/>
    </div>
    <div v-if="gameData && gameData.combat_info.combat_type === 'NORMAL'">
      <EnemyCombatPanel :data="gameData.enemy_data" :enemy_data="gameData.your_data"/>
      <div class="row" style="height: 1rem"></div>
      <AllyCombatPanel :data="gameData.your_data" :enemy_data="gameData.enemy_data"/>
    </div>
    <div v-if="gameData && gameData.combat_info.combat_type === 'DOUBLE'">
      <DoubleEnemyCombatPanel :data="gameData.enemy_data" :enemy_data="gameData.your_data"/>
      <div class="row" style="height: 1rem"></div>
      <DoubleAllyCombatPanel :data="gameData.your_data" :enemy_data="gameData.enemy_data"/>
    </div>
    <div v-if="gameData && gameData.combat_info.combat_type === 'TRIPLE' && false">
      <EnemyCombatPanel :data="gameData.enemy_data" :enemy_data="gameData.your_data"/>
      <div class="row" style="height: 1rem"></div>
      <AllyCombatPanel :data="gameData.your_data" :enemy_data="gameData.enemy_data"/>
    </div>
  </v-container>
</template>

<script>
import AllyCombatPanel from './components/normal-combat/AllyCombatPanel'
import EnemyCombatPanel from './components/normal-combat/EnemyCombatPanel'
import DoubleAllyCombatPanel from './components/dual-combat/DoubleAllyCombatPanel'
import DoubleEnemyCombatPanel from './components/dual-combat/DoubleEnemyCombatPanel'


export default {
  name: 'App',
  components: {
    AllyCombatPanel,
    EnemyCombatPanel,
    DoubleAllyCombatPanel,
    DoubleEnemyCombatPanel
  },
  data() {
    return {
      gameData: null,
    }
  },
  created() {
    window.electron.onDataReceived('updated_game_data', (event, data) => {
      this.gameData = data;
    })
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

* {
  cursor: default;
}
</style>
