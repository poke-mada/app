<!--suppress JSVoidFunctionReturnValueUsed -->
<template>
  <v-card type="primary" class="mt-2" border>
    <v-alert type="success">
      <template v-slot:prepend></template>
      <span>Tu Pokemon</span>
    </v-alert>
    <div class="pa-4">
      <v-row>
        <v-col cols="6">
          <v-row>
            <v-spacer/>
            <v-col>
              <img :src="pokemon.sprite_url" @click="dialog = true" class="card-img-top" width="130" alt="">
            </v-col>
            <v-spacer/>
          </v-row>
          <v-row>
            <v-spacer/>
            <v-col>
              <v-row>
                <v-spacer/>
                <v-col>
                  <v-img :src="`./assets/types/${type_name(type.name)}.png`" v-for="(type, i) in pokemon_types" :key="i"
                         width="32" inline></v-img>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6">
          <v-alert type="info" variant="tonal" class="pb-0 pt-0 mt-1" :text="pokemon.mote">
            <template v-slot:prepend></template>
          </v-alert>
          <p class="text-left font-weight-bold">{{ pokemon.species }}</p>
          <p class="text-left">Nivel <strong>{{ pokemon.level }}</strong></p>
          <p class="text-left">HP: <strong>{{ pokemon.cur_hp }}/{{ pokemon.maxhp }}</strong></p>
          <p class="text-left">Ataque: <strong>{{ pokemon.attack }}</strong></p>
          <p class="text-left">Defensa: <strong>{{ pokemon.defense }}</strong></p>
          <p class="text-left">Ataque Especial: <strong>{{ pokemon.spatk }}</strong></p>
          <p class="text-left">Defensa Especial: <strong>{{ pokemon.spdef }}</strong></p>
          <p class="text-left">Velocidad: <strong>{{ pokemon.speed }}</strong></p>
          <p class="text-left">{{ pokemon_types.map((v) => v.name).join("/") }}</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <p class="text-left">Naturaleza: <strong>{{ pokemon.nature_name }}</strong></p>
          <p class="text-left">Habilidad: <strong>{{ pokemon.ability_name }}</strong></p>
          <p class="text-left">Objeto: <strong>{{ pokemon.item_name }}</strong></p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" v-for="(move, index) in pokemon.moves" :key="index">
          <SingleMovementCard :pokemon="pokemon" :movement="move" v-if="move"/>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script>
import SingleMovementCard from "@/components/basic-comps/SingleMovementCard";

export default {
  name: "PokemonCard",
  emits: ['selected_pokemon', 'show_moves'],
  components: {
    SingleMovementCard
  },
  props: {
    pokemon: {
      type: Object,
      required: true
    }
  },
  methods: {
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
      dialog: false,
      missingno: 'https://static.wikia.nocookie.net/bec6f033-936d-48c5-9c1e-7fb7207e28af'
    }
  }
}
</script>

<style scoped>
</style>