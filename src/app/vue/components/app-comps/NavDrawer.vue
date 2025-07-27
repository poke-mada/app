<template>
  <v-navigation-drawer theme="dark" persistent permanent :rail="rail" @click="rail = false">
    <v-list>
      <v-list-item v-if="rail" prepend-avatar="./icons/icon.ico" title="Maryblog" subtitle="Pokémon X"></v-list-item>
      <v-list-item v-if="!rail" @click.stop="rail = !rail">
        <v-img :src="'./assets/width_logo.png'"></v-img>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>

    <v-list density="compact" nav v-if="logged_in">
      <v-list-item class="marginLine" to="/" prepend-icon="mdi-pokeball" title="inicio" value="home"></v-list-item>
      <v-list-item class="itemBox" to="/combat" title="combates" value="combats" v-if="emulator_on">
        <template #prepend>
          <v-img src="/assets/icons/Combats.svg" width="28" height="28" class="me-2" cover />
        </template>
      </v-list-item>
      <v-list-item class="itemBox" to="/events" title="eventos" value="events">
        <template #prepend>
          <v-img src="/assets/icons/Events.svg" width="28" height="28" class="me-2" cover />
        </template>
      </v-list-item>
      <v-list-item class="itemBox" to="/boxes" title="Cajas" value="boxes">
        <template #prepend>
          <v-img src="/assets/icons/Boxes.svg" width="28" height="28" class="me-2" cover />
        </template>
      </v-list-item>
      <v-list-item class="itemBox" to="/showdown" title="showdown" value="showdown">
        <template #prepend>
          <v-img src="/assets/icons/Showdown.svg" width="28" height="28" class="me-2" cover />
        </template>
      </v-list-item>
      <v-list-item class="itemBox" to="/wildcards" title="Comodines" value="wildcards">
        <template #prepend>
          <v-img src="/assets/icons/Comodin.svg" width="28" height="28" class="me-2" cover />
        </template>
      </v-list-item>
      <v-list-item class="itemBox" to="/rewards" prepend-icon="mdi-package-variant-closed" title="Buzón"
        value="inventory"></v-list-item>
      <v-list-item class="itemBox" to="/market" prepend-icon="mdi-store" title="Mercado" value="market"></v-list-item>
    </v-list>

    <template v-slot:append>
      <v-list density="compact" nav>
        <v-divider></v-divider>
        <!-- <v-list-item prepend-avatar="./assets/coin.png" :title="coins + ' Monedas'"></v-list-item> -->
        <v-list-item v-if="emulator_on" prepend-avatar="./assets/lime_logo.png"
          title="Emulador Conectado"></v-list-item>
        <v-list-item v-if="!emulator_on" prepend-avatar="./assets/lime_logo_off.png"
          title="Emulador Desconectado"></v-list-item>
        <div class="bgProfile" v-if="logged_in">
          <v-img src="./assets/img/profile/ProfilePicture.png" width="56" height="56"></v-img>
        </div>
        <v-list-item class="nameProfile" v-if="logged_in" lines="two" subtitle="Pokemon X" to="/profile" :title="streamer_name">
          <template #append>
            <v-img src="./assets/img/profile/pointsProfile.png" width="28" height="28" class="me-2" cover />
          </template>
        </v-list-item>
        <v-list-item v-if="logged_in" title="Cerrar sesión" @click="log_off">
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

export default {
  name: "NavDrawer",
  props: {
    streamer_name: {
      required: true,
      type: String
    }
  },
  computed: {
    store() {
      return useGameStore()
    },
    emulator_on() {
      return this.store.emulator_on
    },
    logged_in() {
      const token = localStorage.getItem('api_token');
      return token && token.length > 0
    }
  },
  methods: {
    log_off() {
      localStorage.removeItem('api_token');
      localStorage.removeItem('trainer_id');
      localStorage.removeItem('coins');
      this.$router.push('/login');
    }
  }
}
</script>

<script setup>

import { ref } from 'vue'

const rail = ref(true)
</script>

<style scoped></style>