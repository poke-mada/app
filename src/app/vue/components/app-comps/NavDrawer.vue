<template>
  <v-navigation-drawer theme="dark" persistent permanent :rail="rail" @click="rail = false">
    <v-list>
      <v-list-item v-if="rail" prepend-avatar="./icons/icon.ico" title="DEDsafio Pokemon"
        subtitle="Pokémon X"></v-list-item>
      <v-list-item v-if="!rail" @click.stop="rail = !rail">
        <v-img :src="'./assets/width_logo.png'"></v-img>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>

    <v-list density="compact" nav v-if="logged_in">
      <v-list-item class="itemBox" to="/" title="inicio" value="home" cover>
        <template #prepend>
          <svg-icon type="mdi" :path="path"></svg-icon>
        </template>
      </v-list-item>
      <v-list-item class="itemBox" to="/combat" title="combates" value="combats" v-if="emulator_on">
        <template #prepend>
          <v-img src="/assets/icons/active/Combats.svg" width="28" height="28" class="me-2" cover
            v-if="$route.path === '/combat'" />
          <v-img src="/assets/icons/Combats.svg" width="28" height="28" class="me-2" cover v-else />
        </template>
      </v-list-item>
      <v-list-item class="itemBox" to="/events" title="eventos" value="events">
        <template #prepend>
          <v-img src="/assets/icons/active/Events.svg" width="28" height="28" class="me-2" cover
            v-if="$route.path === '/events'" />
          <v-img src="/assets/icons/Events.svg" width="28" height="28" class="me-2" cover v-else />
        </template>
      </v-list-item>
      <v-list-item class="itemBox" to="/boxes" title="Cajas" value="boxes">
        <template #prepend>
          <v-img src="/assets/icons/active/Boxes.svg" width="28" height="28" class="me-2" cover
            v-if="$route.path === '/boxes'" />
          <v-img src="/assets/icons/Boxes.svg" width="28" height="28" class="me-2" cover v-else />
        </template>
      </v-list-item>
      <v-list-item class="itemBox" to="/showdown" title="showdown" value="showdown" v-if="showdown_enabled">
        <template #prepend>
          <v-img src="/assets/icons/active/Showdown.svg" width="28" height="28" class="me-2" cover
            v-if="$route.path === '/showdown'" />
          <v-img src="/assets/icons/Showdown.svg" width="28" height="28" class="me-2" cover v-else />
        </template>
      </v-list-item>
      <v-list-item class="itemBox" to="/wildcards" title="Comodines" value="wildcards">
        <template #prepend>
          <v-img src="/assets/icons/active/Comodin.svg" width="28" height="28" class="me-2" cover
            v-if="$route.path === '/wildcards'" />
          <v-img src="/assets/icons/Comodin.svg" width="28" height="28" class="me-2" cover v-else />
        </template>
      </v-list-item>
      <v-list-item class="itemBox" to="/rewards" title="Buzón" value="inventory">
        <template #prepend>
          <v-img src="/assets/icons/active/Buzon.svg" width="28" height="28" class="me-2" cover
            v-if="$route.path === '/rewards'" />
          <v-img src="/assets/icons/Buzon.svg" width="28" height="28" class="me-2" cover v-else />
        </template>
      </v-list-item>
      <v-list-item class="itemBox" to="/roulettes" title="Ruletas" value="roulettes" v-if="!profile.is_coach">
        <template #prepend>
          <v-img src="/assets/icons/active/Circulo.svg" width="28" height="28" class="me-2" cover
            v-if="$route.path === '/roulettes'" />
          <v-img src="/assets/icons/Circulo.svg" width="28" height="28" class="me-2" cover v-else />
        </template>
      </v-list-item>
      <v-list-item class="itemBox" to="/market" title="Mercado" value="market">
        <template #prepend>
          <v-img src="/assets/icons/active/store.svg" width="28" height="28" class="me-2" cover
            v-if="$route.path === '/market'" />
          <v-img src="/assets/icons/store.svg" width="28" height="28" class="me-2" cover v-else />
        </template>
      </v-list-item>
       <v-list-item class="itemBox" to="/normas" title="Normativa" value="normativa">
        <template #prepend>
          <v-img src="/assets/icons/active/Document.svg" width="28" height="28" class="me-2" cover
            v-if="$route.path === '/normas'" />
          <v-img src="/assets/icons/Document.svg" width="28" height="28" class="me-2" cover v-else />
        </template>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <v-list density="compact" nav>
        <v-divider></v-divider>
        <!-- <v-list-item prepend-avatar="./assets/coin.png" :title="coins + ' Monedas'"></v-list-item> -->
        <v-list-item v-if="emulator_on" prepend-avatar="./assets/lime_logo.png" class="mr-1 mt-2 mb-2"
          title="Emulador Conectado"></v-list-item>
        <v-list-item v-else prepend-avatar="./assets/lime_logo_off.png" class="mr-1 mt-2 mb-2"
          title="Emulador Desconectado">
          <template #append>
            <v-btn size="small" variant="tonal" :loading="reconnecting" @click.stop="retry_connect" v-if="!profile.is_coach">
              Reintentar
            </v-btn>
          </template>
        </v-list-item>
        <v-list-item class="nameProfile mr-2" v-if="logged_in" lines="two" subtitle="Pokemon X" to="/profile"
          :title="streamer_name">
          <template #prepend>
            <img :src="profile.web_picture" width="48" height="48"
              style="left: 10px; position: relative; border-radius: 50%" />
          </template>
          <template #append>
            <v-img src="./assets/img/profile/pointsProfile-inverted.png" width="28" height="28" class="me-2" cover
              v-if="$route.path === '/profile'" />
            <v-img src="./assets/img/profile/pointsProfile.png" width="28" height="28" class="me-2" cover v-else />
          </template>
        </v-list-item>
        <v-list-item v-if="logged_in" title="Cerrar sesión" @click="log_off" class="mb-3 ml-1">
          <template #prepend>
            <v-img src="/assets/icons/OffClose.svg" width="28" height="28" class="me-2" cover />
          </template>
        </v-list-item>
        <v-list-item v-if="!logged_in" prepend-icon="mdi-logout" title="Iniciar Sesion" to="/login"></v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { useGameStore } from "@/stores/app";
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiPokeball } from '@mdi/js';

export default {
  name: "NavDrawer",
  components: {
    SvgIcon
  },
  props: {
    streamer_name: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      path: mdiPokeball,
      reconnecting: false,
    }
  },
  computed: {
    store() {
      return useGameStore()
    },
    emulator_on() {
      return this.store.emulator_on
    },
    profile() {
      return this.store.profile_data
    },
    logged_in() {
      const token = this.store.api_token
      return token && token.length > 0
    },
    showdown_enabled() {
      return this.store.showdown_module;
    }
  },
  watch: {
    // cuando reconecte, quita el loading
    emulator_on(val) {
      if (val) this.reconnecting = false;
    }
  },
  methods: {
    log_off() {
      this.store.logout();
      this.$router.push('/login');
    },
    async retry_connect() {
      if (this.reconnecting) return;
      this.reconnecting = true;
      try {
        window.electron?.startComms?.();
        setTimeout(() => {
          if (!this.emulator_on) this.reconnecting = false;
        }, 4000);
      } catch (e) {
        console.error(e);
        this.reconnecting = false;
      }
    },
  },
}
</script>

<script setup>

import { ref } from 'vue'

const rail = ref(false)
</script>

<style scoped>
.v-list-item--active.v-list-item__prepend.svg {
  fill: white !important;
}
</style>