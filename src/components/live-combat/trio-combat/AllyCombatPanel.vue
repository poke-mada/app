<template>
  <div class="row">
    <div class="col-sm">
      <PokemonPanel :pokemon="this.selectedPokemon" team="you"/>
    </div>
    <div class="col-sm"></div>
    <div class="col-sm">
      <PokemonTeamList @pokemonSelected="selectPokemon" team="you"/>
    </div>
  </div>
  <div class="row" style="margin-top:20px">
    <div class="col-sm">
      <div class="row row-cols-2" v-if="this.selectedPokemon">
        <div class="col" v-for="(move, index) in this.selectedPokemon.moves" :key="index">
          <MovementCard :enemy="this.enemyPokemon" :pokemon="this.selectedPokemon" :movement="move" v-if="move"/>
        </div>
      </div>
    </div>
    <div class="col-sm"></div>
  </div>
</template>

<script>
import PokemonPanel from '@/components/basic-comps/PokemonPanel'
import PokemonTeamList from '@/components/basic-comps/PokemonTeamList';
import MovementCard from './MovementCard'

export default {
  name: "CombatPanel",
  components: {
    PokemonTeamList,
    PokemonPanel,
    MovementCard
  },
  props: {
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