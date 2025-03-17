<template>
  <v-app style="background: url('./assets/kalos.png') no-repeat fixed; background-size: cover">
    <v-snackbar
        max-width="400"
        closable
        color="success"
        border="start"
        location="top right"
        v-model="notification_alert"
        close-delay="2000"
        transition="v-slide-x-transition">
      <div class="text-subtitle-1 pb-2">{{notification.title}}</div>
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
    <router-view/>
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
  </v-app>
</template>


<!--suppress JSUnresolvedFunction -->
<script>
import UpdateDialog from '@/components/page-comps/UpdateDialog';
import {session, emitter} from "@/stores";
const {useGameStore} = require("@/stores/app");

export default {
  name: 'App',
  components: {
    UpdateDialog
  },
  data() {
    return {
      trainer_name: 'MARYBLOG',
      update_dialog: false,
      update_data: {
        progress: 69,
        version: '0.0.0'
      },
      logoff_dialog: false,
      action_notification_alert: false,
      action_notification: {
        title: '',
        message: ''
      },
      notification_alert: false,
      notification: {
        type: 'success',
        title: '¡Notificación!',
        message: 'Archivo de guardado descargado con éxito!',
      },
    }
  },
  methods: {
    refresh_economy() {
      if (!localStorage.getItem('api_token')) {
        return;
      }
      session.get(`api/trainers/get_economy/`).then((response) => {
        if (this.economy !== response.data) {
          localStorage.setItem('coins', response.data);
          emitter.emit('coins_updated', response.data)
          this.economy = response.data
        }
      });
    },
    log_off() {
      localStorage.removeItem('api_token');
      localStorage.removeItem('trainer_id');
      localStorage.removeItem('coins');
      this.$router.push('/login')
    }
  },
  computed: {
    store: () => useGameStore()
  },
  mounted() {
    window.electron.onDataReceived('updated_game_data', async (event, data) => {
      console.log(data)
      this.store.activate(data);
    });

    window.electron.onDataReceived('trainer_name', (event, trainer_name) => {
      return this.store.set_trainer_name(trainer_name);
    });

    window.electron.onDataReceived('update-progress', (event, data) => {
      if (!this.update_dialog) {
        this.update_dialog = true;
      }
      this.update_data = data;
    })
    window.electron.startComms()

    emitter.on('notification', (data) => {
      this.notification_alert = true;
      this.notification = {
        title: data.title,
        message: data.message
      }
    });
    emitter.on('action-notification', (data) => {
      this.action_notification_alert = true;

      this.action_notification = {
        type: data.type || 'success',
        title: data.title,
        message: data.message
      }
    });
    this.interval = setInterval(() => {
      this.refresh_economy();
    }, 5000);
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

body {
  background-repeat: no-repeat;
  background-size: cover;
}

* {
  cursor: default;
}

iframe {
  width: 100vw;
  height: 100vh;
  border: none;
}
</style>
