<template>
  <v-layout>
    <NavBar :logged_in="logged_in" scroll-behavior="hide" :economy="economy"/>
    <v-main>
      <v-row class="mt-2 pl-2 pr-2">
        <v-col>
          <LiveCombatPanel />
        </v-col>
      </v-row>
    </v-main>
  </v-layout>
</template>

<script>
import LiveCombatPanel from "@/components/page-comps/LiveCombatPanel";
import NavBar from "@/components/page-comps/NavBar";


export default {
  name: 'MainAppPage',
  data() {
    const token = localStorage.getItem('api_token');
    return {
      logged_in: token && token.length > 0,
      economy: parseInt(localStorage.getItem('coins') || 0) || 0,
      inlive: false,
      trainer_name: '',
    }
  },
  components: {
    LiveCombatPanel,
    NavBar
  },
  mounted() {
  }
}

</script>
