<template>
  <v-row class="ml-2 w-100">
    <v-col sm cols="4">
      <PokemonPanel :pokemon="this.selectedPokemon" team="you"/>
    </v-col>
    <v-col sm cols="4"></v-col>
    <v-col sm cols="4">
      <PokemonTeamList @pokemonSelected="selectPokemon" team="you" :data="this.data"/>
    </v-col>
  </v-row>
  <v-row class="mt-4 ml-2 w-100">
    <v-col sm cols="10">
      <v-row v-if="this.selectedPokemon">
        <v-col cols="6" v-for="(move, index) in this.selectedPokemon.moves" :key="index">
          <MovementCard :pokemon="this.selectedPokemon" :enemy_data="enemy_data" :movement="move" v-if="move"/>
        </v-col>
      </v-row>
    </v-col>
    <v-col sm></v-col>
  </v-row>
</template>

<script>
import PokemonPanel from '@/components/basic-comps/PokemonPanel'
import PokemonTeamList from '@/components/basic-comps/PokemonTeamList';
import MovementCard from '../basic-comps/MovementCard'

export default {
  name: "CombatPanel",
  components: {
    PokemonTeamList,
    PokemonPanel,
    MovementCard
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