<template>
  <v-row class="mt-4" v-if="false">
    <v-col sm>
      <v-row v-if="this.selectedPokemon">
        <v-col cols="6" v-for="(move, index) in this.selectedPokemon.moves" :key="index">
          <MovementCard :pokemon="this.selectedPokemon" :enemy_data="enemy_data" :movement="move" v-if="move"/>
        </v-col>
      </v-row>
    </v-col>
    <v-col sm></v-col>
  </v-row>
  <v-row>
    <v-col sm>
      <PokemonPanel :pokemon="this.data.team[this.data.selected_pokemon[0]]" team="enemy"/>
    </v-col>
    <v-col sm></v-col>
    <v-col sm>
      <PokemonTeamList @pokemonSelected="selectPokemon" team="enemy" :data="this.data"/>
    </v-col>
  </v-row>
</template>

<script>
import PokemonPanel from '@/components/basic-comps/PokemonPanel'
import MovementCard from '../basic-comps/MovementCard'
import PokemonTeamList from '@/components/basic-comps/PokemonTeamList';

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
      this.selectedPokemon = data.pokemon;
    })

    window.electron.onDataReceived('end_combat', () => {
      this.selectedPokemon = null;
      this.enemyPokemon = null;
    })
  },
  mounted() {
    this.emitter.on('select-pokemon-ally', (pokemon) => {
      this.enemyPokemon = pokemon;
    });
  },
  methods: {}
}
</script>

<style scoped>

</style>