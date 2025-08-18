<!--suppress JSVoidFunctionReturnValueUsed -->
<!-- DETALLES DE POKEMON EN COMBATES  -->
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
                  <v-img :src="pokemon_variety?.sprite_url || missingno" />
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
                        <v-img :src="`./assets/types/Types/${type_name(type.name)}.png`" width="50" inline v-bind="props" />
                      </template>
                      {{type_name_loc(type.name)}}
                    </v-tooltip>
                  </div>
                </div>
                <div class="infoAdicional" v-if="side === 'you'">
                  <p class="text-center"><strong>Naturaleza:</strong> {{ pokemon.nature_name }}</p>
                  <p class="text-center"><strong>Habilidad:</strong> {{ pokemon.ability_name }}</p>
                  <p class="text-center"><strong>Objeto:</strong> {{ pokemon.item_name }}</p>
                </div>
              </div>
            </div>

          </v-col>
          <v-col cols="7" class="p-0">
            <v-container class="tittleStats">
              <h1>STATS</h1>
            </v-container>
            <v-divider class="mb-3"></v-divider>
            <div class="nivelMax">
              <img src="/imgs/Pokeball.png" />
              <p>Stats base</p>
            </div>
            <v-row class="mt-2" dense>
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
                          :max="stat === 'hp' ? maxHp : 255" height="18"
                          :color="stat === 'attack' ? '#0600FF' : '#D5048D'" rounded />
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
                        inline />
                    </template>
                    <span>{{ type_name_loc(weakness.name) }}</span>
                  </v-tooltip>
                </div>
              </div>
            </v-container>
          </v-col>
        </v-row>
        <v-row v-if="side === 'you'">
          <v-col cols="12" class="p-0">
            <v-container class="tittleMoves">
              <h1>MOVIMIENTOS</h1>
            </v-container>
            <v-divider class="mb-3"></v-divider>
          </v-col>
          <v-col cols="6" v-for="(move, index) in pokemon.moves" :key="index">
            <MovementCard :enemy_data="enemy_data" :pokemon="pokemon" :movement="move" v-if="move" />
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
</template>

<script>
import MovementCard from "@/app/vue/components/basic-comps/MovementCard";
import { VARIETIES_DATA } from "@/data/pokemon_varieties_data";
import {get_battle_form} from "@/data/mon_functions";
import {TRANSLATIONS} from "@/data/type_data";

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
    side: {
      type: String,
      required: false
    },
    pokemon: {
      type: Object,
      required: true
    },
    combat_type: {
      type: String,
      default: null
    }
  },
  methods: {
    type_name(val) {
      return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    },
    normalizeSpeciesName(name) {
      return String(name || '')
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[\s.']/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    },
    type_name_loc(val) {
      return TRANSLATIONS[val];
    }
  },
  computed: {
    pokemon_types() {
      if (this.pokemon?.battle_data?.types) {
        return this.pokemon.battle_data.types;
      }
      if (this.pokemon?.types) {
        return this.pokemon.types;
      }
      return []; // <-- importante para evitar errores
    },
    pokemon_weaknesses() {
      if (this.pokemon.battle_data && Array.isArray(this.pokemon.battle_data.weaknesses)) {
        return this.pokemon.battle_data.weaknesses
          .filter(w => w.multiplier >= 0)
          .sort((a, b) => b.multiplier - a.multiplier); // orden descendente
      } else if (this.pokemon.weaknesses && Array.isArray(this.pokemon.weaknesses)) {
        return this.pokemon.weaknesses
          .filter(w => w.multiplier >= 0)
          .sort((a, b) => b.multiplier - a.multiplier); // orden descendente
      }
      if (this.pokemon && Array.isArray(this.pokemon.weaknesses)) {
        return this.pokemon.weaknesses.filter(w => w.multiplier > 1);
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
    maxHp() {
      if (this.combat_type === 'HORDE' && this.side === 'enemy') {
        return this.pokemon?.stats?.max_hp ?? 1;
      }
      return this.pokemon?.max_hp ?? 1;
    },
    normalizedSpeciesKey() {
      const base = this.normalizeSpeciesName(this.pokemon.species);
      const suffix = this.pokemon.suffix ? `-${this.normalizeSpeciesName(this.pokemon.suffix)}` : '';
      return `${base}${suffix}`;
    },
    statsWithLabels() {

      const entry = this.pokemon_variety;
      const baseStats = entry.base_stats || {};

      return {
        hp: {
          label: 'PS',
          statValue: baseStats.hp ?? 0
        },
        attack: {
          label: 'Ataque',
          statValue: baseStats.attack ?? 0
        },
        defense: {
          label: 'Defensa',
          statValue: baseStats.defense ?? 0
        },
        spatk: {
          label: 'Ataque Especial',
          statValue: baseStats.special_attack ?? 0
        },
        spdef: {
          label: 'Defensa Especial',
          statValue: baseStats.special_defense ?? 0
        },
        speed: {
          label: 'Velocidad',
          statValue: baseStats.speed ?? 0
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
.templateCardDetails {
  min-width: 800px;
  max-width: 800px;
}
</style>