<template>
  <v-row>
    <v-col cols="3">
      <VerticalPokemonTeamList @select_pokemon="select_pokemon" team="you" :data="team_data"/>
    </v-col>
    <v-col>
      <PokemonDetailPanel :pokemon="selected_pokemon" v-if="selected_pokemon"/>
    </v-col>
  </v-row>
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
    select_pokemon(pokemon) {
      this.selected_pokemon = pokemon;
    },
  },
}
</script>

<style scoped>

</style>