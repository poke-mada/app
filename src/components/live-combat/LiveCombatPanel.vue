<template>
  <LivePokemonTeamPanel v-if="game_data && game_data.combat_info.combat_type === 'OFF'"
                        :team_data="game_data.your_data"/>
  <v-row v-if="game_data && game_data.combat_info.combat_type === 'NORMAL'">
    <SingleCombatPanel team="enemy" :data="game_data.enemy_data" :enemy_data="game_data.your_data"/>
    <SingleCombatPanel team="you" :data="game_data.your_data" :enemy_data="game_data.enemy_data"/>
  </v-row>

  <v-row v-if="game_data && game_data.combat_info.combat_type === 'DOUBLE'">
    <v-row>
      <DoubleCombatPanel team="enemy" :data="game_data.enemy_data" :enemy_data="game_data.your_data"/>
    </v-row>
    <v-row>
      <v-col>
        <PokemonTeamList team="enemy" :data="game_data.enemy_data" :enemy_data="game_data.your_data"/>
      </v-col>
      <v-spacer/>
      <v-col>
        <PokemonTeamList team="you" :data="game_data.your_data" :enemy_data="game_data.enemy_data"/>
      </v-col>
    </v-row>
    <v-row>
      <DoubleCombatPanel team="you" :data="game_data.your_data" :enemy_data="game_data.enemy_data"/>
    </v-row>
  </v-row>
  <v-row v-if="game_data && game_data.combat_info.combat_type === 'HORDE'">
    <v-row class="ml-2 mr-2">
      <v-col cols="12">
        <HordeCombatPanel team="enemy" :data="game_data.enemy_data" :enemy_data="game_data.your_data"/>
      </v-col>
    </v-row>
    <v-row class="ml-2 mr-2">
      <v-col cols="8">
        <HordeAllyCombatPanel team="you" :data="game_data.your_data" :enemy_data="game_data.enemy_data"/>
      </v-col>
      <v-col cols="4">
        <PokemonTeamList team="you" :data="game_data.your_data" :enemy_data="game_data.enemy_data"/>
      </v-col>
    </v-row>
  </v-row>
  <v-row v-if="game_data && game_data.combat_info.combat_type === 'TRIPLE' && false">
    <EnemyCombatPanel :data="game_data.enemy_data" :enemy_data="game_data.your_data"/>
    <AllyCombatPanel :data="game_data.your_data" :enemy_data="game_data.enemy_data"/>
  </v-row>
</template>

<script>
import AllyCombatPanel from "@/components/live-combat/normal-combat/AllyCombatPanel";
import SingleCombatPanel from "@/components/live-combat/normal-combat/SingleCombatPanel";
import HordeCombatPanel from "@/components/live-combat/horde-combat/HordeCombatPanel";
import HordeAllyCombatPanel from "@/components/live-combat/horde-combat/HordeAllyCombatPanel";
import EnemyCombatPanel from "@/components/live-combat/normal-combat/EnemyCombatPanel";
import DoubleCombatPanel from "@/components/live-combat/dual-combat/DoubleCombatPanel";
import LivePokemonTeamPanel from '@/components/LivePokemonTeamPanel';
import PokemonTeamList from '@/components/basic-comps/PokemonTeamList';

export default {
  name: "LiveCombatPanel",
  components: {
    AllyCombatPanel,
    SingleCombatPanel,
    HordeAllyCombatPanel,
    HordeCombatPanel,
    EnemyCombatPanel,
    DoubleCombatPanel,
    LivePokemonTeamPanel,
    PokemonTeamList
  },
  props: {
    game_data: {
      type: Object,
      required: true
    }
  },
  mounted() {
    console.log(this.game_data)
  }
}
</script>

<style scoped>

</style>