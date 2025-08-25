<template>
  <v-app>
    <v-snackbar
        max-width="400"
        closable
        color="success"
        border="start"
        location="top right"
        v-model="notification_alert"
        close-delay="2000"
        transition="v-slide-x-transition">
      <div class="text-subtitle-1 pb-2">{{ notification.title }}</div>
      <p>{{ notification.message }}</p>
      <template v-slot:actions>
        <v-btn
            color="red"
            variant="text"
            @click="notification_alert = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-layout>
      <NavDrawer :streamer_name="this.streamer_name" style="height: 100vh; position: fixed"/>
      <FloatingInfoCard v-if="logged_in"/>
      <v-main style="min-height: 100vh; background: url('./assets/bgDif.jpg') no-repeat fixed; background-size: cover">
        <router-view/>
      </v-main>
    </v-layout>
    <v-snackbar
        max-width="400"
        closable
        :color="action_notification.type"
        border="start"
        location="bottom center"
        v-model="action_notification_alert"
        close-delay="2000"
        transition="v-slide-y-transition">
      <div class="text-subtitle-1 pb-2">{{ action_notification.title }}</div>
      <p>{{ action_notification.message }}</p>
      <template v-slot:actions>
        <v-btn
            color="red"
            variant="text"
            @click="action_notification_alert = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <UpdateDialog :update_data="update_data" v-if="update_dialog"/>
    <DownloadDialog :download_data="download_data" v-if="download_dialog"/>
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
    <v-dialog v-model="save_dialog" persistent>
      <v-row class="h-100 w-100" justify="center" align="center">
        <v-col cols="6">
          <v-card>
            <template v-slot:title>
              <h3>Guarda la partida</h3>
            </template>
            <template v-slot:text>
              <p>
                ¡Necesitas guardar la partida para poder continuar usando la aplicación!
              </p>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-dialog>
    <v-dialog v-model="custom_dialog.display" :persistent="custom_dialog.persistent">
      <v-row class="h-100 w-100" justify="center" align="center">
        <v-col cols="6">
          <v-card>
            <template v-slot:title>
              <h3>{{ custom_dialog.title }}</h3>
            </template>
            <template v-slot:text>
              <p>
                {{ custom_dialog.message }}
              </p>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-dialog>
  </v-app>
</template>

<!--suppress JSUnresolvedFunction -->
<script>
import NavDrawer from "@/app/vue/components/app-comps/NavDrawer";
import UpdateDialog from '@/app/vue/components/page-comps/UpdateDialog';
import DownloadDialog from '@/app/vue/components/page-comps/DownloadDialog';
import FloatingInfoCard from '@/app/vue/components/app-comps/displays/FloatingInfoCard.vue'
import {emitter} from "@/stores";

const {useGameStore} = require("@/stores/app");

export default {
  name: 'App',
  components: {
    UpdateDialog,
    NavDrawer,
    FloatingInfoCard,
    DownloadDialog
  },
  data() {
    return {
      dataSocket: null,
      trainer_name: null,
      update_dialog: false,
      update_data: {
        progress: 69,
        version: '0.0.0'
      },
      download_dialog: false,
      download_data: {
        progress: 69,
        message: 'Descargando'
      },
      save_dialog: false,
      logoff_dialog: false,
      action_notification_alert: false,
      action_notification: {
        title: '',
        message: ''
      },
      custom_dialog: {
        display: false,
        message: '',
        title: '',
        persistent: false,
      },
      economy: 0,
      notification_alert: false,
      notification: {
        type: 'success',
        title: '¡Notificación!',
        message: 'Archivo de guardado descargado con éxito!',
      },
    }
  },
  methods: {
    log_off() {
      this.store.logout()
      this.$router.push('/login')
    }
  },
  computed: {
    store: () => useGameStore(),
    profile_data() {
      return this.store.profile_data
    },
    logged_in() {
      const token = this.store.api_token
      return token && token.length > 0
    },
    streamer_name() {
      return this.store.streamer_name;
    },
    game_data_socket() {
      return this.store.gameDataSocket;
    }
  },
  async mounted() {
    this.store.start_websocket();
    if (this.profile_data?.is_coach) {
        this.store.start_game_data_websocket()
    } else {
      this.store.start_player_game_data_websocket()
      window.electron.onDataReceived('updated_game_data', async (event, data) => {
        emitter.emit('update_game_data', data)
      });
    }

    emitter.on('update_game_data', (data) =>{
      this.store.activate(data);
    })

    window.electron.onDataReceived('citra_connection_closed', async () => {
      this.store.deactivate();
    });

    window.electron.onDataReceived('notification', (event, data) => {
      this.custom_dialog.display = true;
      this.custom_dialog.title = data.title;
      this.custom_dialog.message = data.message;
      console.log(data)
    });

    window.electron.onDataReceived('trainer_name', (event, trainer_name) => {
      return this.store.set_trainer_name(trainer_name);
    });

    window.electron.onDataReceived('download-progress', (event, data) => {
      if (!this.download_dialog) {
        this.download_dialog = true;
      }
      let download_message = 'Descargando';
      if (data === 100) {
        download_message = 'Extrayendo archivo'
      }
      this.download_data = {
        progress: data,
        message: download_message
      };
    });
    window.electron.onDataReceived('enable-showdown-module', () => {
      this.store.allowShowdown();
    })
    window.electron.onDataReceived('download-stop', () => {
      this.download_dialog = false;
    });

    window.electron.onDataReceived('update-progress', (event, data) => {
      if (!this.update_dialog) {
        this.update_dialog = true;
      }
      this.update_data = data;
    });

    window.electron.sendMessage('store', {
      token: localStorage.getItem('api_token')
    });

    window.electron.startComms();

    window.electron.onDataReceived('perform_save', () => {
      this.save_dialog = false;
    });

    window.electron.onDataReceived('show_save_dialog', () => {
      this.save_dialog = true;
    });

    emitter.on('notification', (data) => {
      this.notification_alert = true;
      this.notification = {
        title: data.title,
        message: data.message,
        persistent: data.persistent,
      }
    });
    emitter.on('custom-dialog', (data) => {
      this.custom_dialog.display = true;
      this.custom_dialog.title = data.title;
      this.custom_dialog.message = data.message;
    });

    emitter.on('action-notification', (data) => {
      this.action_notification_alert = true;

      this.action_notification = {
        type: data.type || 'success',
        title: data.title,
        message: data.message
      }
    });
  }
}
</script>

<style>
#app {
  font-family: 'Segoe UI', sans-serif;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

body {
  background-repeat: no-repeat;
  background-size: cover;
}

::-webkit-scrollbar {
  display: none;
}
</style>
