<template>
  <v-card border class="mt-2">
    <v-alert :type="team === 'enemy' ? 'primary' : 'success'" class="p-0">
      <v-card-title v-if="team === 'enemy'" >
        Equipo Enemigo
      </v-card-title>
      <v-card-title v-if="team === 'you'" >
        Tu Equipo
      </v-card-title>
    </v-alert>
    <v-row class="p-1">
      <v-col v-for="(pokemon, i) in this.data.team.slice(0,3)" :key="i">
        <PokemonCard :pokemon="pokemon" @click="selectPokemon(pokemon)"/>
      </v-col>
    </v-row>
    <v-row class="p-1 pt-0">
      <v-col v-for="(pokemon, i) in this.data.team.slice(3,6)" :key="i">
        <PokemonCard :pokemon="pokemon" @click="selectPokemon(pokemon)"/>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import PokemonCard from "@/components/basic-comps/PokemonCard";

export default {
  name: "PokemonTeamList",
  emits: ["pokemonSelected"],
  components: {
    PokemonCard
  },
  props: {
    data: {
      type: Object,
      required: true
    },
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
    console.log(this.data)
  },
  updated() {
  }
}
</script>

<style scoped>

</style>