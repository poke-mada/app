<template>
  <v-card border class="mt-2">
    <template v-slot:title>
      <v-alert :color="team === 'enemy' ? 'primary' : 'success'" class="p-0">
        Equipo de {{ trainer_name }}
      </v-alert>
    </template>
    <template v-slot:text>
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
    </template>
  </v-card>

  <v-dialog v-model="display">
    <PokemonDetailPanel :pokemon="this.selected_pokemon" :enemy_data="enemy_data"/>
  </v-dialog>
</template>

<script>
import PokemonCard from "@/components/offline-app/api-comps/PokemonCard";
import PokemonDetailPanel from "@/components/offline-app/api-comps/PokemonDetailPanel";

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
      if (this.selected_pokemon.battle_data) {
        return this.selected_pokemon.battle_data.types;
      }
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