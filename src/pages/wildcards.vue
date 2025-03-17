<template>
  <NavBar scroll-behavior="elevate" :economy="economy"/>
  <v-layout>
    <v-main>
      <iframe :src="`https://pokemada.para-mada.com/#/wildcards?hide_layout=true&api_token=${token}`"></iframe>
    </v-main>
  </v-layout>
</template>

<script>
import NavBar from "@/components/page-comps/NavBar";


export default {
  name: 'WildcardsPage',
  components: {
    NavBar
  },
  data() {
    return {
      economy: parseInt(localStorage.getItem('coins') || 0) || 0,
    }
  },
  computed: {
    token() {
      return localStorage.getItem('api_token')
    }
  }
}

</script>
