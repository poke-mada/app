<template>
  <v-layout>
    <v-app-bar scroll-behavior="collapse" :color="this.inlive ? 'teal-darken-4' : 'purple-darken-4'" elevation="4">
      <v-app-bar-title @click="disable_displays()"><span v-if="!inlive">COACH VIEW</span><span v-if="inlive">{{ trainer_name }}</span></v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn variant="text" @click="download_save" v-if="!inlive">Descargar Save</v-btn>
      <v-btn :variant="displays.combat ? 'tonal' : 'text'" @click="switch_display('combat')" v-if="inlive">Combates</v-btn>
      <v-btn :variant="displays.boxes ? 'tonal' : 'text'" @click="switch_display('boxes')" >Cajas</v-btn>
      <v-btn :variant="displays.team ? 'tonal' : 'text'" @click="switch_display('team')">Equipo</v-btn>
      <v-tooltip location="bottom" v-if="!inlive">
        <template v-slot:activator="{props}">
          <v-btn v-bind="props" class="disabled">Notas</v-btn>
        </template>
        WIP
      </v-tooltip>
      <v-tooltip location="bottom">
        <template v-slot:activator="{props}">
          <v-btn v-bind="props" class="disabled">Comodines</v-btn>
        </template>
        WIP
      </v-tooltip>
      <CoinsComponent disabled/>
      <!--      <v-btn prepend-icon="mdi-magnify"/>-->
    </v-app-bar>
    <v-main>
      <PokemonBoxesPanel v-if="displays.boxes" :trainer_name="trainer_name"/>
      <PokemonTeamPanel v-if="displays.team && !inlive" :trainer_name="trainer_name"/>
      <LivePokemonTeamPanel v-if="displays.team && inlive" :trainer_name="trainer_name" :team_data="game_data.your_data"/>
      <LiveCombatPanel v-if="displays.combat" :game_data="game_data"/>
    </v-main>
  </v-layout>
</template>

<script>
import PokemonTeamPanel from '@/components/PokemonTeamPanel'
import LivePokemonTeamPanel from '@/components/LivePokemonTeamPanel';
import PokemonBoxesPanel from '@/components/PokemonBoxesPanel'
import LiveCombatPanel from '@/components/live-combat/LiveCombatPanel'
import CoinsComponent from '@/components/offline-app/CoinsComponent'

export default {
  name: "MainAppComponent",
  components: {
    PokemonTeamPanel,
    LiveCombatPanel,
    PokemonBoxesPanel,
    CoinsComponent,
    LivePokemonTeamPanel
  },
  props: {
    trainer_name: {
      type: String,
      required: true
    },
    inlive: {
      type: Boolean,
      required: false
    },
    game_data: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      displays: {
        boxes: false,
        team: false,
        combat: true
      },
    }
  },
  methods: {
    download_save() {
      window.electron.downloadSave(this.trainer_name)
    },
    switch_display(display_name) {
      for (const display in this.displays) {
        this.displays[display] = display === display_name;
      }
    },
    disable_displays() {
      if (this.inlive) {
        this.displays = {
          boxes: false,
          team: false,
          combat: true
        }
      } else {
        this.displays = {
          boxes: false,
          team: true,
          combat: false
        }
      }
    }
  },
  created() {
    this.disable_displays()
  },
  updated() {
    this.disable_displays()
  }
}
</script>

<style scoped>
.disabled {
  color: #9e9e9e;
}
</style>