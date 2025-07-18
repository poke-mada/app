<!--suppress JSVoidFunctionReturnValueUsed -->
<template>
  <v-card class="rounded-xl cardCombats" elevation="6" style="position: relative;">
    <v-alert :color="team === 'enemy' ? '#0600FF' : team === 'ally' ? 'info' : '#D5048D'"
      class="divCardSup pa-3 d-flex justify-center align-center">
      <span class="textTeamCombats" v-if="team === 'enemy'">
        Pokemon enemigo
      </span>
      <span class="textTeamCombats" v-if="team === 'you'">
        Pokemon atacando
      </span>
      <span class="textTeamCombats" v-if="team === 'ally'">
        Pokemon aliado atacando
      </span>
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
        <v-col cols="6">
          <v-row class="pa-0 ma-0">
            <v-col cols="12" v-for="(value, stat) in baseStats" :key="stat">
              <v-row>
                <v-col cols="4" class="p-1">
                  <div class="statsContent">
                    <!-- Badge si hay boost positivo -->
                    <template v-if="get_pokemon_boost(stat) > 0">
                      <v-badge class="badgeIcon" :content="`+${get_pokemon_boost(stat)}`" color="transparent" bordered
                        offset-x="12" offset-y="0">
                        <template #badge>
                          <v-icon size="18" color="#D5048D" class="me-1">mdi-arrow-up-bold</v-icon>
                          <div class="custom-boost-badge">
                            <span class="text-white text-caption font-weight-bold">
                              +{{ get_pokemon_boost(stat) }}
                            </span>
                          </div>
                        </template>
                      </v-badge>
                    </template>
                    <span class="font-weight-bold">{{ translateStat(stat) }}</span>
                  </div>
                </v-col>
                <v-col cols="8" class="p-1">
                  <v-tooltip location="top">
                    <template #activator="{ props }">
                      <v-progress-linear class="paddinBars" v-bind="props" :model-value="value"
                        :max="stat === 'hp' ? maxHp : 255" height="18"
                        :color="stat === 'attack' ? '#0600FF' : '#D5048D'" rounded />
                    </template>
                    <span>{{ value }}</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <!-- MOVIMIENTOS -->
        <v-col cols="12" v-if="pokemon && team === 'you'">
          <v-col cols="12" class="p-0">
            <v-container class="tittleMoves">
              <h1>MOVIMIENTOS</h1>
            </v-container>
            <v-divider class="mb-3"></v-divider>
          </v-col>
          <v-row>
            <v-col cols="6" v-for="(move, index) in pokemon.moves" :key="index">
              <MovementCard :pokemon="pokemon" :enemy_data="enemy_data" :movement="move" v-if="move" />
            </v-col>
          </v-row>
        </v-col>

      </v-row>
    </v-container>

  </v-card>
</template>


<script>
import MovementCard from "@/app/vue/components/basic-comps/MovementCard";
import { VARIETIES_DATA } from "@/data/pokemon_varieties_data";

export default {
  name: "DualPokemonPanel",
  emits: [],
  components: {
    MovementCard
  },
  props: {
    team: {
      type: String,
      required: true
    },
    pk_dex: {
      type: Number,
      required: false
    },
    team_data: {
      type: Object,
      required: true
    },
    ally_data: {
      type: Object,
      required: false
    },
    enemy_data: {
      type: Object,
      required: true
    }
  },
  methods: {
    get_imposter_pokemon(dex_number) {
      if (dex_number) {
        return this.enemy_data.team.filter(pokemon => pokemon && pokemon.dex_number.toString() === dex_number.toString())[0]
      }
      return null
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
      return this.enemy_data.team_data.filter(pokemon => pokemon && pokemon.dex_number.toString() === dex_number.toString())[0]
    },
    get_pokemon(dex_number) {
      if (this.team === 'ally') {
        return this.get_ally_pokemon(dex_number);
      }
      return this.team_data.team.filter(pokemon => pokemon && pokemon.dex_number.toString() === dex_number.toString())[0]
    },
    type_name(val) {
      return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    },
    get_ally_pokemon(dex_number) {
      return this.ally_data.team.filter(ally => ally && ally.dex_number === dex_number)[0]
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
      if (!this.pk_dex) {
        return null;
      }

      if (this.team === 'ally') {
        return this.get_ally_pokemon(this.pk_dex);
      }

      if (!this.team_data.team.map(pokemon => pokemon && pokemon.dex_number).includes(this.pk_dex)) {
        // noinspection UnnecessaryLocalVariableJS
        const imposter = this.get_imposter_pokemon(this.pk_dex); // TODO: esto tambien cambiaria los stat boosts, ashuda
        if (this.team === 'you') {
          let data = this.get_imposter_pokemon_data(this.pk_dex);
          if (data && imposter) {
            imposter.moves = data.moves;
          }
        }

        return imposter;
      }
      return this.get_pokemon(this.pk_dex);
    },
    pokemon_types() {
      console.log("Este pokemon DOBLEE: ", this.pokemon);
      if (!this.pokemon) return [];
      if (this.pokemon.battle_data) {
        return this.pokemon.types || [];
      }
      return this.pokemon.types || [];
    },
    baseStats() {
      if (!this.pokemon) return {};

      let hp = this.pokemon.battle_data?.current_hp ?? this.pokemon.current_hp ?? 0;

      // Si es mi equipo son datos del pokemon
      if (this.team === 'you' && this.pokemon.battle_data?.stats) {
        hp = this.pokemon.battle_data?.current_hp ?? 0;
        return {
          hp,
          attack: this.pokemon.battle_data.stats.attack || 0,
          defense: this.pokemon.battle_data.stats.defense || 0,
          special_attack: this.pokemon.battle_data.stats.special_attack || 0,
          special_defense: this.pokemon.battle_data.stats.special_defense || 0,
          speed: this.pokemon.battle_data.stats.speed || 0,
        };
      }

      // Si es enemigo, usar los base_stats para todo menos HP
      const species = this.normalizeSpeciesName(this.pokemon?.species);

      const entry = Object.values(VARIETIES_DATA)
        .flatMap(variant => Object.entries(variant))
        .find(([key]) => key.toLowerCase() === species);

      if (!entry) {
        hp = this.pokemon.current_hp ?? 0;
        console.log("Esto no se que show:  ", this.pokemon);
        console.log("El otro HP:  ", hp);

        return {
          hp,
          attack: 0,
          defense: 0,
          special_attack: 0,
          special_defense: 0,
          speed: 0,
        };
      }

      const dexEntry = Object.entries(VARIETIES_DATA)
        .flatMap(([dex, entries]) =>
          Object.entries(entries).map(([key, value]) => ({ dex, ...value, name: key }))
        )
        .find(entry => entry?.name?.toLowerCase() === species);
      const dex_number = dexEntry?.dex || '000';
      console.log("📘 dex_number del enemigo:", dex_number);

      const baseStats = entry[1].base_stats || {};

      return {
        hp,
        attack: baseStats.attack || 0,
        defense: baseStats.defense || 0,
        special_attack: baseStats.special_attack || 0,
        special_defense: baseStats.special_defense || 0,
        speed: baseStats.speed || 0,
      };
    },
    maxHp() {
      return this.pokemon?.battle_data?.stats?.max_hp || 0;
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