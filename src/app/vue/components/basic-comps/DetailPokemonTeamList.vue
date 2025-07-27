<template>
  <!-- SECCION DE BATALLA CON POKEMONS SALVAJES -->
  <v-card class="rounded-xl mb-6" max-width="500" elevation="6" style="position: relative;"
          :style="{ display: combat_type !== 'WILD' ? 'block' : 'none' }">
    <div :style="{ backgroundColor: team === 'enemy' ? '#0600FF' : '#D5048D' }"
         class="divCardSup pa-3 d-flex justify-center align-center">
      <v-avatar size="78" style="position: absolute; top: 80%; left: -5%;">
        <v-img src="/assets/img/Home/Pokeball3.png"></v-img>
      </v-avatar>
      <span class="textTeamCombats" v-if="team === 'enemy'">
        Equipo Enemigo
      </span>
      <span class="textTeamCombats" v-if="team === 'you'">
        Tu Equipo
      </span>
    </div>
    <div class="pa-6">
      <v-row class="p-1">
        <v-col v-for="(pokemon, i) in this.data.team.slice(0, 3)" :key="i">
          <div class="position-relative d-inline-block">
            <!-- Imagen principal del Pokémon -->
            <PokemonCard :pokemon="pokemon && (pokemon.discovered || team === 'you') ? pokemon : null" @click="selectPokemon(pokemon)"/>
            <img class="iconBallPoke" width="22" src="/assets/img/Home/Poké_Ball_icon.png"/>

            <!-- Badge solo si tiene held_item -->
            <img v-if="pokemon && pokemon.held_item && pokemon.held_item !== '0'" src="/assets/img/Home/itemPoke.png"
                 width="22" class="custom-badge"/>
          </div>
        </v-col>
      </v-row>
      <v-row class="p-1 pt-0">
        <v-col v-for="(pokemon, i) in this.data.team.slice(3, 6)" :key="i">
          <div class="position-relative d-inline-block">
            <!-- Imagen principal del Pokémon -->
            <PokemonCard :pokemon="pokemon && (pokemon.discovered || team === 'you') ? pokemon : null" @click="selectPokemon(pokemon)"/>
            <img class="iconBallPoke" width="22" src="/assets/img/Home/Poké_Ball_icon.png"/>

            <!-- Badge solo si tiene held_item -->
            <img v-if="pokemon && pokemon.held_item && pokemon.held_item !== '0'" src="/assets/img/Home/itemPoke.png"
                 width="22" class="custom-badge"/>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-card>
  <!-- LOG DE CMBATE ABAJO DE MI EQUIPO -->
  <template v-if="team === 'you' && combat_type !== 'DOUBLE'">
    <v-container class="containerLogsCombats">
      <v-btn color="teal" @click="combat_log_display = true">
        <span class="logText">LOG DE BATALLA</span>
        <v-img src="/assets/icons/ComatsWhite.svg" width="24" height="24" alt="Log icon" cover/>
      </v-btn>
    </v-container>
  </template>
  <template v-if="team === 'enemy' && combat_type === 'WILD'">
    <!-- CARD CON ULTIMOS 3 MOVIMIENTOS DE LOGS ENEMIGOS SALVAJES -->
    <v-container class="m-0 p-0">
      <v-card class="rounded-xl mb-6" max-width="500" elevation="6" style="position: relative;">
        <!-- titulos de log de batalla  -->
        <div class="divCardLog pa-3 d-flex justify-center align-center">
          <h2 class="textTeamCombatsLog">LOG DE BATALLA</h2>
          <v-img src="/assets/icons/ComatsWhite.svg" class="tamaImg" alt="Log icon" cover/>
        </div>

        <div class="pa-4">
          <v-list>
            <v-list-item v-for="(item, i) in lastMoves" :key="i">
              <v-list-item-content class="logsElementsDiv">
                <v-img src="/assets/img/combat/PokeballLog1.png" alt="Pokeball" width="24" height="24" max-width="24"/>
                <v-list-item-title class="marginLogs letrasMinus">{{ item.message }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
      </v-card>
    </v-container>
  </template>

  <CombatLogDialog v-model="combat_log_display" :move-log="move_log"/>

  <v-dialog v-model="display">
    <v-row>
      <v-spacer @click="display = false"/>
      <PokemonDetailPanel  tailPanel :pokemon="this.selected_pokemon" :enemy_data="enemy_data" :side="team"/>
      <v-spacer @click="display = false"/>
    </v-row>
  </v-dialog>
</template>

<script>
import PokemonCard from "@/app/vue/components/basic-comps/PokemonCard";
import PokemonDetailPanel from "@/app/vue/components/basic-comps/PokemonDetailPanel";
import CombatLogDialog from '@/app/vue/components/basic-comps/CombatLogDialog.vue';

export default {
  name: "PokemonTeamList",
  emits: ["pokemonSelected"],
  components: {
    PokemonCard,
    PokemonDetailPanel,
    CombatLogDialog
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    enemy_data: {
      type: Object,
      required: false
    },
    team: {
      type: String,
      required: true
    },
    move_log: {
      type: Array,
      default: () => []
    },
    combat_type: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      party: {
        team: [null, null, null, null, null, null]
      },
      display: false,
      selected_pokemon: null,
      combat_log_display: false,
    }
  },
  computed: {
    pokemon_types() {
      if (this.selected_pokemon.battle_data) {
        return this.selected_pokemon.battle_data.types;
      }
      return this.selected_pokemon.types;
    },
    lastMoves() {
      // console.log("Movimientos: ", this.move_log);
      return this.move_log.slice(0, 3).reverse();
    }
  },
  methods: {
    selectPokemon: function (pokemon) {
      if (!pokemon) {
        return
      }
      this.selected_pokemon = pokemon;
      if (this.team === 'you') {
        console.log("Tu equipo cargado:", this.team);
        this.display = true;
      }
    },
    type_name(val) {
      return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }
  },
}
</script>

<style scoped>
* {
}
</style>