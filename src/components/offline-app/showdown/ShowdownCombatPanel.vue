<template>
  <TeamSelectorPanel @search="search_combat" :default_trainer="trainer_name" v-if="!combat_data"/>
  <v-row v-if="combat_data">
    <v-col>
      <DoubleCombatPanel :trainer_name="this.combat_data.enemy_trainer.name"
                         @selected_pokemon="select_enemy_pokemon" team="enemy"
                         :data="combat_data.enemy_trainer.current_team"
                         :enemy_data="combat_data.your_trainer.current_team"/>

      <DoubleCombatPanel :trainer_name="this.combat_data.your_trainer.name"
                         @selected_pokemon="select_you_pokemon" team="you"
                         :data="combat_data.your_trainer.current_team"
                         :enemy_data="combat_data.enemy_trainer.current_team"/>
    </v-col>
  </v-row>
</template>

<script>
import TeamSelectorPanel from "@/components/offline-app/showdown/TeamSelectorPanel";
import DoubleCombatPanel from "@/components/offline-app/showdown/DoubleCombatPanel";

export default {
  name: "ShowdownCombatPanel",
  components: {
    TeamSelectorPanel,
    DoubleCombatPanel
  },
  props: {
    trainer_name: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      combat_data: null,
    }
  },
  methods: {
    search_combat(data) {
      window.electron.sendMessage('showdown-combat', {
        enemy_trainer: data.selected_enemy_trainer,
        your_trainer: data.selected_trainer
      })
    },
    select_enemy_pokemon(data) {
      this.combat_data.enemy_trainer.current_team.selected_pokemon[data.slot] = data.team_slot
    },
    select_you_pokemon(data) {
      this.combat_data.your_trainer.current_team.selected_pokemon[data.slot] = data.team_slot
    },
  },
  created() {
    window.electron.onDataReceived('showdown-data', (event, data) => {
      console.log(data)
      this.combat_data = data;
      this.combat_data.enemy_trainer.current_team.selected_pokemon = []
      this.combat_data.your_trainer.current_team.selected_pokemon = []
    })
  },
}
</script>

<style scoped>

</style>