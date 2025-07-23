<template>
  <v-card border>
    <template v-slot:title>
      <v-alert :color="team === 'enemy' ? 'error' : 'success'" class="pa-0 pl-2">
      <span v-if="team === 'enemy'">
        Pokémon enemigo
      </span>
        <span v-if="team === 'you'">
        Pokémon atacando
      </span>
      </v-alert>
    </template>
    <template v-slot:text>
      <v-row class="mt-0">
        <v-col lg="6" md="6">
          <v-row>
            <v-col lg="4" md="4">
              <v-row class="w-100" justify="center">
                <v-col>
                  <v-tooltip location="top">
                    <template v-slot:activator="{props}">
                      <v-img :src="pokemon ? get_sprite() : missingno" @click="dialog = true"
                             class="cursor-pointer" width="96" max-width="96" alt="" v-bind="props"/>
                    </template>
                    <template v-slot:default>
                  <span v-if="real_pokemon && real_pokemon.notes"
                        v-html="real_pokemon.notes.replace('\r\n', '<br/>')">
                  </span>
                    </template>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-col>
            <v-col lg="8" md="8">
              <v-row class="w-100" justify="center" align="center">
                <v-col class="pa-0" cols="5">
                  <span class="mote" :class="team === 'enemy' ? 'info' : 'success'">{{ pokemon ? pokemon.mote : '???' }}</span>
                </v-col>
              </v-row>
              <v-row>
                <v-spacer/>
                <v-col class="pa-0">
                  <span class="text-center font-weight-bold">{{ pokemon ? pokemon.species : '???' }}</span>
                </v-col>
                <v-spacer/>
              </v-row>
              <v-row class="w-100" justify="center">
                <v-spacer/>
                <v-col class="pa-0">
                  <div v-if="pokemon">
                    <img :src="`./assets/types/${type_name(type.name)}.png`"
                         v-for="(type, i) in pokemon_types"
                         class="pokemon-type"
                         :key="i"
                         width="32"/>
                  </div>
                  <div v-if="!pokemon">
                    <v-img :src="missingno" width="32" inline></v-img>
                  </div>
                </v-col>
                <v-spacer/>
              </v-row>
              <v-row>
                <v-spacer/>
                <v-col class="pa-0 " cols="6">
                  <span class="text-center"><strong>Item:</strong> {{ pokemon ? pokemon.held_item_name : '???' }}</span>
                </v-col>
                <v-spacer/>
              </v-row>
              <v-row>
                <v-spacer/>
                <v-col class="pa-0 " cols="6">
                  <v-tooltip>
                    <template v-slot:activator="{props}">
                        <span class="text-left" v-bind="props"><strong>Ability:</strong> {{ pokemon ? ability_name : '???' }}</span>
                    </template>
                    <p>{{ pokemon ? ability_flavor : '' }}</p>
                  </v-tooltip>
                </v-col>
                <v-spacer/>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="d-sm-none d-md-block d-lg-block pb-0" md="6">
          <v-row>
            <v-col cols="12">
              <v-btn variant="flat" elevation="3" color="primary" text="Imposter" class="important-btn"
                     v-if="pokemon && ability_name === 'Imposter'" @click="open_imposter_dialog"/>
              <v-btn variant="flat" elevation="3" color="primary" text="Protean" class="important-btn"
                     v-if="pokemon && ability_name === 'Protean'" @click="open_protean_dialog"/>
            </v-col>
          </v-row>
          <v-row v-if="real_pokemon && real_pokemon.notes">
            <v-col cols="12">
              <span class="white-space">{{ real_pokemon.notes }}</span>
            </v-col>
          </v-row>
        </v-col>
        <v-col lg="12" md="12">
          <v-row v-if="pokemon">
            <v-col lg="6" md="6" sm="12" v-for="(move, index) in pokemon.moves" :key="index" class="mb-0">
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
  <v-dialog v-model="imposter_dialog">
    <v-row>
      <v-spacer @click="imposter_dialog = false"/>
      <v-col xs="12" sm="12" md="4">
        <VerticalPokemonTeamList :data="enemy_data" :team="team" reversed @select_pokemon="select_imposter_pokemon"/>
      </v-col>
      <v-spacer @click="imposter_dialog = false"/>
    </v-row>
  </v-dialog>
  <v-dialog v-model="protean_dialog">
    <v-row>
      <v-spacer @click="protean_dialog = false"/>
      <v-col xs="12" sm="12" md="4">
        <v-card>
          <template v-slot:title>
            <v-alert color="primary">
              <template v-slot:text>
                Escoge el tipo a cambiar
              </template>
            </v-alert>
          </template>
          <template v-slot:text>
            <v-row>
              <v-col v-for="(selectable_type, index) in selectable_types" cols="3" :key="index">
                <v-row>
                  <v-spacer/>
                  <v-col @click="protean_type = selectable_type; protean_dialog = false;" class="text-center">
                    <v-row>
                      <v-spacer/>
                      <v-col>
                        <v-img :src="`./assets/types/${selectable_type}.png`" width="32" aspect-ratio="1/1"/>
                      </v-col>
                      <v-spacer/>
                    </v-row>
                    <span>{{ selectable_type }}</span>
                  </v-col>
                  <v-spacer/>
                </v-row>
              </v-col>
            </v-row>
          </template>
        </v-card>
      </v-col>
      <v-spacer @click="protean_dialog = false"/>
    </v-row>
  </v-dialog>
