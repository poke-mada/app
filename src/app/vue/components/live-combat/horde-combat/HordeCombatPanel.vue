<!-- TEMPLATE DE LAS HORDAS -->
<template>
  <v-card class="rounded-xl cardCombats" elevation="6" style="position: relative;">
    <v-alert color='#0600FF' class="divCardSup pa-3 d-flex justify-center align-center">
      <span class="textTeamCombats" v-if="team === 'enemy'">
        Pokémon de Horda
      </span>
    </v-alert>
    <div class="pokemon-grid">
      <ShortPokemonPanel v-for="(pk, index) in data.selected_pokemon" :key="index" :team="team" :team_data="data"
        :enemy_data="enemy_data" :pk_slot="pk" :combat_type="combat_type"  @showDetails="openDetail" />
    </div>
  </v-card>
  <v-dialog v-model="displayDetails">
    <PokemonDetailPanel v-if="selectedPokemon" :pokemon="selectedPokemon" :team="team" :combat_type="combat_type" :enemy_data="enemy_data"
      @close="displayDetails = false" />
  </v-dialog>
</template>

<script>
import ShortPokemonPanel from '@/app/vue/components/basic-comps/ShortPokemonPanel';
import PokemonDetailPanel from "@/app/vue/components/basic-comps/PokemonDetailPanel.vue";

export default {
  name: "HordeCombatPanel",
  components: {
    ShortPokemonPanel,
    PokemonDetailPanel
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
    enemy_data: {
      type: Object,
      required: true
    },
    combat_type: String
  },
  methods: {
    openDetail(pokemon) {
      this.selectedPokemon = pokemon;
      console.log("Pokemon sleccionado:", this.selectedPokemon);
      this.displayDetails = true;
    }
  },
  computed: {
  },
  data() {
    return {
      selectedPokemon: null,
      displayDetails: false
    }
  },
}
</script>

<style scoped>
.pokemon-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(5, 1fr);
}

@media (max-width: 1024px) {

  /* Tablets: 3 en la primera fila, 2 en la segunda */
  .pokemon-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 600px) {

  /* Celulares: 2 por fila */
  .pokemon-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>