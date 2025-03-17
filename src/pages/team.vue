<template>
  <NavBar :logged_in="logged_in" scroll-behavior="hide" :economy="economy"/>
  <v-layout>
    <v-main>
      <iframe :src="`https://pokemada.para-mada.com/#/?hide_layout=true&api_token=${token}`"></iframe>
    </v-main>
  </v-layout>
</template>

<script>
import NavBar from "@/components/page-comps/NavBar";


export default {
  name: 'TeamPage',
  components: {
    NavBar
  },
  data() {
    const token = localStorage.getItem('api_token');
    return {
      logged_in: token && token.length > 0,
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