</template>


<script>
import MovementCard from "@/app/vue/components/offline-app/api-comps/MovementCard";
import VerticalPokemonTeamList from "@/app/vue/components/offline-app/api-comps/VerticalPokemonTeamList";
import {FORCE_TYPE_ABILITIES, SPECIAL_MOVES} from '@/data/force_type_data'
import {get_form, get_sprite as _get_sprite, get_types} from '@/data/mon_functions';
import {POKEMON_TYPES} from '@/data/type_data';

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
    open_protean_dialog() {
      this.protean_dialog = true;
    },
    open_imposter_dialog() {
      this.imposter_dialog = true;
    },
    select_imposter_pokemon(team_slot) {
      const impostered = this.enemy_data.team[team_slot]
      this.pokemon.impostered = impostered;
      this.impostered_pokemon = impostered;
      this.imposter_dialog = false;
    },
    get_sprite() {
      const form = get_form(this.pokemon)
      return _get_sprite(this.pokemon.dex_number, form)
    },
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
      if (this.pokemon) {
        this.pokemon.impostered = null;
      }
      this.impostered_pokemon = null;
      this.team_slot_selected = team_slot;
      this.dialog = false;
      this.$emit('selected_pokemon', {
        slot: this.pk_slot,
        team_slot: team_slot
      })
    }
  },
  computed: {
    real_pokemon() {
      return this.team_data.team[this.team_slot_selected];
    },
    pokemon() {
      return this.impostered_pokemon || this.team_data.team[this.team_slot_selected];
    },
    pokemon_types() {
      if (this.protean_type) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.pokemon.protean_type = [{name: this.protean_type}]
        return [{name: this.protean_type}]
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.pokemon.got_types = get_types(this.pokemon);
      return this.pokemon.got_types
    },
    ability_name() {
      return this.pokemon.mega_ability_name || this.pokemon.ability_name
    },
    ability_flavor() {
      return this.pokemon.mega_ability_flavor || this.pokemon.ability_flavor
    }
  },
  data() {
    return {
      selectable_types: POKEMON_TYPES,
      protean_type: null,
      protean_dialog: false,
      impostered_pokemon: null,
      imposter_dialog: false,
      team_slot_selected: null,
      dialog: false,
      missingno: 'https://static.wikia.nocookie.net/bec6f033-936d-48c5-9c1e-7fb7207e28af'
    }
  }
}
</script>

<style scoped>
* {
  //border: 1px solid red;
}
@media (max-width: 1600px) {
  .mote {
    font-size: 6px !important;
    padding: .2rem 0.2rem !important;
  }

  .pokemon-type {
    max-height: 16px !important;
    max-width: 16px !important;
  }
}

@keyframes important-btn {
  from {
    box-shadow: 0 0 10px -10px red;
  }
  to {
    box-shadow: 0 0 10px 10px red;
  }
}

.important-btn {
  animation: important-btn 1s infinite alternate !important;
}

.pokemon-type {
  display: inline;
  max-height: 32px;
  max-width: 32px;
}

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

.white-space {
  white-space: pre;
}
</style>
