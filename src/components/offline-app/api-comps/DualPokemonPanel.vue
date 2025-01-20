<template>
  <v-card border>
    <template v-slot:title>
      <v-alert :color="team === 'enemy' ? 'primary' : 'success'" class="p-0">
      <span v-if="team === 'enemy'">
        Pokemon enemigo
      </span>
        <span v-if="team === 'you'">
        Pokemon atacando
      </span>
      </v-alert>
    </template>
    <template v-slot:text>
      <v-row class="mt-0">
        <v-col cols="2">
          <v-row class="w-100" justify="center">
            <v-col >
              <v-tooltip location="top">
                <template v-slot:activator="{props}">
                  <img :src="pokemon ? pokemon.sprite_url : missingno"
                         @click="dialog = true"
                         class="cursor-pointer"
                         content-class="cursor-pointer"
                         width="96"
                         max-width="96"
                         v-bind="props"/>
                </template>
                <template v-slot:default>
                  <span v-if="pokemon && pokemon.notes"
                        v-html="pokemon.notes.replace('\r\n', '<br/>')">
                  </span>
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
          <v-row class="w-100" justify="end" align="end">
            <v-col>
              <div v-if="pokemon">
                <v-img :src="`./assets/types/${type_name(type.name)}.png`" v-for="(type, i) in pokemon_types" :key="i"
                       width="32" inline></v-img>
              </div>
              <div v-if="!pokemon">
                <v-img :src="missingno" width="32" inline></v-img>
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="2">
          <v-row>
            <v-spacer/>
            <v-col class="text-center">
              <span class="justify-center mote" :class="team === 'enemy' ? 'info' : 'success'">
                {{ pokemon ? pokemon.mote : '???' }}
              </span>
            </v-col>
            <v-spacer/>
          </v-row>
          <p class="text-center font-weight-bold">{{ pokemon ? pokemon.species : '???' }}</p>
          <p class="text-center">{{ pokemon ? pokemon_types.map((v) => v.name).join("/") : '???' }}</p>
          <p class="text-center"><strong>Item:</strong> {{ pokemon ? pokemon.held_item_name : '???' }}</p>
          <v-tooltip>
            <template v-slot:activator="{props}">
              <p class="text-center" v-bind="props"><strong>Ability:</strong> {{
                  pokemon ? pokemon.ability_name : '???'
                }}</p>
            </template>
            <p>{{ pokemon ? pokemon.ability_flavor : '' }}</p>
          </v-tooltip>
        </v-col>
        <v-col cols="8">
          <v-row v-if="pokemon">
            <v-col cols="6" v-for="(move, index) in pokemon.moves" :key="index">
              <MovementCard :pokemon="pokemon" :enemy_data="enemy_data" :movement="move" v-if="move" :is_selected="true"
                            :forced_type="get_forced_type(move)"/>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </template>
  </v-card>
  <v-dialog v-model="dialog">
    <v-row>
      <v-spacer @click="dialog = false"/>
      <v-col xs="12" sm="12" md="4">
        <VerticalPokemonTeamList :data="team_data" :team="team" @select_pokemon="select_pokemon"/>
      </v-col>
      <v-spacer @click="dialog = false"/>
    </v-row>
  </v-dialog>
</template>


<script>
import MovementCard from "@/components/offline-app/api-comps/MovementCard";
import VerticalPokemonTeamList from "@/components/offline-app/api-comps/VerticalPokemonTeamList";
import {FORCE_TYPE_ABILITIES, SPECIAL_MOVES} from '@/data/force_type_data'

export default {
  name: "PokemonCard",
  emits: ['selected_pokemon'],
  components: {
    MovementCard,
    VerticalPokemonTeamList
  },
  props: {
    team: {
      type: String,
      required: true
    },
    pk_slot: {
      type: Number,
      required: true
    },
    team_data: {
      type: Object,
      required: true
    },
    enemy_data: {
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
    select_pokemon(team_slot) {
      this.team_slot_selected = team_slot;
      this.dialog = false;
      this.$emit('selected_pokemon', {
        slot: this.pk_slot,
        team_slot: team_slot
      })
    }
  },
  computed: {
    pokemon() {
      let pokemon = this.team_data.team[this.team_slot_selected];
      return pokemon;
    },
    pokemon_types() {
      return this.pokemon.types;
    }
  },
  data() {
    return {
      team_slot_selected: null,
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
