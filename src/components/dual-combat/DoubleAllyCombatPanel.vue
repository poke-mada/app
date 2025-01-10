<template>
  <v-row>
    <v-col sm v-for="(slot, index) in this.data.selected_pokemon" :key="index">
      <PokemonPanel :pokemon="this.data.team[slot]" team="you"/>
    </v-col>
    <v-col sm></v-col>
    <v-col sm>
      <PokemonTeamList @pokemonSelected="selectPokemon" team="you" :data="this.data"/>
    </v-col>
  </v-row>
  <v-row class="mt-4">
    <v-col sm cols="12">
      <v-row v-if="this.selectedPokemon">
        <v-col cols="6" v-for="(move, index) in this.selectedPokemon.moves" :key="index">
          <MovementCard :pokemon="this.selectedPokemon" :enemy_data="enemy_data" :movement="move" v-if="move"/>
        </v-col>
      </v-row>
    </v-col>
    <v-col sm cols="12"></v-col>
  </v-row>
</template>

<script>
import PokemonPanel from '@/components/basic-comps/PokemonPanel'
import PokemonTeamList from '@/components/basic-comps/PokemonTeamList';
import MovementCard from '@/components/basic-comps/MovementCard'

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
      selectedPokemon: null,
      enemyPokemon: null
    }
  },
  created() {
    window.electron.onDataReceived('selected_enemy', (event, data) => {
      this.enemyPokemon = data.pokemon;
    })
  },
  methods: {
    selectPokemon: function (pokemon) {
      this.emitter.emit('select-pokemon-ally', pokemon)
      this.selectedPokemon = pokemon;
    },
  }
}
</script>

<style scoped>

</style>