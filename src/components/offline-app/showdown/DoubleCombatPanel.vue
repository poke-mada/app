<template>
  <v-row>
    <v-col sm cols="8">
      <DualPokemonPanel :pk_slot="0" :team="team" :team_data="this.data" :enemy_data="enemy_data" @selected_pokemon="select_pokemon"/>
      <DualPokemonPanel :pk_slot="1" :team="team" :team_data="this.data" :enemy_data="enemy_data" @selected_pokemon="select_pokemon"/>
    </v-col>
    <v-col sm cols="4">
      <PokemonTeamList :team="team" :data="this.data" :enemy_data="enemy_data" :trainer_name="trainer_name"/>
    </v-col>
  </v-row>
</template>

<script>
import DualPokemonPanel from '@/components/offline-app/api-comps/DualPokemonPanel'
import PokemonTeamList from '@/components/offline-app/api-comps/PokemonTeamList';

export default {
  name: "CombatPanel",
  emits: ['selected_pokemon'],
  components: {
    PokemonTeamList,
    DualPokemonPanel
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    team: {
      type: String,
      required: true
    },
    trainer_name: {
      type: String,
      required: true
    },
    enemy_data: {
      type: Object,
      required: true
    }
  },
  methods: {
    select_pokemon(data) {
      this.$emit('selected_pokemon', data)
    }
  },
  data() {
    return {
      selectedPokemon: null,
      enemyPokemon: null
    }
  },
}
</script>

<style scoped>

</style>