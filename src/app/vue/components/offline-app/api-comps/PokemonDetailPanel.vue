<template style="">
  <div class="templateCardDetails">
    <v-card class="cardsDetailsPokemon mt-2" type="primary" border>
      <v-alert color="#FFC81F" class="divCardSup pa-3 d-flex justify-center align-center">
        <h2 class="textInfoPokemon">
          Informacion
        </h2>
      </v-alert>
      <div class="pa-4">
        <v-row>
          <v-col cols="5">
            <div class="cardPokemon p-0">
              <div class="fotoPokeInfo">
                <div class="cardImgPokeBattle">
                  <v-img :src="pokemon_variety?.sprite_url || missingno"/>
                </div>
                <div class="pokemon-number infoNumber">#{{ pokemon?.dex_number.toString().padStart(4, '0') || '????' }}
                </div>

              </div>
              <div>
                <p class="pokemon-name">{{ pokemon?.species || '???' }}</p>
                <p class="pokemon-level">Nv. {{ pokemon?.level || '??' }}</p>
                <div class="pokemon-type" v-if="pokemon_types && pokemon_types.length">
                  <div v-for="(type, i) in pokemon_types" :key="i" class="d-inline">
                    <v-tooltip location="top">
                      <template v-slot:activator="{props}">
                        <v-img :src="`./assets/types/Types/${type_name(type.name)}.png`" width="50" inline v-bind="props"/>
                      </template>
                      {{ type_name_loc(type.name) }}
                    </v-tooltip>
                  </div>
                </div>
                <div class="infoAdicional">
                  <p class="text-center"><strong>Naturaleza:</strong> {{ pokemon.nature_name }}</p>
                  <p class="text-center"><strong>Habilidad:</strong> {{ pokemon.ability_name }}</p>
                  <p class="text-center"><strong>Objeto:</strong> {{ pokemon.held_item_name }}</p>
                </div>
              </div>
            </div>

          </v-col>
          <v-col cols="7" class="p-0 mt-4">
            <v-container class="tittleStats">
              <h1>STATS</h1>
            </v-container>
            <v-divider class="mb-3"></v-divider>
            <div class="nivelMax">
              <img src="/imgs/Pokeball.png"/>
              <p>Stats base</p>
            </div>
            <v-row class="mt-2 mr-7" dense>
              <v-col cols="12" v-for="(value, stat) in statsWithLabels" :key="stat">
                <v-row align="center">
                  <v-col cols="4" class="text-end p-0">
                    <span class="font-weight-bold nowrap">{{ value.label }}</span>
                  </v-col>
                  <v-col cols="2" class="text-end">
                    <span class="text-right ml-5">{{ value.statValue }}</span>
                  </v-col>
                  <v-col cols="6">
                    <v-tooltip location="top">
                      <template #activator="{ props }">
                        <v-progress-linear class="paddinBars" v-bind="props" :model-value="value.statValue"
                                           :max="stat === 'hp' ? hp : 255" height="18"
                                           :color="stat === 'attack' ? '#0600FF' : '#D5048D'" rounded/>
                      </template>
                      <span>{{ value.statValue }} / {{ stat === 'hp' ? maxHp : 255 }}</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-container class="tittleStats mt-5">
              <h1>DEBILIDADES Y RESISTENCIAS</h1>
              <v-divider class="mb-3"></v-divider>
              <div class="pokemon-weaknesses" v-if="pokemon_weaknesses.length">
                <div v-for="(weakness, i) in pokemon_weaknesses" :key="i">
                  <div class="badgeMulti" :class="{
                    'badge-weakness': weakness.multiplier > 1,
                    'badge-resistance': weakness.multiplier < 1,
                    'badge-neutral': weakness.multiplier === 1
                  }">
                    <p style="margin: 0;">x{{ weakness.multiplier }}</p>
                  </div>
                  <v-tooltip location="top">
                    <template #activator="{ props }">
                      <v-img v-bind="props" :src="`./assets/types/Types/${type_name(weakness.name)}.png`" width="50"
                             inline/>
                    </template>
                    <span>{{ type_name_loc(weakness.name) }}</span>
                  </v-tooltip>
                </div>
              </div>
            </v-container>
          </v-col>
        </v-row>
        <v-row class="mt-6 mb-3">
          <v-col cols="12" class="p-0">
            <v-container class="tittleMoves">
              <h1>MOVIMIENTOS</h1>
            </v-container>
            <v-divider class="mb-3 mt-2"></v-divider>
          </v-col>
          <v-col>
            <v-row class="mr-3 ml-3">
              <v-col cols="6" v-for="(move, index) in pokemon.moves" :key="index" >
                <MovementCard :pokemon="pokemon" :movement="move" v-if="move"/>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn @click="perform_steal" class="gradient-btn" v-if="allow_steal && can_robo && pokemon.stealable">ROBAR</v-btn>
          </v-col>
          <v-col>
            <v-btn @click="perform_karma_steal" class="gradient-btn" v-if="allow_steal && can_robo_justo && pokemon.stealable">ROBO JUSTO
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
</template>

<script>
import MovementCard from "@/app/vue/components/offline-app/api-comps/MovementCard";
import {FORCE_TYPE_ABILITIES, SPECIAL_MOVES} from '@/data/force_type_data'
import {
  get_battle_form,
  get_form,
  get_hp_stat,
  get_sprite as _get_sprite,
  get_stat,
  get_types
} from "@/data/mon_functions";
import {VARIETIES_DATA} from "@/data/pokemon_varieties_data";
import {TRANSLATIONS, WEAKNESS_DATA} from "@/data/type_data";
import {emitter, getAxios} from "@/stores";

