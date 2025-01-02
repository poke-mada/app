<template>
  <div class="row">
    <div class="col-6" v-for="(pokemon, i) in party.team" :key="i">
      <PokemonCard :pokemon="pokemon" @click="selectPokemon(pokemon)"/>
    </div>
  </div>
</template>

<script>
import {ipcRenderer} from "electron";
import PokemonCard from "@/components/PokemonCard";

export default {
  name: "PokemonTeamList",
  emits: ["pokemonSelected"],
  components: {
    PokemonCard
  },
  props: {
    team: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      party: {
        team: [null, null, null, null, null, null]
      }
    }
  },
  methods: {
    selectPokemon: function (pokemon) {
      this.$emit('pokemonSelected', pokemon);
    }
  },
  created() {
    ipcRenderer.on('party_update', (event, data) => {
      if (data.team === this.team) {
        if (this.party.team[data.slot] === data.pokemon) return;
        this.party.team[data.slot] = data.pokemon;
        console.log(data)
      }
    })
  }
}
</script>

<style scoped>

</style>