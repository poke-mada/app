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
        if (data.pokemon === null || data.pokemon === undefined) return;
        this.party.team[data.slot] = data.pokemon;
      }
    })
    ipcRenderer.on('move_update', (event, data) => {
      if (data.pokemon_team === this.team) {
        let pokemon = this.party.team[data.pokemon_slot];
        if (!pokemon) {
          setTimeout(() => {
            this.party.team[data.pokemon_slot][`move${data.slot + 1}`] = {
              current_pp: data.current_pp,
              move_name: data.move_name,
              max_pp: data.max_pp,
              type: data.type,
              power: data.power,
              accuracy: data.accuracy,
              category: data.category
            };
          }, 1000)
          return;
        }
        pokemon[`move${data.slot + 1}`] = {
          current_pp: data.current_pp,
          move_name: data.move_name,
          max_pp: data.max_pp,
          type: data.type,
          power: data.power,
          accuracy: data.accuracy,
          category: data.category
        };
      }
    })
    ipcRenderer.on('pokemon_update', (event, data) => {
      if (data.team === this.team) {
        if (this.party.team[data.slot] === data.pokemon) return;
        if (data.pokemon === null || data.pokemon === undefined) return;
        this.party.team[data.slot].id = data.id;
        this.party.team[data.slot].types = data.types;
        //this.party.team[data.slot] = data.pokemon;
      }
    })
  }
}
</script>

<style scoped>

</style>