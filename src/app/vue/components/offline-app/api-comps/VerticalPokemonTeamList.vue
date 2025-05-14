<template>
  <v-card border class="mt-2 ml-2">
    <template v-slot:title>
      <v-alert :color="(team === 'enemy' && !reversed) || (team === 'you' && reversed) ? 'error' : 'success'" class="p-0">
        <template v-slot:prepend>
        </template>
        <span v-if="(team === 'enemy' && !reversed) || (team === 'you' && reversed)">
          Equipo Enemigo
        </span>
        <span v-if="(team === 'you' && !reversed) || (team === 'enemy' && reversed)">
          Tu Equipo
        </span>
      </v-alert>
    </template>
    <template v-slot:text>
      <v-row>
        <v-col xs="4" sm="4" md="6" v-for="(pokemon, i) in this.data.team" :key="i">
          <v-row>
            <v-spacer/>
            <v-col>
              <PokemonCard :pokemon="pokemon" @click="selectPokemon(i)"/>
            </v-col>
            <v-spacer/>
          </v-row>
        </v-col>
      </v-row>
    </template>
  </v-card>
</template>

<script>
import PokemonCard from "./PokemonCard";

export default {
  name: "VerticalPokemonTeamList",
  emits: ["select_pokemon"],
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
    },
    reversed: {
      type: Boolean,
      required: false
    }
  },
  methods: {
    selectPokemon: function (pokemon) {
      this.$emit('select_pokemon', pokemon);
    }
  },
  created() {
  },
  updated() {
  }
}
</script>

<style scoped>

</style>
