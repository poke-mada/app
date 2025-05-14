<template>
  <v-card type="primary" class="mt-2" border>
    <v-alert :type="team === 'enemy' ? 'primary' : 'success'" class="p-0">
      <span v-if="team === 'enemy'" >
        PokemonTeamData enemigo
      </span>
      <span v-if="team === 'you'" >
        PokemonTeamData atacando
      </span>
    </v-alert>
    <v-row>
      <v-col cols="6">
        <v-row>
          <v-col>
            <img :src="pokemon ? pokemon.sprite_url : missingno" @click="dialog = true" class="cursor-pointer card-img-top" width="130" alt="">
          </v-col>
        </v-row>
        <v-row justify="end">
          <v-col>
            <div v-if="pokemon">
              <v-img :src="`./assets/types/${type_name(type.name)}.png`" v-for="(type, i) in pokemon_types" :key="i"
                     width="32" inline></v-img>
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-alert :type="team === 'enemy' ? 'info' : 'success'" variant="tonal" class="pb-0 pt-0 mt-1">
          <template v-slot:prepend>
          </template>
          <template v-slot:text>
            {{ pokemon ? pokemon.mote : '???' }}
          </template>
        </v-alert>
        <p class="text-center font-weight-bold">{{ pokemon ? pokemon.species : '???' }}</p>
        <p class="text-center">Nivel {{ pokemon ? pokemon.level : '???'}}</p>
        <p class="text-center">{{ pokemon ? pokemon_types.map((v) => v.name).join("/") : '???' }}</p>
        <v-btn color="teal accent-4" class="cursor-pointer" v-if="pokemon" @click="show_moves(pokemon)" text="movimientos"></v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>

export default {
  name: "PokemonCard",
  emits:['selected_pokemon', 'show_moves'],
  components: {
  },
  props: {
    team: {
      type: String,
      required: true
    },
    team_data: {
      type: Object,
      required: true
    }
  },
  methods: {
    selectPokemon(pokemon) {
      this.$emit('selected_pokemon', pokemon);
      this.pokemon = pokemon;
      this.dialog = false;
    },
    show_moves(pokemon) {
      this.$emit('show_moves', pokemon);
    },
    type_name(val) {
      return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    },
  },
  computed: {
    pokemon_types() {
      if (this.pokemon.battle_data) {
        return this.pokemon.battle_data.types;
      }
      return this.pokemon.types;
    }
  },
  data() {
    return {
      pokemon: null,
      dialog: false,
      missingno: 'https://static.wikia.nocookie.net/bec6f033-936d-48c5-9c1e-7fb7207e28af'
    }
  }
}
</script>

<style scoped>

</style>