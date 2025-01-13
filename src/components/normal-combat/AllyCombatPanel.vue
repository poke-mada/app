<template>
  <v-row class="ml-2 w-100">
    <v-col cols="8">
      <SinglePokemonPanel :pokemon="this.selectedPokemon" team="you" :team_data="data" :enemy_data="enemy_data" :pk_slot="pk_slot"/>
    </v-col>
    <v-col sm cols="4">
      <PokemonTeamList @pokemonSelected="selectPokemon" team="you" :data="this.data" :enemy_data="enemy_data"/>
    </v-col>
  </v-row>
</template>

<script>
import SinglePokemonPanel from '@/components/basic-comps/SinglePokemonPanel';
import PokemonTeamList from '@/components/basic-comps/PokemonTeamList';

export default {
  name: "CombatPanel",
  components: {
    PokemonTeamList,
    SinglePokemonPanel,
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    enemy_data: {
      type: Object,
      required: true
    }
  },
  computed: {
    pk_slot() {
      return this.data.selected_pokemon[0]
    }
  },
  data() {
    return {
      selectedPokemon: null
    }
  },
  methods: {
    selectPokemon: function (pokemon) {
      this.selectedPokemon = pokemon;
    },
  }
}
</script>

<style scoped>

</style>