<template>
  <!-- SECCION DE COMBATE CUANDO NO HAY COMBATES ACTIVOS Y SE VE TU EQUIPO  -->
  <v-card border class="mt-2">
    <v-alert :color="team === 'enemy' ? '#0600FF' : '#D5048D'"
      class="divCardSup pa-3 d-flex justify-center align-center">
      <h2 class="textTeamCombats" v-if="team === 'enemy'">
        Pokemon Enemigo
      </h2>
      <h2 class="textTeamCombats" v-if="team === 'you'">
        Tu Equipo
      </h2>
    </v-alert>
    <v-row class="pa-1">
      <v-col cols="6" v-for="(pokemon, i) in this.data.team" :key="i">
        <v-row>
          <v-spacer />
          <v-col>
            <PokemonCard :pokemon="pokemon" @click="selectPokemon(i)" />
          </v-col>
          <v-spacer />
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import PokemonCard from "@/app/vue/components/basic-comps/PokemonCard";

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

<style scoped></style>