export default {
  name: "PokemonCard",
  emits: ['selected_pokemon', 'show_moves'],
  components: {
    MovementCard
  },
  props: {
    pokemon: {
      type: Object,
      required: true
    },
    allow_steal: {
      type: Boolean,
      required: false
    },
    can_robo: {
      type: Boolean,
      required: false
    },
    can_robo_justo: {
      type: Boolean,
      required: false
    }
  },
  methods: {
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
    type_name_loc(val) {
      return TRANSLATIONS[val];
    },
    perform_steal() {
      getAxios().post('/api/wildcards/68/use_card/', {
        target_id: this.pokemon.profile_owner,
        dex_number: this.pokemon.dex_number
      }).catch(error => {
        if (error.status === 400) {
          emitter.emit('action-notification', {
            type: 'error',
            title: '¡Error!',
            message: error.response.data.detail,
          });
        } else if (error.status === 500 && error.response.data.detail === 'contact_paramada') {
          emitter.emit('custom-dialog', {
            title: '¡Error!',
            message: `Ha ocurrido un error, contacta a soporte y mandales este numero: ${error.response.data.error_id}`,
          });
        }
      }).then(async (response) => {
        if (response.status === 200) {
          emitter.emit('action-notification', {
            title: 'Canjeado con Éxito',
            message: `Has canjeado Robo Pokemon`,
          });
        }
      })
    },
    perform_karma_steal() {
      getAxios().post('/api/wildcards/53/use_card/', {
        target_id: this.pokemon.profile_owner,
        dex_number: this.pokemon.dex_number
      }).catch(error => {
        if (error.status === 400) {
          emitter.emit('action-notification', {
            type: 'error',
            title: '¡Error!',
            message: error.response.data.detail,
          });
        } else if (error.status === 500 && error.response.data.detail === 'contact_paramada') {
          emitter.emit('custom-dialog', {
            title: '¡Error!',
            message: `Ha ocurrido un error, contacta a soporte y mandales este numero: ${error.response.data.error_id}`,
          });
        }
      }).then(async (response) => {
        if (response.status === 200) {
          emitter.emit('action-notification', {
            title: 'Canjeado con Éxito',
            message: `Has canjeado Robo Justo`,
          });
        }
      })
    },
  },
  computed: {
    pokemon_types() {
      return get_types(this.pokemon)
    },
    weaknesses() {
      let weaknesses2 = {};
      const types = this.pokemon_types
      for (const type of types) {
        let weak = WEAKNESS_DATA[type.name.toLowerCase()];
        for (const weakness of weak.double_from) {
          if (weakness in weaknesses2) {
            weaknesses2[weakness] *= 2;
          } else {
            weaknesses2[weakness] = 2;
          }
        }
        for (const weakness of weak.zero_from) {
          weaknesses2[weakness] = 0;
        }
        for (const weakness of weak.half_from) {
          if (weakness in weaknesses2) {
            weaknesses2[weakness] /= 2;
          } else {
            weaknesses2[weakness] = 0.5;
          }
        }
      }
      // eslint-disable-next-line no-unused-vars
      return Object.entries(weaknesses2).filter(([type, multiplier]) => multiplier !== 1).map(([type, multiplier]) => {
        return {name: type, multiplier: multiplier}
      });
    },
    pokemon_weaknesses() {
      if (this.weaknesses && Array.isArray(this.weaknesses)) {
        return this.weaknesses
            .filter(w => w.multiplier >= 0)
            .sort((a, b) => b.multiplier - a.multiplier); // orden descendente
      }
      if (Array.isArray(this.weaknesses)) {
        return this.weaknesses.filter(w => w.multiplier > 1);
      }
      return [];
    },
    pokemon_variety() {
      const formKey = get_battle_form(this.pokemon)
      const speciesCatalog = VARIETIES_DATA[this.pokemon.dex_number];

      const entry = speciesCatalog[formKey];
      if (!entry) {
        return Object.values(speciesCatalog)[0]
      }
      return entry;
    },
    hp() {
      return parseInt(get_hp_stat(this.pokemon).toFixed(0));
    },
    attack() {
      return parseInt(get_stat(this.pokemon, 'attack').toFixed(0));
    },
    defense() {
      return parseInt(get_stat(this.pokemon, 'defense').toFixed(0));
    },
    special_attack() {
      return parseInt(get_stat(this.pokemon, 'special_attack').toFixed(0));
    },
    special_defense() {
      return parseInt(get_stat(this.pokemon, 'special_defense').toFixed(0));
    },
    speed() {
      return parseInt(get_stat(this.pokemon, 'speed').toFixed(0));
    },
    statsWithLabels() {
      return {
        hp: {
          label: 'PS',
          statValue: this.hp ?? 0
        },
        attack: {
          label: 'Ataque',
          statValue: this.attack ?? 0
        },
        defense: {
          label: 'Defensa',
          statValue: this.defense ?? 0
        },
        spatk: {
          label: 'Ataque Especial',
          statValue: this.special_attack ?? 0
        },
        spdef: {
          label: 'Defensa Especial',
          statValue: this.special_defense ?? 0
        },
        speed: {
          label: 'Velocidad',
          statValue: this.speed ?? 0
        }
      };
    },
  },
  data() {
    return {
      dialog: false,
      missingno: 'https://res.cloudinary.com/dtattuxue/image/upload/v1753918578/Pokeball_qi5tk3.svg'
    }
  }
}
</script>

<style scoped>
.templateCardDetails {
  min-width: 800px;
  max-width: 800px;
}
</style>
