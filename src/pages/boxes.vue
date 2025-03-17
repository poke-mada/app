<!--suppress JSUnusedGlobalSymbols -->
<template>
  <NavBar scroll-behavior="elevate" :economy="economy"/>
  <v-layout>
    <v-main>
      <iframe :src="`https://pokemada.para-mada.com/#/boxes?hide_layout=true&api_token=${token}&trainer_id=${trainer_id}`"></iframe>
    </v-main>
  </v-layout>
</template>

<script>
import NavBar from "@/components/page-comps/NavBar";

export default {
  name: 'BoxesPage',
  components: {
    NavBar
  },
  props: {
  },
  data() {
    return {
      economy: parseInt(localStorage.getItem('coins') || 0) || 0,
      trainer_id: parseInt(localStorage.getItem('trainer_id') || 0)
    }
  },
  computed: {
    token() {
      return localStorage.getItem('api_token')
    }
  }
}

</script>
