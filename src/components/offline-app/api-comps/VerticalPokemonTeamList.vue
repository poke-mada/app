<template>
  <v-card border class="mt-2">
    <v-alert :type="team === 'enemy' ? 'primary' : 'success'" class="p-0">
      <template v-slot:prepend>
      </template>
      <span v-if="team === 'enemy'">
        Equipo Enemigo
      </span>
      <span v-if="team === 'you'">
        Tu Equipo
      </span>
    </v-alert>
    <v-row class="pa-1">
      <v-col cols="6" v-for="(pokemon, i) in this.data.team" :key="i">
        <v-row>
          <v-spacer/>
          <v-col>
            <PokemonCard :pokemon="pokemon" @click="selectPokemon(i)"/>
          </v-col>
          <v-spacer/>
        </v-row>
      </v-col>
    </v-row>
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