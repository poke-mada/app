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
              <img :src="pokemon.sprite_url" @click="dialog = true" width="130" alt="">
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
          <v-row>
            <v-spacer/>
            <v-col class="text-center">
              <span class="justify-center mote" :class="team === 'enemy' ? 'info' : 'success'">
                {{ pokemon ? pokemon.mote : '???' }}
              </span>
            </v-col>
            <v-spacer/>
          </v-row>
          <p class="text-left font-weight-bold">{{ pokemon.species }}</p>
          <p class="text-left">Nivel <strong>{{ pokemon.level }}</strong></p>
          <p class="text-left">HP: <strong>{{ pokemon.cur_hp }}/{{ pokemon.max_hp }}</strong></p>
          <p class="text-left">Ataque: <strong>{{ pokemon.attack }}</strong></p>
          <p class="text-left">Defensa: <strong>{{ pokemon.defense }}</strong></p>
          <p class="text-left">Ataque Especial: <strong>{{ pokemon.special_attack }}</strong></p>
          <p class="text-left">Defensa Especial: <strong>{{ pokemon.special_defense }}</strong></p>
          <p class="text-left">Velocidad: <strong>{{ pokemon.speed }}</strong></p>
          <p class="text-left">{{ pokemon_types.map((v) => v.name).join("/") }}</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <p class="text-left">Naturaleza: <strong>{{ pokemon.nature_name }}</strong></p>
          <p class="text-left">Habilidad: <strong>{{ pokemon.ability_name }}</strong></p>
          <p class="text-left">Objeto: <strong>{{ pokemon.held_item_name }}</strong></p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" v-for="(move, index) in pokemon.moves" :key="index">
          <MovementCard :enemy_data="enemy_data" :pokemon="pokemon" :movement="move" v-if="move" :forced_type="get_forced_type(move)"/>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script>
import MovementCard from "./MovementCard";
import {FORCE_TYPE_ABILITIES, SPECIAL_MOVES} from '@/data/force_type_data'

export default {
  name: "PokemonCard",
  emits: ['selected_pokemon', 'show_moves'],
  components: {
    MovementCard
  },
  props: {
    enemy_data: {
      type: Object,
      required: false
    },
    pokemon: {
      type: Object,
      required: true
    }
  },
  methods: {
    get_forced_type(movement) {
      let forced_type = this.pokemon.ability.toString() in FORCE_TYPE_ABILITIES;
      let move_type = movement.move_type;


      if (forced_type) {
        let ability_data = FORCE_TYPE_ABILITIES[this.pokemon.ability];
        if (move_type === ability_data.forced_from) {
          move_type = ability_data.forced_type;
        } else if (ability_data.forced_from === '*') {
          move_type = ability_data.forced_type;
        }
      }

      if (movement.index in SPECIAL_MOVES) {
        let special_move = SPECIAL_MOVES[movement.index];
        if (this.pokemon.item_held in special_move) {
          move_type = special_move[this.pokemon.item_held];
        }
      }
      return move_type;
    },
    type_name(val) {
      return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    },
  },
  computed: {
    pokemon_types() {
      return this.pokemon.types || [];
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
.mote {
  border-radius: 10px;
  padding: .2rem 1rem;
}

.success {
  background-color: rgba(76, 175, 80, 0.8);
  color: white;
}

.info {
  background-color: rgba(33, 150, 243, 0.8);
  color: white;
}
</style>
