<template>
  <v-container fluid>
    <v-row v-if="game_data && game_data.combat_info.combat_type === 'OFF'">
      <v-col sm>
        <PokemonTeamList team="you" :data="game_data.your_data" :enemy_data="null"/>
      </v-col>
    </v-row>

    <v-row v-if="game_data && game_data.combat_info.combat_type === 'NORMAL'">
      <EnemyCombatPanel :data="game_data.enemy_data" :enemy_data="game_data.your_data"/>
      <AllyCombatPanel :data="game_data.your_data" :enemy_data="game_data.enemy_data"/>
    </v-row>

    <v-row v-if="game_data && game_data.combat_info.combat_type === 'DOUBLE'">
      <DoubleEnemyCombatPanel :data="game_data.enemy_data" :enemy_data="game_data.your_data"/>
      <DoubleAllyCombatPanel :data="game_data.your_data" :enemy_data="game_data.enemy_data"/>
    </v-row>

    <v-row v-if="game_data && game_data.combat_info.combat_type === 'TRIPLE' && false">
      <EnemyCombatPanel :data="game_data.enemy_data" :enemy_data="game_data.your_data"/>
      <AllyCombatPanel :data="game_data.your_data" :enemy_data="game_data.enemy_data"/>
    </v-row>
  </v-container>
</template>

<script>
import AllyCombatPanel from './components/normal-combat/AllyCombatPanel'
import EnemyCombatPanel from './components/normal-combat/EnemyCombatPanel'
import DoubleAllyCombatPanel from './components/dual-combat/DoubleAllyCombatPanel'
import DoubleEnemyCombatPanel from './components/dual-combat/DoubleEnemyCombatPanel'
import PokemonTeamList from '@/components/basic-comps/PokemonTeamList';


export default {
  name: 'App',
  components: {
    AllyCombatPanel,
    EnemyCombatPanel,
    DoubleAllyCombatPanel,
    DoubleEnemyCombatPanel,
    PokemonTeamList
  },
  data() {
    return {
      game_data: null,
    }
  },
  methods: {
  },
  created() {
    window.electron.onDataReceived('updated_game_data', (event, data) => {
      this.game_data = data;
      console.log(data)
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
