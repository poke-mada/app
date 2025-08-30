<template>
  <!-- SECCION DE COMBATE CUANDO NO HAY COMBATES ACTIVOS Y SE VE TU EQUIPO  -->
  <v-card class="rounded-xl mb-6" max-width="500" elevation="6" style="position: relative;"
    :style="{ display: combat_type !== 'WILD' ? 'block' : 'none' }">
    <div :style="{ backgroundColor: team === 'enemy' ? '#0600FF' : '#D5048D' }"
      class="divCardSup pa-3 d-flex justify-center align-center">
      <v-avatar size="78" style="position: absolute; top: 80%; left: -5%;">
        <v-img src="/assets/img/Home/Pokeball3.png"></v-img>
      </v-avatar>
      <h2 class="textTeamCombats" v-if="team === 'enemy'">
        Pokemon Enemigo
      </h2>
      <h2 class="textTeamCombats" v-if="team === 'you'">
        Tu Equipo
      </h2>
    </div>
    <v-row class="mb-2 mt-1 pl-6">
      <v-col cols="6" v-for="(pokemon, i) in this.data.team" :key="i">
        <PokemonCard :pokemon="pokemon" @click="selectPokemon(i)" />
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