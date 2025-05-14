<template>
  <v-navigation-drawer
      theme="dark"
      persistent
      permanent
      :rail="rail"
      @click="rail = false"
  >
    <v-list>
      <v-list-item v-if="rail"
                   prepend-avatar="./icons/icon.ico"
                   title="Maryblog"
                   subtitle="Pokémon X"
      ></v-list-item>
      <v-list-item v-if="!rail"
                   @click.stop="rail = !rail">
        <v-img :src="'./assets/width_logo.png'"></v-img>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>

    <v-list density="compact" nav v-if="logged_in">
      <v-list-item to="/" prepend-icon="mdi-pokeball" title="Combates" value="combats"></v-list-item>
      <v-list-item to="/rewards" prepend-icon="mdi-package-variant-closed" title="Buzón de regalos" value="inventory"></v-list-item>
      <v-list-item to="/events" prepend-icon="mdi-calendar" title="Tablon de Eventos" value="events"></v-list-item>
      <v-list-item to="/boxes" prepend-icon="mdi-archive" title="Cajas" value="boxes"></v-list-item>
      <v-list-item to="/wildcards" prepend-icon="mdi-cards-outline" title="Comodines" value="wildcards"></v-list-item>
      <v-list-item to="/showdown" prepend-icon="mdi-sword-cross" title="Showdown" value="showdown"></v-list-item>
    </v-list>

    <template v-slot:append>
      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-logout" title="Cerrar Sesion" @click="log_off"></v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
import {useGameStore} from "@/stores/app";

export default {
  name: "NavDrawer",
  computed: {
    store() {
      return useGameStore()
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
      this.$router.push('/login')
    }
  }
}
</script>

<script setup>

import {ref} from 'vue'

const rail = ref(true)
</script>

<style scoped>

</style>