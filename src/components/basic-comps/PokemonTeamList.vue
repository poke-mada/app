<template>
  <v-card border class="mt-2">
    <v-alert :type="team === 'enemy' ? 'primary' : 'success'" class="p-0">
      <span v-if="team === 'enemy'" >
        Equipo Enemigo
      </span>
      <span v-if="team === 'you'" >
        Tu Equipo
      </span>
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

  <v-dialog v-model="display" :width="team === 'you' ? '' : 'auto'">
    <v-card :title="`Movimientos de ${this.selected_pokemon.mote}`">
      <template v-slot:text>
        <v-row class="mt-4" v-if="team === 'you'">
          <v-col sm cols="8">
            <v-row v-if="this.selected_pokemon">
              <v-col cols="6" v-for="(move, index) in this.selected_pokemon.moves" :key="index">
                <MovementCard :pokemon="this.selected_pokemon" :enemy_data="enemy_data" :movement="move" v-if="move"/>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="2">
            <v-row>
              <v-col>
                <img :src="this.selected_pokemon.sprite_url" class="card-img-top" width="130" alt="">
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <div class="float-right">
                  <v-img :src="`./assets/types/${type_name(type.name)}.png`" v-for="(type, i) in this.selected_pokemon.types" :key="i" width="32" inline></v-img>
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="2">
            <v-alert :type="team === 'enemy' ? 'info' : 'success'" variant="tonal" class="pb-0 pt-0 mt-1">
              <template v-slot:prepend>
              </template>
              <template v-slot:text>
                {{ this.selected_pokemon ? this.selected_pokemon.mote : '???' }}
              </template>
            </v-alert>
            <p class="text-center font-weight-bold">{{ this.selected_pokemon ? this.selected_pokemon.species : '???' }}</p>
            <p class="text-center">{{ this.selected_pokemon ? this.selected_pokemon.types.map((v) => v.name).join("/") : '???' }}</p>
          </v-col>
        </v-row>
        <v-row class="mt-4" v-if="team === 'enemy'">
          <v-col cols="6">
            <v-row>
              <v-col>
                <img :src="this.selected_pokemon.sprite_url" class="card-img-top" width="130" alt="">
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <div class="float-right">
                  <v-img :src="`./assets/types/${type_name(type.name)}.png`" v-for="(type, i) in this.selected_pokemon.types" :key="i" width="32" inline></v-img>
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6">
            <v-alert :type="team === 'enemy' ? 'info' : 'success'" variant="tonal" class="pb-0 pt-0 mt-1">
              <template v-slot:prepend>
              </template>
              <template v-slot:text>
                {{ this.selected_pokemon ? this.selected_pokemon.mote : '???' }}
              </template>
            </v-alert>
            <p class="text-center font-weight-bold">{{ this.selected_pokemon ? this.selected_pokemon.species : '???' }}</p>
            <p class="text-center">{{ this.selected_pokemon ? this.selected_pokemon.types.map((v) => v.name).join("/") : '???' }}</p>
          </v-col>
        </v-row>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
import PokemonCard from "@/components/basic-comps/PokemonCard";
import MovementCard from '@/components/basic-comps/MovementCard';

export default {
  name: "PokemonTeamList",
  emits: ["pokemonSelected"],
  components: {
    PokemonCard,
    MovementCard,
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    enemy_data: {
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
      },
      display: false,
      selected_pokemon: null
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
  created() {
    console.log(this.data)
  },
  updated() {
  }
}
</script>

<style scoped>

</style>