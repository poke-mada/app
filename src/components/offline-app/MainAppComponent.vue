<template>
  <v-layout>
    <v-app-bar scroll-behavior="collapse" :color="this.inlive ? 'teal-darken-4' : 'purple-darken-4'" elevation="4">
      <v-app-bar-title @click="disable_displays()">
        <span v-if="!inlive && logged_in">COACH VIEW</span>
        <span v-if="!inlive && !logged_in">PokeMada</span>
        <span v-if="inlive">{{ trainer_name }}</span>
      </v-app-bar-title>
      <v-btn
          v-if="inlive"
          :variant="get_variant('combat')"
          @click="switch_display('combat')"
          text="Combates"/>
      <v-btn
          v-if="logged_in"
          :variant="get_variant('showdown')"
          @click="switch_display('showdown')"
          text="Showdown"/>
      <v-btn
          v-if="logged_in"
          variant="text"
          @click="download_save"
          text="Descargar Save"/>
      <v-btn
          v-if="logged_in"
          :variant="get_variant('boxes')"
          @click="switch_display('boxes')"
          text="Cajas"/>
      <v-btn
          v-if="logged_in"
          :variant="get_variant('team')"
          @click="switch_display('team')"
          text="Equipo"/>
      <v-btn
          v-if="logged_in"
          :variant="get_variant('wildcards')"
          @click="switch_display('wildcards')"
          text="Comodines"/>
      <v-spacer></v-spacer>
      <v-btn
          v-if="logged_in"
          @click="logoff_dialog = true;"
          text="Cerrar Sesión"/>
      <v-btn
          v-if="!logged_in"
          :variant="get_variant('login')"
          @click="switch_display('login');"
          text="Iniciar Sesión"/>
      <CoinsComponent
          v-if="logged_in"
          :coins="this.economy"/>
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
      <div v-if="inlive">
        <LivePokemonTeamPanel v-if="displays.team && inlive" :trainer_name="trainer_name" :team_data="game_data.your_data"/>
        <LiveCombatPanel v-if="displays.combat" :game_data="game_data"/>
      </div>
      <div v-if="logged_in">
        <PokemonBoxesPanel v-if="displays.boxes" :trainer_id="trainer_data.id"/>
        <PokemonTeamPanel v-if="displays.team && !inlive" :trainer_name="trainer_name"/>
        <ShowdownCombatPanel v-if="displays.showdown" :trainer_id="trainer_data.id"/>
        <WildcardListComponent v-if="displays.wildcards" :trainer_id="trainer_data.id"/>
      </div>
      <LoginComponentPanel v-if="!logged_in && (!inlive || displays.login)" @login="log_in"/>
    </v-main>
  </v-layout>
  <v-dialog v-model="logoff_dialog">
    <v-row class="h-100 w-100" justify="center" align="center">
      <v-col cols="6">
        <v-card>
          <template v-slot:title>
            <h3>Cerrar Sesión</h3>
          </template>
          <template v-slot:text>
            <p>
              ¿Estás segur@ de que quieres cerrar sesión?
            </p>
          </template>
          <template v-slot:actions>
            <v-row>
              <v-spacer/>
              <v-col cols="4">
                <v-btn @click="logoff_dialog = false;" variant="tonal" color="primary" text="Cancelar"/>
                <v-btn @click="log_off(); logoff_dialog = false;" variant="text" color="error" text="Cerrar Sesión"/>
              </v-col>
            </v-row>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-dialog>
</template>

<script>
import PokemonTeamPanel from '@/components/PokemonTeamPanel'
import LivePokemonTeamPanel from '@/components/LivePokemonTeamPanel';
import PokemonBoxesPanel from '@/components/PokemonBoxesPanel'
import LiveCombatPanel from '@/components/live-combat/LiveCombatPanel'
import CoinsComponent from '@/components/offline-app/CoinsComponent'
import ShowdownCombatPanel from '@/components/offline-app/showdown/ShowdownCombatPanel'
import LoginComponentPanel from "@/components/offline-app/api-comps/LoginComponentPanel";
import {session} from "@/stores";
import WildcardListComponent from "@/components/offline-app/WildcardListComponent";

export default {
  name: "MainAppComponent",
  components: {
    WildcardListComponent,
    PokemonTeamPanel,
    LiveCombatPanel,
    PokemonBoxesPanel,
    CoinsComponent,
    LivePokemonTeamPanel,
    ShowdownCombatPanel,
    LoginComponentPanel
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
    get_variant(expected_display) {
      if (this.displays[expected_display] === true) {
        return 'tonal'
      }
      return 'text'
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
          combat: true,
          wildcards: false,
          login: false
        }
      } else {
        this.displays = {
          boxes: false,
          team: true,
          showdown: false,
          combat: false,
          wildcards: false,
          login: false
        }
      }
    },
    log_off() {
      localStorage.removeItem('api_token');
      this.logged_in = false;
    },
    log_in() {
      window.location.href = window.location;
    }
  },
  computed: {
    trainer_name() {
      if (this.inlive) {
        return this.live_trainer_name;
      }
      return '';
    }
  },
  data() {
    const token = localStorage.getItem('api_token');
    return {
      logoff_dialog: false,
      logged_in: token && token.length > 0,
      display_menu: false,
      interval: 0,
      economy: parseInt(localStorage.getItem('coins')) || 0,
      trainer_data: {},
      notification_alert: false,
      notification_data: 'Archivo de guardado descargado con éxito!',
      displays: {
        showdown: false,
        boxes: false,
        team: false,
        combat: true,
        wildcards: false,
        login: false
      },
    }
  },
  created() {
    window.electron.onDataReceived('notify', (event, data) => {
      if (!this.notification_alert) {
        this.notification_alert = true;
      }

      this.notification_data = data.message;
    });
    window.electron.onDataReceived('citra-connected', () => {
      this.disable_displays()
    });
  },
  mounted() {
    this.disable_displays()
    if (this.logged_in) {
      session.get(`/api/trainers/get_trainer/`).then((response) => {
        this.trainer_data = response.data;
      }).catch(() =>{
      })
    }

    this.interval = setInterval(() => {
      if (!this.logged_in) return;
      session.get(`/api/trainers/get_economy/`).then((response) => {
        if (this.economy !== response.data) {
          localStorage.setItem('coins', response.data);
          this.notification_alert = true;
          this.notification_data = `Se te han agregado ${response.data - this.trainer_data.economy} monedas a tu cuenta`
        }
        this.economy = response.data;
      }).catch(() =>{
      })
    }, 5000)
  },
  unmounted() {
    clearInterval(this.interval)
  },
  watch: {
    inlive() {
      this.disable_displays()
    }
  }
}
</script>

<style scoped>
.disabled {
  color: #9e9e9e;
}
</style>