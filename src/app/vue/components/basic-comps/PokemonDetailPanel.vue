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
                  <v-img :src="pokemon?.sprite_url || missingno" />
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
                <div class="infoAdicional">
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
              <p v-if="this.side !== 'enemy'">Stats máximos al Nivel 100</p>
              <p v-if="this.side === 'you'">Stats actuales</p>
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
                          :max="stat === 'hp' ? pokemon.maxhp : 255" height="18"
                          :color="stat === 'attack' ? '#0600FF' : '#D5048D'" rounded />
                      </template>
                      <span>{{ value.statValue }} / {{ stat === 'hp' ? pokemon.maxhp : 255 }}</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-container class="tittleStats mt-5">
              <h1>DEBILIDAD</h1>
              <v-divider class="mb-3"></v-divider>
              <div class="pokemon-weaknesses" v-if="pokemon_weaknesses.length">
                <div v-for="(weakness, i) in pokemon_weaknesses" :key="i">
                  <div class="badgeMulti">
                    <p> x{{ weakness.multiplier }}</p>
                  </div>
                  <v-img 
                    :src="`./assets/types/Types/${type_name(weakness.name)}.png`" width="50" inline />
                </div>
              </div>
            </v-container>
          </v-col>
        </v-row>
        <v-row>
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
    }
  },
  methods: {
    type_name(val) {
      return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    },
    type_name_loc(val) {
      return val; // TODO: traducir de ingles a español
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
        return this.pokemon.battle_data.weaknesses.filter(w => w.multiplier > 1);
      }
      if (this.pokemon && Array.isArray(this.pokemon.weaknesses)) {
        return this.pokemon.weaknesses.filter(w => w.multiplier > 1);
      }
      return [];
    },
    statsWithLabels() {
      console.log("Pokemon PARA REVISAR HP: ", this.pokemon);
      return {
        hp: {
          label: 'PS',
          statValue: this.pokemon.battle_data ? this.pokemon.battle_data.current_hp ?? 0 : this.pokemon.maxhp
        },
        attack: {
          label: 'Ataque',
          statValue: this.pokemon.attack ?? 0
        },
        defense: {
          label: 'Defensa',
          statValue: this.pokemon.defense ?? 0
        },
        spatk: {
          label: 'Ataque Especial',
          statValue: this.pokemon.spatk ?? 0
        },
        spdef: {
          label: 'Defensa Especial',
          statValue: this.pokemon.spdef ?? 0
        },
        speed: {
          label: 'Velocidad',
          statValue: this.pokemon.speed ?? 0
        }
      };
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