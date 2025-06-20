<!--suppress JSVoidFunctionReturnValueUsed -->
<template>
  <v-card class="rounded-xl cardCombats" elevation="6" style="position: relative;">
    <v-alert :color="team === 'enemy' ? '#0600FF' : '#D5048D'"
      class="divCardSup pa-3 d-flex justify-center align-center">
      <h2 class="textTeamCombats" v-if="team === 'enemy'">
        Pokemon Enemigo
      </h2>
      <h2 class="textTeamCombats" v-if="team === 'you'">
        Pokemon Atacando
      </h2>
    </v-alert>

    <v-container class="pa-6">
      <v-row>
        <v-col cols="6">
          <div class="cardPokemon">
            <v-row>
              <v-col class="col" cols="4">
                <div class="cardImgPokeBattle">
                  <v-img :src="pokemon?.sprite_url || missingno" width="96" />
                </div>
              </v-col>
              <v-col cols="8" class="pa-0">
                <div>
                  <div class="pokemon-number">#{{ pokemon?.dex_number.toString().padStart(4, '0') || '????' }}</div>
                  <p class="pokemon-name">{{ pokemon?.species || '???' }}</p>
                  <!-- MOTE -->
                  <!-- <span class="justify-center mote" :class="team === 'enemy' ? 'info' : 'success'">
                    {{ pokemon ? pokemon.mote : '???' }}
                  </span> -->
                  <p class="pokemon-level">Nv. {{ pokemon?.level || '??' }}</p>
                  <div class="pokemon-type" v-if="pokemon_types.length">
                    <v-img v-for="(type, i) in pokemon_types" :key="i"
                      :src="`./assets/types/Types/${type_name(type.name)}.png`" width="50" inline />
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-col>
        <v-col cols="6" v-if="team !== 'you'">
          <v-row class="pa-0 ma-0">
            <v-col v-for="(value, stat) in baseStats || {}" :key="stat" cols="12">
              <v-row>
                <v-col cols="4">
                  <div class="statsContent">
                    <!-- Badge solo si hay boost -->
                    <template v-if="get_pokemon_boost(stat) > 0">
                      <v-badge class="badgeIcon" :content="`+${get_pokemon_boost(stat)}`" color="transparent" bordered
                        offset-x="12" offset-y="0">
                        <template #badge>
                          <v-icon size="18" color="#D5048D" class="me-1">mdi-arrow-up-bold</v-icon>
                          <div class="custom-boost-badge">
                            <span class="text-white text-caption font-weight-bold">+{{ get_pokemon_boost(stat) }}</span>
                          </div>
                        </template>
                      </v-badge>
                    </template>
                    <!-- Nombre del stat -->
                    <span class="font-weight-bold">{{ translateStat(stat) }}</span>
                  </div>
                </v-col>
                <v-col cols="8">
                  <!-- Barra de progreso con tooltip -->
                  <v-tooltip location="top">
                    <template #activator="{ props }">
                      <v-progress-linear class="paddinBars" v-bind="props" :model-value="value" :max="255" height="18"
                        :color="stat === 'attack' ? '#0600FF' : '#D5048D'" rounded />
                    </template>
                    <span>{{ value }}</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-col>

            <!-- Precisión al final -->
            <!-- <v-col cols="12" class="pa-0 ma-0">
              <v-badge bordered
                :color="get_pokemon_boost('accuracy') < 0 ? 'error' : get_pokemon_boost('accuracy') > 0 ? 'success' : 'info'"
                :content="`Precisión: ${get_pokemon_boost('accuracy')}`" />
            </v-col> -->
          </v-row>
        </v-col>
        <v-col cols="6" v-if="team === 'you'">
          <v-row class="pa-0 ma-0">
            <v-col v-for="(value, stat) in baseStats || {}" :key="stat" cols="12">
              <v-row>
                <v-col cols="4">
                  <div class="statsContent">
                    <!-- Badge solo si hay boost -->
                    <template v-if="get_pokemon_boost(stat) > 0">
                      <v-badge class="badgeIcon" :content="`+${get_pokemon_boost(stat)}`" color="transparent" bordered
                        offset-x="12" offset-y="0">
                        <template #badge>
                          <v-icon size="18" color="#D5048D" class="me-1">mdi-arrow-up-bold</v-icon>
                          <div class="custom-boost-badge">
                            <span class="text-white text-caption font-weight-bold">+{{ get_pokemon_boost(stat) }}</span>
                          </div>
                        </template>
                      </v-badge>
                    </template>
                    <!-- Nombre del stat -->
                    <span class="font-weight-bold">{{ translateStat(stat) }}</span>
                  </div>
                </v-col>
                <v-col cols="8">
                  <!-- Barra de progreso con tooltip -->
                  <v-tooltip location="top">
                    <template #activator="{ props }">
                      <v-progress-linear class="paddinBars" v-bind="props" :model-value="value" :max="255" height="18"
                        :color="stat === 'attack' ? '#0600FF' : '#D5048D'" rounded />
                    </template>
                    <span>{{ value }}</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-col>

            <!-- Precisión al final -->
            <!-- <v-col cols="12" class="pa-0 ma-0">
              <v-badge bordered
                :color="get_pokemon_boost('accuracy') < 0 ? 'error' : get_pokemon_boost('accuracy') > 0 ? 'success' : 'info'"
                :content="`Precisión: ${get_pokemon_boost('accuracy')}`" />
            </v-col> -->
          </v-row>
        </v-col>
        <v-divider v-if="team === 'you'" class="mb-3"></v-divider>
        <template v-if="team === 'you'">
          <v-container class="tittleMoves">
            <h1>MOVIMIENTOS</h1>
          </v-container>
        </template>
        <v-col cols="12" id="movSection" v-if="team === 'you'">
          <v-row v-if="pokemon">
            <v-col class="pa-1" cols="6" v-for="(move, index) in pokemon.moves" :key="index">
              <SingleMovementCard :pokemon="pokemon" :enemy_data="enemy_data" :movement="move" v-if="move" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>


