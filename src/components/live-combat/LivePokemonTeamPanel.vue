<template>
  <v-col md="4" sm="12" xs="12" lg="2">
    <VerticalPokemonTeamList @select_pokemon="select_pokemon" team="you" :data="team_data"/>
  </v-col>
  <v-col md="8" sm="12" xs="12" lg="10">
    <PokemonDetailPanel :pokemon="selected_pokemon" v-if="selected_pokemon"/>
  </v-col>
</template>

<script>
import VerticalPokemonTeamList from '@/components/basic-comps/VerticalPokemonTeamList';
import PokemonDetailPanel from '@/components/basic-comps/PokemonDetailPanel';

export default {
  name: "PokemonTeamPanel",
  components: {
    VerticalPokemonTeamList,
    PokemonDetailPanel
  },
  props: {
    team_data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selected_pokemon: null,
    }
  },
  methods: {
    select_pokemon(slot) {
      this.selected_pokemon = this.team_data.team[slot];
    },
  },
}
</script>

<style scoped>

</style>