<template>
  <v-card border class="mt-0">
    <template v-slot:text>
      <v-alert :color="computed_color" :text="computed_text" class="pa-0 text-center">
        <template v-slot:prepend></template>
        <template v-slot:append></template>
        <template v-slot:close></template>
      </v-alert>
      <v-row class="p-1">
        <v-col cols="4" v-for="(pokemon, i) in this.data.team" :key="i">
          <v-row>
            <v-col>
              <PokemonCard :pokemon="pokemon" @click="selectPokemon(pokemon, i)" :selected="!this.force_plain && this.selected_slot === i"/>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </template>
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
      required: false
    },
    force_plain: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      party: {
        team: [null, null, null, null, null, null]
      },
      selected_slot: null,
      display: false,
      selected_pokemon: null
    }
  },
  computed: {
    pokemon_types() {
      return this.selected_pokemon.types;
    },
    computed_color() {
      if (this.team === 'enemy') {
        return 'error';
      }
      return 'success';
    },
    computed_text() {
      if (!this.trainer_name) {
        if (this.team === 'you') {
          return 'Tu equipo';
        }
        else if (this.team === 'enemy') {
          return 'Equipo enemigo';
        }
        else if (this.team === 'ally') {
          return 'Equipo aliado';
        }
      }
      return `Equipo de ${this.trainer_name}`
    }
  },
  methods: {
    selectPokemon: function (pokemon, slot) {
      this.$emit('pokemon_selected', pokemon)
      this.selected_slot = slot;
    },
    type_name(val) {
      return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }
  },
}
</script>

<style scoped>

</style>
