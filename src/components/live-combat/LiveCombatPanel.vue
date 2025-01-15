<template>
  <LivePokemonTeamPanel v-if="game_data && game_data.combat_info.combat_type === 'OFF'" :team_data="game_data.your_data"/>
  <v-row v-if="game_data && game_data.combat_info.combat_type === 'NORMAL'">
    <EnemyCombatPanel :data="game_data.enemy_data" :enemy_data="game_data.your_data"/>
    <AllyCombatPanel :data="game_data.your_data" :enemy_data="game_data.enemy_data"/>
  </v-row>

  <v-row v-if="game_data && game_data.combat_info.combat_type === 'DOUBLE'">
    <DoubleEnemyCombatPanel :data="game_data.enemy_data" :enemy_data="game_data.your_data"/>
    <DoubleAllyCombatPanel :data="game_data.your_data" :enemy_data="game_data.enemy_data"/>
  </v-row>
  <v-row v-if="game_data && game_data.combat_info.combat_type === 'HORDE'">
    <v-card>
      <v-alert color="danger">WIP</v-alert>
    </v-card>
  </v-row>
  <v-row v-if="game_data && game_data.combat_info.combat_type === 'TRIPLE' && false">
    <EnemyCombatPanel :data="game_data.enemy_data" :enemy_data="game_data.your_data"/>
    <AllyCombatPanel :data="game_data.your_data" :enemy_data="game_data.enemy_data"/>
  </v-row>
</template>

<script>
import AllyCombatPanel from "@/components/live-combat/normal-combat/AllyCombatPanel";
import EnemyCombatPanel from "@/components/live-combat/normal-combat/EnemyCombatPanel";
import DoubleAllyCombatPanel from "@/components/live-combat/dual-combat/DoubleAllyCombatPanel";
import DoubleEnemyCombatPanel from "@/components/live-combat/dual-combat/DoubleEnemyCombatPanel";
import LivePokemonTeamPanel from '@/components/LivePokemonTeamPanel';

export default {
  name: "LiveCombatPanel",
  components: {
    AllyCombatPanel,
    EnemyCombatPanel,
    DoubleAllyCombatPanel,
    DoubleEnemyCombatPanel,
    LivePokemonTeamPanel
  },
  props: {
    game_data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style scoped>

</style>