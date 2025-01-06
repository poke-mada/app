<template>
  <div class="row">
    <div class="col-sm">
      <PokemonPanel :pokemon="this.selectedPokemon" :team="team"/>
    </div>
    <div class="col-sm"></div>
    <div class="col-sm">
      <PokemonTeamList @pokemonSelected="selectPokemon" :team="team"/>
    </div>
  </div>
  <div class="row" v-if="this.team === 'you'" style="margin-top:20px">
    <div class="col-sm">
      <div class="row row-cols-2 shadow" v-if="this.selectedPokemon">
        <div class="col">
          <MovementCard :movement="this.selectedPokemon.move1" v-if="this.selectedPokemon.move1"/>
        </div>
        <div class="col">
          <MovementCard :movement="this.selectedPokemon.move2" v-if="this.selectedPokemon.move2"/>
        </div>
        <div class="col">
          <MovementCard :movement="this.selectedPokemon.move3" v-if="this.selectedPokemon.move3"/>
        </div>
        <div class="col">
          <MovementCard :movement="this.selectedPokemon.move4" v-if="this.selectedPokemon.move4"/>
        </div>
      </div>
    </div>
    <div class="col-sm"></div>
  </div>
</template>

<script>
import PokemonPanel from './PokemonPanel'
import MovementCard from './MovementCard'
import PokemonTeamList from './PokemonTeamList';
import {state} from '@/store';

export default {
  name: "CombatPanel",
  components: {
    PokemonTeamList,
    PokemonPanel,
    MovementCard
  },
  props: {
    team: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      selectedPokemon: null
    }
  },
  created() {
    window.electron.onDataReceived('selected_enemy', (event, data) => {
      if (this.team === 'enemy') {
        this.selectedPokemon = data.pokemon;
        state.selectedEnemyPokemon = data.pokemon;
      }
    })

    window.electron.onDataReceived('end_combat', () => {
      if (this.team === 'enemy') {
        this.selectedPokemon = null;
        state.selectedEnemyPokemon = null;
      }
    })
  },
  methods: {
    selectPokemon: function (pokemon) {
      if (this.team === 'you') {
        this.selectedPokemon = pokemon;
        state.selectedPokemon = pokemon;
      }
    },
  }
}
</script>

<style scoped>

</style>