<script>
import SingleMovementCard from "@/app/vue/components/basic-comps/SingleMovementCard";
import { VARIETIES_DATA } from "@/data/pokemon_varieties_data";

export default {
  name: "SinglePokemonPanel",
  emits: [],
  components: {
    SingleMovementCard
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
    get_imposter_pokemon(dex_number) {
      if (!dex_number) {
        return null;
      }
      return this.enemy_data.team.filter(pokemon => pokemon && pokemon.dex_number.toString() === dex_number.toString())[0]
    },
    get_pokemon_boost(stat) {
      if (!this.pokemon) {
        return 0;
      }
      if (this.pokemon.battle_data) {
        return this.pokemon.battle_data.boosts[stat];
      }
      if (this.pokemon.boosts) {
        return this.pokemon.boosts[stat];
      }
      return 0;
    },
    get_imposter_pokemon_data(dex_number) {
      if (!dex_number) {
        return null;
      }
      return this.enemy_data.team_data.filter(pokemon => pokemon && pokemon.dex_number.toString() === dex_number.toString())[0];
    },
    get_pokemon(dex_number) {
      if (!dex_number) {
        return null;
      }
      return this.team_data.team.filter(pokemon => pokemon && pokemon.dex_number.toString() === dex_number.toString())[0];
    },
    type_name(val) {
      return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    },
    normalizeSpeciesName(name) {
      return name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    },
    translateStat(stat) {
      const translations = {
        hp: 'PS',
        attack: 'Ataque',
        defense: 'Defensa',
        special_attack: 'At. Especial',
        special_defense: 'Def. Especial',
        speed: 'Velocidad',
      };
      return translations[stat] || stat;
    }
  },
  computed: {
    pokemon() {
      if (!this.pk_slot) {
        return null;
      }
      if (!this.team_data.team.filter(pokemon => !!pokemon).map(pokemon => pokemon.dex_number).includes(this.pk_slot)) {
        // noinspection UnnecessaryLocalVariableJS
        const imposter = this.get_imposter_pokemon(this.pk_slot); // TODO: esto tambien cambiaria los stat boosts, ashuda

        if (this.team === 'you' && imposter) {
          let data = this.get_imposter_pokemon_data(this.pk_slot);
          if (data) {
            imposter.moves = data.moves;
          }
        }

        return imposter;
      }
      return this.get_pokemon(this.pk_slot);
    },
    pokemon_types() {
      if (!this.pokemon) return [];

      if (this.pokemon.battle_data?.types) {
        return this.pokemon.battle_data.types.filter(item => !!item?.name);
      }

      return (this.pokemon.types || []).filter(item => !!item?.name);
    },
    baseStats() {
      const species = this.normalizeSpeciesName(this.pokemon?.species);
      // console.log("🧪 Buscando especie:", species);

      const entry = Object.values(VARIETIES_DATA)
        .flatMap(variant => Object.entries(variant))
        .find(([key]) => key.toLowerCase() === species);

      if (!entry) {
        console.warn(`⚠️ No se encontraron stats base para "${species}"`);
        return {
          hp: 0,
          attack: 0,
          defense: 0,
          special_attack: 0,
          special_defense: 0,
          speed: 0
        };
      }
      const dexEntry = Object.entries(VARIETIES_DATA)
        .flatMap(([dex, entries]) =>
          Object.entries(entries).map(([key, value]) => ({ dex, ...value, name: key }))
        )
        .find(entry => entry?.name?.toLowerCase() === species);

      const dex_number = dexEntry?.dex || '000';
      console.log(dex_number);
      // console.log("✅ Stats encontrados:", entry[1].base_stats);
      return entry[1].base_stats || {};
    }
  },
  // watch: {
  //   pokemon(newVal) {
  //     if (newVal?.species) {
  //       console.log("📢 Nombre original:", newVal.species);
  //       console.log("🔍 Normalizado:", newVal.species.toLowerCase());
  //     }
  //   }
  // },
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
  padding: .1rem 1rem;
  font-size: 10px;
  text-transform: capitalize;
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