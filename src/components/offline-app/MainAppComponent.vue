<template>
  <v-layout>
    <v-app-bar scroll-behavior="collapse" :color="this.inlive ? 'teal-darken-4' : 'purple-darken-4'" elevation="4">
      <v-app-bar-title @click="disable_displays()"><span v-if="!inlive">{{ trainer_name }}'s COACH VIEW</span><span
          v-if="inlive">{{ trainer_name }}</span></v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn variant="text" @click="download_save" v-if="!inlive">Descargar Save</v-btn>
      <v-btn :variant="displays.combat ? 'tonal' : 'text'" @click="switch_display('combat')" v-if="inlive">Combates
      </v-btn>
      <v-btn :variant="displays.showdown ? 'tonal' : 'text'" @click="switch_display('showdown')" v-if="!inlive">
        Showdown
      </v-btn>
      <v-btn :variant="displays.boxes ? 'tonal' : 'text'" @click="switch_display('boxes')">Cajas</v-btn>
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
      <CoinsComponent :coins="this.trainer_data.economy"/>
    </v-app-bar>
    <v-main>
      <v-snackbar
          max-width="400"
          closable
          color="success"
          border="start"
          location="top right"
          v-model="notification_alert"
          close-delay="2000"
          transition="v-slide-x-transition">
        <div class="text-subtitle-1 pb-2">Notificacion!</div>
        <p>{{ notification_data }}</p>
      </v-snackbar>
      <PokemonBoxesPanel v-if="displays.boxes" :trainer_name="trainer_name"/>
      <PokemonTeamPanel v-if="displays.team && !inlive && trainer_name" :trainer_name="trainer_name"/>
      <CoachingSelectionPanel v-if="displays.team && !inlive && !trainer_name" @trainer_selected="select_trainer"/>
      <LivePokemonTeamPanel v-if="displays.team && inlive" :trainer_name="trainer_name"
                            :team_data="game_data.your_data"/>
      <LiveCombatPanel v-if="displays.combat" :game_data="game_data"/>
      <ShowdownCombatPanel v-if="displays.showdown" :trainer_name="trainer_name"/>
    </v-main>
  </v-layout>
</template>

<script>
import PokemonTeamPanel from '@/components/PokemonTeamPanel'
import LivePokemonTeamPanel from '@/components/LivePokemonTeamPanel';
import PokemonBoxesPanel from '@/components/PokemonBoxesPanel'
import LiveCombatPanel from '@/components/live-combat/LiveCombatPanel'
import CoinsComponent from '@/components/offline-app/CoinsComponent'
import ShowdownCombatPanel from '@/components/offline-app/showdown/ShowdownCombatPanel'
import CoachingSelectionPanel from "@/components/offline-app/CoachingSelectionPanel";
import {session} from "@/store";

export default {
  name: "MainAppComponent",
  components: {
    PokemonTeamPanel,
    LiveCombatPanel,
    PokemonBoxesPanel,
    CoinsComponent,
    LivePokemonTeamPanel,
    ShowdownCombatPanel,
    CoachingSelectionPanel
  },
  props: {
    live_trainer_name: {
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
  methods: {
    select_trainer(trainer_name) {
      this.coached_trainer_name = trainer_name;
      localStorage.setItem('coached_trainer_name', trainer_name);
    },
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
          showdown: false,
          combat: true
        }
      } else {
        this.displays = {
          boxes: false,
          team: true,
          showdown: false,
          combat: false
        }
      }
    }
  },
  computed: {
    trainer_name() {
      if (this.inlive) {
        return this.live_trainer_name;
      }
      return this.coached_trainer_name;
    }
  },
  data() {
    return {
      interval: 0,
      coached_trainer_name: localStorage.getItem('coached_trainer_name'),
      trainer_data: {
        economy: parseInt(localStorage.getItem('coins')) || 0
      },
      notification_alert: false,
      notification_data: 'Archivo de guardado descargado con éxito!',
      displays: {
        showdown: false,
        boxes: false,
        team: false,
        combat: true
      },
    }
  },
  created() {
    this.disable_displays()
    window.electron.onDataReceived('notify', (event, data) => {
      if (!this.notification_alert) {
        this.notification_alert = true;
      }

      this.notification_data = data.message;
    });

    if (this.trainer_name) {
      session.get(`trainer/${this.trainer_name}/`).then((response) => {
        this.trainer_data = response.data;
      })
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      if (!this.trainer_name) return;
      session.get(`economy/${this.trainer_name}/`).then((response) => {
        if (this.trainer_data.economy !== response.data) {
          localStorage.setItem('coins', response.data);
          this.notification_alert = true;
          this.notification_data = `Se te han agregado ${response.data - this.trainer_data.economy} monedas a tu cuenta`
        }
        this.trainer_data.economy = response.data;
      })
    }, 5000)
  },
  unmounted() {
    clearInterval(this.interval)
  },
  updated() {
    this.disable_displays()
  },
}
</script>

<style scoped>
.disabled {
  color: #9e9e9e;
}
</style>