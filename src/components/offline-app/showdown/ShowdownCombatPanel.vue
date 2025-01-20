<!--suppress JSUnresolvedVariable -->
<template>
  <v-row v-if="!combat_data">
    <v-col>
      <TeamSelectorPanel @search="search_combat" :default_trainer="trainer_id"/>
    </v-col>
  </v-row>
  <v-row v-if="combat_data" class="ma-1 h-100">
    <v-col>
      <DoubleCombatPanel :trainer_name="this.combat_data.enemy_trainer.name"
                         @selected_pokemon="select_enemy_pokemon" team="enemy"
                         :data="combat_data.enemy_trainer.current_team"
                         :enemy_data="combat_data.your_trainer.current_team"/>
      <v-row>
        <v-col sm="12" md="4">
          <PokemonTeamList team="enemy" :data="this.combat_data.enemy_trainer.current_team"
                           :enemy_data="this.combat_data.your_trainer.current_team"
                           :trainer_name="this.combat_data.enemy_trainer.name"/>
        </v-col>
        <v-col>
          <v-row class="h-100 w-100" justify="center" align="center">
            <v-col>
              <v-card>
                <template v-slot:text>
                  <v-row class="w-100 full-row">
                    <v-col>
                      <v-btn class="w-100" color="teal" @click="speed_table_display = true" text="Tabla de velocidades"/>
                    </v-col>
                  </v-row>
                </template>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col sm="12" md="4">
          <PokemonTeamList team="you" :data="this.combat_data.your_trainer.current_team"
                           :enemy_data="this.combat_data.enemy_trainer.current_team" :trainer_name="this.combat_data.your_trainer.name"/>
        </v-col>
      </v-row>
      <DoubleCombatPanel :trainer_name="this.combat_data.your_trainer.name"
                         @selected_pokemon="select_you_pokemon" team="you"
                         :data="combat_data.your_trainer.current_team"
                         :enemy_data="combat_data.enemy_trainer.current_team"/>
    </v-col>
  </v-row>
  <v-dialog v-model="speed_table_display">
    <v-row justify="center">
      <v-spacer @click="speed_table_display = false"/>
      <v-col fluid>
        <v-card height="100%">
          <template v-slot:actions>
            <v-btn text="Cerrar" color="teal" variant="text" @click="speed_table_display = false"></v-btn>
          </template>
          <template v-slot:text>
            <SpeedTable :combat_info="combat_data"/>
          </template>
        </v-card>
      </v-col>
      <v-spacer @click="speed_table_display = false"/>
    </v-row>
  </v-dialog>
</template>

<script>
import TeamSelectorPanel from "@/components/offline-app/showdown/TeamSelectorPanel";
import DoubleCombatPanel from "@/components/offline-app/showdown/DoubleCombatPanel";
import PokemonTeamList from '@/components/offline-app/api-comps/PokemonTeamList';
import SpeedTable from "@/components/offline-app/api-comps/SpeedTable";
import {session} from "@/stores";

export default {
  name: "ShowdownCombatPanel",
  components: {
    TeamSelectorPanel,
    DoubleCombatPanel,
    PokemonTeamList,
    SpeedTable
  },
  props: {
    trainer_id: {
      type: Number,
      required: false
    },
  },
  data() {
    return {
      speed_table_display: false,
      combat_data: null,
    }
  },
  methods: {
    async search_combat(data) {
      let enemy_trainer = await session.get(`/api/trainers/${data.selected_enemy_trainer}/`, {params: {localization: 'en'}}).then((response) => response.data);

      let your_trainer = await session.get(`/api/trainers/${data.selected_trainer}/`, {params: {localization: 'en'}}).then((response) => response.data);

      this.combat_data = {
        enemy_trainer,
        your_trainer
      };
      this.combat_data.enemy_trainer.current_team.selected_pokemon = []
      this.combat_data.your_trainer.current_team.selected_pokemon = []
    },
    select_enemy_pokemon(data) {
      this.combat_data.enemy_trainer.current_team.selected_pokemon[data.slot] = data.team_slot
    },
    select_you_pokemon(data) {
      this.combat_data.your_trainer.current_team.selected_pokemon[data.slot] = data.team_slot
    },
  }
}
</script>

<style scoped>
.full-row {
  margin: -15px 0;
}
</style>
