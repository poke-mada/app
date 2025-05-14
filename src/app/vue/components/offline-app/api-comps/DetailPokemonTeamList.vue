<template>
  <v-card border class="mt-2">
    <template v-slot:title>
      <v-alert :color="team === 'enemy' ? 'error' : 'success'" class="pa-0 pl-2">
        Equipo de {{ trainer_name }}
      </v-alert>
    </template>
    <template v-slot:text>
      <v-row class="p-1">
        <v-col cols="4" v-for="(pokemon, i) in this.data.team" :key="i">
          <v-row>
            <v-col>
              <PokemonCard :pokemon="pokemon" @click="selectPokemon(pokemon)"/>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </template>
  </v-card>

  <v-dialog v-model="display">
    <v-row>
      <v-spacer @click="display = false;"/>
      <v-col sm="12" xs="12" md="6" lg="6">
        <PokemonDetailPanel :pokemon="this.selected_pokemon" :enemy_data="enemy_data"/>
      </v-col>
      <v-spacer @click="display = false;"/>
    </v-row>
  </v-dialog>
</template>

<script>
import PokemonCard from "@/app/vue/components/offline-app/api-comps/PokemonCard";
import PokemonDetailPanel from "@/app/vue/components/offline-app/api-comps/PokemonDetailPanel";

export default {
  name: "PokemonTeamList",
  emits: ["pokemonSelected"],
  components: {
    PokemonCard,
    PokemonDetailPanel
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    enemy_data: {
      type: Object,
      required: false
    },
    team: {
      type: String,
      required: true
    },
    trainer_name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      party: {
        team: [null, null, null, null, null, null]
      },
      display: false,
      selected_pokemon: null
    }
  },
  computed: {
    pokemon_types() {
      return this.selected_pokemon.types;
    }
  },
  methods: {
    selectPokemon: function (pokemon) {
      this.selected_pokemon = pokemon;
      this.display = true;
    },
    type_name(val) {
      return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }
  },
}
</script>

<style scoped>

</style>
