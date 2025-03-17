<template>
  <v-row v-if="game_data && game_data.combat_info.combat_type === 'OFF'">
    <LivePokemonTeamPanel :team_data="game_data.your_data"/>
  </v-row>
  <v-row v-if="game_data && game_data.combat_info.combat_type === 'NORMAL'">
    <v-col cols="12">
      <v-row>
        <SingleCombatPanel team="enemy" :team_data="game_data.enemy_data" :enemy_data="game_data.your_data"/>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-card>
            <template v-slot:text>
              <v-row>
                <v-col>
                  <v-btn text="Tabla de Tipos" color="teal" @click="this.coverage_table_display = true;"/>
                </v-col>
                <v-col>
                  <v-btn text="Log de combate" color="teal" @click="this.combat_log_display = true;"/>
                </v-col>
              </v-row>
            </template>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <SingleCombatPanel team="you" :team_data="game_data.your_data" :enemy_data="game_data.enemy_data"/>
      </v-row>
    </v-col>
  </v-row>
  <v-row v-if="game_data && game_data.combat_info.combat_type === 'DOUBLE'">
    <v-col cols="12">
      <v-row>
        <DoubleCombatPanel team="enemy" :team_data="game_data.enemy_data" :enemy_data="game_data.your_data"/>
      </v-row>
      <v-row>
        <v-col cols="4">
          <PokemonTeamList team="enemy" :data="game_data.enemy_data" :enemy_data="game_data.your_data"/>
        </v-col>
        <v-col cols="4">
          <v-card>
            <template v-slot:text>
              <v-row>
                <v-col>
                  <v-btn text="Tabla de Tipos" color="teal" @click="this.coverage_table_display = true;"/>
                </v-col>
                <v-col>
                  <v-btn text="Log de combate" color="teal" @click="this.combat_log_display = true;"/>
                </v-col>
              </v-row>
            </template>
          </v-card>
        </v-col>
        <v-col cols="4">
          <PokemonTeamList team="you" :data="game_data.your_data" :enemy_data="game_data.enemy_data"/>
        </v-col>
      </v-row>
      <v-row>
        <DoubleCombatPanel team="you" :team_data="game_data.your_data" :ally_data="game_data.ally_data" :enemy_data="game_data.enemy_data"/>
      </v-row>
    </v-col>
  </v-row>
  <v-row v-if="game_data && game_data.combat_info.combat_type === 'HORDE'">
    <v-row class="ml-2 mr-2">
      <v-col cols="12">
        <HordeCombatPanel team="enemy" :data="game_data.enemy_data" :enemy_data="game_data.your_data"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-card>
          <template v-slot:text>
            <v-row>
              <v-col>
                <v-btn text="Tabla de Tipos" color="teal" @click="this.coverage_table_display = true;"/>
              </v-col>
              <v-col>
                <v-btn text="Log de combate" color="teal" @click="this.combat_log_display = true;"/>
              </v-col>
            </v-row>
          </template>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="ml-2 mr-2">
      <v-col cols="8">
        <HordeAllyCombatPanel team="you" :team_data="game_data.your_data" :enemy_data="game_data.enemy_data"/>
      </v-col>
      <v-col cols="4">
        <PokemonTeamList team="you" :data="game_data.your_data" :enemy_data="game_data.enemy_data"/>
      </v-col>
    </v-row>
  </v-row>
  <v-row v-if="game_data && game_data.combat_info.combat_type === 'TRIPLE'">
    <v-col>
      <v-alert color="error">WIP</v-alert>
    </v-col>
  </v-row>
  <v-dialog v-model="coverage_table_display">
    <CoverageTableDisplay :combat_data="this.game_data" @close_display="this.coverage_table_display = false;"/>
  </v-dialog>
  <v-dialog v-model="combat_log_display">
    <v-row>
      <v-spacer @click="combat_log_display = false;"/>
      <v-col>
        <v-card max-height="75vh">
          <v-data-table-virtual
              hide-default-footer
              disable-sort
              height="55vh"
              density="comfortable"
              :headers="headers"
              :items="move_log"/>
        </v-card>
      </v-col>
      <v-spacer @click="combat_log_display = false;"/>
    </v-row>
  </v-dialog>
</template>

<script>
import SingleCombatPanel from "@/components/live-combat/normal-combat/SingleCombatPanel";
import HordeCombatPanel from "@/components/live-combat/horde-combat/HordeCombatPanel";
import HordeAllyCombatPanel from "@/components/live-combat/horde-combat/HordeAllyCombatPanel";
import DoubleCombatPanel from "@/components/live-combat/dual-combat/DoubleCombatPanel";
import LivePokemonTeamPanel from '@/components/live-combat/LivePokemonTeamPanel';
import PokemonTeamList from '@/components/basic-comps/DetailPokemonTeamList';
import CoverageTableDisplay from "@/components/basic-comps/CoverageTableDisplay";
import {useGameStore} from "@/stores/app";

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
    store () {
      return useGameStore();
    },
    game_data () {
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

<style scoped>

</style>