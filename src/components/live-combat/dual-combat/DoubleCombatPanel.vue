<template>
  <v-col md="6" sm="12">
    <DualPokemonPanel :pk_dex="this.first_slot" :team="first_slot_team" :team_data="this.team_data" :enemy_data="enemy_data"/>
  </v-col>
  <v-col md="6" sm="12">
    <DualPokemonPanel :pk_dex="this.second_slot" :team="second_slot_team" :team_data="this.team_data" :enemy_data="enemy_data" :ally_data="this.ally_data"/>
  </v-col>
</template>

<script>
import DualPokemonPanel from '@/components/basic-comps/DualPokemonPanel'

export default {
  name: "DoubleCombatPanel",
  components: {
    DualPokemonPanel
  },
  props: {
    team_data: {
      type: Object,
      required: true
    },
    ally_data: {
      type: Object,
      required: false
    },
    enemy_data: {
      type: Object,
      required: true
    },
    team: {
      type: String,
      required: true
    }
  },
  methods: {},
  computed: {
    first_slot() {
      if (this.team === 'enemy') {
        return parseInt(this.team_data.selected_pokemon[0]) || null;
      }
      return this.team_data.selected_pokemon[0];
    },
    second_slot() {
      if (this.team === 'enemy') {
        return parseInt(this.team_data.selected_pokemon[1]) || null;
      }
      if (this.team_data.selected_pokemon[1] === undefined) {
        return this.ally_data.selected_pokemon[1];
      }
      return parseInt(this.team_data.selected_pokemon[1]);
    },
    first_slot_team() {
      if (this.team === 'enemy') {
        return 'enemy';
      }
      return 'you';
    },
    second_slot_team() {
      if (this.team === 'enemy') {
        return 'enemy';
      }
      const selected_dex = this.team_data.selected_pokemon[1];
      if (this.ally_data && this.ally_data.team.filter(pokemon => pokemon.dex_number === selected_dex).length > 0) {
        return 'ally';
      }
      return 'you';
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