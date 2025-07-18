<template>
  <v-row v-if="game_data && game_data.combat_info.combat_type === 'OFF'">
    <LivePokemonTeamPanel :team_data="game_data.your_data" />
  </v-row>
  <v-row v-if="game_data && game_data.combat_info.combat_type === 'NORMAL'">
    <v-col cols="12">
      <v-row>
        <SingleCombatPanel team="enemy" :team_data="game_data.enemy_data" :enemy_data="game_data.your_data"
          :move_log="move_log" :combat_type="game_data.combat_info.combat_env" />
      </v-row>
      <v-row>
        <SingleCombatPanel team="you" :team_data="game_data.your_data" :enemy_data="game_data.enemy_data"
          :move_log="move_log" :combat_type="game_data.combat_info.combat_type" />
      </v-row>
    </v-col>
  </v-row>
  <v-row v-if="game_data && game_data.combat_info.combat_type === 'DOUBLE'">
    <v-col cols="12">
      <v-row>
        <DoubleCombatPanel team="enemy" :team_data="game_data.enemy_data" :enemy_data="game_data.your_data"
          :move_log="move_log" :combat_type="game_data.combat_info.combat_type" />
      </v-row>
      <v-row>
        <DoubleCombatPanel team="you" :team_data="game_data.your_data" :ally_data="game_data.ally_data"
          :enemy_data="game_data.enemy_data" :move_log="move_log" :combat_type="game_data.combat_info.combat_type" />
      </v-row>
      <v-row>
        <v-col cols="4">
          <PokemonTeamList team="you" :data="game_data.your_data" :enemy_data="game_data.enemy_data"
            :move_log="move_log" :combat_type="game_data.combat_info.combat_type" />
        </v-col>
        <!-- Log de combate en medio -->
        <v-col cols="4" v-if="game_data && game_data.combat_info.combat_type === 'DOUBLE'">
          <v-card class="rounded-xl mb-6" elevation="6" style="position: relative;">
            <div class="divCardLog pa-3 d-flex justify-center align-center">
              <h2 class="textTeamCombatsLog">LOG DE BATALLA</h2>
              <v-img src="/assets/icons/ComatsWhite.svg" class="tamaImg" alt="Log icon" cover />
            </div>

            <div class="pa-4">
              <v-list>
                <v-list-item v-for="(item, i) in move_log.slice(0, 3)" :key="i">
                  <v-list-item-content class="logsElementsDiv">
                    <v-img src="/assets/img/combat/PokeballLog1.png" alt="Pokeball" width="24" height="24" />
                    <v-list-item-title class="marginLogs letrasMinus">{{ item.message }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
          </v-card>
        </v-col>
        <v-col cols="4">
          <PokemonTeamList team="enemy" :data="game_data.enemy_data" :enemy_data="game_data.your_data"
            :move_log="move_log" :combat_type="game_data.combat_info.combat_type" />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <v-row v-if="game_data && game_data.combat_info.combat_type === 'HORDE'">
    <v-row class="ml-2 mr-2">
      <v-col cols="12">
        <HordeCombatPanel team="enemy" :data="game_data.enemy_data" :enemy_data="game_data.your_data"
          :move_log="move_log" :combat_type="game_data.combat_info.combat_type" />
      </v-col>
    </v-row>
    <v-row class="ml-2 mr-2">
      <v-col cols="8">
        <HordeAllyCombatPanel team="you" :team_data="game_data.your_data" :enemy_data="game_data.enemy_data"
          :move_log="move_log" :combat_type="game_data.combat_info.combat_type" />
      </v-col>
      <v-col cols="4">
        <PokemonTeamList team="you" :data="game_data.your_data" :enemy_data="game_data.enemy_data" :move_log="move_log"
          :combat_type="game_data.combat_info.combat_type" />
      </v-col>
    </v-row>
  </v-row>
  <v-row v-if="game_data && game_data.combat_info.combat_type === 'TRIPLE'">
    <v-col>
      <v-alert color="error">WIP</v-alert>
    </v-col>
  </v-row>
  <v-dialog v-model="coverage_table_display">
    <CoverageTableDisplay :combat_data="this.game_data" @close_display="this.coverage_table_display = false;" />
  </v-dialog>
  <v-dialog v-model="combat_log_display">
    <v-row>
      <v-spacer @click="combat_log_display = false;" />
      <v-col>
        <v-card max-height="75vh">
          <v-data-table-virtual hide-default-footer disable-sort height="55vh" density="comfortable" :headers="headers"
            :items="move_log" />
        </v-card>
      </v-col>
      <v-spacer @click="combat_log_display = false;" />
    </v-row>
  </v-dialog>
</template>

<script>
import SingleCombatPanel from "@/app/vue/components/live-combat/normal-combat/SingleCombatPanel";
import HordeCombatPanel from "@/app/vue/components/live-combat/horde-combat/HordeCombatPanel";
import HordeAllyCombatPanel from "@/app/vue/components/live-combat/horde-combat/HordeAllyCombatPanel";
import DoubleCombatPanel from "@/app/vue/components/live-combat/dual-combat/DoubleCombatPanel";
import LivePokemonTeamPanel from '@/app/vue/components/live-combat/LivePokemonTeamPanel';
import PokemonTeamList from '@/app/vue/components/basic-comps/DetailPokemonTeamList';
import CoverageTableDisplay from "@/app/vue/components/basic-comps/CoverageTableDisplay";
import { useGameStore } from "@/stores/app";

export default {
  name: "LiveCombatPanel",
  components: {
    SingleCombatPanel,
    HordeAllyCombatPanel,
    HordeCombatPanel,
    DoubleCombatPanel,
    LivePokemonTeamPanel,
    PokemonTeamList,
    CoverageTableDisplay,
  },
  computed: {
    store() {
      return useGameStore();
    },
    game_data() {
      return this.store.game_data;
    },
    move_log() {
      return [...this.game_data.combat_info.combat_move_log_messages].reverse();
    }
  },
  data() {
    return {
      headers: [
        { title: 'Movement', align: 'start', key: 'key', value: 'message' },
      ],
      combat_log_display: false,
      coverage_table_display: false
    }
  },
  mounted() {
  }
}
</script>

<style scoped></style>